import { NextRequest, NextResponse } from "next/server";
export async function POST(request: NextRequest) {
  const { url } = await request.json();

  const result = await validateUrlForMaliciousContent(url);

  if (result) {
    return NextResponse.json({ message: result }, { status: 400 });
  }

  return NextResponse.json({ message: null }, { status: 200 });
}

const validateUrlForMaliciousContent = async (url: string) => {
  const urll = new URL(url);

  if (!urll.protocol.startsWith("http")) {
    return "Invalid URL";
  }

  if (urll.hostname === "localhost") {
    return "Invalid URL";
  }

  try {
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
