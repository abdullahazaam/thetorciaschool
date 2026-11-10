'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
} from 'lucide-react';

/**
 * Institutional Academic Schedule by Month (0-indexed: 0 = Jan, 10 = Nov, 11 = Dec)
 * Provides authentic, STEM & early-years educational milestones for The Torcia School
 */
function getMonthlySchedule(year, month) {
  const schedulesByMonth = {
    // November (Month 10)
    10: [
      {
        id: 'nov-1',
        day: 4,
        title: 'Montessori Phonics & Motor Skills Activity',
        category: 'Early Years',
        time: '9:00 AM – 11:30 AM',
        location: 'Junior Activity Hall',
        description:
          'Hands-on sensory exploration with Montessori manipulatives, early phonics games, and tactile learning tools for Playgroup and Nursery.',
      },
      {
        id: 'nov-2',
        day: 10,
        title: 'STEM Robotics & Coding Discovery Lab',
        category: 'STEM & Innovation',
        time: '10:00 AM – 1:00 PM',
        location: 'Activity & STEM Lab',
        description:
          'Interactive STEM session introducing primary students to basic robotic mechanisms, visual coding block sequences, and sensor logic.',
      },
      {
        id: 'nov-3',
        day: 16,
        title: 'Mid-Term Parent-Teacher Consultation (PTM)',
        category: 'Academic',
        time: '8:30 AM – 1:30 PM',
        location: 'Main Academic Wing',
        description:
          'Individual progress reviews between parents and certified educators to discuss academic growth, phonics mastery, and foundational milestones.',
      },
      {
        id: 'nov-4',
        day: 21,
        title: 'Iqbal Day & Urdu Declamation Showcase',
        category: 'Cultural & Values',
        time: '9:30 AM – 12:00 PM',
        location: 'Campus Auditorium',
        description:
          'Special student assembly featuring poetic recitations, patriotic presentations, and bilingual speech competitions across junior houses.',
      },
      {
        id: 'nov-5',
        day: 27,
        title: 'Islamic Etiquette & Adab Workshop',
        category: 'Character Building',
        time: '10:30 AM – 12:30 PM',
        location: 'School Hall',
        description:
          'Inspiring session reinforcing practical Islamic manners, daily morning duas, and community respect as part of our leadership curriculum.',
      },
    ],
    // December (Month 11)
    11: [
      {
        id: 'dec-1',
        day: 5,
        title: 'Annual Sports & Fitness Meet',
        category: 'Co-Curricular',
        time: '8:30 AM – 1:00 PM',
        location: 'Campus Sports Ground',
        description:
          'Energetic inter-house athletic races, obstacle courses, gymnastics, and teamwork competitions for all grades.',
      },
      {
        id: 'dec-2',
        day: 14,
        title: 'Mid-Year Academic Review & Assessments',
        category: 'Academic',
        time: '8:00 AM – 12:30 PM',
        location: 'Academic Classrooms',
        description:
          'Formative term assessments reviewing core numeracy, bilingual literacy, and scientific understanding across Primary classes.',
      },
      {
        id: 'dec-3',
        day: 22,
        title: 'Winter Science & Arts Exhibition',
        category: 'STEM & Arts',
        time: '9:00 AM – 1:30 PM',
        location: 'Main Exhibition Hall',
        description:
          'Grand showcase of student scientific models, robotics inventions, creative canvas art, and environmental science projects.',
      },
      {
        id: 'dec-4',
        day: 25,
        title: 'Quaid-e-Azam Day Observance',
        category: 'National Holiday',
        time: 'Full Day',
        location: 'All Campuses',
        description:
          'Commemoration honoring the Founder of Pakistan, Quaid-e-Azam Muhammad Ali Jinnah. School campus remains closed.',
      },
    ],
    // October (Month 9)
    9: [
      {
        id: 'oct-1',
        day: 5,
        title: 'Eid Milad-un-Nabi Observance',
        category: 'Islamic & Cultural',
        time: '8:30 AM – 12:30 PM',
        location: 'School Courtyard',
        description:
          'Special Seerah gathering featuring Quranic recitations, heartfelt Naat presentations, and moral discourses honoring Prophet Muhammad (SAW).',
      },
      {
        id: 'oct-2',
        day: 12,
        title: 'Montessori Sensory & Discovery Day',
        category: 'Early Years',
        time: '9:00 AM – 11:30 AM',
        location: 'Montessori Junior Wing',
        description:
          'Interactive sensory exploration day for Playgroup and Nursery students using tactile wooden blocks and Montessori motor manipulatives.',
      },
      {
        id: 'oct-3',
        day: 20,
        title: 'Parent-Teacher Meeting (PTM)',
        category: 'Academic',
        time: '8:30 AM – 1:30 PM',
        location: 'Main Academic Block',
        description:
          'Mid-term individual consultations between parents and class teachers to review academic performance and foundational milestones.',
      },
      {
        id: 'oct-4',
        day: 28,
        title: 'Inter-House Speech & Qira’at Contest',
        category: 'Co-Curricular',
        time: '10:00 AM – 12:30 PM',
        location: 'Campus Auditorium',
        description:
          'Bilingual declamation contest in Urdu and English alongside a formal Tajweed recitation competition across all houses.',
      },
    ],
  };

  if (schedulesByMonth[month]) {
    return schedulesByMonth[month];
  }

  // Fallback realistic milestones for any month in the academic calendar
  return [
    {
      id: `gen-${month}-1`,
      day: 8,
      title: 'Montessori Cognitive & Creative Workshop',
      category: 'Early Years',
      time: '9:00 AM – 11:30 AM',
      location: 'Activity Center',
      description:
        'Hands-on experiential learning session focusing on motor dexterity, phonics, and sensory discovery.',
    },
    {
      id: `gen-${month}-2`,
      day: 15,
      title: 'Monthly Academic Review & Progress Assessment',
      category: 'Academic',
      time: '8:30 AM – 1:00 PM',
      location: 'Main Academic Block',
      description:
        'Consultations between parents and educators reviewing student academic progress and character development.',
    },
    {
      id: `gen-${month}-3`,
      day: 22,
      title: 'STEM Discovery & Practical Science Lab',
      category: 'STEM & Innovation',
      time: '9:30 AM – 12:30 PM',
      location: 'Science & Robotics Lab',
      description:
        'Applied robotics models and scientific experimentation in our modern school activity laboratory.',
    },
  ];
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function EventCalendar() {
  // Real-time dynamic current date initialization
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [today, setToday] = useState(null);
  const [activeEventId, setActiveEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [liveEvents, setLiveEvents] = useState([]);

  // Client-side synchronization to detect exact user local time
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
  }, []);

  // Fetch dynamic events from database
  useEffect(() => {
    async function fetchCalendarEvents() {
      try {
        const res = await fetch('/api/events');
        if (res.ok) {
          const json = await res.json();
          if (json.data && Array.isArray(json.data)) {
            const mapped = json.data.map((evt) => {
              const d = new Date(evt.date);
              return {
                id: evt._id,
                year: d.getFullYear(),
                month: d.getMonth(),
                day: d.getDate(),
                title: evt.title,
                category: evt.type === 'event' ? 'Campus Event' : 'Campus News',
                time: 'Scheduled Event',
                location: 'Torcia Campus',
                description: evt.description,
              };
            });
            setLiveEvents(mapped);
          }
        }
      } catch (err) {
        console.error('Failed to load events for calendar:', err);
      }
    }
    fetchCalendarEvents();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Determine if the calendar is currently showing today's month & year
  const isCurrentMonthView =
    today !== null &&
    year === today.getFullYear() &&
    month === today.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setActiveEventId(null);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setActiveEventId(null);
  };

  const handleResetToday = () => {
    const now = today || new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setActiveEventId(null);
  };

  // Merge live database events with institutional monthly schedule
  const currentMonthLive = liveEvents.filter(
    (e) => e.year === year && e.month === month
  );
  const defaultEvents = getMonthlySchedule(year, month);
  const monthEvents = [
    ...currentMonthLive,
    ...defaultEvents.filter(
      (def) => !currentMonthLive.some((live) => live.day === def.day)
    ),
  ].sort((a, b) => a.day - b.day);

  // Sync selected event spotlight whenever month or events change
  useEffect(() => {
    if (monthEvents.length > 0) {
      const todayDate = today ? today.getDate() : new Date().getDate();
      const isCurrent =
        today !== null &&
        year === today.getFullYear() &&
        month === today.getMonth();
      const todayEvent = isCurrent
        ? monthEvents.find((e) => e.day === todayDate)
        : null;
      setSelectedEvent(todayEvent || monthEvents[0]);
    } else {
      setSelectedEvent(null);
    }
  }, [month, year, liveEvents, today]);

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.25)] rounded-2xl p-4 sm:p-6 lg:p-8 transition-all duration-300">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 sm:pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isCurrentMonthView ? 'bg-emerald-500 animate-pulse' : 'bg-[#A01A22]'
              }`}
            ></span>
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#A01A22]">
              {isCurrentMonthView ? 'Active Term • Real-Time Calendar' : 'Campus Event Schedule'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-serif text-gray-900 tracking-tight mt-0.5">
            {MONTH_NAMES[month]} {year}
          </h3>
          <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-0.5">
            Hover over or click highlighted dates to view scheduled campus activities.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetToday}
            className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold active:scale-95 transition-all flex items-center gap-1.5 shadow-xs ${
              isCurrentMonthView
                ? 'bg-red-50 text-[#A01A22] border border-red-200'
                : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-[#A01A22] border border-gray-200'
            }`}
            title="Jump back to the current real-time month"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isCurrentMonthView ? 'bg-[#A01A22] animate-pulse' : 'bg-gray-400'
              }`}
            ></span>
            <span>Today</span>
          </button>

          <div className="flex items-center bg-gray-100 rounded-full p-0.5 border border-gray-200">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded-full text-gray-700 hover:bg-white hover:text-red-700 transition shadow-xs active:scale-90"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-full text-gray-700 hover:bg-white hover:text-red-700 transition shadow-xs active:scale-90"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 md:gap-3 py-2.5 text-center">
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={d}
            className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider ${
              i === 0 || i === 5 ? 'text-red-700 font-extrabold' : 'text-gray-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Monthly Dates Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5 md:gap-3">
        {/* Previous Month Padding Days */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => {
          const dayNum = prevMonthDays - firstDayIndex + idx + 1;
          return (
            <div
              key={`prev-${idx}`}
              className="min-h-[75px] sm:min-h-[90px] p-2 sm:p-2.5 flex flex-col gap-1 rounded-xl bg-gray-100/50 text-gray-400 border border-gray-200/70 select-none opacity-50 pointer-events-none"
            >
              <span className="text-xs sm:text-sm font-semibold">{dayNum}</span>
            </div>
          );
        })}

        {/* Current Month Days */}
        {Array.from({ length: totalDaysInMonth }).map((_, idx) => {
          const day = idx + 1;
          const dayEvents = monthEvents.filter((e) => e.day === day);
          const hasEvent = dayEvents.length > 0;
          const event = hasEvent ? dayEvents[0] : null;
          const isSelected = hasEvent && selectedEvent?.id === event?.id;
          const isHovered = hasEvent && activeEventId === event?.id;

          // Check if this date is today in real-time
          const isToday =
            today !== null &&
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate();

          // Determine horizontal pop-up alignment based on column index (0-6)
          const colIndex = (firstDayIndex + idx) % 7;
          let popoverPositionClass = 'left-1/2 -translate-x-1/2';
          if (colIndex <= 1) {
            popoverPositionClass = 'left-0 translate-x-0';
          } else if (colIndex >= 5) {
            popoverPositionClass = 'right-0 left-auto translate-x-0';
          }

          // Determine vertical pop-up direction (top row vs lower rows)
          const rowIndex = Math.floor((firstDayIndex + idx) / 7);
          const isTopRow = rowIndex <= 0;
          const popoverVerticalClass = isTopRow ? 'top-full mt-2' : 'bottom-full mb-2';

          return (
            <div
              key={`curr-${day}`}
              className="relative"
              onMouseEnter={() => hasEvent && setActiveEventId(event.id)}
              onMouseLeave={() => hasEvent && setActiveEventId(null)}
            >
              <button
                type="button"
                onClick={() => {
                  if (hasEvent) {
                    setSelectedEvent(event);
                    setActiveEventId(event.id);
                  }
                }}
                className={`w-full min-h-[75px] sm:min-h-[90px] p-2 sm:p-2.5 flex flex-col gap-1 justify-between text-left transition-all duration-200 rounded-xl ${
                  isToday
                    ? `border-2 border-red-600 bg-gradient-to-b from-red-50/95 via-white to-red-50/40 shadow-md ring-2 ring-red-500/40 hover:shadow-lg hover:border-red-700 ${
                        isSelected ? 'ring-3 ring-red-700' : ''
                      }`
                    : hasEvent
                    ? `border-2 border-red-500 bg-red-50 shadow-sm hover:shadow-md hover:border-red-600 ${
                        isSelected ? 'ring-2 ring-red-700' : ''
                      }`
                    : 'border border-gray-300 bg-white shadow-2xs hover:shadow-sm hover:border-red-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm ${
                      isToday
                        ? 'font-extrabold text-[#A01A22] flex items-center gap-1'
                        : hasEvent
                        ? 'text-red-700 font-bold'
                        : 'text-gray-700 font-semibold'
                    }`}
                  >
                    {day}
                  </span>

                  {isToday ? (
                    <span className="inline-flex items-center gap-1 bg-[#A01A22] text-white px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Today
                    </span>
                  ) : hasEvent ? (
                    <span className="hidden sm:inline-block bg-red-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-2xs leading-tight">
                      Event
                    </span>
                  ) : null}
                </div>

                {/* Event Preview or Today Indicator */}
                {hasEvent ? (
                  <div className="w-full mt-0.5 flex items-center min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block mr-1 shrink-0" />
                    <span className="text-[10px] sm:text-xs font-semibold text-red-950 truncate leading-tight">
                      {event.title}
                    </span>
                  </div>
                ) : isToday ? (
                  <div className="w-full mt-0.5 flex items-center min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold text-red-800/80 italic">
                      Current Day
                    </span>
                  </div>
                ) : (
                  <div className="h-1" />
                )}
              </button>

              {/* Hover Pop-up Tooltip Card */}
              <AnimatePresence>
                {isHovered && event && (
                  <motion.div
                    initial={{ opacity: 0, y: isTopRow ? -8 : 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: isTopRow ? -6 : 6, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className={`absolute ${popoverVerticalClass} ${popoverPositionClass} w-72 sm:w-80 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-100 rounded-xl p-3.5 sm:p-4 z-50 text-left pointer-events-none`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5 pb-1.5 border-b border-gray-100">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wide uppercase bg-red-100 text-red-800">
                        <Sparkles className="w-3 h-3 text-[#A01A22]" />
                        {event.category}
                      </span>
                      <span className="text-[11px] sm:text-xs font-extrabold text-[#A01A22]">
                        {MONTH_NAMES[month].slice(0, 3)} {day}, {year}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold font-serif text-gray-900 leading-snug mb-1">
                      {event.title}
                    </h4>

                    <div className="space-y-0.5 mb-2 text-[11px] sm:text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-[#A01A22] shrink-0" />
                        <span className="font-semibold text-gray-800">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed font-normal bg-gray-50/80 rounded-lg p-2 border border-gray-100">
                      {event.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Legend & Selected Event Spotlight */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Visual Legend */}
        <div className="flex items-center flex-wrap gap-3 sm:gap-4 text-[11px] sm:text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A01A22] ring-2 ring-red-200"></span>
            <span className="font-semibold text-gray-800">Campus Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200"></span>
            <span className="font-semibold text-gray-800">Today</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span>Regular Academic Day</span>
          </div>
        </div>

        {/* Selected Event Quick Info */}
        {selectedEvent && (
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-700 bg-red-50/80 border border-red-200/60 rounded-full px-3 py-1">
            <Info className="w-3.5 h-3.5 text-[#A01A22] shrink-0" />
            <span>
              <strong>Selected:</strong> {selectedEvent.title} (
              {MONTH_NAMES[month].slice(0, 3)} {selectedEvent.day})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
