import { NextRequest, NextResponse } from "next/server";
import { createDatasetItem } from "../../datasetItems";

import { auth } from "@/auth";

/*
Add a new dataset item
*/
export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  const body = await req.json();
  // i will receive an object with content and tag properties

  const user = req.auth?.user?.email;
  const data = createDatasetItem({ ...body, createdBy: user });

  if (!data) {
    return NextResponse.json({ message: "Error saving data" }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Data saved successfully" },
    { status: 200 }
  );
});
