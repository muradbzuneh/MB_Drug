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
      drugId?: string;
      comment?: string;
      rating?: number;
    };

    const drugId = body.drugId?.trim();
    const comment = body.comment?.trim();
    const numericRating =
      typeof body.rating === "number" && Number.isFinite(body.rating)
        ? Math.floor(body.rating)
        : null;

    if (!drugId || !comment) {
      return NextResponse.json(
        { error: "drugId and comment are required." },
        { status: 400 }
      );
    }

    if (numericRating !== null && (numericRating < 1 || numericRating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    const drug = await prisma.drug.findUnique({
      where: { id: drugId },
      select: { id: true },
    });

    if (!drug) {
      return NextResponse.json({ error: "Drug not found." }, { status: 404 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        drugId,
        comment,
        rating: numericRating,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}