'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { schoolBrand } from '@/lib/schoolImages';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Academics', href: '/academics' },
  { name: 'Admissions', href: '/admissions' },
  { name: 'News & Events', href: '/news' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/50 transition-all">
      {/* Top Notification / Contact Bar */}
      <div className="bg-[#A01A22] text-white text-[10px] font-normal h-6 flex items-center px-4 sm:px-8 lg:px-12 overflow-hidden">
        <div className="max-w-[1600px] mx-auto w-full flex justify-between items-center leading-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-white/95 font-normal">
              <MapPin className="w-3 h-3 text-white shrink-0" />
              Plot # 20/13 Block 5C, Nazimabad Karachi
            </span>
            <span className="hidden md:inline text-white/40">|</span>
            <a href="tel:03422049976" className="hidden md:flex items-center gap-1 text-white/95 hover:text-white transition font-normal">
              <Phone className="w-3 h-3 text-white shrink-0" />
              0342-2049976
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white hidden sm:flex items-center gap-1 font-normal">
              <Sparkles className="w-3 h-3 text-white shrink-0" /> Admissions Open: Playgroup to Class V
            </span>
            <Link
              href="/admin"
              className="text-white hover:bg-white/30 transition-colors bg-white/20 px-1.5 py-0.5 rounded text-[10px] font-normal leading-tight"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12 w-full">
        <div className="flex justify-between items-center h-12">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-8 h-8 rounded-md bg-white p-0.5 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-300 border border-gray-100 shrink-0">
              <Image
                src={schoolBrand.treeIcon}
                alt="The Torcia School Crest"
                width={28}
                height={28}
                className="object-contain h-7 w-7"
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="block text-base sm:text-lg font-black tracking-tight text-[#111827] group-hover:text-[#A01A22] transition-colors leading-none">
                THE TORCIA SCHOOL
              </span>
              <span className="block text-[8px] sm:text-[9px] uppercase font-bold tracking-wider text-[#A01A22] leading-tight mt-0.5">
                LEARN • GROW • LEAD
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-3 py-1.5 text-sm font-semibold transition-colors duration-200 ${
                    isActive
                      ? 'text-[#A01A22] font-bold'
                      : 'text-gray-600 hover:text-[#111827]'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#A01A22] rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/admissions"
              className="bg-[#A01A22] hover:bg-[#87131A] text-white font-semibold px-4 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 text-sm flex items-center gap-1.5"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-[#A01A22] hover:bg-gray-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/50 bg-white/90 backdrop-blur-md shadow-xl animate-in slide-in-from-top-4 duration-200">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-50 text-[#A01A22] font-bold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#111827]'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2">
              <Link
                href="/admissions"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#A01A22] hover:bg-[#87131A] text-white font-bold py-3 rounded-full shadow-sm transition"
              >
                Apply Now →
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl text-sm transition"
              >
                Admin Dashboard
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

