import { prisma } from "@/lib/prisma";
import { Gender } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "PHARMACIST") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json() as {
      name?: string; description?: string; usage?: string;
      bodyPart?: string; category?: string; ageGroup?: string;
      gender?: string; estimatedPrice?: number; imageUrl?: string;
    };

    const required = ["name", "description", "usage", "bodyPart", "category", "ageGroup"] as const;
    for (const key of required) {
      if (!body[key]?.trim()) {
        return NextResponse.json({ error: `${key} is required.` }, { status: 400 });
      }
    }

    const drug = await prisma.drug.create({
      data: {
        name: body.name!.trim(),
        description: body.description!.trim(),
        usage: body.usage!.trim(),
        bodyPart: body.bodyPart!.trim(),
        category: body.category!.trim(),
        ageGroup: body.ageGroup!.trim(),
        gender: body.gender as Gender | undefined,
        estimatedPrice: body.estimatedPrice ?? null,
        imageUrl: body.imageUrl ?? null,
        createdById: session.user.id,
      },
    });

    return NextResponse.json(drug, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create drug." }, { status: 500 });
  }
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