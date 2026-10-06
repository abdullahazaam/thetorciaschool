'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Phone,
  Calendar,
  User,
  Clock,
  Eye,
  Send,
  MessageCircle,
} from 'lucide-react';

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: '' });
    }, 3500);
  };

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/submissions?type=contact');
      if (res.ok) {
        const json = await res.json();
        setMessages(json.data || []);
      }
    } catch (e) {
      console.error('Error fetching contacts:', e);
      showToast('Failed to load contact inquiries.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleReply = async (item) => {
    const originalStatus = item.status;
    const newStatus = 'replied';

    // 1. Optimistically update local state immediately without full page reload
    setMessages((prev) =>
      prev.map((m) => (m._id === item._id ? { ...m, status: newStatus } : m))
    );

    if (selectedMessage && selectedMessage._id === item._id) {
      setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
    }

    // 2. Open mailto link
    if (item.email && item.email !== 'N/A') {
      window.open(
        `mailto:${item.email}?subject=Response from The Torcia School: ${encodeURIComponent(
          item.subject || 'Inquiry'
        )}&body=Dear ${encodeURIComponent(
          item.name
        )},%0D%0A%0D%0AThank you for reaching out to The Torcia School regarding your inquiry.%0D%0A%0D%0A`,
        '_blank'
      );
    }

    // 3. Update database via PATCH
    try {
      const res = await fetch(`/api/submissions/${item._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status on server');
      }

      showToast(`Marked inquiry from "${item.name}" as Replied.`, 'success');
    } catch (err) {
      console.error(err);
      setMessages((prev) =>
        prev.map((m) => (m._id === item._id ? { ...m, status: originalStatus } : m))
      );
      showToast('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the message from "${item.name}"?`
    );
    if (!confirmed) return;

    // Optimistically remove from state immediately without full page reload
    setMessages((prev) => prev.filter((m) => m._id !== item._id));

    if (selectedMessage && selectedMessage._id === item._id) {
      setSelectedMessage(null);
    }

    try {
      const res = await fetch(`/api/submissions/${item._id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete message');
      }

      showToast(`Inquiry from "${item.name}" deleted successfully.`, 'success');
    } catch (err) {
      console.error(err);
      setMessages((prev) => [item, ...prev]);
      showToast('Failed to delete message record.', 'error');
    }
  };

  const handleOpenMessage = async (item) => {
    setSelectedMessage(item);

    // If unread, mark as read
    if (item.status === 'unread') {
      setMessages((prev) =>
        prev.map((m) => (m._id === item._id ? { ...m, status: 'read' } : m))
      );
      try {
        await fetch(`/api/submissions/${item._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'read' }),
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    switch (s) {
      case 'replied':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'read':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'archived':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200 font-bold';
    }
  };

  // Filtered messages
  const filtered = messages.filter((item) => {
    const matchesStatus =
      statusFilter === 'all' ? true : (item.status || 'unread').toLowerCase() === statusFilter;

    const term = searchQuery.toLowerCase();
    const name = (item.name || '').toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const subject = (item.subject || '').toLowerCase();
    const msg = (item.message || '').toLowerCase();

    const matchesSearch =
      !term ||
      name.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      subject.includes(term) ||
      msg.includes(term);

    return matchesStatus && matchesSearch;
  });

  const totalCount = messages.length;
  const unreadCount = messages.filter((m) => (m.status || 'unread') === 'unread').length;
  const repliedCount = messages.filter((m) => m.status === 'replied').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            Contact Inquiries &amp; Messages
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage correspondence received from parents, visitors, and campus stakeholders.
          </p>
        </div>
        <button
          onClick={fetchContacts}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold self-start transition border border-gray-200 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inquiries</span>
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

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Inquiries</span>
            <div className="p-2 bg-red-50 text-[#A01A22] rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 mt-2">{totalCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">All contact messages</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Unread</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-700 mt-2">{unreadCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Awaiting response</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Replied</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-700 mt-2">{repliedCount}</div>
          <p className="text-[11px] text-gray-500 mt-0.5">Answered by admin</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sender, email, subject, or message..."
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
            <option value="all">All Inquiries ({totalCount})</option>
            <option value="unread">Unread ({unreadCount})</option>
            <option value="read">Read</option>
            <option value="replied">Replied ({repliedCount})</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Messages Data Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500 space-y-3">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-800 text-sm">No contact inquiries found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Messages submitted through the public Contact page will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Sender</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Subject &amp; Message</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Contact</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Date</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider">Status</th>
                  <th className="py-3.5 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((item) => {
                  const subject = item.subject || 'General Inquiry';
                  const msgPreview = item.message || 'No message content provided.';
                  const status = item.status || 'unread';

                  return (
                    <tr key={item._id} className="hover:bg-gray-50/80 transition">
                      {/* Sender */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                        <div className="text-[11px] text-gray-500">{item.email}</div>
                      </td>

                      {/* Subject & Message Preview */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-gray-800 truncate">{subject}</div>
                        <p className="text-gray-500 text-[11px] truncate mt-0.5">{msgPreview}</p>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                        {item.phone ? (
                          <div className="flex items-center gap-1 font-medium text-gray-800">
                            <Phone className="w-3 h-3 text-gray-400" />
                            <a href={`tel:${item.phone}`} className="hover:text-[#A01A22] transition">
                              {item.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-gray-400">Email only</span>
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
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] border capitalize ${getStatusBadge(
                            status
                          )}`}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Full Message */}
                          <button
                            type="button"
                            onClick={() => handleOpenMessage(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition shadow-sm"
                            title="Read complete message"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-500" />
                            <span>Read</span>
                          </button>

                          {/* Reply Button (Mailto + DB Update) */}
                          <button
                            type="button"
                            onClick={() => handleReply(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50/70 hover:bg-[#A01A22] text-[#A01A22] hover:text-white border border-red-100 hover:border-[#A01A22] transition shadow-sm"
                            title="Reply to sender via email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply</span>
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-rose-50/60 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-100 hover:border-rose-600 transition shadow-sm"
                            title="Delete inquiry"
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-[#A01A22] rounded-xl">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Inquiry Message</h3>
                  <span className="text-[11px] text-gray-500">
                    From: {selectedMessage.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-1">
                <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Subject</span>
                <span className="font-bold text-gray-900 text-sm block">
                  {selectedMessage.subject || 'General Inquiry'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Sender Email</span>
                  <a href={`mailto:${selectedMessage.email}`} className="font-semibold text-[#A01A22] hover:underline">
                    {selectedMessage.email || 'N/A'}
                  </a>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold">Phone Number</span>
                  <span className="font-semibold text-gray-800">
                    {selectedMessage.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 block uppercase tracking-wider text-[10px] font-bold mb-1">Message Body</span>
                <div className="p-4 bg-gray-50/70 rounded-xl text-gray-800 leading-relaxed border border-gray-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedMessage.message || 'No message content.'}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                Received on {new Date(selectedMessage.createdAt || Date.now()).toLocaleString()}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => handleReply(selectedMessage)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#A01A22] hover:bg-[#87131A] transition shadow"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
