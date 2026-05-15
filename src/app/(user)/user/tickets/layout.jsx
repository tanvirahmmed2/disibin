export const metadata = {
  title: 'My Ticket | Disibin',
  description: 'Manage your ticket about interactions, orders, and projects on Disibin.',
}

export default function Layout({ children }) {
  return <section className="w-full animate-in fade-in duration-700">{children}</section>
}
