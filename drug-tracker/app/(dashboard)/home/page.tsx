import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { BellRing, BookOpenText, Brain, Pill } from "lucide-react";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  const [reminderCount, drugCount] = await Promise.all([
    session?.user?.id
      ? prisma.drugUsage.count({ where: { userId: session.user.id } })
      : Promise.resolve(0),
    prisma.drug.count(),
  ]);

  const cards = [
    {
      href: "/drugs",
      icon: <Pill className="h-7 w-7 text-emerald-400" />,
      label: "Drugs",
      value: drugCount,
      sub: "Browse available medicines",
    },
    {
      href: "/tracker",
      icon: <BellRing className="h-7 w-7 text-emerald-400" />,
      label: "Reminders",
      value: reminderCount,
      sub: "Your active dosage schedule",
    },
    {
      href: "/prescription",
      icon: <BookOpenText className="h-7 w-7 text-emerald-400" />,
      label: "Prescription",
      value: null,
      sub: "Send prescription to pharmacist",
    },
    {
      href: "/health-tips",
      icon: <Brain className="h-7 w-7 text-emerald-400" />,
      label: "Health Tips",
      value: null,
      sub: "Evidence-based medication guidance",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-emerald-900 p-6">
        <h1 className="text-2xl font-bold text-white">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-slate-400">Here&apos;s your health overview.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-[#1b345f] bg-emerald-900 p-6 transition hover:border-emerald-100 hover:bg-emerald-700"
          >
            <div className="flex items-center justify-between">
              <span>{c.icon}</span>
              {c.value !== null && (
                <span className="text-3xl font-bold text-emerald-400">{c.value}</span>
              )}
            </div>
            <h2 className="mt-3 font-semibold text-white">{c.label}</h2>
            <p className="mt-0.5 text-sm text-slate-400">{c.sub}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
