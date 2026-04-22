import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, and message are required." },
        { status: 400 }
      );
    }

    const contact = await prisma.contact.create({
      data: { name, email, message },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to send message." }, { status: 500 });
  }
}
