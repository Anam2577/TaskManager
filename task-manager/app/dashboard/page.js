"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); // Refresh list after update
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (status === "loading") return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 shadow-sm rounded-lg">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
          <p className="text-gray-500 mt-1">Logged in as {session?.user?.name} | Role: <span className="font-semibold text-blue-600">{session?.user?.role}</span></p>
        </div>
        <button onClick={() => signOut()} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded transition">
          Logout
        </button>
      </div>

      {/* Admin Panel */}
      {session?.user?.role === "Admin" && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="font-bold text-blue-800 text-xl mb-2">Admin Controls</h2>
          <p className="text-sm text-blue-600 mb-4">You have full access to create and assign tasks.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition">
            + Create New Task
          </button>
          {/* Note: You can add a modal or form here to actually hit the POST /api/tasks route */}
        </div>
      )}

      {/* Task Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Pending', 'In Progress', 'Completed'].map(colStatus => (
          <div key={colStatus} className="bg-gray-200 p-5 rounded-lg min-h-[400px]">
            <h2 className="font-bold mb-4 text-xl text-gray-700 border-b pb-2">{colStatus}</h2>
            {tasks.filter(t => t.status === colStatus).map(task => {
              const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Completed';
              return (
                <div key={task._id} className={`bg-white p-5 mb-4 rounded-lg shadow-sm border-l-4 ${isOverdue ? 'border-red-500' : 'border-blue-500'}`}>
                  <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
                  {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>Assignee: <span className="font-medium text-gray-700">{task.assignedTo?.name || 'Unassigned'}</span></p>
                    <p className={isOverdue ? 'text-red-500 font-bold' : ''}>
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <select 
                    className="mt-4 text-sm border p-2 rounded w-full bg-gray-50 cursor-pointer"
                    value={task.status}
                    onChange={(e) => updateStatus(task._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}