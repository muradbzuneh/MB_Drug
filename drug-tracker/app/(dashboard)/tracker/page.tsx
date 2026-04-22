import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import ReminderAlert from "./ReminderAlert";

export default async function TrackerPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const usages = await prisma.drugUsage.findMany({
    where: { userId: session.user.id },
    include: { drug: true },
    orderBy: { time: "asc" },
  });

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-8 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">My Drug Schedule</h1>
        <p className="mt-1 text-sm text-emerald-700">Your active reminders and dosage plan.</p>
      </div>

      {usages.length === 0 ? (
        <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 text-sm text-emerald-700 shadow-md">
          No reminders yet. Open a drug detail page and add your first reminder.
        </div>
      ) : (
        <div className="grid gap-4">
          {usages.map((u) => (
            <article key={u.id} className="rounded-2xl border border-emerald-100 bg-white/90 p-5 shadow-md">
              <h2 className="text-lg font-semibold text-emerald-900">{u.drug.name}</h2>
              <p className="mt-1 text-sm text-emerald-800">Dosage: {u.dosage}</p>
              <p className="text-sm text-emerald-700">Time: {u.time}</p>
            </article>
          ))}
        </div>
      )}

      <ReminderAlert usages={usages} />
    </section>
  );
}
