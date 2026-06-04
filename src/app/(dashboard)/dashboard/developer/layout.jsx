export const metadata = {
    title: 'Developer Dashboard | Disibin',
    description: 'Developer workspace — projects, tasks, and chat.',
}

export default function DeveloperLayout({ children }) {
    return <section className="w-full animate-in fade-in duration-500">{children}</section>;
}
