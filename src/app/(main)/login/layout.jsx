import { isLogin } from "@/lib/middleware"
import { redirect } from "next/navigation"

export const metadata = {
  title: 'Login | Disibin',
  description: 'Log in to your Disibin account to manage your projects and studio interactions.',
}

export default async function Layout({ children }) {
  const auth= await isLogin()
  if(auth.success)redirect('/user')

  return(
     <section className="w-full animate-in fade-in duration-700">{children}</section>
  )
}
