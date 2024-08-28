import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { saltAndHashPassword } from "../utils";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();
    // YOU MAY WANT TO ADD SOME VALIDATION HERE

    //make sure there is no user with the same email
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    //hash the password
    const hashedPassword = await saltAndHashPassword(password);

    //create the user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return NextResponse.json({ message: "success" });
  } catch (e) {
    console.log({ e });
  }

  return NextResponse.json({ message: "success" });
}
