import DashboardNavbar from "@/component/dashboard/DashboardNavbar"
import DashboardSidebar from "@/component/dashboard/DashboardSidebar"

export const metadata = {
  title: 'Management Dashboard | Disibin',
  description: 'Administrative interface for managing Disibin studio operations.',
}

export default function Layout({ children }) {
  
  return (
    <section className="w-full animate-in fade-in duration-700 relative">
      <DashboardNavbar/>
      <DashboardSidebar/>
      {children}
      
      </section>
  )
}
