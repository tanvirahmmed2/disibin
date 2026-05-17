import TaskBoard from "@/component/dashboard/tasks/TaskBoard";

export const metadata = {
    title: "Task Management | Manager Dashboard",
    description: "Create and manage tasks for your team."
};

export default function ManagerTasksPage() {
    return <TaskBoard role="manager" />;
}
