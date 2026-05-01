import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ReminderAlert from "./ReminderAlert";
import DeleteReminder from "./DeleteReminder";

export default async function TrackerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) redirect("/login");

  const usages = await prisma.drugUsage.findMany({
    where: { userId: session.user.id },
    include: { drug: { select: { name: true, category: true } } },
    orderBy: { time: "asc" },
  });

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-emerald-950 p-6">
        <h1 className="text-2xl font-bold text-white">My Drug Schedule</h1>
        <p className="mt-1 text-sm text-slate-400">
          {usages.length} active reminder{usages.length !== 1 ? "s" : ""}
        </p>
      </div>

      {usages.length === 0 ? (
        <div className="rounded-2xl border border-[#1b345f] bg-emerald-800 p-6 text-sm text-slate-400">
          No reminders yet. Open a drug detail page and add your first reminder.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {usages.map((u) => (
            <article key={u.id} className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="font-semibold text-white">{u.drug.name}</h2>
                  <p className="text-xs text-slate-500">{u.drug.category}</p>
                </div>
                <span className="shrink-0 rounded-lg bg-emerald-500/15 px-2.5 py-1 text-sm font-semibold text-emerald-400">
                  {u.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">Dosage: {u.dosage}</p>
              <DeleteReminder id={u.id} />
            </article>
          ))}
        </div>
      )}

      <ReminderAlert usages={usages} />
    </section>
  );
}
