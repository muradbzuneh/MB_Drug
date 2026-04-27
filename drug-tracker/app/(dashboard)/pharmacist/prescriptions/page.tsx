import Image from "next/image";
import { Check, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function PrescriptionsPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "PHARMACIST" && session?.user?.role !== "ADMIN") {
    redirect("/home");
  }

  const prescriptions = await prisma.prescription.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    approved: "bg-emerald-500/15 text-emerald-400",
    rejected: "bg-red-500/15 text-red-400",
    pending: "bg-yellow-500/15 text-yellow-400",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6">
        <h1 className="text-2xl font-bold text-white">Prescriptions</h1>
        <p className="mt-1 text-sm text-slate-400">
          {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""} submitted
        </p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 text-sm text-slate-400">
          No prescriptions submitted yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {prescriptions.map((p) => (
            <div key={p.id} className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">
                    {p.user.name ?? p.user.email ?? "Unknown user"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {new Date(p.createdAt).toLocaleString()}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[p.status] ?? statusColor.pending}`}>
                  {p.status}
                </span>
              </div>

              {p.imageUrl && (
                <Image
                  src={p.imageUrl}
                  alt="Prescription"
                  width={240}
                  height={240}
                  className="rounded-xl object-cover"
                />
              )}

              {p.note && (
                <p className="text-sm text-slate-300 rounded-xl border border-[#1b345f] bg-[#070f24] px-4 py-3">
                  {p.note}
                </p>
              )}

              {p.status === "pending" && (
                <form
                  className="flex gap-2"
                  action={async (formData: FormData) => {
                    "use server";
                    const status = formData.get("status") as string;
                    await prisma.prescription.update({ where: { id: p.id }, data: { status } });
                    revalidatePath("/pharmacist/prescriptions");
                  }}
                >
                  <button
                    name="status"
                    value="approved"
                    className="rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Approve
                    </span>
                  </button>
                  <button
                    name="status"
                    value="rejected"
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                  >
                    <span className="inline-flex items-center gap-1">
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </span>
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
