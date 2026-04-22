import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export default async function PrescriptionsPage() {
  const session = await getServerSession();

  if (session?.user?.role !== "PHARMACIST") {
    return <p>Unauthorized</p>;
  }

  const prescriptions = await prisma.prescription.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-10">
      <h1 className="text-xl font-bold">Prescriptions</h1>

      {prescriptions.map((p) => (
        <div key={p.id} className="border p-4 mt-3">
          <p>User: {p.user.name ?? p.user.email ?? "Unknown user"}</p>

          {p.imageUrl && (
            <Image
              src={p.imageUrl}
              alt="Prescription image"
              width={160}
              height={160}
              className="mt-2 w-40 rounded object-cover"
            />
          )}

          <p>{p.note ?? "No note provided."}</p>
          <p>Status: {p.status}</p>
        </div>
      ))}
    </div>
  );
}