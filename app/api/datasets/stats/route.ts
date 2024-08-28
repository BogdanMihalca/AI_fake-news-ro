import { ChartConfig } from "@/components/ui/chart";
import { getDatasetItems } from "../../datasetItems";
import romanianStopWords from "./romanian_stopwords.json";

export const GET = async () => {
  const dataset = await getDatasetItems();

  const words = new Map<string, number>();
  const tags = new Map<string, number>();

  dataset.forEach((item) => {
    item.content.split(" ").forEach((word) => {
      words.set(word, (words.get(word) || 0) + 1);
    });
    tags.set(item.tag, (tags.get(item.tag) || 0) + 1);
  });

  const wordCloudData = Array.from(words.entries()).map(([word, count]) => ({
    name: word,
    value: count,
  }));
  const wordCloudDataProcessed =
    processWordCloudDataToRemoveConnection(wordCloudData);

  const wordCloudDataChartConfig: ChartConfig = {};
  wordCloudDataProcessed.forEach((element, i) => {
    wordCloudDataChartConfig[element.name] = {
      label: element.name,
    };
  });

  const tagDistributionChartData = Array.from(tags.entries()).map(
    ([tag, count], i) => {
      let colorIndex = i + 1;
      if (colorIndex > 5) {
        colorIndex = colorIndex % 5;
      }
      return {
        tag,
        count,
        fill: `hsl(var(--chart-${colorIndex}))`,
      };
    }
  );

  const tagDistributionChartConfig: ChartConfig = {};
  tagDistributionChartData.forEach((element, i) => {
    tagDistributionChartConfig[element.tag] = {
      label: element.tag,
    };
  });

  // Step 1: Update data reduction to track total content length and count of articles for each tag
  const contentStatsByTag = dataset.reduce((acc, item) => {
    if (!acc[item.tag]) {
      acc[item.tag] = { totalLength: 0, count: 0 };
    }
    acc[item.tag].totalLength += item.content.length;
    acc[item.tag].count += 1;
    return acc;
  }, {} as Record<string, { totalLength: number; count: number }>);

  // Step 2: Compute the average content length for each tag
  const contentLengthByTagChartData = Object.entries(contentStatsByTag).map(
    ([tag, { totalLength, count }]) => ({
      tag,
      words: totalLength / count,
      fill: `hsl(var(--chart-${
        tagDistributionChartData.findIndex((item) => item.tag === tag) + 1
      }))`,
    })
  );

  const contentLengthByTagChartDataConfig: ChartConfig = {};
  contentLengthByTagChartData.forEach((element, i) => {
    contentLengthByTagChartDataConfig[element.tag] = {
      label: element.tag,
    };
  });

  return Response.json({
    wordCloudData: wordCloudDataProcessed,
    wordCloudDataChartConfig,
    tagDistributionChartData,
    tagDistributionChartConfig,
    totalItems: dataset.length,
    contentLengthByTagChartData,
    contentLengthByTagChartDataConfig,
  });
};

const processWordCloudDataToRemoveConnection = (
  wordCloudData: { name: string; value: number }[]
) => {
  const filteredWordCloudData = wordCloudData.filter((item) => {
    return (
      !romanianStopWords.includes(item.name.toLowerCase()) &&
      item.name.length > 3
    );
  });

  filteredWordCloudData.sort((a, b) => b.value - a.value);
  return filteredWordCloudData.slice(0, 100).map((item) => ({
    name: item.name,
    value: item.value,
    // use the max value to generate fills for the chart starting from red
    fill: `hsl(0, 100%, ${Math.floor(
      100 - (item.value / filteredWordCloudData[0].value) * 100
    )}%)`,
  }));
};
