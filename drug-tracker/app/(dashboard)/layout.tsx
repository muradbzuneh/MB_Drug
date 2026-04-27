"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/app/components/Sidbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07111f] text-slate-100 md:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col">
        <div className="sticky top-0 z-30 border-b border-[#1b345f] bg-[#07111f]/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#1b345f] bg-[#0c1d3f] px-3 py-2 text-sm font-semibold text-slate-200"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
            Menu
          </button>
        </div>

        <main className="flex-1 p-3 md:p-5">
          <div className="min-h-[calc(100vh-1.5rem)] rounded-xl border border-[#1b345f] bg-[#0c1d3f] p-4 text-slate-100 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
