"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { href: "/home", label: "Home", icon: "⌂" },
  { href: "/drugs", label: "Drugs", icon: "💊" },
  { href: "/tracker", label: "Tracker", icon: "⏰" },
  { href: "/prescription", label: "Prescription", icon: "📤" },
];

const pharmacistItems = [
  { href: "/pharmascist", label: "Prescriptions", icon: "🔬" },
  { href: "/drugs/new", label: "Add Drug", icon: "+" },
];

const adminItems = [
  { href: "/admin", label: "Admin Panel", icon: "⚙" },
];

export default function Sidbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const extraItems =
    role === "ADMIN"
      ? adminItems
      : role === "PHARMACIST"
      ? pharmacistItems
      : [];

  const allItems = [...navItems, ...extraItems];

  return (
    <aside className="w-full border-b border-[#1a2b49] bg-[#0b1630] px-4 py-5 text-slate-200 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-7">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
          ✚
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">DrugTrack</h1>
          <p className="text-xs text-slate-400">Health dashboard</p>
        </div>
      </div>

      <nav className="mt-8 grid gap-1.5">
        {allItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                isActive
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                  : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <span className="w-5 text-center text-xs">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 border-t border-[#1a2b49] pt-4">
        {session?.user?.name && (
          <p className="mb-3 truncate px-3 text-xs text-slate-400">{session.user.name}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/50 hover:text-white"
        >
          <span className="w-5 text-center text-xs">↩</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
