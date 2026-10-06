'use client';

import { useState } from 'react';
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

const SAMPLE_EVENTS = [
  {
    id: 'evt-1',
    day: 5,
    title: 'Eid Milad-un-Nabi Observance',
    category: 'Islamic & Cultural',
    time: '8:30 AM – 12:30 PM',
    location: 'School Courtyard',
    description:
      'Special Seerah gathering featuring Quranic recitations, heartfelt Naat presentations, and moral discourses honoring the Prophet Muhammad (SAW).',
  },
  {
    id: 'evt-2',
    day: 10,
    title: 'Montessori Sensory & Discovery Day',
    category: 'Early Years',
    time: '9:00 AM – 11:30 AM',
    location: 'Montessori Junior Wing',
    description:
      'Interactive sensory exploration day for Playgroup and Nursery students using tactile wooden blocks and Montessori motor manipulatives.',
  },
  {
    id: 'evt-3',
    day: 15,
    title: 'Parent-Teacher Meeting (PTM)',
    category: 'Academic',
    time: '8:30 AM – 1:30 PM',
    location: 'Main Academic Block',
    description:
      'Mid-term individual consultations between parents and class teachers to review academic performance and foundational milestones.',
  },
  {
    id: 'evt-4',
    day: 22,
    title: 'Annual Science & STEM Robotics Fair',
    category: 'STEM & Innovation',
    time: '9:00 AM – 1:00 PM',
    location: 'Science Lab & Grounds',
    description:
      'Primary grade students showcase hands-on robotics models, working electrical circuits, and creative environmental science experiments.',
  },
  {
    id: 'evt-5',
    day: 28,
    title: "Inter-House Speech & Qira'at Contest",
    category: 'Co-Curricular',
    time: '10:00 AM – 12:30 PM',
    location: 'Campus Auditorium',
    description:
      'Bilingual declamation contest in Urdu and English alongside a formal Tajweed recitation competition across all houses.',
  },
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026
  const [activeEventId, setActiveEventId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(SAMPLE_EVENTS[0]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setActiveEventId(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setActiveEventId(null);
  };

  const handleResetToday = () => {
    setCurrentDate(new Date(2026, 9, 1)); // Set back to current Academic month (October 2026)
    setActiveEventId(null);
  };

  // Only show sample events in the active school month (October 2026) or allow preview
  const isTargetMonth = month === 9 && year === 2026;
  const monthEvents = isTargetMonth ? SAMPLE_EVENTS : [];

  return (
    <div className="w-full bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-6 sm:p-8 lg:p-10 transition-all duration-300">
      {/* Calendar Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A01A22] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#A01A22]">
              Campus Event Schedule
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-gray-900 tracking-tight mt-1">
            {monthNames[month]} {year}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Hover over or click highlighted dates to view scheduled campus activities.
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleResetToday}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all"
          >
            Current Term
          </button>
          <div className="flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
              type="button"
              onClick={handlePrevMonth}
              aria-label="Previous Month"
              className="p-1.5 rounded-full text-gray-700 hover:bg-white hover:text-red-700 transition shadow-sm active:scale-90"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next Month"
              className="p-1.5 rounded-full text-gray-700 hover:bg-white hover:text-red-700 transition shadow-sm active:scale-90"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-1 sm:gap-3 py-4 text-center">
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={d}
            className={`text-xs font-bold uppercase tracking-wider ${
              i === 0 || i === 5 ? 'text-red-700 font-extrabold' : 'text-gray-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Monthly Dates Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
        {/* Previous Month Padding Days */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => {
          const dayNum = prevMonthDays - firstDayIndex + idx + 1;
          return (
            <div
              key={`prev-${idx}`}
              className="aspect-square sm:aspect-[4/3] rounded-2xl p-1.5 sm:p-2.5 bg-gray-50/30 border border-transparent text-gray-300 text-xs flex flex-col justify-start items-center sm:items-start select-none opacity-40 pointer-events-none"
            >
              <span>{dayNum}</span>
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
          const popoverVerticalClass = isTopRow
            ? 'top-full mt-2.5'
            : 'bottom-full mb-2.5';

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
                className={`w-full aspect-square sm:aspect-[4/3] rounded-2xl p-1.5 sm:p-2.5 flex flex-col justify-between items-center sm:items-start transition-all duration-300 text-left ${
                  hasEvent
                    ? 'bg-red-50/80 hover:bg-red-100/90 border border-red-200 hover:border-red-400 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5'
                    : 'bg-gray-50/40 hover:bg-gray-100/60 border border-gray-100 text-gray-700'
                } ${isSelected ? 'ring-2 ring-[#A01A22] bg-red-100/80 shadow-md' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      hasEvent ? 'text-[#A01A22] font-bold' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </span>
                  {hasEvent && (
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#A01A22] text-white">
                      Event
                    </span>
                  )}
                </div>

                {/* Event Indicator Dot / Preview */}
                {hasEvent ? (
                  <div className="w-full flex items-center justify-center sm:justify-start gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#A01A22] shadow-[0_0_8px_rgba(160,26,34,0.6)] animate-pulse" />
                    <span className="hidden sm:inline-block text-[11px] font-medium text-gray-800 truncate max-w-[85%]">
                      {event.title}
                    </span>
                  </div>
                ) : (
                  <div className="h-2" />
                )}
              </button>

              {/* Hover Pop-up Tooltip Card (Framer Motion Micro-interaction) */}
              <AnimatePresence>
                {isHovered && event && (
                  <motion.div
                    initial={{ opacity: 0, y: isTopRow ? -8 : 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: isTopRow ? -6 : 6, scale: 0.95 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    className={`absolute ${popoverVerticalClass} ${popoverPositionClass} w-72 sm:w-80 bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-100 rounded-lg p-4 z-50 text-left pointer-events-none`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-red-100 text-red-800">
                        <Sparkles className="w-3 h-3 text-[#A01A22]" />
                        {event.category}
                      </span>
                      <span className="text-xs font-extrabold text-[#A01A22]">
                        {monthNames[month].slice(0, 3)} {day}, {year}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold font-serif text-gray-900 leading-snug mb-1.5">
                      {event.title}
                    </h4>

                    <div className="space-y-1 mb-2.5 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#A01A22] shrink-0" />
                        <span className="font-semibold text-gray-800">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-normal bg-gray-50/80 rounded-lg p-2 border border-gray-100">
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
      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Visual Legend */}
        <div className="flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A01A22]"></span>
            <span className="font-semibold text-gray-800">Campus Event</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span>Regular Academic Day</span>
          </div>
        </div>

        {/* Selected Event Quick Info */}
        {selectedEvent && (
          <div className="flex items-center gap-2 text-xs text-gray-700 bg-red-50/80 border border-red-200/60 rounded-full px-4 py-1.5">
            <Info className="w-3.5 h-3.5 text-[#A01A22] shrink-0" />
            <span>
              <strong>Selected:</strong> {selectedEvent.title} (
              {monthNames[month].slice(0, 3)} {selectedEvent.day})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

