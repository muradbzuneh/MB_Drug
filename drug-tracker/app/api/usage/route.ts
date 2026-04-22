import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { drugId?: string; dosage?: string; time?: string };
    const { drugId, dosage, time } = body;

    if (!drugId || !dosage || !time) {
      return NextResponse.json({ error: "drugId, dosage, and time are required." }, { status: 400 });
    }

    // Validate time format HH:MM
    if (!/^\d{2}:\d{2}$/.test(time)) {
      return NextResponse.json({ error: "Time must be in HH:MM format." }, { status: 400 });
    }

    const drug = await prisma.drug.findUnique({ where: { id: drugId }, select: { id: true } });
    if (!drug) {
      return NextResponse.json({ error: "Drug not found." }, { status: 404 });
    }

    const usage = await prisma.drugUsage.create({
      data: {
        drugId,
        dosage,
        time,
        userId: session.user.id,
      },
    });

    return NextResponse.json(usage, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save reminder." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required." }, { status: 400 });
    }

    const usage = await prisma.drugUsage.findUnique({ where: { id } });
    if (!usage || usage.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    await prisma.drugUsage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete reminder." }, { status: 500 });
  }
}
