import UserNavbar from "@/component/dashboard/UserNavbar"
import UserSidebar from "@/component/dashboard/UserSidebar"
import { isLogin } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'My Dashboard | Disibin',
  description: 'Manage your interactions, orders, and projects on Disibin.',
}

export default async function Layout({ children }) {
  const auth= await isLogin()
  if(!auth.success)return redirect('/login')

  return (
    <section className="w-full animate-in fade-in duration-700 relative overflow-x-hidden pt-14">
      <UserNavbar/>
      <UserSidebar/>
      {children}
    </section>
  )
}
