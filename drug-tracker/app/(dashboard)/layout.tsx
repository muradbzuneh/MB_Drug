import Sidbar from "@/app/components/Sidbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#070f24] md:flex">
      <Sidbar />
      <main className="flex-1 p-3 md:p-5">
        <div className="min-h-[calc(100vh-1.5rem)] rounded-xl border border-[#193158] bg-[#0a1836] p-5 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
