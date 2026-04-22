import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as {
      imageUrl?: string;
      note?: string;
    };

    const imageUrl = body.imageUrl?.trim();
    const note = body.note?.trim();

    if (!imageUrl) {
      return NextResponse.json({ error: "Image is required." }, { status: 400 });
    }

    const prescription = await prisma.prescription.create({
      data: {
        imageUrl,
        note: note || null,
        userId: session.user.id,
      },
    });

    return NextResponse.json(prescription, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create prescription." },
      { status: 500 }
    );
  }
}