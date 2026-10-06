import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Admission from '@/models/Admission';
import Contact from '@/models/Contact';

export const PATCH = PUT;

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();

    const updateData = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.reply !== undefined) updateData.reply = body.reply;

    let updated = await Submission.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) {
      updated = await Admission.findByIdAndUpdate(id, updateData, { new: true });
    }
    if (!updated) {
      updated = await Contact.findByIdAndUpdate(id, updateData, { new: true });
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update submission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    let deleted = await Submission.findByIdAndDelete(id);
    if (!deleted) {
      deleted = await Admission.findByIdAndDelete(id);
    }
    if (!deleted) {
      deleted = await Contact.findByIdAndDelete(id);
    }

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete submission' },
      { status: 500 }
    );
  }
}
