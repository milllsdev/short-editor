import { AppSidebar } from "@/components/app/app-sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#08090b]"><AppSidebar /><main className="min-h-screen pb-20 md:ml-60 md:pb-0">{children}</main></div>;
}
