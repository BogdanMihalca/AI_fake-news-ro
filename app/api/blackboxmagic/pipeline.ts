/* eslint-disable no-unused-vars */
import { pipeline, PipelineType } from "@xenova/transformers";
import path from "path";
import { promises as fs } from "fs";

interface PipelineSingleton {
  task: PipelineType;
  model: string;
  instance: any; // Replace 'any' with the appropriate type for the pipeline instance

  getInstance(progress_callback?: any): Promise<any>; // Replace 'any' with the appropriate type for the progress callback
}

const P = (): PipelineSingleton =>
  class PipelineSingleton {
    static task: PipelineType = "feature-extraction";
    static model: string = "mihalca/bert_model_ro_fake_news";
    private cacheDir: string;

    private constructor() {
      this.cacheDir = path.resolve(process.cwd(), "cache");
    }

    /* uncomment the following lines to use the model from the local filesystem */
    //static task: PipelineType = "text-classification";
    //static model: string = "bert_model";

    static instance: any = null; // Replace 'any' with the appropriate type for the pipeline instance

    static async getInstance(progress_callback?: any): Promise<any> {
      if (this.instance === null) {
        await PipelineSingleton.ensureCacheDir();
        this.instance = await pipeline(this.task, this.model, {
          progress_callback,
        });
      }
      return this.instance;
    }

    private static async ensureCacheDir() {
      const cacheDir = path.resolve(process.cwd(), "cache");
      try {
        await fs.mkdir(cacheDir, { recursive: true });
      } catch (error) {
        console.error("Error creating cache directory:", error);
      }
    }
  };

let PipelineSingleton: PipelineSingleton;
if (process.env.NODE_ENV !== "production") {
  if (!(global as any).PipelineSingleton)
    (global as any).PipelineSingleton = P();

  PipelineSingleton = (global as any).PipelineSingleton;
} else {
  PipelineSingleton = P();
}

export default PipelineSingleton;
