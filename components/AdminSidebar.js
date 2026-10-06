'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  GraduationCap,
  MessageSquare,
  Users,
  ExternalLink,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { schoolBrand } from '@/lib/schoolImages';

const navItems = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Admissions', href: '/admin/admissions', icon: GraduationCap },
  { name: 'Contact Inquiries', href: '/admin/contact', icon: MessageSquare },
  { name: 'News & Announcements', href: '/admin/news', icon: Newspaper },
  { name: 'Faculty Management', href: '/admin/faculty', icon: Users },
];

export default function AdminSidebar({ onLogout }) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 min-h-screen text-gray-900 relative z-40">
      {/* Brand Header */}
      <div className="p-6 border-b border-gray-200 flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl bg-red-50 p-1.5 border border-red-100 flex items-center justify-center shrink-0">
          <Image
            src={schoolBrand.treeIcon}
            alt="The Torcia School"
            width={32}
            height={32}
            className="object-contain"
          />
        </div>
        <div>
          <h2 className="text-gray-900 font-bold text-sm tracking-tight leading-tight">The Torcia School</h2>
          <span className="text-[11px] text-gray-500 font-medium tracking-wide">Admin Portal</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1.5 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-3 py-2">
          Management
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 text-xs transition duration-200 ${
                isActive
                  ? 'bg-red-50 text-red-700 border-r-4 border-red-600 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-red-600" />}
            </Link>
          );
        })}
      </nav>

      {/* Campus Info & Logout Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[11px] space-y-1">
          <div className="text-gray-500 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Admin Active</span>
          </div>
          <div className="text-gray-800 font-semibold truncate">Nazimabad Campus</div>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition"
        >
          <span>Live Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
        </Link>

        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:text-red-700 hover:bg-red-50 transition"
          >
            <LogOut className="w-3.5 h-3.5 text-gray-400" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </aside>
  );
}
