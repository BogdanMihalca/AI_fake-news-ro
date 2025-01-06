import { pipeline, env, softmax } from "@huggingface/transformers";
import { map } from "lodash";
import labelMapping from "./label_mapping.json";
// Skip local model check
env.allowLocalModels = false;

// Use the Singleton pattern to enable lazy construction of the pipeline.
class PipelineSingleton {
  static task = "feature-extraction";
  static model = "mihalca/bert_model_ro_fake_news";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
  // Retrieve the classification pipeline. When called for the first time,
  // this will load the pipeline and save it for future use.
  let classifier = await PipelineSingleton.getInstance((x) => {
    // We also add a progress callback to the pipeline so that we can
    // track model loading.
    self.postMessage(x);
  });

  // Actually perform the classification
  let output = await classifier(event.data.text);
  const v_softmaxed = softmax(output.data);
  const mappedResult = map(v_softmaxed, (item, index) => {
    return {
      label: labelMapping[index],
      score: item,
    };
  });

  // Send the output back to the main thread
  self.postMessage({
    status: "complete",
    output: {
      text: event.data.text,
      results: mappedResult,
    },
  });
});
