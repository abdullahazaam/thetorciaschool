'use client';

import { useState } from 'react';
import { Mail, Trash2, Pencil, AlertCircle, CheckCircle2, X, Save } from 'lucide-react';

export default function AdminInquiriesTable({ initialInquiries = [] }) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [loadingId, setLoadingId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editDetail, setEditDetail] = useState('');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3000);
  };

  const getStatusColor = (status = '') => {
    const s = status.toLowerCase();
    if (s === 'pending' || s === 'new') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (s === 'unread') {
      return 'bg-blue-50 text-blue-800 border-blue-200';
    }
    if (s === 'reviewed' || s === 'read') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (s === 'contacted' || s === 'replied') {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    return 'bg-gray-50 text-gray-800 border-gray-200';
  };

  const getApiRoute = (item) => {
    if (item.source === 'submission') {
      return `/api/submissions/${item._id}`;
    }
    if (item.type === 'Admission') {
      return '/api/admissions';
    }
    if (item.type === 'Contact') {
      return '/api/contact';
    }
    return '/api/inquiries';
  };

  const handleStatusChange = async (item, newStatus) => {
    const originalStatus = item.status;
    const route = getApiRoute(item);
    const isSub = item.source === 'submission';

    // Optimistically update local UI state immediately
    setInquiries((prev) =>
      prev.map((inq) => (inq._id === item._id ? { ...inq, status: newStatus } : inq))
    );
    setLoadingId(item._id);

    try {
      const res = await fetch(route, {
        method: isSub ? 'PATCH' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSub ? { status: newStatus } : { id: item._id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update status');
      }

      showToast(`Status updated to "${newStatus}"`, 'success');
    } catch (err) {
      console.error(err);
      // Revert if error
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === item._id ? { ...inq, status: originalStatus } : inq))
      );
      showToast(err.message || 'Status update failed', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  const handleReply = async (item) => {
    const newStatus = item.type === 'Admission' ? 'contacted' : 'replied';
    const originalStatus = item.status;

    // 1. Immediately update local state without reloading
    setInquiries((prev) =>
      prev.map((inq) => (inq._id === item._id ? { ...inq, status: newStatus } : inq))
    );

    // 2. Trigger mailto link if email exists
    if (item.email && item.email !== 'N/A') {
      window.open(
        `mailto:${item.email}?subject=Response from The Torcia School&body=Dear ${encodeURIComponent(
          item.name
        )},%0D%0A%0D%0AThank you for contacting The Torcia School.%0D%0A`,
        '_blank'
      );
    }

    // 3. Update database via PATCH
    try {
      const isSub = item.source === 'submission';
      const route = getApiRoute(item);

      const res = await fetch(route, {
        method: isSub ? 'PATCH' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isSub ? { status: newStatus } : { id: item._id, status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      showToast(`Status marked as "${newStatus}"`, 'success');
    } catch (err) {
      console.error(err);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === item._id ? { ...inq, status: originalStatus } : inq))
      );
      showToast(err.message || 'Failed to update reply status', 'error');
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setEditStatus(item.status);
    setEditDetail(item.detail || '');
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    const item = editingItem;
    const isSub = item.source === 'submission';
    const route = getApiRoute(item);

    // Update local state immediately
    setInquiries((prev) =>
      prev.map((inq) =>
        inq._id === item._id ? { ...inq, status: editStatus, detail: editDetail } : inq
      )
    );
    setEditingItem(null);

    try {
      const res = await fetch(route, {
        method: isSub ? 'PATCH' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isSub
            ? { status: editStatus, message: editDetail }
            : { id: item._id, status: editStatus, detail: editDetail }
        ),
      });

      if (!res.ok) {
        throw new Error('Failed to update submission');
      }

      showToast('Record updated successfully', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Update failed', 'error');
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${item.type} submission from "${item.name}"?`
    );
    if (!confirmed) return;

    const isSub = item.source === 'submission';
    const route = isSub
      ? `/api/submissions/${item._id}`
      : item.type === 'Admission'
        ? `/api/admissions?id=${item._id}`
        : item.type === 'Contact'
          ? `/api/contact?id=${item._id}`
          : `/api/inquiries?id=${item._id}`;

    // Immediately remove from UI state without full reload
    setInquiries((prev) => prev.filter((inq) => inq._id !== item._id));
    setLoadingId(item._id);

    try {
      const res = await fetch(route, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete record');
      }

      showToast('Record deleted successfully', 'success');
    } catch (err) {
      console.error(err);
      // Revert if error
      setInquiries((prev) => [item, ...prev]);
      showToast(err.message || 'Delete operation failed', 'error');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast feedback */}
      {toast.message && (
        <div
          className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium border shadow-sm transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Inline Edit Modal / Drawer */}
      {editingItem && (
        <div className="p-4 bg-red-50/50 border border-red-200 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <Pencil className="w-3.5 h-3.5 text-[#A01A22]" />
              <span>Edit Submission: {editingItem.name}</span>
            </h4>
            <button
              onClick={() => setEditingItem(null)}
              className="p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none focus:border-[#A01A22]"
              >
                <option value="pending">Pending</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="reviewed">Reviewed</option>
                <option value="contacted">Contacted</option>
                <option value="replied">Replied</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Detail / Message Note</label>
              <input
                type="text"
                value={editDetail}
                onChange={(e) => setEditDetail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none focus:border-[#A01A22]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#A01A22] hover:bg-[#87131A] transition shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="text-center py-12 text-gray-500 space-y-3">
          <Mail className="w-10 h-10 text-gray-300 mx-auto" />
          <p className="text-sm font-medium text-gray-700">No submissions recorded in database yet.</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Submissions from the public Admissions and Contact forms will appear in this table automatically.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/75 text-gray-600">
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Applicant / Sender</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Type &amp; Detail</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Contact</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {inquiries.map((item) => {
                const hasEmail = item.email && item.email !== 'N/A';
                const isItemLoading = loadingId === item._id;

                return (
                  <tr
                    key={item._id}
                    className={`hover:bg-gray-50/80 transition ${
                      isItemLoading ? 'opacity-60 pointer-events-none' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.name}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.type === 'Admission'
                              ? 'bg-red-50 text-[#A01A22] border border-red-100'
                              : 'bg-sky-50 text-sky-700 border border-sky-100'
                          }`}
                        >
                          {item.type}
                        </span>
                        <span className="text-gray-600 truncate max-w-[140px]">{item.detail}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 whitespace-nowrap">
                      <div>{item.phone}</div>
                      {hasEmail && <div className="text-[11px] text-gray-400">{item.email}</div>}
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2.5 py-1 border outline-none cursor-pointer transition shadow-sm ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.type === 'Admission' ? (
                          <>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="contacted">Contacted</option>
                            <option value="admitted">Admitted</option>
                            <option value="archived">Archived</option>
                          </>
                        ) : (
                          <>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </>
                        )}
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Reply Action */}
                        <button
                          type="button"
                          onClick={() => handleReply(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-[#A01A22] text-gray-700 hover:text-white border border-gray-200 hover:border-[#A01A22] transition shadow-sm"
                          title="Reply via Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>

                        {/* Edit Action */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-200 text-gray-700 border border-gray-200 transition shadow-sm"
                          title="Edit Status & Note"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        {/* Delete Action */}
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50/60 hover:bg-rose-600 text-rose-700 hover:text-white border border-red-100 hover:border-rose-600 transition shadow-sm"
                          title="Delete submission"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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
  );
}
