import Link from "next/link";

const meals = [
  { title: "Morning Dose", items: "Vitamin C", count: "1 item", time: "08:00" },
  { title: "Afternoon Dose", items: "Pain Relief", count: "1 item", time: "13:00" },
  { title: "Night Dose", items: "Antibiotic", count: "1 item", time: "20:00" },
];

export default function DashboardPage() {
  return (
    <section className="space-y-4 text-slate-100">
      <header className="flex items-start justify-between rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-5">
        <div>
          <h1 className="text-2xl font-bold text-white">Home</h1>
          <p className="mt-1 text-sm text-slate-400">Track your daily medication schedule</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Today&apos;s reminders</p>
          <p className="text-xl font-bold text-emerald-400">3</p>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-3 rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-4">
          <h2 className="text-sm font-semibold text-slate-200">Quick Actions</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">morning</span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">afternoon</span>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">night</span>
          </div>
          <Link
            href="/drugs/new"
            className="block rounded-lg bg-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            + Add Drug Entry
          </Link>
          <Link
            href="/dashboard/tracker"
            className="block rounded-lg bg-emerald-500/90 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            View Tracker
          </Link>
        </div>

        <div className="space-y-3">
          {meals.map((meal) => (
            <article key={meal.title} className="rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{meal.title}</h3>
                  <p className="text-xs text-slate-400">{meal.count}</p>
                </div>
                <p className="text-sm font-semibold text-slate-200">{meal.time}</p>
              </div>
              <div className="rounded-lg bg-slate-800/60 px-3 py-2 text-sm text-slate-200">{meal.items}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
