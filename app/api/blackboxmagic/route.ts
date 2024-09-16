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

export const PUT = auth(async function PUT(request: NextRequest) {
  const body = await request.json();
  const query = body.url;

  // validate if the URL is valid using lodash
  if (!query) {
    return NextResponse.json(
      {
        error: "Missing URL parameter",
      },
      { status: 400 }
    );
  }

  //check the url for malicious content
  const maliciousError = await validateUrlForMaliciousContent(query);
  if (maliciousError) {
    return NextResponse.json(
      {
        error: maliciousError,
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

const validateUrlForMaliciousContent = async (url: string) => {
  const urll = new URL(url);
  if (!urll.protocol.startsWith("http")) {
    return "Invalid URL";
  }

  if (urll.hostname === "localhost") {
    return "Invalid URL";
  }

  try {
    //cal google safe browsing api
    //if the url is malicious return error
    //else return success
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v5/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client: {
            clientId: "aifakenewsdetector",
            clientVersion: "1.5.2",
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION",
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: url }],
          },
        }),
      }
    );

    if ((response as any).matches) {
      return "Malicious URL, We stored your request for further investigation";
    }
  } catch (error) {
    console.error("Error validating URL for malicious content", error);
    return "Error validating URL for malicious content";
  }

  return null;
};
