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
    <section className="w-full animate-in fade-in duration-700 relative">
      <DashboardNavbar/>
      <DashboardSidebar/>
      {children}
      
      </section>
  )
}
