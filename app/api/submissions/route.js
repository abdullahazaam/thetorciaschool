import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Submission from '@/models/Submission';
import Admission from '@/models/Admission';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;

    const subDocs = await Submission.find(filter).sort({ createdAt: -1 }).lean();

    const extraDocs = [];
    if (!type || type === 'admission') {
      const admFilter = status ? { status } : {};
      const admList = await Admission.find(admFilter).sort({ createdAt: -1 }).lean().catch(() => []);
      extraDocs.push(
        ...admList.map((a) => ({
          _id: a._id.toString(),
          name: a.studentName ? `${a.studentName} (Parent: ${a.parentName})` : a.parentName,
          studentName: a.studentName || '',
          parentName: a.parentName || '',
          grade: a.grade || '',
          email: a.email || '',
          phone: a.phone || '',
          message: a.message || `Admission application for Grade: ${a.grade}. Parent: ${a.parentName}`,
          type: 'admission',
          status: a.status || 'pending',
          createdAt: a.createdAt,
          source: 'admission',
        }))
      );
    }

    if (!type || type === 'contact') {
      const cntFilter = status ? { status } : {};
      const cntList = await Contact.find(cntFilter).sort({ createdAt: -1 }).lean().catch(() => []);
      extraDocs.push(
        ...cntList.map((c) => ({
          _id: c._id.toString(),
          name: c.name || '',
          email: c.email || '',
          phone: c.phone || '',
          subject: c.subject || 'General Inquiry',
          message: c.message || '',
          type: 'contact',
          status: c.status || 'unread',
          createdAt: c.createdAt,
          source: 'contact',
        }))
      );
    }

    const allSubmissions = [...subDocs, ...extraDocs];
    allSubmissions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({ success: true, count: allSubmissions.length, data: allSubmissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
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

    const { name, email, phone, message, type, status, studentName, parentName, grade } = body;

    if (!name && !studentName) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    const submission = await Submission.create({
      name: name || studentName,
      email: email || '',
      phone: phone || '',
      message: message || (grade ? `Grade: ${grade}. Parent: ${parentName}` : ''),
      type: type || 'contact',
      status: status || 'pending',
    });

    return NextResponse.json({ success: true, data: submission }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit' },
      { status: 500 }
    );
  }
}
