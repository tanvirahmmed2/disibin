import TaskBoard from "@/component/dashboard/tasks/TaskBoard";

export const metadata = {
    title: "My Tasks | Developer Dashboard",
    description: "View and manage tasks assigned to you."
};

export default function DeveloperTasksPage() {
    return <TaskBoard role="developer" />;
}
