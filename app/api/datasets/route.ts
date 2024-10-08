import { NextRequest, NextResponse } from "next/server";
import {
  deleteDatasetItem,
  getDatasetItems,
  clearDatasetItems,
  updateDatasetItem,
  insertDatasetItems,
} from "../datasetItems";
import { auth } from "@/auth";

/* 
Get all dataset items
*/
// eslint-disable-next-line
export async function GET(req: NextRequest) {
  const dataset = await getDatasetItems();
  return new Response(JSON.stringify(dataset), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/*
Deletes all dataset items
and inserts the new ones
*/
export const POST = auth(async function POST(req: NextRequest & { auth: any }) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  if (req.auth?.user?.role !== "ADMIN")
    return NextResponse.json(
      { message: "Not enough permissions" },
      { status: 401 }
    );

  const body = await req.json();
  // i will receive a list of objects with content and tag properties
  const data = body.datasetItems;
  //clear the
  await clearDatasetItems();
  await insertDatasetItems(data, "admin");

  return NextResponse.json(
    { message: "Data saved successfully" },
    { status: 200 }
  );
});

/* 
Delete a dataset item
*/
export const DELETE = auth(async function DELETE(
  req: NextRequest & { auth: any }
) {
  const id = Number(req.url.split("?")[1].split("=")[1]);

  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });

  if (req.auth?.user?.role !== "ADMIN")
    return NextResponse.json(
      { message: "Not enough permissions" },
      { status: 401 }
    );

  await deleteDatasetItem(Number(id));

  return NextResponse.json(
    { message: "Data deleted successfully" },
    { status: 200 }
  );
});

/* 
Update a dataset item
*/
export const PUT = auth(async function PUT(req: NextRequest & { auth: any }) {
  if (!req.auth)
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  if (req.auth?.user?.role !== "ADMIN")
    return NextResponse.json(
      { message: "Not enough permissions" },
      { status: 401 }
    );

  const data = await req.json();
  const user = req.auth?.user?.email;

  await updateDatasetItem({ ...data, user });
  return Response.json(
    { message: "Data updated successfully" },
    {
      status: 200,
    }
  );
});
