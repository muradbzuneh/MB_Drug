import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Logout from "./Logout";
import ProfileForm from "./ProfileForm";


export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
   
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!user) redirect("/login");

  const roleColor: Record<string, string> = {
    ADMIN: "bg-purple-500/15 text-purple-400",
    PHARMACIST: "bg-blue-500/15 text-blue-400",
    USER: "bg-emerald-500/15 text-emerald-400",
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl w-100 h-30 bg-emerald-950 p-6">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="mt-1 text-sm text-slate-400">Manage your account information.</p>
      </div>

      <div className="rounded-2xl border border-[#1b345f] bg-emerald-800 p-6 flex items-center gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-900  text-2xl font-bold text-emerald-400">
          {user.name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <p className="font-semibold text-white">{user.name ?? "No name"}</p>
          <p className="text-sm text-slate-400">{user.email}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleColor[user.role] ?? ""}`}>
              {user.role}
            </span>
            <span className="text-xs text-slate-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
         
        </div>
      </div>

      <ProfileForm currentName={user.name ?? ""} />
  <Logout />
     
    </div>
  );
}
