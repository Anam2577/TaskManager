import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Task from '@/models/Task';

export async function PATCH(req, { params }) {
  await connectDB();
  const { status } = await req.json();
  
  try {
    const updatedTask = await Task.findByIdAndUpdate(params.id, { status }, { new: true });
    return NextResponse.json(updatedTask);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}