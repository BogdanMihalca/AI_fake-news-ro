import Image from "next/image";
import { Separator } from "../ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

interface AiModelsTabProps {
  title: string;
  value: string;
}

const AiModelsTab: React.FC<AiModelsTabProps> = ({ title, value }) => {
  return (
    <TabsContent value={value} className="w-full min-h-[75vh] ">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            In this study, the following artificial intelligence models were
            compared for detecting fake news.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-sm text-gray-200">
            In this study, several{" "}
            <span className="text-blue-300 font-semibold">
              artificial intelligence models
            </span>{" "}
            were used to detect fake news. Each model has unique characteristics
            and contributes differently to the correct classification of texts.
            Here are details about the models used:
          </p>
          {/* Naive Bayes */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Naive Bayes
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
              <Image
                src="/nayve.png"
                alt="Naive Bayes"
                className="block mb-8 lg:mb-0 lg:mr-8"
                width={600}
                height={400}
              />
              <div>
                <p className="mt-4">
                  <strong>Naive Bayes</strong> is a simple but effective
                  algorithm based on{" "}
                  <span className="text-blue-300 font-medium">
                    Bayes&apos; theorem
                  </span>
                  . It uses the assumption that each attribute (word) in a text
                  is <span className="font-semibold">independent</span>, which
                  makes it fast and efficient for classifying large texts.
                </p>
                <p className="mt-4">
                  Despite its simplicity, Naive Bayes is often used in text
                  classification tasks and performs surprisingly well for binary
                  or multi-class classification tasks.
                  <a
                    href="https://en.wikipedia.org/wiki/Naive_Bayes_classifier"
                    className="text-blue-300 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" className="mt-8 mb-8" />
          {/* Logistic Regression */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Logistic Regression
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
              <Image
                src="/logisitc.png"
                alt="Logistic Regression"
                className="block mb-8 lg:mb-0 lg:mr-8"
                width={300}
                height={300}
              />
              <div>
                <p className="mt-4">
                  <strong>Logistic Regression</strong> is a{" "}
                  <span className="text-blue-300 font-medium">
                    linear classification
                  </span>{" "}
                  model used for binary classification problems. It models the
                  probability that an observation belongs to a class and is
                  efficient in simple classification tasks.
                </p>
                <p>
                  Despite its simplicity, Logistic Regression can produce
                  impressive results, especially in combination with other text
                  preprocessing techniques.
                  <a
                    href="https://en.wikipedia.org/wiki/Logistic_regression"
                    className="text-blue-300 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" className="mt-8 mb-8" />
          {/*Support vector machine */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              Support Vector Machine (SVM)
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
              <Image
                src="/svm.webp"
                alt="Support Vector Machine"
                className="block mb-8 lg:mb-0 lg:mr-8"
                width={300}
                height={300}
              />
              <div>
                <p className="mt-4">
                  <strong>Support Vector Machine (SVM)</strong> is a{" "}
                  <span className="text-blue-300 font-medium">
                    classification
                  </span>{" "}
                  algorithm that works by separating data using a hyperplane.
                  SVM is very efficient in classifying complex data and is often
                  used in tasks where classes are difficult to separate.
                </p>
                <p>
                  SVM works well with large datasets and can be used to
                  effectively separate fake news from real news.
                  <a
                    href="https://en.wikipedia.org/wiki/Support_vector_machine"
                    className="text-blue-300 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          <Separator orientation="horizontal" className="mt-8 mb-8" />
          {/* BERT */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              BERT (Bidirectional Encoder Representations from Transformers)
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
              <Image
                src="/bert.png"
                alt="BERT"
                className="block mb-8 lg:mb-0 lg:mr-8"
                width={400}
                height={300}
              />
              <div>
                <p className="mt-4">
                  <strong>BERT</strong> is an advanced{" "}
                  <span className="text-blue-300 font-medium">
                    natural language processing
                  </span>{" "}
                  model developed by Google. It is a Transformer model that
                  understands the bidirectional context of words in a sentence,
                  making it extremely powerful in text classification tasks.
                </p>
                <p>
                  BERT is widely used in fake news detection due to its ability
                  to capture the subtleties and context of language.
                  <a
                    href="https://en.wikipedia.org/wiki/BERT_(language_model)"
                    className="text-blue-300 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
          <Separator orientation="horizontal" className="mt-8 mb-8" />
          {/* RoERTa Large */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-red-500 mb-4">
              RoBERTa-large
            </h3>
            <div className="text-sm text-muted-foreground flex flex-col lg:flex-row items-start">
              <Image
                src="/roberta.png"
                alt="RoBERTa-large"
                className="block mb-8 lg:mb-0 lg:mr-8"
                width={600}
                height={300}
              />
              <div>
                <p className="mt-4">
                  <strong>RoBERTa-large</strong> is an optimized version of the{" "}
                  <span className="text-blue-300 font-medium">BERT</span> model
                  developed by Facebook AI. RoBERTa-large is trained on more
                  data and has hyperparameter settings adjusted for better
                  performance in classification tasks.
                </p>
                <p>
                  This model has proven to be extremely effective in detecting
                  fake news, being able to capture complex semantic
                  relationships between words.
                  <a
                    href="https://en.wikipedia.org/wiki/RoBERTa"
                    className="text-blue-300 hover:underline ml-2"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export { AiModelsTab };
