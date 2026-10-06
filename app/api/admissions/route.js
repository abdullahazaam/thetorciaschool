import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Admission from '@/models/Admission';
import { sendAdmissionNotifications } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const admissions = await Admission.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, admissions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Database error fetching admissions' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request payload format.' },
        { status: 400 }
      );
    }

    const studentName = typeof body.studentName === 'string' ? body.studentName.trim() : '';
    const parentName = typeof body.parentName === 'string' ? body.parentName.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const grade = typeof body.grade === 'string' ? body.grade.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    if (!studentName || !parentName || !phone || !grade) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields (student name, parent name, phone, grade).' },
        { status: 400 }
      );
    }

    if (studentName.length > 100 || parentName.length > 100 || phone.length > 30 || grade.length > 50 || email.length > 120) {
      return NextResponse.json(
        { success: false, error: 'One or more fields exceed maximum permitted character length.' },
        { status: 400 }
      );
    }

    const admission = await Admission.create({
      studentName,
      parentName,
      email: email || '',
      phone,
      grade,
      status: 'pending',
    });

    // Asynchronously trigger notification emails to applicant and school admin
    try {
      await sendAdmissionNotifications(admission);
    } catch (mailError) {
      console.error('[Admissions API] Email notification failed:', mailError);
    }

    return NextResponse.json({ success: true, admission }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit admission inquiry' },
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

    const updated = await Admission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Admission record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, admission: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update admission status' },
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
      } catch (e) {
        // body might be empty
      }
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required for deletion' },
        { status: 400 }
      );
    }

    const deleted = await Admission.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Admission record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Admission record deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete admission record' },
      { status: 500 }
    );
  }
}
