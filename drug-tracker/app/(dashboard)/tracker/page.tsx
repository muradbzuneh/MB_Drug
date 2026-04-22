import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ReminderAlert from "./ReminderAlert";

export default async function TrackerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const usages = await prisma.drugUsage.findMany({
    where: { userId: session.user.id },
    include: { drug: true },
    orderBy: { time: "asc" },
  });

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6">
        <h1 className="text-2xl font-bold text-white">My Drug Schedule</h1>
        <p className="mt-1 text-sm text-slate-400">Your active reminders and dosage plan.</p>
      </div>

      {usages.length === 0 ? (
        <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 text-sm text-slate-400">
          No reminders yet. Open a drug detail page and add your first reminder.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {usages.map((u) => (
            <article key={u.id} className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-5">
              <h2 className="font-semibold text-white">{u.drug.name}</h2>
              <p className="mt-1 text-sm text-slate-400">Dosage: {u.dosage}</p>
              <p className="mt-0.5 text-sm font-medium text-emerald-400">⏰ {u.time}</p>
            </article>
          ))}
        </div>
      )}

      <ReminderAlert usages={usages} />
    </section>
  );
}
