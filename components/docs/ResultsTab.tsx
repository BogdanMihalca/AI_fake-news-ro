import { Separator } from "@/components/ui/separator";
import metrics from "./results_alll_merged.json";

import { TabsContent } from "@/components/ui/tabs";
import { map, reduce } from "lodash";
import { TrendingUp, TrendingDown, PieChart } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Rectangle,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ResultsTabProps {
  title: string;
  value: string;
}

const ResultsTab: React.FC<ResultsTabProps> = ({ title, value }) => {
  const data = map(metrics, (metric, i) => ({
    label: metric.Model,
    accuracy: metric.Accuracy,
    precision: metric.Precision,
    recall: metric.Recall,
    f1: metric["F1 Score"],
    fill: `hsl(var(--chart-${i + 1}))`,
  }));

  const dataROC = reduce(
    metrics,
    (acc: any[], { Model, "ROC AUC Per Class": rocAucPerClass }: any) => {
      Object.keys(rocAucPerClass).forEach((metric) => {
        const existingMetric = acc.find((item) => item.label === metric);
        if (existingMetric) {
          existingMetric[Model] = rocAucPerClass[metric] || 0;
        } else {
          acc.push({
            label: metric,
            [Model]: rocAucPerClass[metric] || 0,
          });
        }
      });
      return acc;
    },
    []
  );

  const rocChartConfig: ChartConfig = reduce(
    metrics,
    (acc, { Model }, i) => {
      acc[Model] = {
        label: Model,
        color: `hsl(var(--chart-${i + 1}))`,
      };
      return acc;
    },
    {} as any
  );

  const chartConfig: ChartConfig = {
    "Naive Bayes": {
      label: "Naive Bayes",
    },
    "Logistic Regression": {
      label: "Logistic Regression",
    },
    "Support Vector Machine": {
      label: "Support Vector Machine",
    },
    BERT: {
      label: "BERT",
    },
    "BERT Enhanced": {
      label: "BERT Enhanced",
    },
    "RoBERTa-large": {
      label: "RoBERTa-large",
    },
  };

  return (
    <TabsContent value={value} className="w-full min-h-[75vh]">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            In this section, the evaluation results of artificial intelligence
            models for detecting fake news are presented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section
            id="metrics-definition"
            className="mb-16 px-6 py-10 bg-gray-800 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-200 mb-8 text-center">
              Model Evaluation Metrics
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Accuracy */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-blue-400 mb-4">
                    Accuracy
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Accuracy</strong> measures the proportion of total
                    correct predictions (both positive and negative) out of all
                    predictions.
                  </p>
                </div>
                <div>
                  The formula is:
                  <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                    Accuracy = (TP + TN) / (TP + TN + FP + FN)
                  </p>
                </div>
              </div>

              {/* Precision */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">
                    Precision
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Precision</strong> is the proportion of relevant
                    examples (true positives) among all examples labeled as
                    positive (positive predictions).
                  </p>
                </div>
                <div>
                  The formula is:
                  <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                    Precision = TP / (TP + FP)
                  </p>
                </div>
              </div>

              {/* Recall */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-red-400 mb-4">
                    Recall
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong>Recall</strong> measures the proportion of positive
                    examples correctly identified out of all actual positive
                    examples.
                  </p>
                </div>
                <div>
                  The formula is:
                  <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                    Recall = TP / (TP + FN)
                  </p>
                </div>
              </div>

              {/* F1 Score */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">
                    F1 Score
                  </h3>
                  <p className="text-gray-300 text-sm">
                    <strong>F1 Score</strong> is the harmonic mean of Precision
                    and Recall. It is useful when you need to consider both
                    false positive and false negative errors.
                  </p>
                </div>
                <div className="mt-10">
                  The formula is:
                  <p className="mt-4 text-gray-500 italic text-xs font-mono bg-neutral-900 rounded-md p-4">
                    F1 Score = 2 * (Precision * Recall) / (Precision + Recall)
                  </p>
                </div>
              </div>
            </div>
          </section>
          <Separator orientation="horizontal" className="mt-4 mb-4" />
          <section className="mb-16 px-6 py-10 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-500 mb-8 text-center">
              Evaluation Results
            </h2>
            <p className="text-sm text-gray-200 mb-4 text">
              ** All models were trained on the same dataset and evaluated using
              the same metrics.
            </p>
            <p className="text-sm text-gray-200 mb-4">
              ** The only exception is the model{" "}
              <span className="font-extrabold">Bert Enhanced</span> which is the
              same model used in our application.
              <br></br>
              At its core, it is the same Bert model, but more advanced text
              preprocessing techniques and optimized hyperparameters were
              applied, resulting in much superior results.
            </p>
            <p className="text-sm text-gray-200 mb-4">
              ** The base model for <span className="font-extrabold">BERT</span>{" "}
              and <span className="font-extrabold">Bert Enhanced</span> is the
              `bert-base-uncased` model from Hugging Face. It comes pre-trained
              on a large dataset and is optimized for text classification tasks.
            </p>
            <p className="text-sm text-gray-200 mb-8">
              ** Accuracy, precision, recall, and F1 Score are measured in
              percentages.
            </p>

            <div className="grid grid-cols-1  lg:grid-cols-2 gap-8">
              {/* Accuracy */}

              <Card>
                <CardHeader>
                  <CardTitle>Accuracy</CardTitle>
                  <CardDescription className="text-xs">
                    This represents the percentage of correctly classified
                    examples by the model. For example, a model with 100%
                    accuracy means it has correctly classified all the tested
                    news.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) =>
                          chartConfig[value as keyof typeof chartConfig]
                            ?.label as string
                        }
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => `${value * 100}%`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            valueFormatter={(value) =>
                              `${(value * 100).toFixed(2)}%`
                            }
                          />
                        }
                      />
                      <Bar
                        dataKey="accuracy"
                        strokeWidth={2}
                        radius={8}
                        activeIndex={5}
                        activeBar={({ ...props }) => {
                          return (
                            <Rectangle
                              {...props}
                              fillOpacity={0.8}
                              stroke={props.payload.fill}
                              strokeDasharray={4}
                              strokeDashoffset={4}
                            />
                          );
                        }}
                      >
                        <LabelList
                          dataKey="accuracy"
                          position="top"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium">
                    The highest accuracy is achieved by{" "}
                    {
                      data.reduce((acc, curr) => {
                        return acc.accuracy > curr.accuracy ? acc : curr;
                      }).label
                    }
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="flex gap-2 font-sm text-muted-foreground ">
                    The lowest accuracy is achieved by{" "}
                    {
                      data.reduce((acc, curr) => {
                        return acc.accuracy < curr.accuracy ? acc : curr;
                      }).label
                    }
                    <TrendingDown className="h-4 w-4" />
                  </div>

                  <div className="text-muted-foreground">
                    which indicates that it is not optimal for detecting fake
                    news in this dataset.
                  </div>
                </CardFooter>
              </Card>

              {/* Precision */}
              <Card>
                <CardHeader>
                  <CardTitle>Precision</CardTitle>
                  <CardDescription className="text-xs">
                    Precision represents the percentage of relevant examples
                    (true positives) among all examples labeled as positive
                    (positive predictions).
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="label"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) =>
                          chartConfig[value as keyof typeof chartConfig]
                            ?.label as string
                        }
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        tickFormatter={(value) => `${value * 100}%`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            valueFormatter={(value) =>
                              `${(value * 100).toFixed(2)}%`
                            }
                          />
                        }
                      />
                      <Bar
                        dataKey="precision"
                        strokeWidth={2}
                        radius={8}
                        activeIndex={5}
                        activeBar={({ ...props }) => {
                          return (
                            <Rectangle
                              {...props}
                              fillOpacity={0.8}
                              stroke={props.payload.fill}
                              strokeDasharray={4}
                              strokeDashoffset={4}
                            />
                          );
                        }}
                      >
                        <LabelList
                          dataKey="precision"
                          position="top"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium">
                    The highest precision is achieved by{" "}
                    {
                      data.reduce((acc, curr) => {
                        return acc.accuracy > curr.accuracy ? acc : curr;
                      }).label
                    }
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="text-muted-foreground">
                    <PieChart className="h-4 w-4 inline-block" /> Although
                    RoBERTa-large offers good precision, it is not as high as
                    other models, which may mean that, although it is quite
                    precise, it makes more false positive errors than BERT or
                    SVM.
                  </div>
                  <div className="text-muted-foreground">
                    <PieChart className="h-4 w-4 inline-block" /> The BERT model
                    has good precision, which shows that it can make a solid
                    distinction between real and fake news, minimizing the
                    number of real news labeled incorrectly.
                  </div>
                </CardFooter>
              </Card>

              {/* Recall */}
              <Card>
                <CardHeader>
                  <CardTitle>Recall</CardTitle>
                  <CardDescription>
                    Recall measures the proportion of positive examples
                    correctly identified out of all actual positive examples.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={data}
                      layout="vertical"
                      margin={{
                        left: 40,
                      }}
                    >
                      <YAxis
                        dataKey="label"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value: string) =>
                          chartConfig[value as keyof typeof chartConfig]
                            ?.label as string
                        }
                      />
                      <XAxis dataKey="recall" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            hideLabel
                            valueFormatter={(value) =>
                              `${(value * 100).toFixed(2)}%`
                            }
                          />
                        }
                      />
                      <Bar dataKey="recall" layout="vertical" radius={5}>
                        <LabelList
                          dataKey="recall"
                          position="insideRight"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium">
                    The highest recall is achieved by{" "}
                    {
                      data.reduce((acc, curr) => {
                        return acc.recall > curr.recall ? acc : curr;
                      }).label
                    }
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="text-muted-foreground">
                    <PieChart className="h-4 w-4 inline-block" /> SVM shows a
                    high recall, indicating that this model can correctly
                    identify most fake news, being efficient in capturing
                    relevant examples.
                  </div>
                  <div className="text-muted-foreground">
                    <PieChart className="h-4 w-4 inline-block" /> The BERT model
                    has the best recall among the models, being able to
                    recognize a high percentage of fake news, even those with
                    subtle nuances, demonstrating a very good ability to capture
                    real positive examples.
                  </div>
                </CardFooter>
              </Card>

              {/* F1 Score */}
              <Card>
                <CardHeader>
                  <CardTitle>F1 Score</CardTitle>
                  <CardDescription>
                    The F1 Score is the harmonic mean of Precision and Recall.
                    It is useful when you need to consider both false positive
                    and false negative errors.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart
                      accessibilityLayer
                      data={data}
                      layout="vertical"
                      margin={{
                        left: 40,
                      }}
                    >
                      <YAxis
                        dataKey="label"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value: string) =>
                          chartConfig[value as keyof typeof chartConfig]
                            ?.label as string
                        }
                      />
                      <XAxis dataKey="f1" type="number" hide />
                      <ChartTooltip
                        cursor={false}
                        content={
                          <ChartTooltipContent
                            hideLabel
                            valueFormatter={(value) =>
                              `${(value * 100).toFixed(2)}%`
                            }
                          />
                        }
                      />
                      <Bar dataKey="f1" layout="vertical" radius={5}>
                        <LabelList
                          dataKey="f1"
                          position="insideRight"
                          offset={8}
                          className="fill-foreground"
                          fontSize={12}
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="flex gap-2 font-medium">
                    The highest F1 Score is achieved by{" "}
                    {
                      data.reduce((acc, curr) => {
                        return acc.f1 > curr.f1 ? acc : curr;
                      }).label
                    }
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="text-muted-foreground">
                    <PieChart className="h-4 w-4 inline-block" /> The F1 Score
                    for Naive Bayes is the lowest, suggesting that the model
                    makes significant compromises between precision and recall,
                    resulting in poor overall performance in detecting fake
                    news.
                  </div>
                  <div className="text-muted-foreground">
                    <PieChart className="h-4 w-4 inline-block" /> Although
                    RoBERTa-large offers a good F1 Score, it is lower than that
                    of the BERT model, suggesting that while the model performs
                    well, it is not as effective in maintaining a balance
                    between precision and recall.
                  </div>
                </CardFooter>
              </Card>

              {/* ROC auc per class */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>ROC AUC per Class</CardTitle>
                  <CardDescription>
                    AUC (Area Under the Curve) is a measure of the performance
                    of a classification model. The higher the AUC, the better
                    the model is at distinguishing between classes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={rocChartConfig}>
                    <BarChart accessibilityLayer data={dataROC}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="label"
                        tickLine={true}
                        tickMargin={10}
                        axisLine={true}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dashed" />}
                      />
                      <Bar
                        dataKey="Naive Bayes"
                        fill="hsl(var(--chart-1))"
                        radius={5}
                        strokeWidth={2}
                      />

                      <Bar
                        dataKey="Logistic Regression"
                        fill="hsl(var(--chart-2))"
                        radius={5}
                        strokeWidth={2}
                      />
                      <Bar
                        dataKey="Support Vector Machine"
                        fill="hsl(var(--chart-3))"
                        radius={5}
                        strokeWidth={2}
                      />
                      <Bar
                        dataKey="BERT"
                        fill="hsl(var(--chart-4))"
                        radius={5}
                        strokeWidth={2}
                      />
                      <Bar
                        dataKey="RoBERTa-large"
                        fill="hsl(var(--chart-5))"
                        radius={5}
                        strokeWidth={2}
                      />
                      <Bar
                        dataKey="BERT Enhanced"
                        fill="hsl(var(--chart-6))"
                        radius={5}
                        strokeWidth={2}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-emerald-500">
                      <PieChart className="h-4 w-4 inline-block mr-2" />
                      General Model Strength:
                    </span>{" "}
                    Models like SVM and BERT consistently demonstrate the
                    ability to handle various forms of false information,
                    excelling particularly in detecting satire and real news,
                    while Naive Bayes faces more challenges with nuanced classes
                    such as misinformation.
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-fuchsia-500">
                      <PieChart className="h-4 w-4 inline-block mr-2" />
                      Challenge with Misinformation:
                    </span>{" "}
                    Misinformation appears to be the most difficult class for
                    all models, as it often contains partial truths, which can
                    confuse traditional machine learning models.
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-red-500">
                      <PieChart className="h-4 w-4 inline-block mr-2" />
                      Detecting Satire:
                    </span>{" "}
                    All models perform exceptionally well in detecting satire,
                    likely due to the exaggerated nature of this class, making
                    it easier to differentiate from other types of content.
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-amber-500">
                      <PieChart className="h-4 w-4 inline-block mr-2" />
                      Reliability in Detecting Real News:
                    </span>{" "}
                    All models, especially BERT and SVM, perform extremely well
                    in correctly identifying real news, indicating that these
                    models are very capable of distinguishing legitimate
                    content.
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-semibold text-sky-500">
                      <PieChart className="h-4 w-4 inline-block mr-2" />
                      Sensitivity to Propaganda:
                    </span>{" "}
                    BERT and SVM are particularly effective in identifying
                    propaganda, suggesting their strength in detecting
                    manipulative or biased content.
                  </div>
                </CardFooter>
              </Card>
            </div>
          </section>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export { ResultsTab };
