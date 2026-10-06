import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Compass, Target } from 'lucide-react';
import GalleryGrid from '@/components/GalleryGrid';
import MotionCard from '@/components/MotionCard';
import { aboutImages } from '@/lib/schoolImages';

export const metadata = {
  title: 'About Us | The Torcia School',
  description: 'Learn about the mission, vision, campus and foundational values of The Torcia School in Karachi.',
};

export default function AboutPage() {
  return (
    <div className="w-full bg-transparent">
      {/* 1. Header Banner & Campus Heritage */}
      <section className="bg-transparent py-10 sm:py-12 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
              ABOUT THE TORCIA SCHOOL
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Nurturing Character, Intellect &amp; Purpose
            </h1>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full mx-auto my-3"></div>
            <p className="text-gray-900 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Located in Nazimabad, Karachi, The Torcia School represents a torch of enlightenment dedicated to raising principled, high-achieving youth.
            </p>
          </div>

          <MotionCard index={0} className="w-full">
            <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 sm:p-8 lg:p-12 hover:-translate-y-2 transition-all duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
              <div className="lg:col-span-6 space-y-4 md:space-y-6">
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
                    OUR IDENTITY &amp; PHILOSOPHY
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    A Beacon of Quality Education in Karachi
                  </h2>
                  <div className="w-14 h-1 bg-[#A01A22] rounded-full my-2 md:my-3"></div>
                </div>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                  The Torcia School is established on the conviction that early childhood and primary education must develop not only sharp minds, but strong moral foundations grounded in social responsibility and Islamic values.
                </p>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                  Our Nazimabad campus is equipped with purpose-built classrooms, modern learning manipulatives, and compassionate, certified teachers who nurture each child's individual strengths.
                </p>

                {/* Badges */}
                <div className="grid grid-cols-2 gap-3 sm:gap-5 pt-1 md:pt-3">
                  <div className="p-3.5 sm:p-5 bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl">
                    <span className="text-xl sm:text-3xl font-black text-gray-900 tracking-tight">Playgroup</span>
                    <p className="text-[11px] sm:text-xs text-gray-700 mt-1 font-semibold">To Class V (Primary)</p>
                  </div>
                  <div className="p-3.5 sm:p-5 rounded-2xl bg-red-50/70 border border-red-100/50 shadow-sm">
                    <span className="text-xl sm:text-3xl font-black text-[#A01A22] tracking-tight">7 Core</span>
                    <p className="text-[11px] sm:text-xs text-[#A01A22] mt-1 font-semibold">Foundational Pillars</p>
                  </div>
                </div>
              </div>

              {/* Campus Building Photo */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl w-full aspect-video md:aspect-video border border-gray-100 bg-gray-900">
                  <Image
                    src="/images/admissions-promo-16x9.jpg"
                    alt="The Torcia School Admissions Open"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="w-full h-full object-contain md:object-cover object-center"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </MotionCard>
        </div>
      </section>

      {/* 3. Mission & Vision */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-3xl mb-8">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
              OUR GUIDING LIGHT
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Mission &amp; Vision
            </h2>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full my-3"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-8 lg:gap-10">
            {/* Mission Card */}
            <MotionCard index={0} className="h-full">
              <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 md:p-8 sm:p-10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full">
                <div className="space-y-2 md:space-y-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-50 text-[#A01A22] flex items-center justify-center shadow-sm">
                    <Target className="w-4 h-4 md:w-6 md:h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-bold font-serif text-gray-900 tracking-tight">Our Mission</h3>
                  <p className="text-xs md:text-base text-gray-900 leading-relaxed font-semibold line-clamp-3 md:line-clamp-none">
                    "To provide quality education in a disciplined, values-based environment that nurtures knowledge, character, and social responsibilities."
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal line-clamp-3 md:line-clamp-none">
                    We cultivate an environment where students acquire sound academic knowledge alongside a deep sense of social responsibility, integrity, and personal accountability.
                  </p>
                </div>
              </div>
            </MotionCard>

            {/* Vision Card */}
            <MotionCard index={1} className="h-full">
              <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 md:p-8 sm:p-10 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-full">
                <div className="space-y-2 md:space-y-4">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-50 text-[#A01A22] flex items-center justify-center shadow-sm">
                    <Compass className="w-4 h-4 md:w-6 md:h-6 stroke-[2]" />
                  </div>
                  <h3 className="text-sm md:text-2xl font-bold font-serif text-gray-900 tracking-tight">Our Vision</h3>
                  <p className="text-xs md:text-base text-gray-900 leading-relaxed font-semibold line-clamp-3 md:line-clamp-none">
                    "To build an educated and morally strong youth for the betterment of society and the revival of Islam."
                  </p>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal line-clamp-3 md:line-clamp-none">
                    Our vision guides us to produce young men and women of high moral caliber who excel in science, language, and technology while upholding the enduring principles of Islam.
                  </p>
                </div>
              </div>
            </MotionCard>
          </div>
        </div>
      </section>

      {/* 4. Values Tree Graphic Showcase */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionCard index={0} className="w-full">
            <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 sm:p-8 lg:p-12 hover:-translate-y-2 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center">
                <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-video md:aspect-video shadow-md border border-gray-100 bg-gray-900">
                  <Image
                  src="/images/about/roots_of_virtue.jpg"
                  alt="The Torcia School Roots of Virtue"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="w-full h-full object-contain md:object-cover object-center"
                />
              </div>

              <div className="lg:col-span-7 space-y-4 md:space-y-6">
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
                    THE TORCIA METAPHOR
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    Roots of Virtue, Branches of Leadership
                  </h2>
                  <div className="w-14 h-1 bg-[#A01A22] rounded-full my-2 md:my-3"></div>
                </div>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                  Just as a grand tree draws nourishment from deep roots, a child's intellect blooms when anchored in virtue, confidence, learning, and creativity.
                </p>

                <div className="grid grid-cols-2 gap-2.5 md:gap-4 pt-2">
                  {[
                    { name: 'Confidence', desc: 'Instilling self-assurance and expressive public speaking.' },
                    { name: 'Continuous Learning', desc: 'Fostering inquiry and intellectual curiosity.' },
                    { name: 'Creativity', desc: 'Encouraging original thinking and problem solving.' },
                    { name: 'Moral Leadership', desc: 'Rooted in Islamic character and social ethics.' },
                  ].map((item) => (
                    <div key={item.name} className="p-3 md:p-4 bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl">
                      <h4 className="text-xs md:text-sm font-bold text-[#A01A22] tracking-tight">{item.name}</h4>
                      <p className="text-[11px] md:text-xs text-gray-700 mt-1 leading-relaxed font-normal line-clamp-2 md:line-clamp-none">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionCard>
        </div>
      </section>

      {/* 4.5 Campus Infrastructure & Virtual Campus Tour with Ken Burns Effect */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionCard index={0} className="w-full">
            <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 sm:p-8 lg:p-12 overflow-hidden">
              <div className="max-w-3xl mb-4 md:mb-8">
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
                  CAMPUS INFRASTRUCTURE
                </span>
                <h2 className="text-2xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                  Virtual Campus Experience
                </h2>
                <div className="w-14 h-1 bg-[#A01A22] rounded-full my-2 md:my-3"></div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                  Take a cinematic glimpse into our purposeful learning spaces, modern air-conditioned classrooms, sensory activity zones, and secure campus perimeter.
                </p>
              </div>

              {/* Cinematic Ken Burns Viewport */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 group">
                {/* Ken Burns Animated Image */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src="/images/about/classrooms.jpg"
                    alt="The Torcia School Campus Infrastructure"
                    fill
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover object-center w-full h-full animate-kenburns"
                    priority
                  />
                </div>

                {/* Subtle Gradient Overlays for Cinematic Feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating On-Screen Badges & Overlay Details */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    Live Campus View
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-lg">
                    Plot 20/13 Block 5C Nazimabad
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
                  <div className="max-w-xl">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-yellow-300 block mb-1">
                      Safe, Modern &amp; Nurturing Environment
                    </span>
                    <h3 className="text-lg sm:text-2xl font-bold font-serif leading-snug drop-shadow-md">
                      Interactive Classrooms &amp; Practical Exploration Wings
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 line-clamp-2 mt-1 font-medium drop-shadow">
                      Designed with child ergonomics, natural airflow, CCTV security monitoring, and activity-based learning stations.
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <Link
                      href="/contact"
                      className="px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-xs hover:bg-[#A01A22] hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      Book In-Person Tour
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </MotionCard>
        </div>
      </section>

      {/* 5. Campus Photo Gallery */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>

      {/* 6. Campus Contact CTA */}
      <section className="bg-transparent py-12 lg:py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionCard index={0} className="w-full">
            <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 sm:p-8 md:p-10 space-y-3 sm:space-y-5">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
                VISIT OUR CAMPUS
              </span>
              <h2 className="text-2xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                Experience The Torcia School in Person
              </h2>
              <div className="w-14 h-1 bg-[#A01A22] rounded-full mx-auto my-2 md:my-3"></div>
              <p className="text-gray-700 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Visit our campus at Plot # 20/13 Block 5C near Abbasi Shaheed Hospital, Nazimabad Karachi to tour our facilities and meet our academic faculty.
              </p>
              <div className="pt-2 sm:pt-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-semibold text-xs sm:text-sm shadow-xl active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1"
                >
                  <span>Get in Touch with Admissions</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </MotionCard>
        </div>
      </section>
    </div>
  );
}

