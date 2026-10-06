'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

const heroSlideImages = [
  { src: '/images/hero-1.png', alt: 'The Torcia School Campus' },
  { src: '/images/hero-2.png', alt: 'The Torcia School Academic Excellence' },
  { src: '/images/hero-3.png', alt: 'The Torcia School Students and Activities' },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlideImages.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[calc(100vh-4.5rem)] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Slides with Smooth Cross-Fade Transition */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {heroSlideImages.map((image, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={image.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>

      {/* Soft Translucent Gradient Overlay (z-15) */}
      <div className="absolute inset-0 z-[15] bg-gradient-to-b from-black/50 via-black/20 to-black/60 pointer-events-none"></div>

      {/* Static Centered Text & CTA Buttons (z-20) */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center space-y-6 drop-shadow-xl">
        {/* Overline Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold tracking-widest uppercase shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-red-300" />
          <span>The Torcia School • Nazimabad Karachi</span>
        </div>

        {/* Main Cinematic Heading */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-center text-white [text-shadow:_0_4px_12px_rgba(0,0,0,0.9)]">
          Empowering Young Minds for a Brighter Tomorrow
        </h1>

        {/* Tagline / Subtitle */}
        <p className="text-lg md:text-xl text-gray-100 font-normal max-w-3xl mx-auto leading-relaxed [text-shadow:_0_4px_12px_rgba(0,0,0,0.9)]">
          Growing Future Leaders through academic excellence, moral integrity, and modern STEM innovation.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/admissions"
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-sm shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 hover:-translate-y-0.5"
          >
            <span>Apply for Admission</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/academics"
            className="w-full sm:w-auto px-5 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-md border border-white/30 transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 shadow-md"
          >
            <span>Explore Programs</span>
          </Link>
        </div>

        {/* Trust Highlights */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-gray-200 font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#A01A22]"></div>
            <span>Playgroup to Class V</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#A01A22]"></div>
            <span>Values-Based Curriculum</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#A01A22]"></div>
            <span>Montessori &amp; Robotics Labs</span>
          </div>
        </div>

        {/* Slide Indicators / Dots */}
        <div className="flex items-center justify-center gap-2.5 pt-4">
          {heroSlideImages.map((_, dotIndex) => (
            <button
              key={dotIndex}
              onClick={() => setCurrentSlide(dotIndex)}
              aria-label={`Go to slide ${dotIndex + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                dotIndex === currentSlide
                  ? 'w-8 bg-[#A01A22]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
