import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Lightbulb, Monitor, Shield, ArrowRight, Check } from 'lucide-react';
import AdmissionsPromo from '@/components/AdmissionsPromo';
import MotionCard from '@/components/MotionCard';

export const metadata = {
  title: 'Academics | The Torcia School',
  description: 'Academic programs from Playgroup to Class V at The Torcia School, Karachi.',
};

const classLevels = [
  {
    grade: 'Playgroup & Nursery',
    tier: 'Early Years',
    age: 'Ages 3 – 4',
    image: '/images/academics/playgroup.jpg',
    focus: 'Sensory discovery, motor skills, social habits, early language exposure and phonics.',
    curriculum: ['Montessori-inspired play', 'Pre-writing & Fine Motor Activities', 'Rhymes & Phonics', 'Islamic Manners (Adab)'],
  },
  {
    grade: 'Kindergarten (KG-I & KG-II)',
    tier: 'Pre-Primary',
    age: 'Ages 4 – 6',
    image: '/images/academics/kindergarten.jpg',
    focus: 'Early literacy and numeracy, foundational Urdu & English reading, and cognitive thinking.',
    curriculum: ['English & Urdu Phonics', 'Basic Math Concepts & Numbers', 'General Knowledge & Science Discovery', 'Daily Dua & Islamic Stories'],
  },
  {
    grade: 'Class I to Class III',
    tier: 'Junior Primary',
    age: 'Ages 6 – 9',
    image: '/images/academics/junior_primary.jpg',
    focus: 'Structured academic foundation, critical reading comprehension, mathematical reasoning, and hands-on science.',
    curriculum: ['Mathematics & Problem Solving', 'English Comprehension & Creative Writing', 'Science Experiments', 'Nazra Quran & Islamic Studies', 'Introductory Computer Skills'],
  },
  {
    grade: 'Class IV & Class V',
    tier: 'Senior Primary',
    age: 'Ages 9 – 11',
    image: '/images/academics/senior_primary.jpg',
    focus: 'Advanced analytical skills, independent research, digital literacy, and leadership preparation.',
    curriculum: ['Advanced STEM & Scientific Inquiry', 'Bilingual Literacy (English & Urdu)', 'Social Studies & Geography', 'Digital Fluency & Coding Basics', 'Moral Education & Character Building'],
  },
];

const facultyHighlights = [
  {
    title: 'Certified Montessori Directress',
    desc: 'Expert early childhood guidance fostering child-centered learning and developmental care.',
    image: '/images/academics/faculty_montessori.jpg',
    badge: 'Montessori Care',
  },
  {
    title: 'AMI & LMI Certified Educators',
    desc: 'Internationally trained teachers utilizing scientific teaching techniques and structured methodologies.',
    image: '/images/academics/faculty_certified.jpg',
    badge: 'Faculty Credentials',
  },
  {
    title: 'Activity-Based STEM Learning',
    desc: 'Hands-on projects, experiments, robotics, and group activities to stimulate analytical curiosity.',
    image: '/images/academics/senior_primary.jpg',
    badge: 'STEM & Robotics',
  },
  {
    title: 'Dedicated Kids Play Area',
    desc: 'Safe, interactive indoor play infrastructure supporting gross motor and social development.',
    image: '/images/academics/kids_play_area.jpg',
    badge: 'Physical Play',
  },
];

const methodologies = [
  {
    title: 'Inquiry-Based Learning',
    desc: 'Students learn by questioning, investigating, and discovering concepts rather than rote learning.',
    icon: Lightbulb,
  },
  {
    title: 'Digital & Practical Integration',
    desc: 'Audio-visual aids, modern computing tools, and hands-on laboratory experiences.',
    icon: Monitor,
  },
  {
    title: 'Values-Integrated Curriculum',
    desc: 'Islamic ethics and values woven naturally into daily subjects and behavior standards.',
    icon: Shield,
  },
  {
    title: 'Continuous Formative Assessment',
    desc: 'Regular developmental reviews, parent updates, and personalized teacher guidance.',
    icon: CheckCircle,
  },
];

export default function AcademicsPage() {
  return (
    <div className="w-full bg-transparent">
      {/* 1. Header & Class Levels */}
      <section className="bg-transparent py-10 sm:py-12 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-3 mb-8 sm:mb-10">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
              ACADEMIC PROGRESSION
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Curriculum &amp; Educational Methodology
            </h1>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full mx-auto my-3"></div>
            <p className="text-gray-900 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed font-normal">
              Our progressive academic path spans Playgroup through Class V, blending high standards with international pedagogical best practices.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-8 lg:gap-10 items-stretch">
            {classLevels.map((lvl, idx) => (
              <MotionCard key={lvl.grade} index={idx} className="h-full">
                <Link
                  href="/admissions"
                  className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] bg-white/95 backdrop-blur-xl border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden flex flex-col h-full"
                >
                  {/* Aspect Ratio Image Container */}
                  <div className="relative w-full aspect-video md:aspect-video overflow-hidden">
                    <Image
                      src={lvl.image}
                      alt={lvl.grade}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 bg-white/95 text-[#A01A22] px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-md">
                      {lvl.tier}
                    </div>
                    <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-black/80 text-white px-2 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
                      {lvl.age}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-6 md:p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-6 flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-sm sm:text-xl md:text-2xl font-bold font-serif text-gray-900 tracking-tight mb-1 sm:mb-2.5">
                        {lvl.grade}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-2 sm:mb-6 font-normal line-clamp-2 md:line-clamp-none">
                        {lvl.focus}
                      </p>

                      <div className="hidden sm:block">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#A01A22] mb-3">
                          Core Subjects &amp; Focus:
                        </h4>
                        <ul className="space-y-2.5">
                          {lvl.curriculum.map((item) => (
                            <li key={item} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                              <div className="w-4 h-4 rounded-full bg-red-50 text-[#A01A22] flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                              <span className="font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-2 sm:pt-5 border-t border-gray-100 mt-auto">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-4 sm:py-2 rounded-full text-[10px] sm:text-xs font-bold text-[#A01A22] hover:text-white hover:bg-[#A01A22] active:scale-95 transition-all duration-300 hover:shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:-translate-y-1">
                        <span>Apply for level</span>
                        <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Real Faculty Standards Showcase */}
      <section className="bg-transparent py-12 lg:py-16 border-b border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-8">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
              TEACHING QUALITY
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Faculty &amp; Infrastructure Standards
            </h2>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full my-3"></div>
            <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
              Internationally certified educators creating warm, productive, interactive classroom communities.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {facultyHighlights.map((f, idx) => (
              <MotionCard key={f.title} index={idx} className="h-full">
                <div
                  className="bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 flex flex-col h-full"
                >
                  <div className="relative w-full aspect-video md:aspect-video overflow-hidden">
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <span className="absolute bottom-2 left-2 md:bottom-2.5 md:left-2.5 bg-[#A01A22] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full shadow">
                      {f.badge}
                    </span>
                  </div>
                  <div className="p-3 md:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 tracking-tight mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none">{f.title}</h3>
                      <p className="text-[11px] sm:text-xs text-gray-700 leading-relaxed font-normal line-clamp-2 sm:line-clamp-3">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Teaching Methodology Section */}
      <section className="bg-transparent py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left max-w-2xl mb-8">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
              OUR METHODOLOGY
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
              Active Intellectual Engagement
            </h2>
            <div className="w-14 h-1 bg-[#A01A22] rounded-full my-3"></div>
            <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
              Moving beyond traditional passive learning to active intellectual curiosity and critical thought.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {methodologies.map((m, idx) => {
              const Icon = m.icon;
              return (
                <MotionCard key={m.title} index={idx} className="h-full">
                  <div
                    className="bg-white/95 backdrop-blur-xl rounded-2xl p-3.5 md:p-8 border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] transition-all duration-500 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-red-50 text-[#A01A22] flex items-center justify-center mb-3 md:mb-5 shadow-sm">
                        <Icon className="w-4 h-4 md:w-6 md:h-6 stroke-[2]" />
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm md:text-lg text-gray-900 tracking-tight mb-1 md:mb-2">{m.title}</h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-gray-700 leading-relaxed font-normal line-clamp-2 md:line-clamp-none">{m.desc}</p>
                    </div>
                  </div>
                </MotionCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Admissions CTA Banner */}
      <section className="bg-transparent py-8 lg:py-12 border-t border-red-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionCard index={0}>
            <AdmissionsPromo />
          </MotionCard>
        </div>
      </section>
    </div>
  );
}

