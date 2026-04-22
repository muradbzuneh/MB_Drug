import { getServerSession } from "next-auth";

export default async function AdminPage() {
  const session = await getServerSession();

  if (session?.user.role !== "ADMIN") {
    return <p>Access Denied</p>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <p>Manage users and system</p>
    </div>
  );
}