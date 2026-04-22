import { redirect } from "next/navigation";

// The (dashboard) root "/" is handled by app/page.tsx (landing).
// Authenticated users land on /home via login redirect.
export default function DashboardRoot() {
  redirect("/home");
}
