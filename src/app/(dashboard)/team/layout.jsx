import Navbar from "@/component/team/bars/Navbar"
import Sidebar from "@/component/team/bars/Sidebar"
import { isTeamLogin } from "@/lib/auth/team"
import { redirect } from "next/navigation"


export const metadata = {
  title: 'Management Dashboard | Disibin',
  description: 'Administrative interface for managing Disibin studio operations.',
}

export default async function Layout({ children }) {
  const auth= await isTeamLogin()
  if(!auth.success) return redirect('/team-auth/login')
  
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
