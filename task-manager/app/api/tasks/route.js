import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = {};
  // Members only see their tasks. Admins see all.
  if (session.user.role === 'Member') {
    query.assignedTo = session.user.id;
  }

  const tasks = await Task.find(query).populate('assignedTo', 'name').sort({ dueDate: 1 });
  return NextResponse.json(tasks);
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
  }

  const data = await req.json();
  const newTask = await Task.create(data);
  return NextResponse.json(newTask, { status: 201 });
}