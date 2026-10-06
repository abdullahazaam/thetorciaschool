import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Faculty from '@/models/Faculty';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    const query = includeInactive ? {} : { isActive: true };
    const faculty = await Faculty.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: faculty.length, data: faculty });
  } catch (error) {
    console.error('Error fetching faculty:', error);
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

    const { name, degree, designation, imageUrl, experience, isActive } = body;

    if (!name || !degree || !designation) {
      return NextResponse.json(
        { success: false, error: 'Name, degree, and designation are required' },
        { status: 400 }
      );
    }

    const member = await Faculty.create({
      name: name.trim(),
      degree: degree.trim(),
      designation: designation.trim(),
      imageUrl: imageUrl || '',
      experience: experience ? experience.trim() : '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, data: member }, { status: 201 });
  } catch (error) {
    console.error('Error creating faculty member:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create faculty member' },
      { status: 500 }
    );
  }
}
