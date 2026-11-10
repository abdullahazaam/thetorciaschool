import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Faq from '@/models/Faq';

export const dynamic = 'force-dynamic';

const DEFAULT_FAQS = [
  {
    question: 'What are the age requirements across Playgroup, Montessori, and Primary grades?',
    answer: 'Playgroup accepts children starting at 2.5 years. Montessori/Nursery caters to 3.5 to 5 years focusing on foundational sensory motor skills. Grade I requires a minimum age of 5 years, Grade II minimum 6 years, and Grade III minimum 7 years. Class IV & V require age-appropriate readiness evaluation.',
    category: 'Admissions',
    order: 1,
    isActive: true,
  },
  {
    question: 'What are the regular student timings and campus office hours?',
    answer: 'Pre-Primary (Playgroup & Montessori) operates Monday through Thursday from 8:30 AM to 12:30 PM, and Friday until 12:00 Noon. Primary (Classes I to V) operates Monday through Thursday from 7:45 AM to 1:30 PM, and Friday until 12:30 PM. The Admissions Desk is open Monday to Saturday from 7:45 AM to 2:00 PM (Friday until 1:00 PM).',
    category: 'Timings',
    order: 2,
    isActive: true,
  },
  {
    question: 'Can parents visit the campus for a guided tour before registration?',
    answer: 'Yes, parents are warmly invited to visit our Nazimabad campus (Plot # 20/13 Block 5C, near Abbasi Shaheed Hospital) during working hours. You can meet our directress, explore our robotics lab, and tour the classrooms.',
    category: 'Campus',
    order: 3,
    isActive: true,
  },
  {
    question: 'What distinguishes The Torcia School curriculum and STEM programme?',
    answer: 'We combine rigorous Oxford/Cambridge-aligned primary academics with our flagship STEM & Robotics Programme (Coding, AI, and hands-on science kits), alongside a structured values-based moral foundation promoting discipline and leadership.',
    category: 'Curriculum',
    order: 4,
    isActive: true,
  },
  {
    question: 'What documents must be submitted for admission confirmation?',
    answer: "Parents are requested to submit: (1) Copy of the child's Nadra B-Form, (2) 4 passport-size photographs, (3) Copy of Parent/Guardian CNIC, and (4) Last school leaving certificate / previous report card for transfer students.",
    category: 'Admissions',
    order: 5,
    isActive: true,
  },
  {
    question: 'What is the fee structure for the 2026–2027 academic session?',
    answer: 'The one-time Admission Fee is Rs. 15,000, Annual Charges are Rs. 4,000, and the Monthly Tuition Fee is Rs. 5,000. Special sibling concessions and merit considerations are reviewed on a case-by-case basis.',
    category: 'Fees',
    order: 6,
    isActive: true,
  },
];

export async function GET(request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('all') === 'true';

    const query = includeInactive ? {} : { isActive: true };
    let faqs = await Faq.find(query).sort({ order: 1, createdAt: 1 }).lean();

    // If database is empty, seed initial default institutional FAQs
    if (faqs.length === 0) {
      try {
        await Faq.insertMany(DEFAULT_FAQS);
        faqs = await Faq.find(query).sort({ order: 1, createdAt: 1 }).lean();
      } catch (seedErr) {
        console.warn('Could not auto-seed FAQs, returning in-memory defaults:', seedErr);
        faqs = DEFAULT_FAQS;
      }
    }

    return NextResponse.json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    // Graceful fallback to default FAQs so UI never breaks
    return NextResponse.json({ success: true, count: DEFAULT_FAQS.length, data: DEFAULT_FAQS });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();

    const { question, answer, category, order, isActive } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { success: false, error: 'Question and answer are required' },
        { status: 400 }
      );
    }

    const faq = await Faq.create({
      question: question.trim(),
      answer: answer.trim(),
      category: category ? category.trim() : 'Admissions',
      order: typeof order === 'number' ? order : 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create FAQ' },
      { status: 500 }
    );
  }
}
