import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const [reminderCount, drugCount] = await Promise.all([
    session?.user?.id
      ? prisma.drugUsage.count({ where: { userId: session.user.id } })
      : Promise.resolve(0),
    prisma.drug.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-400">Here&apos;s your health overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href="/drugs"
          className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 shadow-md transition hover:border-emerald-500/40 hover:bg-[#0f2347]"
        >
          <p className="text-3xl font-bold text-emerald-400">{drugCount}</p>
          <h2 className="mt-1 font-semibold text-white">💊 Drugs</h2>
          <p className="text-sm text-slate-400">Browse available medicines</p>
        </Link>

        <Link
          href="/tracker"
          className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 shadow-md transition hover:border-emerald-500/40 hover:bg-[#0f2347]"
        >
          <p className="text-3xl font-bold text-emerald-400">{reminderCount}</p>
          <h2 className="mt-1 font-semibold text-white">⏰ Reminders</h2>
          <p className="text-sm text-slate-400">Your active dosage schedule</p>
        </Link>

        <Link
          href="/prescription"
          className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] p-6 shadow-md transition hover:border-emerald-500/40 hover:bg-[#0f2347]"
        >
          <p className="text-3xl font-bold text-emerald-400">📤</p>
          <h2 className="mt-1 font-semibold text-white">Prescription</h2>
          <p className="text-sm text-slate-400">Send prescription to pharmacist</p>
        </Link>
      </div>
    </div>
  );
}
