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

    const body = (await req.json()) as { imageUrl?: string; note?: string };
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
    return NextResponse.json({ error: "Failed to create prescription." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Pharmacists and admins see all prescriptions; users see only their own
    const isPrivileged =
      session.user.role === "PHARMACIST" || session.user.role === "ADMIN";

    const prescriptions = await prisma.prescription.findMany({
      where: isPrivileged ? undefined : { userId: session.user.id },
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(prescriptions);
  } catch {
    return NextResponse.json({ error: "Failed to fetch prescriptions." }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "PHARMACIST" && session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = (await req.json()) as { id?: string; status?: string };
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "id and status are required." }, { status: 400 });
    }

    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const prescription = await prisma.prescription.update({
      where: { id: body.id },
      data: { status: body.status },
    });

    return NextResponse.json(prescription);
  } catch {
    return NextResponse.json({ error: "Failed to update prescription." }, { status: 500 });
  }
}
