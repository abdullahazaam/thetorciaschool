import Image from 'next/image';
import { galleryImages } from '@/lib/schoolImages';
import { Sparkles } from 'lucide-react';
import MotionCard from '@/components/MotionCard';

export default function GalleryGrid({ limit }) {
  const imagesToShow = limit ? galleryImages.slice(0, limit) : galleryImages;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#A01A22] block mb-1.5">
            CAMPUS GALLERY
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-[40px] font-extrabold text-gray-900 tracking-tight leading-tight">
            Life &amp; Learning at The Torcia School
          </h2>
          <div className="w-14 h-1 bg-[#A01A22] rounded-full my-3"></div>
          <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
            Real moments from our classrooms, celebrations, student activities, and campus environment.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {imagesToShow.map((item, index) => (
          <MotionCard key={index} index={index} className="h-full">
            <div
              className="group relative bg-white/95 backdrop-blur-xl rounded-2xl overflow-hidden border-t-4 border-red-700 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(160,26,34,0.15)] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
            <div className="relative w-full aspect-video md:aspect-video overflow-hidden">
              <Image
                src={item.src}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end p-5">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-red-300" />
                  <span>The Torcia School • Nazimabad</span>
                </span>
              </div>
            </div>

            <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#A01A22]">
                  {item.category}
                </span>
                <h3 className="text-xs sm:text-base font-bold text-gray-900 mt-1 group-hover:text-[#A01A22] transition-colors line-clamp-1">
                  {item.title}
                </h3>
              </div>
            </div>
          </div>
        </MotionCard>
        ))}
      </div>
    </div>
  );
}

