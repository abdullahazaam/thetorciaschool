import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Inquiry from '@/models/Inquiry';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, inquiries });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Database connection error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const inquiry = await Inquiry.create(body);
    return NextResponse.json({ success: true, inquiry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit inquiry' },
      { status: 400 }
    );
  }
}

export async function PATCH(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: 'Record ID and new status are required' },
        { status: 400 }
      );
    }

    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json({ success: true, inquiry: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update inquiry status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      try {
        const body = await request.json();
        id = body?.id;
      } catch (e) {}
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required for deletion' },
        { status: 400 }
      );
    }

    await Inquiry.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete inquiry' },
      { status: 500 }
    );
  }
}
