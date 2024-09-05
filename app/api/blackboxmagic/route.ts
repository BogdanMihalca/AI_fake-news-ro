import { NextRequest, NextResponse } from "next/server";
import PipelineSingleton from "./pipeline";
import labelMapping from "./label_mapping.json";
import { softmax, Tensor } from "@xenova/transformers";
import { map } from "lodash";
import { auth } from "@/auth";
import { getContent, preprocessText } from "./util";

export const POST = auth(async function POST(
  request: NextRequest & { auth: any }
) {
  if (!request.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const text = body.text;

  const preprocessed = preprocessText(text);

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
  const result: Tensor = await classifier(preprocessed);

  const v_softmaxed = softmax(result.data as number[]);

  // Map the predicted labels to the original string labels
  const mappedResult = map(v_softmaxed, (item, index) => {
    return {
      label: labelMapping[index],
      score: item,
    };
  });

  return NextResponse.json({
    results: mappedResult,
    text: preprocessed,
  });
});

export const GET = auth(async function GET(request: NextRequest) {
  const queryData = request.url.split("?")[1];
  const query = queryData.split("=")[1];

  // validate if the URL is valid using lodash
  if (!query) {
    return NextResponse.json(
      {
        error: "Missing URL parameter",
      },
      { status: 400 }
    );
  }

  const response = await fetch(query);

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Error fetching the URL",
      },
      { status: 400 }
    );
  }

  const html = await response.text();

  const articleContent = getContent(html);

  if (articleContent.length < 50) {
    return NextResponse.json(
      {
        error: "Article content too short",
      },
      { status: 400 }
    );
  }

  const preprocessed = preprocessText(articleContent);

  // Get the classification pipeline. When called for the first time,
  // this will load the pipeline and cache it for future use.
  const classifier = await PipelineSingleton.getInstance();

  // Actually perform the classification
  const result: Tensor = await classifier(preprocessed);

  const v_softmaxed = softmax(result.data as number[]);
  // Map the predicted labels to the original string labels
  const mappedResult = map(v_softmaxed, (item, index) => {
    return {
      label: labelMapping[index],
      score: item,
    };
  });

  return NextResponse.json({
    results: mappedResult,
    text: preprocessed,
  });
});
