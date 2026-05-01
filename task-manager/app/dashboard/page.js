"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);

  // 1. Protection: If not logged in, send to login page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchTasks();
    }
  }, [status, router]);

  // 2. Load all tasks from MongoDB
  const fetchTasks = async () => {
    try {
      const res = await axios.get("/api/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    }
  };

  // 3. Create a new task (Admin Only)
  const handleCreateTask = async () => {
    const title = prompt("Enter the task title:");
    const description = prompt("Enter task description (optional):");
    
    if (title) {
      try {
        await axios.post("/api/tasks", {
          title,
          description,
          status: "Pending",
          dueDate: new Date(Date.now() + 86400000).toISOString(), // Defaults to tomorrow
        });
        fetchTasks(); // Refresh the list instantly
      } catch (error) {
        alert("Error creating task. Check console.");
        console.error(error);
      }
    }
  };

  // 4. Update task status (Move between columns)
  const updateStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`/api/tasks/${taskId}`, { status: newStatus });
      fetchTasks(); 
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  if (status === "loading") return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
      Loading your workspace...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-white p-6 shadow-sm rounded-xl border border-gray-200">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Task Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Welcome back, <span className="text-gray-800 font-medium">{session?.user?.name}</span> | 
              Role: <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase italic">
                {session?.user?.role || "Member"}
              </span>
            </p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })} 
            className="mt-4 md:mt-0 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition-all shadow-md"
          >
            Logout
          </button>
        </div>

        {/* --- ADMIN CONTROLS SECTION --- */}
        {session?.user?.role === "Admin" && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="font-bold text-2xl mb-1 flex items-center">
                  <span className="mr-2">⚡</span> Admin Management
                </h2>
                <p className="text-blue-100 opacity-90">Assign tasks and manage the team workflow.</p>
              </div>
              <button 
                onClick={handleCreateTask}
                className="mt-4 md:mt-0 bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-transform active:scale-95 shadow-sm"
              >
                + Create New Task
              </button>
            </div>
          </div>
        )}

        {/* --- KANBAN BOARD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['Pending', 'In Progress', 'Completed'].map(colStatus => (
            <div key={colStatus} className="bg-gray-200/50 p-4 rounded-2xl min-h-[500px] border border-gray-300 shadow-inner">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="font-black text-gray-700 uppercase tracking-widest text-sm">{colStatus}</h2>
                <span className="bg-gray-300 text-gray-600 text-xs font-bold px-2 py-1 rounded-md">
                  {tasks.filter(t => t.status === colStatus).length}
                </span>
              </div>

              {tasks.filter(t => t.status === colStatus).map(task => (
                <div 
                  key={task._id} 
                  className="bg-white p-5 mb-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow group"
                >
                  <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 italic">"{task.description}"</p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                    <div>
                      <span className="block font-medium text-gray-600 capitalize">👤 {task.assignedTo?.name || 'Unassigned'}</span>
                      <span className="block mt-1">📅 {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="mt-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Change Status</label>
                    <select 
                      className="mt-1 block w-full text-sm border-gray-200 bg-gray-50 p-2 rounded-md cursor-pointer focus:ring-blue-500 focus:border-blue-500"
                      value={task.status}
                      onChange={(e) => updateStatus(task._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
              
              {tasks.filter(t => t.status === colStatus).length === 0 && (
                <div className="text-center py-10 text-gray-400 text-sm italic">
                  No tasks here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}