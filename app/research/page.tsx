import { CodeBlock } from "@/components/common/CodeBlock";
import Content from "@/components/commonPages/Content";
import PageHeader from "@/components/commonPages/PageHeader";
import { Separator } from "@/components/ui/separator";

import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  preProcessedCode,
  scrapperCode,
  trainingCode,
} from "../../components/research/code";
import { Card, CardContent } from "@/components/ui/card";
import { ChartTabs } from "@/components/research/ChartTabs";

const HowItWorks = () => {
  return (
    <>
      <PageHeader title="Research" />
      <Content>
        <div className="flex w-full">
          <Card className="w-1/4 mr-4 px-2 py-4 hidden md:block">
            <CardContent className="fixed w-1/4 p-2 text-sm">
              <Link
                href="#how_it_started"
                className="flex items-center flex-wrap mb-4"
              >
                <span className="mr-2 text-lg">💡</span>
                How it started
                <LinkIcon size={20} className="ml-2" />
              </Link>
              <Link
                href="#data_gathering"
                className="flex flex-wrap items-center"
              >
                <span className="mr-2  text-lg">🔍</span> Data gathering
                <LinkIcon size={20} className="ml-2" />
              </Link>
              <Link
                href="#data_preprocessing"
                className="flex items-center flex-wrap  mt-4"
              >
                <span className="mr-2 text-lg">🧹</span> Data preprocessing
                <LinkIcon size={20} className="ml-2" />
              </Link>
              <Link
                href="#training_the_model"
                className="flex items-center flex-wrap mt-4"
              >
                <span className="mr-2 text-lg">🧠</span> Training the model
                <LinkIcon size={20} className="ml-2" />
              </Link>
              <Link
                href="#model_evaluation"
                className="flex items-center flex-wrap mt-4"
              >
                <span className="mr-2 text-lg">📊</span> Model evaluation
                <LinkIcon size={20} className="ml-2" />
              </Link>
            </CardContent>
          </Card>
          <Card className="w-full md:w-3/4">
            <CardContent className="p-4">
              {/* How it started */}
              <section id="how_it_started" className="text-sm mb-6">
                <h1 className="text-2xl font-bold">💡 How it started</h1>
                <p className="mt-2">
                  The project started as an idea to help people identify fake
                  news and misinformation. The goal was to create a tool that
                  can help people verify the authenticity of news articles and
                  other information they come across online.
                </p>
                <p className="mt-2">
                  The project was inspired by the rise of fake news and
                  misinformation online, and the need for a tool that can help
                  people separate fact from fiction especially in the age of
                  social media and the internet.
                </p>
                <p className="my-2">
                  Detection of fake news in Romanian language is a challenging
                  task due to the lack of resources and tools available for this
                  language. My goal was to create a tool that can help people
                  identify fake news and misinformation in Romanian language,
                  and to provide a way for people to verify the authenticity of
                  news articles and other information they come across online.
                </p>
              </section>
              <Separator className="my-4 bg-slate-500" />
              {/* Data gathering */}
              <section id="data_gathering" className="text-sm mb-6">
                <h1 className="text-2xl font-bold">🔍 Data gathering</h1>
                <p className="mt-2">
                  The first step in creating the fake news detection tool was to
                  find a dataset of fake news articles in Romanian language. I
                  searched online for datasets of fake news articles in the
                  Romanian language, but I couldn&apos;t find any suitable
                  dataset that I could use for training the model. I further
                  searched and found a dataset called{" "}
                  <Link
                    href="https://huggingface.co/datasets/mateiaass/FakeRom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    FakeRom
                  </Link>{" "}
                </p>
                <p className="mt-2">
                  The FakeRom dataset contains{" "}
                  <span className="font-bold text-red-500">838</span> fake and
                  real news articles in Romanian language, and it was created by
                  scraping articles from various websites and social media
                  platforms. The majority of the articles in the dataset are
                  real news articles, and only a small percentage of them are
                  fake news split in nuance, satire, propaganda, misinformation,
                  etc.
                </p>
                <div className="flex justify-center mt-4">
                  <Image
                    src="/fakerom_dataset.png"
                    alt="Fake news dataset"
                    width={600}
                    height={400}
                  />
                </div>
                {/* LIST OF THE issues with this dataset  */}
                <h3 className="text-xl font-bold mt-4 ml-16">
                  Issues with the dataset:
                </h3>
                <ul className="list-disc mt-2 ml-24">
                  <li>
                    The dataset contains a small number of fake news articles
                    compared to the real news articles.
                  </li>
                  <li>News articles might be outdated.</li>
                  <li>
                    Contains articles from various sources and domains, which
                    might affect the performance of the model.
                  </li>
                </ul>
                <p className="mt-8">
                  I start <span className="font-bold"> think</span> about a
                  solution to improve the dataset by gathering more relevant and
                  up-to-date articles. I came across a platform called{" "}
                  <Link
                    href="https://www.hotnews.ro/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    Veridica
                  </Link>{" "}
                  that provides a list of analyzed articles and their nuance by
                  real journalists. My toughs were:{" "}
                  <span className="font-light italic text-yellow-400">
                    &quot;I found the honeypot!&quot;
                  </span>
                </p>
                <p className="mt-2">
                  The next step was to scrape the articles from the website and
                  create a new dataset that contains real news articles and
                  their nuance. I put together a scraper using{" "}
                  <Link
                    href="https://pypi.org/project/beautifulsoup4/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    BeautifulSoup
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="https://pypi.org/project/requests/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    requests
                  </Link>{" "}
                  libraries in Python.
                </p>
                <CodeBlock code={scrapperCode} title="Scrapper code:" />
                <p className="mt-2">
                  The scraper was able to bring{" "}
                  <span className="font-bold text-purple-500">1356</span>{" "}
                  articles from the website, and I used the articles to create a
                  new dataset that contains real news articles and fake news in
                  their nuance. This dataset will be used to train the fake news
                  detection model and improve its performance. So far the
                  dataset combined with{" "}
                  <Link
                    href="https://huggingface.co/datasets/mateiaass/FakeRom"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    FakeRom
                  </Link>{" "}
                  , now has{" "}
                  <span className="font-bold text-green-500">2194</span>{" "}
                  articles in total. The next step is to optimize the dataset by
                  removing special characters, stopwords, and other irrelevant
                  information. Also to overcome the imbalance of the classes, I
                  will use techniques like oversampling, undersampling, and
                  SMOTE.
                </p>
              </section>
              <Separator className="my-4 bg-slate-500" />
              {/* Data preprocessing */}
              <section id="data_preprocessing" className="text-sm mb-6">
                <h1 className="text-2xl font-bold">🧹 Data preprocessing</h1>
                <p className="mt-2">
                  The next step in building the fake news detection tool
                  involves data preprocessing to ensure the data is clean,
                  consistent, and ready for model training. This step includes
                  various tasks such as text cleaning, data augmentation, and
                  handling class imbalances to optimize model performance.
                </p>
                <p className="mt-2">
                  Data preprocessing is critical to improving the model&apos;s
                  performance by eliminating noise and irrelevant information,
                  thus enhancing the model&apos;s ability to generalize.
                  Moreover, it ensures balanced class distributions, crucial for
                  preventing model bias.
                </p>
                <p className="mt-2">
                  The following steps outline the preprocessing procedure:
                </p>
                <ul className="list-disc mt-2 ml-24">
                  <li>Text is converted to lowercase.</li>
                  <li>Special characters and single characters are removed.</li>
                  <li>Multiple spaces are replaced with a single space.</li>
                </ul>
                <p className="my-4">
                  The preprocessing process also includes the following advanced
                  techniques:
                </p>
                <ol className="list-decimal list-inside mb-4 ml-24">
                  <li className="mb-2">
                    <strong>Loading JSON Data:</strong> The dataset is loaded
                    from a JSON file using the <code>load_json</code> function.
                  </li>
                  <li className="mb-2">
                    <strong>Basic Text Preprocessing:</strong> The text is
                    cleaned by converting it to lowercase, removing special
                    characters, eliminating single characters, and condensing
                    multiple spaces into one using the{" "}
                    <code>preprocess_text</code> function.
                  </li>
                  <li className="mb-2">
                    <strong>Synonym Replacement:</strong> The minority class
                    data is augmented using the <code>synonym_replacement</code>{" "}
                    function, which employs pre-trained fastText embeddings to
                    replace words with their synonyms, enhancing the dataset’s
                    variety.
                  </li>
                  <li className="mb-2">
                    <strong>Data Augmentation:</strong> The minority class data
                    is further augmented by generating new samples with synonym
                    replacement and combining them with the original data.
                  </li>
                  <li className="mb-2">
                    <strong>Handling Class Imbalance:</strong> The
                    RandomOverSampler method from the <code>imblearn</code>{" "}
                    library is used to balance the dataset by oversampling the
                    minority classes, ensuring that each class has an equal
                    number of samples.
                  </li>
                  <li className="mt-2">
                    <strong>Saving the Enhanced Dataset:</strong> The processed
                    and balanced dataset is saved in JSON format using the{" "}
                    <code>save_to_json</code> function.
                  </li>
                </ol>
                <p className="mt-2">
                  The final balanced dataset is now ready for training and is
                  saved to the specified path. Additionally, the class
                  distribution is printed to confirm that the classes are
                  balanced.
                </p>
                <CodeBlock
                  code={preProcessedCode}
                  title="Data preprocessing code:"
                />
              </section>
              <Separator className="my-4 bg-slate-500" />
              {/* Training the  */}
              <section id="training_the_model" className="text-sm mb-6">
                <h1 className="text-2xl font-bold">🧠 Training the model</h1>
                <p className="mt-2">
                  The next step in creating the fake news detection tool is to
                  train the model using the preprocessed data. This involves
                  feeding the cleaned and balanced dataset into a machine
                  learning algorithm to learn the patterns and features that
                  distinguish fake news from real news articles.
                </p>
                <p className="mt-2">
                  For this project, we chose to use the{" "}
                  <span className="font-bold">BERT</span> (Bidirectional Encoder
                  Representations from Transformers) model, a state-of-the-art
                  natural language processing model. BERT is particularly
                  well-suited for this task due to its ability to understand the
                  context of words in a sentence, making it highly effective at
                  distinguishing between nuanced differences in text.
                </p>
                <p className="mt-2">
                  The training process involves fine-tuning the{" "}
                  <span className="font-bold">BERT base uncased</span> model on
                  our preprocessed dataset. This allows the model to learn the
                  specific features and patterns that are indicative of fake
                  news in the Romanian language. The model is then evaluated on
                  a test set to measure its performance using metrics such as
                  <span className="font-bold">
                    {" "}
                    accuracy, precision, recall,
                  </span>
                  and <span className="font-bold">F1 score</span>.
                </p>
                <p className="mt-2">
                  After training, the model can be used to predict whether a
                  news article is real, or fake, and if is fake to predict its
                  nuance. The model can also be used to generate a confidence
                  score for each prediction based on the features it has
                  learned. This makes it a powerful tool for verifying the
                  authenticity of news articles and other information online.
                </p>
                <p className="mt-2">
                  You can read more about the BERT model and its capabilities{" "}
                  <Link
                    href="https://huggingface.co/transformers/model_doc/bert.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    here
                  </Link>
                  .
                </p>
                <CodeBlock
                  code={trainingCode}
                  title="Training the model code:"
                />

                <p className="mt-2">
                  We didn&quot;t choose to use{" "}
                  <span className="font-bold">BERT</span> without a reason. We
                  chose it because it is a powerful model that can be used for a
                  wide range of natural language processing tasks, including
                  text classification, question answering, and named entity
                  recognition.
                  <span className="font-bold">BERT</span> is particularly
                  well-suited for this task due to its ability to understand the
                  context of words in a sentence, making it highly effective at
                  distinguishing between nuanced differences in text. We also
                  compared it with other models like{" "}
                  <span className="font-bold text-cyan-500">
                    Logistic Regression (LR)
                  </span>
                  , <span className="font-bold text-cyan-500">Naive Bayes</span>
                  , and{" "}
                  <span className="font-bold text-cyan-500">
                    Support Vector Machine (SVM)
                  </span>
                  , and <span className="font-bold">BERT</span> outperformed
                  them in terms of{" "}
                  <span className="font-bold text-green-500">accuracy</span>,{" "}
                  <span className="font-bold text-green-500">precision</span>,{" "}
                  <span className="font-bold text-green-500">recall</span>, and{" "}
                  <span className="font-bold text-green-500">F1 score</span>.
                  Those metrics are available in the model evaluation section.
                </p>
              </section>
              <Separator className="my-4 bg-slate-500" />
              {/* Model evaluation */}
              <section id="model_evaluation" className="text-sm mb-6">
                <h1 className="text-2xl font-bold">📊 Model evaluation</h1>
                <p className="mt-2">
                  The model was evaluated on a test set to measure its
                  performance using metrics such as accuracy, precision, recall,
                  and F1 score. The evaluation results are as follows:
                </p>
                <p className="mt-2">
                  The model performed well on the test set, achieving high
                  scores in all metrics. The high scores indicate that the model
                  is effective at distinguishing between fake news nuance in
                  articles in the Romanian language.
                </p>
                <p className="mt-2">
                  Bellow is a comparison between the models used in the project
                  and their performance, trained on the original dataset and the
                  enhanced dataset:
                </p>
                <ChartTabs />
              </section>
            </CardContent>
          </Card>
        </div>
      </Content>
    </>
  );
};

export default HowItWorks;
