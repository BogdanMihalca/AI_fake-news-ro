"use client";
import { map, maxBy } from "lodash";
import { FC, useEffect, useState } from "react";
import { Terminal, PieChart } from "lucide-react";
import {
  Bar,
  BarChart,
  LabelList,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { BalckboxResultsSkeleton } from "./BlacboxResultsSkeleton";
import { FeedbackForm, FeedbackFormSchemaType } from "./FeedbackForm";
import { useToast } from "../ui/use-toast";

interface BlackboxResultsProps {
  result:
    | {
        results: {
          label: string;
          score: number;
        }[];
        text: string;
      }
    | undefined;
  ready: boolean | null;
}

const BlackboxResults: FC<BlackboxResultsProps> = ({ result, ready }) => {
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);

  useEffect(() => {
    setFeedbackSent(false);
  }, [result]);

  const { toast } = useToast();

  const chartConfig = map(result?.results, (value, key) => ({
    [value.label]: {
      label: value.label,
      score: (value.score * 100).toFixed(2),
      color: `hsl(var(--chart-${key + 1}))`,
    },
  })).reduce((acc, obj) => ({ ...acc, ...obj }), {
    score: {
      label: "Score",
    },
  }) as ChartConfig;

  const chartData = map(result?.results, (value, i) => ({
    category: value.label,
    label: value.label,
    labelScore: (value.score * 100).toFixed(2) + "%",
    score: value.score.toFixed(2),
    fill: `hsl(var(--chart-${i + 1}))`,
  }));

  const availableTags = map(result?.results, (value) => ({
    label: value.label,
    value: value.label,
  }));

  const resultedLabel = (maxBy(result?.results, "score") as any)?.label;

  const handleSendFeedback = (data: FeedbackFormSchemaType) => {
    // is useful if text is at least 100 characters
    if (!result?.text || result?.text.length < 50) {
      setFeedbackSent(true);
      return;
    }

    const feedbackData = {
      content: result?.text,
      tag: data.isCorrect === "yes" ? resultedLabel : data.label,
    };
    setIsSendingFeedback(true);

    fetch("/api/datasets/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => {
        if (!response.ok) {
          toast({
            title: "Feedback Error",
            description: "Error sending feedback: " + response.statusText,
            variant: "destructive",
          });
        }
        setFeedbackSent(true);
        setIsSendingFeedback(false);
      })
      .catch((error) => {
        toast({
          title: "Feedback Error",
          description: "Error sending feedback: " + error.message,
          variant: "destructive",
        });
        setIsSendingFeedback(false);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4 md:mt-0">
      {ready === false ? (
        <BalckboxResultsSkeleton />
      ) : ready === null ? (
        <div className="flex items-center justify-center md:p-10 lg:p-20">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Do you want to check if an article is fake?</AlertTitle>
            <AlertDescription className="pt-5 flex">
              <PieChart className="h-10 w-10 mr-4" />
              Enter the text or web address of the article in the form on the
              left and press the Analyze button.
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-start align-baseline">
          <Card className="w-[400px] rounded-b-none md:rounded-r-none md:rounded-b-md overflow-hidden">
            <CardContent className="pb-0 pt-2 bg-neutral-950/50">
              <ChartContainer
                config={chartConfig}
                className="mx-auto max-h-[200px]"
              >
                <RadarChart data={chartData}>
                  <ChartTooltip
                    cursor={true}
                    content={
                      <ChartTooltipContent
                        valueFormatter={(value) => `${value}%`}
                      />
                    }
                  />
                  <PolarGrid
                    className="opacity-50"
                    gridType="circle"
                    stroke="#ffffff"
                  />
                  <PolarAngleAxis dataKey="category" />
                  <Radar
                    dataKey="score"
                    strokeWidth={3}
                    stroke="#2a41f5"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.9}
                    dot={{
                      r: 2,
                      fillOpacity: 1,
                      fill: "red",
                    }}
                  />
                </RadarChart>
              </ChartContainer>
              <Separator className="mb-4" />
              <ChartContainer config={chartConfig} className="h-[150px] w-full">
                <BarChart
                  margin={{
                    left: 40,
                    right: 0,
                    top: 0,
                    bottom: 10,
                  }}
                  data={chartData}
                  layout="vertical"
                  barSize={32}
                  barGap={2}
                >
                  <XAxis type="number" dataKey="score" hide />
                  <YAxis
                    dataKey="category"
                    type="category"
                    tickLine={true}
                    // tickMargin={4}
                    axisLine={false}
                    className="text-xs"
                  />
                  <Bar dataKey="score" radius={5}>
                    <LabelList
                      position="insideLeft"
                      dataKey="labelScore"
                      fill="white"
                      offset={10}
                      fontSize={12}
                    />
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm border-t-2 pt-2">
              <CardDescription>
                <span className="font-bold">Result:</span> {resultedLabel}
              </CardDescription>
              <CardDescription>
                <span className="font-bold">Probability of:</span>{" "}
                {(
                  (maxBy(result?.results, "score") as any)?.score * 100
                ).toFixed(2)}
                %
              </CardDescription>
            </CardFooter>
          </Card>
          <FeedbackForm
            handleOnSubmit={handleSendFeedback}
            tags={availableTags}
            feedbackSent={feedbackSent}
            isSendingFeedback={isSendingFeedback}
          />
        </div>
      )}
    </div>
  );
};

export { BlackboxResults };
