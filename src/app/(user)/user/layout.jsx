import UserNavbar from "@/component/dashboard/UserNavbar"
import UserSidebar from "@/component/dashboard/UserSidebar"

export const metadata = {
  title: 'My Dashboard | Disibin',
  description: 'Manage your interactions, orders, and projects on Disibin.',
}

export default function Layout({ children }) {
  return (
    <section className="w-full animate-in fade-in duration-700 relative overflow-x-hidden">
      <UserNavbar/>
      <UserSidebar/>
      {children}
    </section>
  )
}
