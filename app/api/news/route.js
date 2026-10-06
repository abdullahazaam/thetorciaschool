import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import News from '@/models/News';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const filter = category ? { category } : {};
    const news = await News.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, count: news.length, news });
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

    const newArticle = await News.create(body);
    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create news item' },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'News ID is required' }, { status: 400 });
    }

    const deleted = await News.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete' },
      { status: 500 }
    );
  }
}
