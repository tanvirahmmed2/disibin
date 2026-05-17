import TaskBoard from "@/component/dashboard/tasks/TaskBoard";

export const metadata = {
    title: "My Tasks | Support Dashboard",
    description: "View and manage tasks assigned to you."
};

export default function SupportTasksPage() {
    return <TaskBoard role="support" />;
}
