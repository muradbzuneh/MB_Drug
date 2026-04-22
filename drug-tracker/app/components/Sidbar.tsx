"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const mainNav = [
  { href: "/home", label: "Home", icon: "🏠" },
  { href: "/drugs", label: "Drugs", icon: "💊" },
  { href: "/prescription", label: "Prescription", icon: "📤" },
  { href: "/tracker", label: "Tracker", icon: "📊" },
  { href: "/feedback", label: "Feedback", icon: "💬" },
  { href: "/contact", label: "Contact", icon: "📞" },
];

const extraNav = [
  { href: "/health-tips", label: "Health Tips", icon: "🧠" },
];

const userNav = [
  { href: "/profile", label: "Profile", icon: "👤" },
];

const pharmacistNav = [
  { href: "/pharmacist/prescriptions", label: "Prescriptions", icon: "🔬" },
  { href: "/drugs/new", label: "Add Drug", icon: "➕" },
];

const adminNav = [
  { href: "/admin", label: "Admin Panel", icon: "⚙️" },
];

function NavItem({ href, label, icon }: { href: string; label: string; icon: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-sm transition ${
        isActive
          ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
          : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800/50 hover:text-white"
      }`}
    >
      <span className="w-5 text-center text-base leading-none">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="mt-5 mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
      {label}
    </p>
  );
}

export default function Sidbar() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <aside className="w-full border-b border-[#1a2b49] bg-[#0b1630] px-4 py-5 text-slate-200 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:px-5 md:py-7 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-sm font-bold text-white">
          ✚
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">DrugTrack</h1>
          <p className="text-xs text-slate-400">Health dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        <SectionLabel label="Main" />
        <div className="grid gap-0.5">
          {mainNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <SectionLabel label="Extra" />
        <div className="grid gap-0.5">
          {extraNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        <SectionLabel label="Account" />
        <div className="grid gap-0.5">
          {userNav.map((item) => (
            <NavItem key={item.href} {...item} />
          ))}
        </div>

        {role === "PHARMACIST" && (
          <>
            <SectionLabel label="Pharmacist" />
            <div className="grid gap-0.5">
              {pharmacistNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <SectionLabel label="Admin" />
            <div className="grid gap-0.5">
              {adminNav.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </div>
          </>
        )}
      </nav>

      {/* Bottom */}
      <div className="mt-4 border-t border-[#1a2b49] pt-4 space-y-1">
        {session?.user?.name && (
          <p className="truncate px-3 text-xs text-slate-400">{session.user.name}</p>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-sm text-slate-300 transition hover:border-slate-700 hover:bg-slate-800/50 hover:text-white"
        >
          <span className="w-5 text-center text-base leading-none">↩</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
