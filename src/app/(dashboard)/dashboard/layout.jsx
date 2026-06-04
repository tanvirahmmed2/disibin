import DashboardNavbar from "@/component/dashboard/DashboardNavbar"
import DashboardSidebar from "@/component/dashboard/DashboardSidebar"
import { ManagementRole } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Management Dashboard | Disibin',
  description: 'Administrative interface for managing Disibin studio operations.',
}

export default async function Layout({ children }) {
  const auth = await ManagementRole()
  if (!auth.success) return redirect('/login')
  
  return (
    <section className="w-full relative pt-14 bg-slate-50 min-h-screen">
      <DashboardNavbar/>
      <DashboardSidebar/>
      <main className="lg:ml-64 transition-all duration-300 animate-in fade-in duration-700">
        {children}
      </main>
    </section>
  )
}
