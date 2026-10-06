'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AppLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Admin routes handle their own layout without the public Navbar and Footer
  if (isAdminRoute) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 antialiased selection:bg-torcia-gold selection:text-slate-950">
      <Navbar />
      <main className="flex-grow bg-transparent">{children}</main>
      <Footer />
    </div>
  );
}
