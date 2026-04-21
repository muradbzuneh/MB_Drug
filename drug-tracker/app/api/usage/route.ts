import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { drugId, dosage, time } = await req.json();

  const usage = await prisma.drugUsage.create({
    data: {
      drugId,
      dosage,
      time,
      userId: session.user.id,
    },
  });

  return NextResponse.json(usage);
}