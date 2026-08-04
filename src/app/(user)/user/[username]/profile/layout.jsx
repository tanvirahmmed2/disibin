export const metadata = {
  title: 'My Profile | Disibin',
  description: 'Manage your personal account details and studio preferences.',
}

export default function Layout({ children }) {
  return <section className="w-full animate-in fade-in duration-700">{children}</section>
}
