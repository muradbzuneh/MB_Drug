import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "ADMIN") redirect("/home");

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const roleColor: Record<string, string> = {
    ADMIN: "bg-purple-500/15 text-purple-400",
    PHARMACIST: "bg-blue-500/15 text-blue-400",
    USER: "bg-emerald-500/15 text-emerald-400",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#1b345f] bg-emerald-900 p-6">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="mt-1 text-sm text-slate-400">{users.length} registered users</p>
      </div>

      <div className="rounded-2xl border border-[#1b345f] bg-[#0c1d3f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1b345f] text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Email</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Role</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Joined</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Change Role</th>
              </tr>
            </thead> 
            <tbody>
              {users.map((u:any) => (
                <tr key={u.id} className="border-b border-[#1b345f] last:border-0">
                  <td className="px-5 py-3 text-slate-200">{u.name ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-400">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor[u.role] ?? ""}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500 text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <form
                      className="flex items-center gap-2"
                      action={async (formData: FormData) => {
                        "use server";
                        const role = formData.get("role") as "USER" | "PHARMACIST" | "ADMIN";
                        await prisma.user.update({ where: { id: u.id }, data: { role } });
                        revalidatePath("/admin");
                      }}
                    >
                      <select
                        name="role"
                        defaultValue={u.role}
                        className="rounded-lg border border-[#1b345f] bg-[#070f24] px-2 py-1 text-xs text-slate-200 outline-none focus:border-emerald-500"
                      >
                        <option value="USER">USER</option>
                        <option value="PHARMACIST">PHARMACIST</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
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
    </div>
  );
}
