import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, ArrowRight, Newspaper } from 'lucide-react';
import MotionCard from '@/components/MotionCard';
import EventCalendar from '@/components/EventCalendar';
import connectToDatabase from '@/lib/mongodb';
import News from '@/models/News';
import Event from '@/models/Event';

export const dynamic = 'force-dynamic';

async function getNews() {
  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      const [newsDocs, eventDocs] = await Promise.all([
        News.find({}).sort({ createdAt: -1 }).limit(12).lean().catch(() => []),
        Event.find({ isActive: true }).sort({ date: -1 }).limit(12).lean().catch(() => []),
      ]);

      const formattedEvents = eventDocs.map((e) => ({
        _id: e._id.toString(),
        title: e.title,
        category: e.type ? e.type.charAt(0).toUpperCase() + e.type.slice(1) : 'Event',
        excerpt: e.description,
        content: e.description,
        imageUrl: e.imageUrl,
        eventDate: e.date ? new Date(e.date).toISOString() : new Date().toISOString(),
        isFeatured: false,
      }));

      const combined = [...formattedEvents, ...newsDocs];
      if (combined.length > 0) {
        return JSON.parse(JSON.stringify(combined));
      }
    }
  } catch (error) {
    console.error('Error fetching news from database:', error.message);
  }
  return [];
}

export default async function NewsPage() {
  const newsList = await getNews();

  return (
    <div className="w-full bg-transparent py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Header */}
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
            CAMPUS UPDATES &amp; EVENTS
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
            News &amp; Campus Announcements
          </h1>
          <div className="w-14 h-1 bg-[#A01A22] rounded-full mx-auto my-3"></div>
          <p className="text-gray-900 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
            Stay informed about campus activities, academic milestones, celebrations, and student achievements at The Torcia School.
          </p>
        </div>

        {/* 2. News Grid */}
        {newsList.length === 0 ? (
          <div className="bg-white/95 backdrop-blur-xl border border-dashed border-red-200 rounded-2xl p-10 sm:p-14 text-center text-gray-500 shadow-md max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#A01A22] flex items-center justify-center mx-auto">
              <Newspaper className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-base">New updates coming soon</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We are currently preparing fresh announcements and upcoming events. Check back soon for the latest campus updates!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 items-stretch">
            {newsList.map((item, idx) => {
              const dateStr = item.eventDate
                ? new Date(item.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Recent';

              return (
                <MotionCard key={item._id} index={idx} className="h-full">
                  <Link
                    href={`/news/${item._id}`}
                    className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden flex flex-col h-full"
                  >
                    <div className="relative w-full aspect-video md:aspect-video overflow-hidden">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          <Newspaper className="w-8 h-8 sm:w-10 sm:h-10" />
                        </div>
                      )}

                      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white text-[#A01A22] px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-md">
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>{item.category || 'News'}</span>
                      </div>
                    </div>

                    <div className="p-3 sm:p-5 md:p-8 space-y-2 md:space-y-4 flex-1 flex flex-col justify-between flex-grow">
                      <div className="flex-grow">
                        <span className="text-[10px] sm:text-xs text-gray-600 flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2.5 font-semibold">
                          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#A01A22]" />
                          {dateStr}
                        </span>

                        <h2 className="text-xs sm:text-base md:text-xl font-bold font-serif text-gray-900 tracking-tight line-clamp-2 group-hover:text-red-700 transition-colors leading-snug">
                          {item.title}
                        </h2>

                        <p className="text-[11px] sm:text-xs md:text-sm text-gray-700 leading-relaxed line-clamp-2 md:line-clamp-3 mt-1 sm:mt-2.5 font-normal">
                          {item.excerpt}
                        </p>
                      </div>

                      <div className="pt-2 sm:pt-4 md:pt-5 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <span className="text-[10px] sm:text-xs text-gray-500 font-medium hidden sm:inline">The Torcia School</span>
                        <div className="inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-[#A01A22] hover:text-white hover:bg-[#A01A22] active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1">
                          <span>Read Story</span>
                          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </MotionCard>
              );
            })}
          </div>
        )}

          {/* 3. Academic Calendar & Upcoming Events Section */}
          <section className="mt-10 sm:mt-12">
            <div className="max-w-4xl mx-auto text-center space-y-1.5 sm:space-y-2 mb-5 sm:mb-6">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
                CAMPUS SCHEDULE &amp; EVENTS
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Academic Calendar &amp; Upcoming Events
              </h2>
              <div className="w-12 h-1 bg-[#A01A22] rounded-full mx-auto my-2"></div>
              <p className="text-gray-900 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-normal">
                Explore scheduled campus milestones, parent-teacher conferences, student exhibitions, and holiday observances at The Torcia School.
              </p>
            </div>

            <MotionCard index={0} className="w-full max-w-5xl mx-auto">
              <EventCalendar />
            </MotionCard>
          </section>

          {/* Admin note banner */}
          <MotionCard index={0} className="w-full">
            <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 text-center max-w-xl mx-auto space-y-2">
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Campus administrators can publish new stories, upload event photos, or archive announcements directly.
              </p>
              <Link
                href="/admin"
                className="inline-block text-xs font-bold text-[#A01A22] hover:underline underline-offset-4 tracking-wide"
              >
                Access Admin Portal →
              </Link>
            </div>
          </MotionCard>
        </div>
      </div>
  );
}

