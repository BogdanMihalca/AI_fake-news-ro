import { map } from "lodash";
import { FC } from "react";
import { Skeleton } from "../ui/skeleton";

interface BlackboxResultsProps {
  result: { label: string; score: number }[];
  ready: boolean;
}

const BlackboxResults: FC<BlackboxResultsProps> = ({ result, ready }) => {
  return (
    <div className="col-span-2">
      {!ready ? (
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          {map(result, (value, key) => (
            <div key={key} className="flex flex-col space-y-3">
              <div className="flex flex-col space-y-2">
                <div className="text-lg font-bold">{value.label}</div>
                <div className="text-sm">{value.score}</div>
              </div>
            </div>
          ))}
          {/* 
              <Card className="max-w-xs">
                <CardContent className="flex gap-4 p-4">
                  <div className="grid items-center gap-2">
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                      <div className="text-sm text-muted-foreground">Move</div>
                      <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                        562/600
                        <span className="text-sm font-normal text-muted-foreground">
                          kcal
                        </span>
                      </div>
                    </div>
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                      <div className="text-sm text-muted-foreground">
                        Exercise
                      </div>
                      <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                        73/120
                        <span className="text-sm font-normal text-muted-foreground">
                          min
                        </span>
                      </div>
                    </div>
                    <div className="grid flex-1 auto-rows-min gap-0.5">
                      <div className="text-sm text-muted-foreground">Stand</div>
                      <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
                        8/12
                        <span className="text-sm font-normal text-muted-foreground">
                          hr
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChartContainer
                    config={{
                      move: {
                        label: "Move",
                        color: "hsl(var(--chart-1))",
                      },
                      exercise: {
                        label: "Exercise",
                        color: "hsl(var(--chart-2))",
                      },
                      stand: {
                        label: "Stand",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="mx-auto aspect-square w-full max-w-[80%]"
                  >
                    <RadialBarChart
                      margin={{
                        left: -10,
                        right: -10,
                        top: -10,
                        bottom: -10,
                      }}
                      data={[
                        {
                          activity: "stand",
                          value: (8 / 12) * 100,
                          fill: "var(--color-stand)",
                        },
                        {
                          activity: "exercise",
                          value: (46 / 60) * 100,
                          fill: "var(--color-exercise)",
                        },
                        {
                          activity: "move",
                          value: (245 / 360) * 100,
                          fill: "var(--color-move)",
                        },
                      ]}
                      innerRadius="20%"
                      barSize={24}
                      startAngle={90}
                      endAngle={450}
                    >
                      <PolarAngleAxis
                        type="number"
                        domain={[0, 100]}
                        dataKey="value"
                        tick={false}
                      />
                      <RadialBar dataKey="value" background cornerRadius={5} />
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
              </Card> */}
        </div>
      )}
    </div>
  );
};

export { BlackboxResults };
