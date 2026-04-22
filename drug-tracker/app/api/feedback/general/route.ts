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

    const body = (await req.json()) as { comment?: string };
    const comment = body.comment?.trim();

    if (!comment) {
      return NextResponse.json({ error: "comment is required." }, { status: 400 });
    }

    // General feedback stored without a drugId — reuse Feedback model with null drugId
    // Since schema requires drugId, we store it in Contact model as a general message
    const contact = await prisma.contact.create({
      data: {
        name: session.user.name ?? "User",
        email: session.user.email ?? "",
        message: comment,
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback." }, { status: 500 });
  }
}
