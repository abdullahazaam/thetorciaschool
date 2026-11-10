import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-gray-200 shadow-xl">
        <div className="w-20 h-20 rounded-2xl bg-red-50 text-[#A01A22] font-black text-3xl font-serif flex items-center justify-center mx-auto border border-red-100">
          404
        </div>
        <div>
          <h1 className="text-2xl font-bold font-serif text-gray-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            The page or campus resource you are looking for might have been moved, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#A01A22] text-white font-bold text-xs hover:bg-[#87131A] transition shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/admissions"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-bold text-xs hover:bg-gray-200 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Admissions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
