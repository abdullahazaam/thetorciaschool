import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { schoolBrand } from '@/lib/schoolImages';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#A01A22] text-white">
      {/* 1. Top Call-to-Action Banner */}
      <div className="relative overflow-hidden bg-[#87131A] text-white py-8 sm:py-9 px-4 sm:px-6 lg:px-8 border-b border-white/15">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & School Name */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-xl bg-white p-1.5 flex items-center justify-center shrink-0 shadow-md">
              <Image
                src={schoolBrand.treeIcon}
                alt="The Torcia School"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <span className="block text-lg font-black tracking-tight text-white leading-snug">
                THE TORCIA SCHOOL
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-white/90">
                LEARN • GROW • LEAD
              </span>
            </div>
          </div>

          {/* Banner Invitation Text */}
          <div className="text-center md:text-left max-w-xl">
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Ready to be part of something greater?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-0.5">
              Join a community that believes in your potential. Admissions open for Playgroup through Class V.
            </p>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <Link
              href="/admissions"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#A01A22] hover:bg-gray-100 font-bold text-sm shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Deep Red Footer Body */}
      <div className="pt-6 pb-12 px-4 md:pt-12 md:pb-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8 mb-6 md:mb-8">
            {/* Column 1 on Desktop / Brand Header on Mobile */}
            <div className="col-span-2 md:col-span-1 space-y-2.5 md:space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white p-1 shadow-md flex items-center justify-center shrink-0">
                  <Image
                    src={schoolBrand.treeIcon}
                    alt="The Torcia School"
                    width={38}
                    height={38}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-bold text-white tracking-tight leading-tight">The Torcia School</h4>
                  <p className="text-[10px] sm:text-[11px] uppercase font-bold text-white/90 tracking-wider">Growing Future Leaders</p>
                </div>
              </div>
              <p className="text-xs md:text-sm text-white/85 leading-relaxed font-normal">
                To provide quality education in a disciplined, values-based environment that nurtures knowledge, character, and social responsibilities.
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[11px] sm:text-xs text-white font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-white" /> Playgroup to Class V
              </div>
            </div>

            {/* Column 1 on Mobile (Quick Navigation) */}
            <div className="col-span-1">
              <h4 className="text-xs md:text-sm font-bold text-white tracking-wider uppercase mb-2 md:mb-4 border-l-2 border-white pl-2">
                Quick Navigation
              </h4>
              <ul className="space-y-1 md:space-y-2 text-xs md:text-sm text-white/85">
                {[
                  { name: 'Home', href: '/' },
                  { name: 'About Our Vision', href: '/about' },
                  { name: 'Academic Programs', href: '/academics' },
                  { name: 'Admissions Inquiry', href: '/admissions' },
                  { name: 'Campus News', href: '/news' },
                  { name: 'Contact Info', href: '/contact' },
                  { name: 'Admin Portal', href: '/admin' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="hover:text-white transition-colors flex items-center gap-1 group hover:translate-x-0.5 duration-200"
                    >
                      <ArrowRight className="w-2.5 h-2.5 text-white opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span className="truncate">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2 on Mobile (Nazimabad Campus) */}
            <div className="col-span-1">
              <h4 className="text-xs md:text-sm font-bold text-white tracking-wider uppercase mb-2 md:mb-4 border-l-2 border-white pl-2">
                Nazimabad Campus
              </h4>
              <ul className="space-y-1.5 md:space-y-2.5 text-xs md:text-sm text-white/85">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                  <span className="leading-tight">
                    Plot # 20/13 Block 5C, Nazimabad Karachi
                  </span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Phone className="w-3.5 h-3.5 text-white shrink-0" />
                  <a href="tel:03422049976" className="hover:text-white transition-colors font-medium">
                    0342-2049976
                  </a>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <Mail className="w-3.5 h-3.5 text-white shrink-0" />
                  <a href="mailto:thetorciaschool@gmail.com" className="hover:text-white transition-colors break-all">
                    thetorciaschool@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Row 2 on Mobile (Full Width) / Column 4 on Desktop: Timings & Vision */}
            <div className="col-span-2 md:col-span-1 space-y-2 md:space-y-3">
              <h4 className="text-xs md:text-sm font-bold text-white tracking-wider uppercase mb-2 md:mb-4 border-l-2 border-white pl-2">
                School Timings
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-3">
                {/* School Timings Card */}
                <div className="bg-red-950/40 p-3 rounded-xl border border-red-800/50 space-y-1 text-xs">
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white text-[11px] sm:text-xs">Mon – Sat:</div>
                      <div className="text-white/85 text-[10px] sm:text-[11px]">7:45 AM - 2:00 PM</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-1.5 pt-1 border-t border-red-800/40">
                    <Clock className="w-3.5 h-3.5 text-white shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white text-[11px] sm:text-xs">Friday:</div>
                      <div className="text-white/85 text-[10px] sm:text-[11px]">7:45 AM - 1:00 PM</div>
                    </div>
                  </div>
                </div>

                {/* Core Vision Card */}
                <div className="bg-red-950/40 p-3 rounded-xl border border-red-800/50 flex flex-col justify-center text-xs">
                  <span className="font-bold text-white block text-[11px] sm:text-xs mb-0.5">Core Vision:</span>
                  <p className="text-[10px] sm:text-[11px] text-white/90 leading-tight">
                    To build an educated and morally strong youth for the revival of Islam and society.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Sub-footer bar with Social Icons & Legal */}
          <div className="pt-4 border-t border-red-900/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/80">
            <p>© {currentYear} The Torcia School. All rights reserved.</p>

            <div className="flex items-center gap-5">
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <Youtube className="w-4 h-4" />
              </a>
              <span className="text-white/30">|</span>
              <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
