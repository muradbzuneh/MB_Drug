import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function HomePage() {
  const session = await getServerSession();

  const [reminderCount, drugCount] = await Promise.all([
    session?.user?.id
      ? prisma.drugUsage.count({ where: { userId: session.user.id } })
      : 0,
    prisma.drug.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""} 👋
        </h1>
        <p className="mt-1 text-sm text-emerald-700">Here&apos;s your health overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/drugs" className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md hover:shadow-lg transition">
          <p className="text-2xl font-bold text-emerald-700">{drugCount}</p>
          <h2 className="mt-1 font-semibold text-emerald-900">💊 Drugs</h2>
          <p className="text-sm text-gray-500">Browse available medicines</p>
        </Link>

        <Link href="/tracker" className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md hover:shadow-lg transition">
          <p className="text-2xl font-bold text-emerald-700">{reminderCount}</p>
          <h2 className="mt-1 font-semibold text-emerald-900">⏰ Reminders</h2>
          <p className="text-sm text-gray-500">Your active dosage schedule</p>
        </Link>

        <Link href="/prescription" className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md hover:shadow-lg transition">
          <h2 className="font-semibold text-emerald-900">📤 Prescription</h2>
          <p className="text-sm text-gray-500">Send prescription to pharmacist</p>
        </Link>
      </div>
    </div>
  );
}
