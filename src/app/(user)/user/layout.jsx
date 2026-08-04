import Navbar from "@/component/user/bars/Navbar"
import Sidebar from "@/component/user/bars/Sidebar"


export const metadata = {
  title: 'My Dashboard | Disibin',
  description: 'Manage your interactions, orders, and projects on Disibin.',
}

export default async function Layout({ children }) {
  return (
    <section className="w-full animate-in fade-in duration-700 relative overflow-x-hidden pt-14">
      <Navbar/>
      <Sidebar/>
      {children}
    </section>
  )
}
