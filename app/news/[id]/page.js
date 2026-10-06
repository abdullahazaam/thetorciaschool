import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Tag, Newspaper } from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import News from '@/models/News';
import Event from '@/models/Event';

export const dynamic = 'force-dynamic';

async function getArticle(id) {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const article = await News.findById(id).lean();
      if (article) return JSON.parse(JSON.stringify(article));

      const event = await Event.findById(id).lean();
      if (event) {
        return JSON.parse(
          JSON.stringify({
            _id: event._id.toString(),
            title: event.title,
            category: event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'Event',
            excerpt: event.description,
            content: event.description,
            imageUrl: event.imageUrl,
            eventDate: event.date,
            createdAt: event.createdAt,
          })
        );
      }
    }
  } catch (e) {
    // ignore invalid ObjectId format
  }
  return null;
}

export default async function NewsDetailPage({ params }) {
  const { id } = params;
  const article = await getArticle(id);

  if (!article) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-[#A01A22] flex items-center justify-center mb-4 shadow-sm">
          <Newspaper className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-gray-900 mb-2">Article Not Found</h1>
        <p className="text-gray-600 text-sm max-w-md mb-6">
          The announcement or story you are looking for may have been archived or removed.
        </p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#A01A22] text-white text-xs font-bold hover:bg-[#87131A] transition shadow-md"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to News &amp; Events</span>
        </Link>
      </div>
    );
  }

  const dateStr = article.eventDate
    ? new Date(article.eventDate).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date(article.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

  return (
    <div className="w-full bg-transparent py-10 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#A01A22] hover:text-[#87131A] transition group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Announcements</span>
          </Link>
        </div>

        {/* Article Container Card */}
        <article className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-red-50 text-[#A01A22] border border-red-100 px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <Tag className="w-3 h-3" />
              <span>{article.category || 'News'}</span>
            </span>

            <span className="text-xs text-gray-500 flex items-center gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#A01A22]" />
              <span>{dateStr}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-serif text-gray-900 tracking-tight leading-tight">
            {article.title}
          </h1>

          {article.imageUrl && (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-md">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover object-center"
                priority
              />
            </div>
          )}

          {article.excerpt && (
            <p className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed italic border-l-4 border-[#A01A22] pl-4 py-1">
              {article.excerpt}
            </p>
          )}

          <div className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal whitespace-pre-line space-y-4">
            {article.content}
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">The Torcia School • Nazimabad Campus</span>
            <Link
              href="/admissions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#A01A22] hover:text-[#87131A] transition"
            >
              <span>Enroll Your Child →</span>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
