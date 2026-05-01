"use client";

import {
  Home,
  Pill,
  Upload,
  BarChart3,
  MessageCircle,
  Phone,
  Brain,
  User,
  FlaskConical,
  Plus,
  Settings,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

/* ================= NAV CONFIG ================= */

type NavEntry = {
  href: string;
  label: string;
  icon: React.ElementType;
};

const mainNav: NavEntry[] = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/drugs", label: "Drugs", icon: Pill },
  { href: "/prescription", label: "Prescription", icon: Upload },
  { href: "/tracker", label: "Tracker", icon: BarChart3 },
  { href: "/feedback", label: "Feedback", icon: MessageCircle },
  { href: "/contact", label: "Contact", icon: Phone },
];

const extraNav: NavEntry[] = [
  { href: "/health-tips", label: "Health Tips", icon: Brain },
];

const userNav: NavEntry[] = [
  { href: "/profile", label: "Profile", icon: User },
];

const pharmacistNav: NavEntry[] = [
  { href: "/pharmacist/prescriptions", label: "Prescriptions", icon: FlaskConical },
  { href: "/drugs/new", label: "Add Drug", icon: Plus },
];

const adminNav: NavEntry[] = [
  { href: "/admin", label: "Admin Panel", icon: Settings },
];

/* ================= NAV GROUP ================= */

function NavGroup({
  items,
  label,
  pathname,
  onNavigate,
}: {
  items: NavEntry[];
  label: string;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <>
      <p className="mt-5 mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>

      <div className="grid gap-0.5">
        {items.map(({ href, label: name, icon }) => {
          const Icon = icon;
          const isActive =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition ${
                isActive
                  ? "border-emerald-700/30 bg-emerald-500/15 text-emerald-300"
                  : "border-transparent text-emerald-900 hover:border-slate-900 hover:bg-slate-800/50 hover:text-white"
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isActive ? "text-emerald-400" : "text-slate-400"
                }`}
              />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

/* ================= SIDEBAR ================= */

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ open = false, onClose = () => {} }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;

  const sidebarContent = (
    <aside className="flex h-full w-72 max-w-[85vw] flex-col bg-white px-5 py-7 text-slate-200 shadow-2xl md:w-64 md:max-w-none md:shadow-none">
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-emerald-500">
          <Image
            src="/Logo.jpg"
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
            
          />
        </div>

        <div>
          <p className="text-lg font-bold text-emerald-400">DrugTrack</p>
          <p className="text-[11px] text-gray-800">Health dashboard</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="mt-6 flex-1 overflow-y-auto">
        <NavGroup items={mainNav} label="Main" pathname={pathname} onNavigate={onClose} />
        <NavGroup items={extraNav} label="Extra" pathname={pathname} onNavigate={onClose} />
        <NavGroup items={userNav} label="Account" pathname={pathname} onNavigate={onClose} />

        {role === "PHARMACIST" && (
          <NavGroup items={pharmacistNav} label="Pharmacist" pathname={pathname} onNavigate={onClose} />
        )}

        {role === "ADMIN" && (
          <NavGroup items={adminNav} label="Admin" pathname={pathname} onNavigate={onClose} />
        )}
      </nav>

      {/* Bottom */}
      <div className="mt-4 space-y-2 border-t border-[#1a2b49] pt-4">
        {session?.user?.name && (
          <p className="truncate px-3 text-xs text-slate-400">
            {session.user.name}
          </p>
        )}

       
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex md:w-64 md:border-r md:border-[#1a2b49]">
        {sidebarContent}
      </div>

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        } md:hidden`}
        onClick={onClose}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}