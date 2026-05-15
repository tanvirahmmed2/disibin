export const metadata = {
  title: 'Admin Dashboard | Disibin',
  description: 'Manage your admin panel on Disibin.',
}

export default function Layout({ children }) {
  return <section className="w-full animate-in fade-in duration-700">{children}</section>
}
