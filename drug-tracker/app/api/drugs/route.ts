import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (session?.user.role !== "PHARMACIST") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  const drug = await prisma.drug.create({
    data: {
      name: body.name,
      description: body.description,
      usage: body.usage,
      bodyPart: body.bodyPart,
      category: body.category,
      ageGroup: body.ageGroup,
      gender: body.gender,
      estimatedPrice: body.estimatedPrice,
      imageUrl: body.imageUrl,
      createdById: session.user.id,
    },
  });

  return NextResponse.json(drug);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search");
  const bodyPart = searchParams.get("bodyPart");
  const category = searchParams.get("category");
  const gender = searchParams.get("gender");
  const genderFilter =
    gender === Gender.MALE || gender === Gender.FEMALE ? gender : undefined;

  const drugs = await prisma.drug.findMany({
    where: {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        bodyPart ? { bodyPart } : {},
        category ? { category } : {},
        genderFilter ? { gender: genderFilter } : {},
      ],
    },
  });

  return NextResponse.json(drugs);
}