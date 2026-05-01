"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/login"); 
    } else {
      alert("Error signing up");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <input type="text" placeholder="Full Name" required className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setName(e.target.value)} />
        <input type="email" placeholder="Email Address" required className="w-full border p-3 mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required className="w-full border p-3 mb-6 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={e => setPassword(e.target.value)} />
        <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-semibold hover:bg-blue-700 transition">Sign Up</button>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </form>
    </div>
  );
}