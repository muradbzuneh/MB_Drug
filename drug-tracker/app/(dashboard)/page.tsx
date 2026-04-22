import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const usages = session?.user?.id
    ? await prisma.drugUsage.findMany({
        where: { userId: session.user.id },
        include: { drug: { select: { name: true } } },
        orderBy: { time: "asc" },
        take: 5,
      })
    : [];

  return (
    <section className="space-y-4 text-slate-100">
      <header className="flex items-start justify-between rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-5">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {session?.user?.name ? `Hi, ${session.user.name}` : "Home"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">Track your daily medication schedule</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Active reminders</p>
          <p className="text-xl font-bold text-emerald-400">{usages.length}</p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-3 rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-4">
          <h2 className="text-sm font-semibold text-slate-200">Quick Actions</h2>
          <Link
            href="/drugs"
            className="block rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Browse Drugs
          </Link>
          <Link
            href="/tracker"
            className="block rounded-lg bg-emerald-500/90 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            View Tracker
          </Link>
          <Link
            href="/prescription"
            className="block rounded-lg border border-emerald-500/40 px-4 py-2.5 text-center text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
          >
            Upload Prescription
          </Link>
        </div>

        <div className="space-y-3">
          {usages.length === 0 ? (
            <div className="rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-4 text-sm text-slate-400">
              No reminders yet.{" "}
              <Link href="/drugs" className="text-emerald-400 underline">
                Browse drugs
              </Link>{" "}
              to add your first reminder.
            </div>
          ) : (
            usages.map((u) => (
              <article key={u.id} className="rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">{u.drug.name}</h3>
                  <p className="text-sm font-semibold text-emerald-400">{u.time}</p>
                </div>
                <p className="mt-1 text-xs text-slate-400">Dosage: {u.dosage}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
