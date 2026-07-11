import { AppSidebar } from "@/components/app/app-sidebar";
import { requireAuthenticatedUser } from "@/lib/supabase/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAuthenticatedUser();
  return <div className="min-h-screen bg-[#08090b]"><AppSidebar /><main className="min-h-screen pb-20 md:ml-60 md:pb-0">{children}</main></div>;
}
