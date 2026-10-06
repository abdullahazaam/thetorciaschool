'use client';

import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Mail,
  Calendar,
  User,
  Clock,
  Sparkles,
  Save,
} from 'lucide-react';

export default function AdminAdmissionsPage() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [statusModalItem, setStatusModalItem] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3500);
  };

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions?type=admission');
      if (res.ok) {
        const json = await res.json();
        setAdmissions(json.data || []);
      }
    } catch (e) {
      console.error('Error fetching admissions:', e);
      showToast('Failed to load admissions from database.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleUpdateStatus = async (item, statusToSet) => {
    const originalStatus = item.status;
    const targetStatus = statusToSet || newStatus;
    if (!targetStatus) return;

    // Optimistically update local UI state immediately without page reload
    setAdmissions((prev) =>
      prev.map((adm) => (adm._id === item._id ? { ...adm, status: targetStatus } : adm))
    );

    if (selectedAdmission && selectedAdmission._id === item._id) {
      setSelectedAdmission((prev) => ({ ...prev, status: targetStatus }));
    }

    setStatusModalItem(null);

    try {
      const res = await fetch(`/api/submissions/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status on server');
      }

      showToast(`Status updated to "${targetStatus}"`, 'success');
    } catch (err) {
      console.error(err);
      // Revert if error
      setAdmissions((prev) =>
        prev.map((adm) => (adm._id === item._id ? { ...adm, status: originalStatus } : adm))
      );
      showToast('Status update failed.', 'error');
    }
  };

  const handleDelete = async (item) => {
    const displayName = item.studentName || item.name || 'this submission';
    const confirmed = window.confirm(
      `Are you sure you want to delete the admission submission for "${displayName}"?`
    );
    if (!confirmed) return;

    // Optimistically remove from state immediately without page reload
    setAdmissions((prev) => prev.filter((adm) => adm._id !== item._id));

    if (selectedAdmission && selectedAdmission._id === item._id) {
      setSelectedAdmission(null);
    }

    try {
      const res = await fetch(`/api/submissions/${item._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete admission record');
      }

      showToast(`Record for "${displayName}" deleted successfully.`, 'success');
    } catch (err) {
      console.error(err);
      // Revert if error
      setAdmissions((prev) => [item, ...prev]);
      showToast('Failed to delete admission record.', 'error');
    }
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'admitted':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'contacted':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'reviewed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  // Filtered admissions
  const filtered = admissions.filter((item) => {
    const matchesStatus =
      statusFilter === 'all' ? true : (item.status || 'pending').toLowerCase() === statusFilter;

    const term = searchQuery.toLowerCase();
    const student = (item.studentName || item.name || '').toLowerCase();
    const parent = (item.parentName || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const grade = (item.grade || '').toLowerCase();
    const email = (item.email || '').toLowerCase();

    const matchesSearch =
      !term ||
      student.includes(term) ||
      parent.includes(term) ||
      phone.includes(term) ||
      grade.includes(term) ||
      email.includes(term);

    return matchesStatus && matchesSearch;
  });

  // Metric stats
  const totalCount = admissions.length;
  const pendingCount = admissions.filter((a) => (a.status || 'pending') === 'pending').length;
  const contactedCount = admissions.filter((a) => a.status === 'contacted').length;
  const admittedCount = admissions.filter((a) => a.status === 'admitted').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            Admissions Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Review online admission registrations, manage student enrollment status, and schedule assessments.
          </p>
        </div>
        <button
          onClick={fetchAdmissions}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold self-start transition border border-gray-200 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Toast */}
      {toast.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm shadow-sm ${
            toast.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total</span>
            <div className="p-2 bg-red-50 text-[#A01A22] rounded-xl">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{totalCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Online applications</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">{pendingCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Awaiting review</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Contacted</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">{contactedCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Interview / Assessed</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Admitted</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-700 mt-2">{admittedCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Confirmed admissions</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, parent, phone, or grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-gray-50 border border-gray-200 text-gray-900 outline-none focus:border-[#A01A22] focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl bg-gray-50 border border-gray-200 text-gray-700 outline-none focus:border-[#A01A22]"
          >
            <option value="all">All Statuses ({totalCount})</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="contacted">Contacted</option>
            <option value="admitted">Admitted</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Admissions Data Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 space-y-3">
            <GraduationCap className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-800 text-sm">No admission submissions found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'New admission inquiries submitted from the public portal will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Student &amp; Parent</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Grade Applied</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Contact Info</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Application Date</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Current Status</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const student = item.studentName || item.name || 'Applicant';
                  const parent = item.parentName || (item.studentName ? 'Not specified' : '');
                  const grade = item.grade || (item.detail && item.detail.includes('Grade') ? item.detail : 'Playgroup - V');
                  const status = item.status || 'pending';

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/80 transition">
                      {/* Student & Parent Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm">{student}</div>
                        {parent && (
                          <div className="text-[11px] text-gray-500 flex items-center gap-1">
                            <span>Parent:</span>
                            <span className="font-medium text-gray-700">{parent}</span>
                          </div>
                        )}
                      </td>

                      {/* Grade */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-[#A01A22] border border-red-100">
                          {grade}
                        </span>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                        <div className="flex items-center gap-1 font-medium text-gray-800">
                          <Phone className="w-3 h-3 text-gray-400" />
                          <a href={`tel:${item.phone}`} className="hover:text-[#A01A22] transition">
                            {item.phone}
                          </a>
                        </div>
                        {item.email && item.email !== 'N/A' && (
                          <div className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-gray-400" />
                            <a href={`mailto:${item.email}`} className="hover:text-[#A01A22] transition truncate max-w-[160px]">
                              {item.email}
                            </a>
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border capitalize ${getStatusBadge(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Details Button */}
                          <button
                            type="button"
                            onClick={() => setSelectedAdmission(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition shadow-sm"
                            title="View full submission details"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            <span>Details</span>
                          </button>

                          {/* Update Status Button */}
                          <button
                            type="button"
                            onClick={() => {
                              setStatusModalItem(item);
                              setNewStatus(item.status || 'pending');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50/70 hover:bg-[#A01A22] text-[#A01A22] hover:text-white border border-red-100 hover:border-[#A01A22] transition shadow-sm"
                            title="Change application status"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Status</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50/60 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-100 hover:border-rose-600 transition shadow-sm"
                            title="Delete submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View Details Modal */}
      {selectedAdmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-[#A01A22] rounded-xl">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Admission Application</h3>
                  <span className="text-[11px] text-gray-500">
                    ID: {selectedAdmission._id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAdmission(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Student Name</span>
                  <span className="font-bold text-gray-900 text-sm">
                    {selectedAdmission.studentName || selectedAdmission.name}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Grade / Class</span>
                  <span className="font-bold text-[#A01A22] text-sm">
                    {selectedAdmission.grade || 'Early Years / Primary'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Parent / Guardian</span>
                  <span className="font-semibold text-gray-800">
                    {selectedAdmission.parentName || 'Parent info listed on phone'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Current Status</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold mt-1 capitalize border ${getStatusBadge(selectedAdmission.status)}`}>
                    {selectedAdmission.status || 'pending'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Contact Phone</span>
                  <a href={`tel:${selectedAdmission.phone}`} className="font-semibold text-[#A01A22] hover:underline">
                    {selectedAdmission.phone}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Email Address</span>
                  <span className="font-semibold text-gray-800">
                    {selectedAdmission.email || 'N/A'}
                  </span>
                </div>
              </div>

              {selectedAdmission.message && (
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold mb-1">Applicant Note</span>
                  <div className="p-3 bg-gray-50 rounded-xl text-gray-700 leading-relaxed border border-gray-100">
                    {selectedAdmission.message}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Submitted on {new Date(selectedAdmission.createdAt || Date.now()).toLocaleString()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedAdmission(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {statusModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Update Application Status</h3>
              <button
                onClick={() => setStatusModalItem(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-gray-600">
              Change workflow stage for{' '}
              <strong className="text-gray-900">{statusModalItem.studentName || statusModalItem.name}</strong>:
            </p>

            <div className="space-y-2">
              {['pending', 'reviewed', 'contacted', 'admitted', 'archived'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setNewStatus(st)}
                  className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold capitalize flex items-center justify-between border transition ${
                    newStatus === st
                      ? 'bg-red-50 border-[#A01A22] text-[#A01A22]'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{st}</span>
                  {newStatus === st && <CheckCircle2 className="w-3.5 h-3.5 text-[#A01A22]" />}
                </button>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setStatusModalItem(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(statusModalItem, newStatus)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#A01A22] hover:bg-[#87131A] transition shadow"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Status</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
