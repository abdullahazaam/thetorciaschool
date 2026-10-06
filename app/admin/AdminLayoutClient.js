'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminSidebar from '@/components/AdminSidebar';
import { LogOut, ExternalLink } from 'lucide-react';

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Login page has its own standalone container without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-gray-900 font-sans">
      <AdminSidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col min-w-0 bg-slate-100">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between bg-white sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-900 tracking-wide">Campus Control Center</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 border border-gray-200 transition shadow-sm"
            >
              <span>View Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-red-700 bg-white hover:bg-red-50 border border-gray-200 transition shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-gray-500" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
