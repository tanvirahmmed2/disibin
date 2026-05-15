export const metadata = {
  title: 'My purchases | Disibin',
  description: 'Manage your purchases on Disibin.',
}

export default function Layout({ children }) {
  return <section className="w-full animate-in fade-in duration-700">{children}</section>
}
