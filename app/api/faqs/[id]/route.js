import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Faq from '@/models/Faq';

export async function PUT(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const body = await request.json();

    const updateData = {};
    if (body.question !== undefined) updateData.question = body.question.trim();
    if (body.answer !== undefined) updateData.answer = body.answer.trim();
    if (body.category !== undefined) updateData.category = body.category.trim();
    if (body.order !== undefined) updateData.order = Number(body.order);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const updatedFaq = await Faq.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFaq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedFaq });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update FAQ' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const deletedFaq = await Faq.findByIdAndDelete(id);

    if (!deletedFaq) {
      return NextResponse.json(
        { success: false, error: 'FAQ not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete FAQ' },
      { status: 500 }
    );
  }
}
