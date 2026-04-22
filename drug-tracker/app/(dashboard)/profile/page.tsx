import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-xl backdrop-blur">
        <h1 className="text-2xl font-bold text-emerald-900">Profile</h1>
        <p className="mt-1 text-sm text-emerald-700">Manage your account information.</p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white/90 p-6 shadow-md space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700">
            {user.name?.[0]?.toUpperCase() ?? "?"}
          </div>
          <div>
            <p className="font-semibold text-emerald-900">{user.name ?? "—"}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {user.role}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <ProfileForm userId={user.id} currentName={user.name ?? ""} />
    </div>
  );
}
