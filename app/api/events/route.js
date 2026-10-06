import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    const query = includeInactive ? {} : { isActive: true };
    const events = await Event.find(query).sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, count: events.length, data: events });
  } catch (error) {
    console.error('Error fetching events:', error);
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

    const { title, description, date, type, imageUrl, isActive } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title,
      description,
      date: date ? new Date(date) : new Date(),
      type: type || 'news',
      imageUrl: imageUrl || '',
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, data: event }, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create event' },
      { status: 500 }
    );
  }
}
