import Navbar from "@/component/user/bars/Navbar"
import Sidebar from "@/component/user/bars/Sidebar"

export const metadata = {
  title: 'My Dashboard | Disibin',
  description: 'Manage your interactions, orders, and projects on Disibin.',
}

export default async function Layout({ children }) {
  return (
    <section className="w-full relative pt-14 bg-slate-50 min-h-screen">
      <Navbar/>
      <Sidebar/>
      <main className="lg:ml-64 transition-all duration-300 animate-in fade-in">
        {children}
      </main>
    </section>
  )
}
