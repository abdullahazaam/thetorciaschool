import Link from 'next/link';
import {
  Newspaper,
  ArrowRight,
  ShieldCheck,
  Database,
  Users,
  Mail,
  GraduationCap,
  MessageSquare,
} from 'lucide-react';
import connectToDatabase from '@/lib/mongodb';
import News from '@/models/News';
import Admission from '@/models/Admission';
import Contact from '@/models/Contact';
import Inquiry from '@/models/Inquiry';
import Event from '@/models/Event';
import Submission from '@/models/Submission';
import Faculty from '@/models/Faculty';
import AdminInquiriesTable from '@/components/AdminInquiriesTable';

export const dynamic = 'force-dynamic';

async function getStats() {
  let admissionsCount = 0;
  let contactCount = 0;
  let newsCount = 0;
  let dbStatus = 'Not Connected';
  let recentInquiries = [];

  try {
    if (process.env.MONGODB_URI) {
      await connectToDatabase();
      dbStatus = 'Connected';

      const [
        admCount,
        cntCount,
        inqCount,
        nwsCount,
        eventCount,
        subAdmCount,
        subCntCount,
      ] = await Promise.all([
        Admission.countDocuments().catch(() => 0),
        Contact.countDocuments().catch(() => 0),
        Inquiry.countDocuments().catch(() => 0),
        News.countDocuments().catch(() => 0),
        Event.countDocuments().catch(() => 0),
        Submission.countDocuments({ type: 'admission' }).catch(() => 0),
        Submission.countDocuments({ type: 'contact' }).catch(() => 0),
      ]);

      admissionsCount = admCount + subAdmCount;
      contactCount = cntCount + inqCount + subCntCount;
      newsCount = nwsCount + eventCount;

      const [latestAdmissions, latestContacts, latestInquiries, latestSubmissions] = await Promise.all([
        Admission.find({}).sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
        Contact.find({}).sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
        Inquiry.find({}).sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
        Submission.find({}).sort({ createdAt: -1 }).limit(5).lean().catch(() => []),
      ]);

      const formatted = [
        ...latestAdmissions.map((a) => ({
          _id: a._id.toString(),
          type: 'Admission',
          name: a.studentName ? `${a.studentName} (Parent: ${a.parentName})` : a.parentName,
          email: a.email || 'N/A',
          phone: a.phone || 'N/A',
          detail: `Grade: ${a.grade}`,
          status: a.status || 'pending',
          createdAt: a.createdAt,
        })),
        ...latestContacts.map((c) => ({
          _id: c._id.toString(),
          type: 'Contact',
          name: c.name,
          email: c.email || 'N/A',
          phone: c.phone || 'N/A',
          detail: c.subject || c.message?.slice(0, 30) || 'Message',
          status: c.status || 'unread',
          createdAt: c.createdAt,
        })),
        ...latestInquiries.map((i) => ({
          _id: i._id.toString(),
          type: i.type || 'Inquiry',
          name: i.studentName ? `${i.studentName} (Parent: ${i.parentName})` : i.parentName,
          email: i.email || 'N/A',
          phone: i.phone || 'N/A',
          detail: i.gradeApplyingFor ? `Grade: ${i.gradeApplyingFor}` : (i.message?.slice(0, 30) || 'Inquiry'),
          status: i.status || 'pending',
          createdAt: i.createdAt,
        })),
        ...latestSubmissions.map((s) => ({
          _id: s._id.toString(),
          type: s.type === 'admission' ? 'Admission' : 'Contact',
          source: 'submission',
          name: s.name,
          email: s.email || 'N/A',
          phone: s.phone || 'N/A',
          detail: s.message ? (s.message.length > 30 ? s.message.slice(0, 30) + '...' : s.message) : (s.type === 'admission' ? 'Admission inquiry' : 'Contact submission'),
          status: s.status || 'pending',
          createdAt: s.createdAt,
        })),
      ];

      formatted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      recentInquiries = formatted.slice(0, 8);
    }
  } catch (e) {
    console.error('Error fetching admin dashboard stats:', e);
    dbStatus = 'Error Connecting';
  }

  return {
    admissionsCount,
    contactCount,
    newsCount,
    dbStatus,
    recentInquiries: JSON.parse(JSON.stringify(recentInquiries)),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your campus data and announcements.</p>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Admissions</span>
            <div className="p-2 sm:p-2.5 bg-red-50 text-red-600 rounded-xl">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2">{stats.admissionsCount}</div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1 font-medium line-clamp-1">
            <span>Online submissions</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Messages</span>
            <div className="p-2 sm:p-2.5 bg-red-50 text-red-600 rounded-xl">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2">{stats.contactCount}</div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium line-clamp-1">General inquiries</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">Database</span>
            <div className="p-2 sm:p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Database className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-extrabold text-gray-900 mt-2 flex items-center gap-2">
            <span className={`w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full ${stats.dbStatus === 'Connected' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="truncate">{stats.dbStatus}</span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium line-clamp-1">MongoDB Atlas</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-500">News</span>
            <div className="p-2 sm:p-2.5 bg-sky-50 text-sky-600 rounded-xl">
              <Newspaper className="w-4 h-4 sm:w-5 sm:h-5 text-sky-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-4xl font-extrabold text-gray-900 mt-2">{stats.newsCount}</div>
          <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 font-semibold line-clamp-1">Campus updates</p>
        </div>
      </div>

      {/* Two Column Layout: Quick Actions & Inquiries Data Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Quick Actions & Security */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 font-serif tracking-tight">Management Actions</h2>

            <div className="space-y-3">
              <Link
                href="/admin/news"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:bg-[#A01A22] group-hover:text-white transition">
                    <Newspaper className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#A01A22] transition">
                      Post News or Event
                    </h3>
                    <p className="text-xs text-gray-500">Upload photos &amp; publish articles</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#A01A22] transition" />
              </Link>

              <Link
                href="/admin/faculty"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-50 text-red-600 group-hover:bg-[#A01A22] group-hover:text-white transition">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#A01A22] transition">
                      Faculty Directory
                    </h3>
                    <p className="text-xs text-gray-500">Add, edit &amp; manage teachers</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#A01A22] transition" />
              </Link>

              <Link
                href="/admin/admissions"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-[#A01A22] group-hover:text-white transition">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#A01A22] transition">
                      Admission Form
                    </h3>
                    <p className="text-xs text-gray-500">Manage admission submissions</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#A01A22] transition" />
              </Link>

              <Link
                href="/admin/contact"
                className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-red-100 hover:bg-red-50/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gray-100 text-gray-700 group-hover:bg-[#A01A22] group-hover:text-white transition">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#A01A22] transition">
                      Contact Desk
                    </h3>
                    <p className="text-xs text-gray-500">Manage contact inquiries and messages</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#A01A22] transition" />
              </Link>
            </div>
          </div>

          {/* Security status */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 text-xs text-gray-600 shadow-md">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Session Security</span>
            </div>
            <p className="leading-relaxed">
              Protected by Next.js edge middleware. Authenticated using <code className="text-[#A01A22] font-semibold">ADMIN_SECRET</code> with HTTP-only session cookies.
            </p>
          </div>
        </div>

        {/* Right Column: Inquiries Data Table */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-serif tracking-tight">Recent Inquiries &amp; Messages</h2>
              <p className="text-xs text-gray-500 mt-0.5">Real-time user submissions from Admissions and Contact portals</p>
            </div>
            <div className="text-xs text-gray-500 font-medium">
              Interactive Data Grid
            </div>
          </div>

          <AdminInquiriesTable initialInquiries={stats.recentInquiries} />
        </div>
      </div>
    </div>
  );
}
