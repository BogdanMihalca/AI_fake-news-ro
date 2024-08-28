import { NextRequest, NextResponse } from "next/server";
import PipelineSingleton from "./pipeline";
import labelMapping from "./label_mapping.json";

export async function GET(request: NextRequest) {
  const text = request.nextUrl.searchParams.get("text");
  if (!text) {
    return NextResponse.json(
      {
        error: "Missing text parameter",
      },
      { status: 400 }
    );
  }
  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.
  const classifier = await PipelineSingleton.getInstance();

  // Actually perform the classification
  const result = await classifier(text);

  // Map the predicted labels to the original string labels
  const mappedResult = result.map((item: { label: string; score: any }) => {
    //LABEL_4
    const label_id = item.label.split("_")[1];

    return {
      label: labelMapping[label_id as any],
      score: item.score,
    };
  });

  return NextResponse.json(mappedResult);
}
