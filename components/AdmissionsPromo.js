'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Sparkles, ArrowRight, Calendar } from 'lucide-react';

export default function AdmissionsPromo({
  className = '',
  bgImage = '/images/3.jpeg',
  title = 'ADMISSIONS OPEN!',
  subtitle = 'Enroll Now for the New Academic Year!',
  phoneNumber = '0342-2049976',
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl bg-gray-900 flex flex-col items-center justify-between text-center ${className}`}
    >
      {/* Background Image Layer */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <Image
          src={bgImage}
          alt="The Torcia School Admissions"
          fill
          sizes="(max-width: 768px) 100vw, 1200px"
          className="object-cover object-center filter brightness-[0.85]"
          priority
        />
        {/* Dark Gradient Overlay for optimal text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/85 backdrop-blur-[1px]" />
      </div>

      {/* Main Promotional Content */}
      <div className="relative z-10 w-full p-4 md:p-8 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-3 md:space-y-6">
        {/* Overline Badge */}
        <div className="inline-flex items-center gap-1.5 py-1 px-2.5 md:py-2 md:px-4 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] md:text-sm font-semibold tracking-widest uppercase shadow-md">
          <Sparkles className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-yellow-300" />
          <span>The Torcia School • Session 2026–2027</span>
        </div>

        {/* 1. Main Heading with Yellow/Red Typography & Deep Shadow (Hidden on Mobile to Prevent Image Clashes) */}
        <h2 className="hidden md:block text-3xl sm:text-5xl md:text-6xl font-black text-yellow-400 tracking-tight uppercase drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none select-none">
          {title}
        </h2>

        {/* 2. Red Ribbon / Banner Pill (Hidden on Mobile) */}
        <div className="hidden md:inline-block transform -rotate-1 hover:rotate-0 transition-transform duration-300">
          <div className="bg-[#A01A22] text-white px-5 sm:px-8 py-2 sm:py-2.5 rounded-full font-extrabold text-xs sm:text-sm md:text-base tracking-wider uppercase shadow-[0_8px_25px_rgba(160,26,34,0.6)] border border-red-400/40">
            {subtitle}
          </div>
        </div>

        {/* Educational Scope Descriptor */}
        <p className="text-white/90 text-xs leading-tight md:text-base max-w-2xl font-medium drop-shadow-md">
          Nurturing curiosity, strong moral values, and academic excellence from early sensory discovery to primary leadership.
        </p>

        {/* 3. Interactive Program Level Buttons */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 pt-1 md:pt-2">
          {/* Orange Gradient Button: Playgroup */}
          <Link
            href="/admissions"
            className="group px-3 py-1.5 text-[11px] md:px-6 md:py-3 md:text-base rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold tracking-wide shadow-lg hover:shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
          >
            <span>Playgroup</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Green Gradient Button: Montessori */}
          <Link
            href="/admissions"
            className="group px-3 py-1.5 text-[11px] md:px-6 md:py-3 md:text-base rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold tracking-wide shadow-lg hover:shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
          >
            <span>Montessori</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Blue Gradient Button: Primary */}
          <Link
            href="/admissions"
            className="group px-3 py-1.5 text-[11px] md:px-6 md:py-3 md:text-base rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold tracking-wide shadow-lg hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5"
          >
            <span>Primary (Class I – V)</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 4. Contact & Tour Footer Strip */}
      <div className="relative z-10 w-full bg-[#87131A]/95 sm:bg-[#87131A]/90 backdrop-blur-md py-2 md:py-4 px-3 sm:px-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-white text-xs md:text-lg font-semibold tracking-wide">
        <span className="uppercase tracking-wider font-extrabold text-yellow-300">
          BOOK A CAMPUS TOUR TODAY!
        </span>
        <span className="hidden sm:inline-block text-white/40">•</span>
        <a
          href={`tel:${phoneNumber.replace(/-/g, '')}`}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-white hover:text-yellow-300 transition-colors font-bold group"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-red-900 transition-colors">
            <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span>{phoneNumber}</span>
        </a>
      </div>
    </div>
  );
}
