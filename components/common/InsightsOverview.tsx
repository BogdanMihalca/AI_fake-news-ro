"use client";

import { RefreshCcw, TrendingUp } from "lucide-react";
import {
  Label,
  Pie,
  PieChart,
  Treemap,
  Bar,
  BarChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useCallback, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useSession } from "next-auth/react";

const InsightsOverview = ({ isHomePage }: { isHomePage?: boolean }) => {
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<{
    wordCloudData: { name: string; value: number }[];
    tagDistributionChartData: { tag: string; count: number; fill: string }[];
    tagDistributionChartConfig: ChartConfig;
    wordCloudDataChartConfig: ChartConfig;
    contentLengthByTagChartData: {
      tag: string;
      words: number;
      fill: string;
    }[];
    contentLengthByTagChartDataConfig: ChartConfig;
    totalItems: number;
  }>({
    wordCloudData: [],
    tagDistributionChartData: [],
    tagDistributionChartConfig: {},
    wordCloudDataChartConfig: {},
    totalItems: 0,
    contentLengthByTagChartData: [],
    contentLengthByTagChartDataConfig: {},
  });

  const fetchDatasetStats = useCallback(async () => {
    setIsLoading(true);
    fetch("/api/datasets/stats", { cache: "no-cache" })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats", error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchDatasetStats();
  }, [fetchDatasetStats]);

  return (
    <>
      <div
        className={`flex items-center  ${isHomePage ? "" : "justify-center"}`}
      >
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <span tabIndex={0}>
                <Button
                  className={`${isHomePage ? "mb-6" : "mx-auto"}`}
                  variant="outline"
                  disabled={status !== "authenticated"}
                  onClick={fetchDatasetStats}
                >
                  Refresh stats <RefreshCcw className="ml-4" />
                </Button>
              </span>
            </TooltipTrigger>
            {status !== "authenticated" && (
              <TooltipContent>
                <div className="text-center max-w-60">
                  You need to be authenticated to update statistics
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        className={isHomePage ? "flex justify-around space-x-4 flex-wrap" : ""}
      >
        {/* TAG PIE CHART */}
        <Card
          className={`flex flex-col  ${
            !isHomePage
              ? "border-x-0 border-t-0 rounded-none "
              : "mt-4 md:mt-0 min-w-[30%] flex-shrink-0"
          }`}
        >
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-sm">Tag Distribution</CardTitle>
            <CardDescription>in the dataset</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 p-0">
            {isLoading ? (
              <div className="flex flex-col space-y-3 justify-center align-middle my-4">
                <Skeleton className="h-[125px] w-[200px] rounded-xl mx-auto" />
                <div className="space-y-2  mx-auto">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <ChartContainer
                config={stats.tagDistributionChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={stats.tagDistributionChartData}
                    dataKey="count"
                    nameKey="tag"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-3xl font-bold"
                              >
                                {stats.totalItems}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className="fill-muted-foreground"
                              >
                                Total items
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Predominant is: <TrendingUp size={16} />
              &quot;{findMax(stats.tagDistributionChartData, "count")?.tag}
              &quot;
            </div>
            <div className="leading-none text-muted-foreground">
              {findMax(stats.tagDistributionChartData, "count")?.count} items
            </div>
          </CardFooter>
        </Card>
        {/* WORDS TREE MAP */}
        <Card
          className={`flex flex-col   ${
            !isHomePage
              ? "border-x-0 border-t-0 rounded-none"
              : " mt-4 md:mt-0 min-w-[33%] flex-shrink-0"
          }`}
        >
          <CardHeader className="items-center pb-0 ">
            <CardTitle className="text-sm">Word Frequency</CardTitle>
            <CardDescription>
              Limited to the top 100 most frequent words
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 p-0 mt-4 ">
            {isLoading ? (
              <div className="flex flex-col space-y-3 justify-center align-middle my-4">
                <Skeleton className="h-[125px] w-[200px] rounded-xl mx-auto" />
                <div className="space-y-2  mx-auto">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <ChartContainer
                config={stats.wordCloudDataChartConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <Treemap
                  height={250}
                  width={250}
                  data={stats.wordCloudData}
                  dataKey="value"
                  nameKey="name"
                  stroke="#fff"
                >
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                </Treemap>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm mt-4">
            <div className="flex items-center gap-2 font-medium leading-none">
              Predominant is: <TrendingUp size={16} />
              &quot;{findMax(stats.wordCloudData, "value")?.name}&quot;
            </div>
            <div className="leading-none text-muted-foreground">
              {findMax(stats.wordCloudData, "value")?.value} occurrences
            </div>
            <div className="leading-none text-muted-foreground">
              {stats.wordCloudData.length}+ unique words
            </div>
          </CardFooter>
        </Card>
        {/* CONTENT LENGTH BAR CHART */}
        <Card
          className={`flex flex-col  ${
            !isHomePage
              ? "border-x-0 border-t-0 rounded-none"
              : " mt-4 md:mt-0 min-w-[33%] flex-shrink-0"
          }`}
        >
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-sm">Content Length</CardTitle>
            <CardDescription>by tag</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0 p-0 mt-4">
            {isLoading ? (
              <div className="flex flex-col space-y-3 justify-center align-middle my-4">
                <Skeleton className="h-[125px] w-[200px] rounded-xl mx-auto" />
                <div className="space-y-2  mx-auto">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ) : (
              <ChartContainer
                config={stats.contentLengthByTagChartDataConfig}
                className="mx-auto aspect-square max-h-[250px]"
              >
                <BarChart
                  data={stats.contentLengthByTagChartData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 20 }}
                >
                  <XAxis dataKey="tag" />
                  <YAxis />
                  <Bar dataKey="words" fill="#8884d8" />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm mt-4">
            <div className="flex items-center gap-2 font-medium leading-none">
              Predominant tag: <TrendingUp size={16} />
              &quot;{findMax(stats.contentLengthByTagChartData, "words")?.tag}
              &quot;
            </div>
            <div className="leading-none text-muted-foreground">
              {Number(
                findMax(stats.contentLengthByTagChartData, "words")?.words
              ).toFixed(2)}{" "}
              characters on average
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default InsightsOverview;

function findMax<T>(arr: T[], key: keyof T) {
  if (!arr.length) return null;
  return arr.reduce((max, item) => (item[key] > max[key] ? item : max));
}
