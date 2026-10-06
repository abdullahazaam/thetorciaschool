import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Faculty from '@/models/Faculty';

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();

    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name.trim();
    if (body.degree !== undefined) updateData.degree = body.degree.trim();
    if (body.designation !== undefined) updateData.designation = body.designation.trim();
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.experience !== undefined) updateData.experience = body.experience.trim();
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updated = await Faculty.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Faculty member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating faculty member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update faculty member' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deleted = await Faculty.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Faculty member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Faculty member deleted successfully' });
  } catch (error) {
    console.error('Error deleting faculty member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete faculty member' },
      { status: 500 }
    );
  }
}
