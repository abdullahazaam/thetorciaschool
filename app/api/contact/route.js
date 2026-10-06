import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { sendContactNotifications } from '@/lib/mailer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, contacts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Database error fetching contact messages' },
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

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : 'General Inquiry';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields (name, email, message).' },
        { status: 400 }
      );
    }

    if (name.length > 100 || email.length > 120 || phone.length > 30 || subject.length > 150 || message.length > 3000) {
      return NextResponse.json(
        { success: false, error: 'One or more fields exceed maximum permitted character length.' },
        { status: 400 }
      );
    }

    const contact = await Contact.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message,
      status: 'unread',
    });

    // Asynchronously trigger notification emails to visitor and school admin
    try {
      await sendContactNotifications(contact);
    } catch (mailError) {
      console.error('[Contact API] Email notification failed:', mailError);
    }

    return NextResponse.json({ success: true, contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit contact message' },
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

    const updated = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, contact: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update contact status' },
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

    const deleted = await Contact.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Contact message deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete contact message' },
      { status: 500 }
    );
  }
}
