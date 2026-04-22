import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") {
    redirect("/home");
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">Admin Panel</h1>
        <p className="mt-1 text-sm text-emerald-700">Manage users and roles.</p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-4 shadow-md overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-emerald-100 text-left text-emerald-900">
              <th className="pb-3 pr-4 font-semibold">Name</th>
              <th className="pb-3 pr-4 font-semibold">Email</th>
              <th className="pb-3 pr-4 font-semibold">Role</th>
              <th className="pb-3 font-semibold">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-emerald-50">
                <td className="py-3 pr-4 text-slate-800">{u.name ?? "—"}</td>
                <td className="py-3 pr-4 text-slate-600">{u.email}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      u.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : u.role === "PHARMACIST"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3">
                  <form
                    action={async (formData: FormData) => {
                      "use server";
                      const role = formData.get("role") as string;
                      const { prisma: db } = await import("@/lib/prisma");
                      await db.user.update({ where: { id: u.id }, data: { role: role as "USER" | "PHARMACIST" | "ADMIN" } });
                    }}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="rounded-lg border border-emerald-200 bg-white px-2 py-1 text-xs text-slate-900 outline-none focus:border-emerald-500"
                    >
                      <option value="USER">USER</option>
                      <option value="PHARMACIST">PHARMACIST</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
