import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Award,
  Users,
  HeartHandshake,
  Compass,
  Brain,
  ArrowRight,
  Quote,
} from 'lucide-react';
import HeroSlider from '@/components/HeroSlider';
import GalleryGrid from '@/components/GalleryGrid';
import AdmissionsPromo from '@/components/AdmissionsPromo';
import MotionCard from '@/components/MotionCard';
import { aboutImages } from '@/lib/schoolImages';

// The 6 Core Values
const coreValuesList = [
  {
    title: 'Integrity',
    desc: 'We do what is right, even when it is hard, grounding all action in moral honesty and truth.',
    icon: ShieldCheck,
  },
  {
    title: 'Excellence',
    desc: 'We strive for the highest standards in academics, character development, and daily conduct.',
    icon: Award,
  },
  {
    title: 'Respect',
    desc: 'We value every voice, background, and perspective, cultivating deep mutual empathy.',
    icon: Users,
  },
  {
    title: 'Compassion',
    desc: 'We care for our community, our society, and each other through active service and kindness.',
    icon: HeartHandshake,
  },
  {
    title: 'Leadership',
    desc: 'We empower students to lead with confidence, visionary purpose, and social responsibility.',
    icon: Compass,
  },
  {
    title: 'Innovation',
    desc: 'We embrace scientific curiosity, digital skills, and creative ideas to build a better future.',
    icon: Brain,
  },
];

// Academic Progression Cards
const progressionTiers = [
  {
    title: 'Early Years Foundation',
    grades: 'Playgroup & Nursery',
    age: 'Ages 3 – 4',
    desc: 'Sensory discovery, Montessori manipulatives, fine motor skills, and gentle social habits.',
    image: '/images/home/early_years.jpg',
    href: '/academics',
  },
  {
    title: 'Kindergarten & Prep',
    grades: 'KG-I & KG-II',
    age: 'Ages 4 – 6',
    desc: 'Phonics, early numeracy, bilingual foundation, creative arts, and moral Islamic etiquette.',
    image: '/images/home/kindergarten.jpg',
    href: '/academics',
  },
  {
    title: 'Primary School',
    grades: 'Class I to Class V',
    age: 'Ages 6 – 11',
    desc: 'Rigorous STEM inquiry, mathematical problem solving, English & Urdu fluency, and IT literacy.',
    image: '/images/home/primary.jpg',
    href: '/academics',
  },
  {
    title: 'STEM & Digital Skills',
    grades: 'Activity Lab & Robotics',
    age: 'All Primary Grades',
    desc: 'Practical experiments, robotics exploration, digital fluency, and interactive computer science.',
    image: '/images/home/stem.jpg',
    href: '/academics',
  },
];

export default function HomePage() {
  return (
    <div className="relative z-10 w-full bg-transparent">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "The Torcia School",
            "description": "Providing quality education from Playgroup to Class V.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Plot # 20/13 Block 5C near Abbasi Shaheed Hospital",
              "addressLocality": "Nazimabad, Karachi",
              "addressRegion": "Sindh",
              "addressCountry": "PK"
            },
            "telephone": "0342-2049976",
            "email": "thetorciaschool@gmail.com"
          })
        }}
      />
      {/* 1. Full-Width Automatic Image Slider (Cross-fade Carousel) */}
      <HeroSlider />

      {/* 2. Values That Shape Great Minds (Soft Off-White Section, High-Depth Cards) */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Strictly Left-Aligned */}
          <div className="max-w-3xl mb-8 text-left">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
              OUR CORE VALUES
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Values That Shape Great Minds
            </h2>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full my-3"></div>
            <p className="text-gray-900 text-sm sm:text-base leading-relaxed font-normal">
              We believe that strong values build strong individuals. Our core principles guide every decision, every lesson, and every step of the journey.
            </p>
          </div>

          {/* 6 High-Depth Value Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8 items-stretch">
            {coreValuesList.map((val, idx) => {
              const Icon = val.icon;
              return (
                <MotionCard key={val.title} index={idx} className="h-full">
                  <Link
                    href="/about"
                    className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl p-4 md:p-8 flex flex-col justify-between h-full"
                  >
                    <div className="flex-grow">
                      {/* Minimalist Red Icon Container */}
                      <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-50 text-[#A01A22] flex items-center justify-center mb-3 md:mb-6 shadow-sm group-hover:bg-[#A01A22] group-hover:text-white transition-colors duration-300">
                        <Icon className="w-4 h-4 md:w-6 md:h-6 stroke-[2]" />
                      </div>

                      <h3 className="text-sm font-bold md:text-xl text-gray-900 tracking-tight mb-1.5 md:mb-3 group-hover:text-red-700 transition-colors">
                        {val.title}
                      </h3>

                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed font-normal line-clamp-3">
                        {val.desc}
                      </p>
                    </div>
                  </Link>
                </MotionCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Academic Progression (Soft Off-White Section, High-Depth Cards) */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header with View All Link - Strictly Left-Aligned */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 text-left">
            <div className="max-w-2xl">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
                ACADEMIC PROGRESSION
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                A Journey of Continuous Growth
              </h2>
              <div className="w-14 h-1 bg-[#A01A22] rounded-full my-3"></div>
              <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
                From foundational learning to future-ready skills, our academic journey is designed to help every student reach their full potential.
              </p>
            </div>

            <Link
              href="/academics"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-[#A01A22] hover:text-[#87131A] active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1 self-start md:self-end"
            >
              <span>View All Programs</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Progression Cards Grid with High Depth */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 items-stretch">
            {progressionTiers.map((tier, idx) => (
              <MotionCard key={tier.title} index={idx} className="h-full">
                <Link
                  href={tier.href}
                  className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden flex flex-col h-full"
                >
                  {/* Fixed Aspect Ratio Container with Next.js Image */}
                  <div className="relative w-full aspect-[4/3] md:aspect-video overflow-hidden">
                    <Image
                      src={tier.image}
                      alt={tier.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    {/* Bottom Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex items-end p-2.5 sm:p-4">
                      <div className="w-full flex items-center justify-between text-white">
                        <div>
                          <h3 className="font-bold text-xs sm:text-base tracking-tight text-white group-hover:text-red-200 transition-colors">
                            {tier.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs text-white/85">{tier.grades}</p>
                        </div>

                        {/* Circular Red Arrow Button */}
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#A01A22] text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#87131A] transition-all duration-300 shadow-md">
                          <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Text Content */}
                  <div className="p-3 md:p-5 flex-1 flex flex-col justify-between space-y-1.5 md:space-y-3 flex-grow">
                    <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-[#A01A22] group-hover:text-red-700 transition-colors">
                      {tier.age}
                    </span>
                    <p className="text-xs text-gray-700 leading-relaxed line-clamp-2 md:line-clamp-3">
                      {tier.desc}
                    </p>
                  </div>
                </Link>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About The Torcia School (Soft Off-White Section, High-Depth Card) */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Unified Master Card: Legacy of Learning */}
          <MotionCard index={0} className="w-full">
            <div className="flex flex-col md:flex-row md:h-[480px] bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden">
              {/* Left: 40% Width Image Container with proper fit */}
              <div className="relative w-full md:w-2/5 aspect-video md:aspect-auto md:h-full md:min-h-full bg-gray-900">
                <Image
                  src={aboutImages.campusBuilding?.src || '/images/admissions-promo-16x9.jpg'}
                  alt="The Torcia School Nazimabad Campus"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-contain md:object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent hidden md:flex items-end p-6">
                  <div className="text-white">
                    <span className="text-xs uppercase font-bold tracking-wider text-red-200 block">
                      Purpose-Built Facility
                    </span>
                    <h3 className="text-sm sm:text-base font-bold">Plot # 20/13 Block 5C, Nazimabad Karachi</h3>
                  </div>
                </div>
              </div>

              {/* Right: 60% Width Text & Stats Container */}
              <div className="w-full md:w-3/5 p-4 sm:p-6 md:p-12 flex flex-col justify-center space-y-3 md:space-y-5 text-left">
                <div>
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
                    ABOUT THE TORCIA SCHOOL
                  </span>
                  <h2 className="text-2xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
                    A Legacy of Learning, A Future of Leaders
                  </h2>
                  <div className="w-14 h-1 bg-[#A01A22] rounded-full my-2 md:my-3"></div>
                </div>

                <p className="text-sm md:text-base text-gray-700 leading-relaxed font-normal">
                  The Torcia School is more than an institution — it’s a community where curiosity is encouraged, talents are nurtured, and every student is inspired to achieve greatness.
                </p>

                {/* 3 Metric Counters */}
                <div className="grid grid-cols-3 gap-2 md:gap-8 pt-2.5 pb-2.5 md:pt-3 md:pb-3 border-y border-gray-200/60">
                  <div>
                    <div className="text-xl sm:text-2xl md:text-4xl font-black text-[#A01A22] tracking-tight">10+</div>
                    <div className="text-[11px] leading-tight md:text-sm font-bold text-gray-700 mt-0.5 md:mt-1">Years of Excellence</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl md:text-4xl font-black text-[#A01A22] tracking-tight">500+</div>
                    <div className="text-[11px] leading-tight md:text-sm font-bold text-gray-700 mt-0.5 md:mt-1">Happy Students</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl md:text-4xl font-black text-[#A01A22] tracking-tight">50+</div>
                    <div className="text-[11px] leading-tight md:text-sm font-bold text-gray-700 mt-0.5 md:mt-1">Dedicated Faculty</div>
                  </div>
                </div>

                <div className="pt-1">
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-semibold text-xs md:text-sm shadow-xl active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1"
                  >
                    <span>Learn More About Us</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </MotionCard>
        </div>
      </section>

      {/* 5. What Parents Say / Testimonials (Strictly Left-Aligned Heading & Compact Spacing) */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header - Strictly Left-Aligned */}
          <div className="max-w-3xl mb-4 md:mb-8 text-left">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1">
              WHAT PARENTS SAY
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Trusted by Families, Loved by Students
            </h2>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full my-2 md:my-3"></div>
            <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
              Hear firsthand experiences from parents who entrust their children's formative education and character development to us.
            </p>
          </div>

          {/* Testimonial Card - High Depth and Left-Aligned Structure */}
          <MotionCard index={0} className="max-w-4xl">
            <div className="bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 p-4 sm:p-8 md:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-red-50 relative shrink-0 border-2 border-[#A01A22] shadow-md">
                <Image
                  src="/images/14.jpeg"
                  alt="Parent Testimonial"
                  fill
                  className="object-cover object-center"
                />
              </div>

              <div className="space-y-2 sm:space-y-3 text-left">
                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-[#A01A22] opacity-80" />
                <p className="text-sm sm:text-lg text-gray-700 leading-relaxed italic font-normal">
                  "The Torcia School has given my child the confidence, knowledge, and values to build a bright future. We are grateful for the amazing teachers and supportive campus community."
                </p>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-gray-900">Sarah Ahmed</h4>
                  <p className="text-[11px] sm:text-xs text-[#A01A22] font-semibold">Parent of Grade 3 Student • Nazimabad</p>
                </div>
              </div>
            </div>
          </MotionCard>
        </div>
      </section>

      {/* 5.5. Admissions Promo Banner CTA */}
      <section className="bg-transparent py-8 lg:py-12 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionCard index={0}>
            <AdmissionsPromo />
          </MotionCard>
        </div>
      </section>

      {/* 6. Campus Gallery Grid (Soft Off-White Section) */}
      <section className="bg-transparent py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid limit={6} />
        </div>
      </section>
    </div>
  );
}

