import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as { name?: string };
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "name is required." }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { name },
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Failed to update profile." }, { status: 500 });
  }
}
