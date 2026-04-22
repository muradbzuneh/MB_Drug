import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PrescriptionsPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "PHARMACIST" && session?.user?.role !== "ADMIN") {
    redirect("/home");
  }

  const prescriptions = await prisma.prescription.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">Prescriptions</h1>
        <p className="mt-1 text-sm text-emerald-700">Review and manage patient prescriptions.</p>
      </div>

      {prescriptions.length === 0 ? (
        <p className="rounded-xl border border-emerald-100 bg-white/80 p-6 text-sm text-emerald-700">
          No prescriptions submitted yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((p) => (
            <div key={p.id} className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-emerald-900">
                    {p.user.name ?? p.user.email ?? "Unknown user"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    p.status === "approved"
                      ? "bg-emerald-100 text-emerald-700"
                      : p.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {p.imageUrl && (
                <Image
                  src={p.imageUrl}
                  alt="Prescription"
                  width={200}
                  height={200}
                  className="mt-3 rounded-lg object-cover"
                />
              )}

              {p.note && (
                <p className="mt-2 text-sm text-slate-700">{p.note}</p>
              )}

              <PrescriptionActions id={p.id} currentStatus={p.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PrescriptionActions({ id, currentStatus }: { id: string; currentStatus: string }) {
  if (currentStatus !== "pending") return null;

  return (
    <form
      className="mt-3 flex gap-2"
      action={async (formData: FormData) => {
        "use server";
        const status = formData.get("status") as string;
        const { prisma: db } = await import("@/lib/prisma");
        await db.prescription.update({ where: { id }, data: { status } });
      }}
    >
      <button
        name="status"
        value="approved"
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
      >
        Approve
      </button>
      <button
        name="status"
        value="rejected"
        className="rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
      >
        Reject
      </button>
    </form>
  );
}
