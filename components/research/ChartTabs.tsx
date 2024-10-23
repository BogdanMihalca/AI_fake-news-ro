"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import all_results from "@/components/research/1_results_all_models.json";
import { findIndex, forEach } from "lodash";
import { Key, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ChartTabs = () => {
  const evaluationDescription = useMemo(
    () => [
      {
        type: "accuracy",
        description:
          "Accuracy is the ratio of correctly predicted observations to the total observations. It is a measure of the overall performance of the model.",
        formula: "Accuracy = (TP + TN) / (TP + TN + FP + FN)",
      },
      {
        type: "precision",
        description:
          "Precision is the ratio of correctly predicted positive observations to the total predicted positive observations. It is a measure of the accuracy of the positive predictions.",
        formula: "Precision = TP / (TP + FP)",
      },
      {
        type: "recall",
        description:
          "Recall is the ratio of correctly predicted positive observations to the all observations in actual class. It is a measure of the completeness of the positive predictions.",
        formula: "Recall = TP / (TP + FN)",
      },
      {
        type: "f1_score",
        description:
          "F1 Score is the weighted average of Precision and Recall. It is a measure of the model's accuracy.",
        formula: "F1 Score = 2 * (Precision * Recall) / (Precision + Recall)",
      },
      {
        type: "log_loss",
        description:
          "Log Loss is the loss function used in logistic regression. It measures the performance of a classification model where the prediction output is a probability value between 0 and 1.",
        formula:
          "Log Loss = -1 * (1 / N) * Σ (y * log(p) + (1 - y) * log(1 - p))",
      },
    ],
    []
  );

  const config: any = useMemo(() => {
    const config: any = {};
    forEach(evaluationDescription, (item) => {
      config[item.type] = {
        BERT: {
          label: "Bert",
          color: "hsl(var(--chart-1))",
        },
        "Logistic Regression": {
          label: "Log. Regression",
          color: "hsl(var(--chart-2))",
        },
        "Multinomial Naive Bayes": {
          label: "Naive Bayes",
          color: "hsl(var(--chart-3))",
        },
        "Support Vector Machine": {
          label: "SVM",
          color: "hsl(var(--chart-4))",
        },
        RoBERTaLarge: {
          label: "RoBERTa",
          color: "hsl(var(--chart-5))",
        },
      };
    });
    return config;
  }, [evaluationDescription]);

  const metrics = useMemo(() => {
    const metricsChartData: any = {};
    forEach(evaluationDescription, (item) => {
      metricsChartData[item.type] = {
        fakero: all_results
          .filter((m) => m.model.includes("FakeRom"))
          .map((model) => {
            return {
              model: model.model.replace("(trained on FakeRom)", "").trim(),
              value: model[item.type as keyof typeof model],
              testData: model.test_set,
              fill: config[item.type][
                model.model
                  .replace("(trained on FakeRom)", "")
                  .trim() as keyof typeof config
              ]?.color,
            };
          }),
        mine: all_results
          .filter((m) => m.model.includes("NEW"))
          .map((model) => {
            return {
              model: model.model.replace("(trained on NEW)", "").trim(),
              testData: model.test_set,
              value: model[item.type as keyof typeof model],
              fill: config[item.type][
                model.model
                  .replace("(trained on NEW)", "")
                  .trim() as keyof typeof config
              ]?.color,
            };
          }),
      };
    });
    return metricsChartData;
  }, [config, evaluationDescription]);

  return (
    <Tabs defaultValue="accuracy" className="w-full mt-4">
      <TabsList className="w-full flex-wrap h-auto">
        <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
        <TabsTrigger value="precision">Precision</TabsTrigger>
        <TabsTrigger value="recall">Recall</TabsTrigger>
        <TabsTrigger value="f1_score">F1 Score</TabsTrigger>
        <TabsTrigger value="log_loss"> Log Loss</TabsTrigger>
      </TabsList>
      {["accuracy", "precision", "recall", "f1_score", "log_loss"].map(
        (tab) => (
          <TabsContent key={tab} value={tab} className="w-full">
            <div className="p-4 bg-slate-800 shadow-md rounded-lg">
              <h4 className="text-lg font-bold mb-2 text-gray-200">
                {tab.replace(/_/g, " ").toUpperCase()}
              </h4>
              <p className="text-gray-200 mb-4">
                {
                  evaluationDescription.find((item) => item.type === tab)
                    ?.description
                }
              </p>
              <div className="bg-gray-900 p-3 rounded-md">
                <p className="text-red-200 font-semibold">Formula:</p>
                <p className="text-gray-500">
                  {
                    evaluationDescription.find((item) => item.type === tab)
                      ?.formula
                  }
                </p>
              </div>
            </div>

            {/* a div with to chrats one under another but on md devices one near another */}
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-4  bg-slate-800 shadow-md rounded-lg mt-4 mr-2">
                <h4 className="text-lg font-bold mb-2 text-gray-200">
                  {tab.replace(/_/g, " ").toUpperCase()} - FakeRom Dataset
                </h4>
                <ChartContainer config={config[tab as keyof typeof config]}>
                  <BarChart accessibilityLayer data={metrics[tab].fakero}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="model"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        config[tab][value as keyof typeof config]?.label
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          valueFormatter={(value) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                          indicator="line"
                          labelFromDataKey="testData"
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      strokeWidth={2}
                      radius={8}
                      // the index with the highest value will be highlighted
                      activeIndex={findIndex(
                        metrics[tab].fakero,
                        (item: any) => {
                          return (
                            item.value ===
                            Math.max(
                              ...metrics[tab].fakero.map(
                                (item: any) => item.value
                              )
                            )
                          );
                        }
                      )}
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
                    />
                  </BarChart>
                </ChartContainer>
                {/* a table with the values and also add a color indicator */}
                <Separator
                  orientation="horizontal"
                  className="my-4 bg-slate-500"
                />
                <Table className="w-full">
                  <TableCaption className="text-left">
                    <p>
                      Highest {tab.replace(/_/g, " ").toUpperCase()} value its
                      for the{" "}
                      {
                        metrics[tab].fakero.reduce(
                          (acc: any, item: any) => {
                            return item.value > acc.value ? item : acc;
                          },
                          { value: 0 }
                        ).model
                      }
                    </p>
                    <p>
                      Lowest {tab.replace(/_/g, " ").toUpperCase()} value its
                      for the{" "}
                      {
                        metrics[tab].fakero.reduce(
                          (acc: any, item: any) => {
                            return item.value < acc.value ? item : acc;
                          },
                          { value: 1 }
                        ).model
                      }
                    </p>
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-gray-950">
                      <TableHead>Model</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics[tab].fakero.map((item: any, index: Key) => (
                      <TableRow key={index} className="bg-gray-900">
                        <TableCell>
                          <span
                            className="inline-block w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: item.fill }}
                          />
                          {
                            config[tab][item.model as keyof typeof config]
                              ?.label
                          }
                          <br />
                          <p className="text-xs mt-2">
                            <span className="text-gray-500">
                              Test data from:
                            </span>{" "}
                            <span style={{ color: item.fill }}>
                              {item.testData.replace("test data from", "")}
                            </span>
                          </p>
                        </TableCell>
                        <TableCell>{(item.value * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="w-full md:w-1/2 p-4  bg-slate-800 shadow-md rounded-lg mt-4 ml-2">
                <h4 className="text-lg font-bold mb-2 text-gray-200">
                  {tab.replace(/_/g, " ").toUpperCase()} - Improved Dataset
                </h4>
                <ChartContainer config={config[tab as keyof typeof config]}>
                  <BarChart accessibilityLayer data={metrics[tab].mine}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="model"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      tickFormatter={(value) =>
                        config[tab][value as keyof typeof config]?.label
                      }
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          hideLabel
                          valueFormatter={(value) =>
                            `${(value * 100).toFixed(2)}%`
                          }
                          indicator="line"
                          labelFromDataKey="testData"
                        />
                      }
                    />
                    <Bar
                      dataKey="value"
                      strokeWidth={2}
                      radius={8}
                      // the index with the highest value will be highlighted
                      activeIndex={findIndex(metrics[tab].mine, (item: any) => {
                        return (
                          item.value ===
                          Math.max(
                            ...metrics[tab].mine.map((item: any) => item.value)
                          )
                        );
                      })}
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
                    />
                  </BarChart>
                </ChartContainer>
                {/* a table with the values and also add a color indicator */}
                <Separator
                  orientation="horizontal"
                  className="my-4 bg-slate-500"
                />
                <Table className="w-full">
                  <TableCaption className="text-left">
                    <p>
                      Highest {tab.replace(/_/g, " ").toUpperCase()} value its
                      for the{" "}
                      {
                        metrics[tab].mine.reduce(
                          (acc: any, item: any) => {
                            return item.value > acc.value ? item : acc;
                          },
                          { value: 0 }
                        ).model
                      }
                    </p>
                    <p>
                      Lowest {tab.replace(/_/g, " ").toUpperCase()} value its
                      for the{" "}
                      {
                        metrics[tab].mine.reduce(
                          (acc: any, item: any) => {
                            return item.value < acc.value ? item : acc;
                          },
                          { value: 1 }
                        ).model
                      }
                    </p>
                  </TableCaption>
                  <TableHeader>
                    <TableRow className="bg-gray-950">
                      <TableHead>Model</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics[tab].mine.map((item: any, index: Key) => (
                      <TableRow key={index} className="bg-gray-900">
                        <TableCell>
                          <span
                            className="inline-block w-4 h-4 rounded-full mr-2"
                            style={{ backgroundColor: item.fill }}
                          />
                          {
                            config[tab][item.model as keyof typeof config]
                              ?.label
                          }
                          <br />
                          <p className="text-xs mt-2">
                            <span className="text-gray-500">
                              Test data from:
                            </span>{" "}
                            <span style={{ color: item.fill }}>
                              {item.testData.replace("test data from", "")}
                            </span>
                          </p>
                        </TableCell>
                        <TableCell>{(item.value * 100).toFixed(2)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        )
      )}
    </Tabs>
  );
};

export { ChartTabs };
