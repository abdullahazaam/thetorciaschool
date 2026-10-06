'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { schoolBrand } from '@/lib/schoolImages';

function LoginForm() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('from') || '/admin';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      router.push(redirectTarget);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Incorrect password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative z-10 space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#A01A22] font-semibold transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to School Website</span>
        </Link>
      </div>

      {/* Card */}
      <div className="bg-white border border-red-100 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex relative w-16 h-16 rounded-2xl bg-red-50 p-2 shadow-sm items-center justify-center mx-auto mb-2 border border-red-100">
            <Image
              src={schoolBrand.treeIcon}
              alt="The Torcia School"
              width={46}
              height={46}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight font-serif">Admin Portal</h1>
          <p className="text-xs text-gray-500 font-medium">
            The Torcia School • Campus Management System
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Administrator Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter ADMIN_SECRET password..."
                className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 hover:-translate-y-0.5"
          >
            <span>{loading ? 'Verifying Credentials...' : 'Authenticate & Enter'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-gray-100 text-center flex items-center justify-center gap-1.5 text-[11px] text-gray-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Protected by Torcia Session Authentication</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 px-4 py-12 relative overflow-hidden">
      {/* Background ambient radial effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-red-100/60 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-red-200/40 blur-3xl pointer-events-none"></div>

      <Suspense fallback={<div className="text-gray-600 text-sm">Loading admin security portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
