'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronDown,
  X,
  ListOrdered,
  Eye,
  EyeOff,
  Save,
} from 'lucide-react';

const FAQ_CATEGORIES = [
  'Admissions',
  'Timings',
  'Curriculum',
  'Fees',
  'Campus',
  'General',
];

export default function AdminFaqsPage() {
  const [faqsList, setFaqsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  // Creation Form State (Dedicated strictly to creating new FAQs)
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newCategory, setNewCategory] = useState('Admissions');
  const [newOrder, setNewOrder] = useState(1);
  const [newIsActive, setNewIsActive] = useState(true);

  // Edit Popup Modal State (Separate dedicated dialog state)
  const [editingItem, setEditingItem] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [editCategory, setEditCategory] = useState('Admissions');
  const [editOrder, setEditOrder] = useState(1);
  const [editIsActive, setEditIsActive] = useState(true);

  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faqs?all=true');
      if (res.ok) {
        const json = await res.json();
        const list = json.data || [];
        setFaqsList(list);
        setNewOrder(list.length + 1);
      }
    } catch (e) {
      console.error('Error fetching FAQs:', e);
      setFeedback({ type: 'error', message: 'Failed to fetch FAQs from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const resetCreateForm = () => {
    setNewQuestion('');
    setNewAnswer('');
    setNewCategory('Admissions');
    setNewOrder(faqsList.length + 1);
    setNewIsActive(true);
  };

  // Open Edit Popup Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditQuestion(item.question || '');
    setEditAnswer(item.answer || '');
    setEditCategory(item.category || 'Admissions');
    setEditOrder(item.order !== undefined ? item.order : 1);
    setEditIsActive(item.isActive !== undefined ? item.isActive : true);
  };

  // Close Edit Popup Modal
  const handleCloseEditModal = () => {
    setEditingItem(null);
  };

  // Handle Create New FAQ (Sidebar form)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      const payload = {
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
        category: newCategory.trim(),
        order: Number(newOrder) || 0,
        isActive: newIsActive,
      };

      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add FAQ');
      }

      setFaqsList((prev) =>
        [...prev, data.data].sort((a, b) => (a.order || 0) - (b.order || 0))
      );
      setFeedback({
        type: 'success',
        message: 'New question and answer published to the Parent FAQ accordion!',
      });

      resetCreateForm();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Submit (Inside centered Popup Modal)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setModalSubmitting(true);
    try {
      const payload = {
        question: editQuestion.trim(),
        answer: editAnswer.trim(),
        category: editCategory.trim(),
        order: Number(editOrder) || 0,
        isActive: editIsActive,
      };

      const res = await fetch(`/api/faqs/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update FAQ');
      }

      // Optimistically update list
      setFaqsList((prev) =>
        prev
          .map((f) => (f._id === editingItem._id ? data.data : f))
          .sort((a, b) => (a.order || 0) - (b.order || 0))
      );

      setFeedback({
        type: 'success',
        message: `FAQ "${editQuestion.substring(0, 45)}..." updated successfully!`,
      });

      // Automatically close the modal on success
      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update FAQ.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDelete = async (id, qText) => {
    const confirmed = window.confirm(
      `Are you sure you want to remove this FAQ: "${qText.substring(0, 50)}..."?`
    );
    if (!confirmed) return;

    setFaqsList((prev) => prev.filter((item) => item._id !== id));
    if (editingItem && editingItem._id === id) {
      handleCloseEditModal();
    }

    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'FAQ removed successfully.' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete FAQ');
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to delete FAQ.' });
      fetchFaqs();
    }
  };

  const handleToggleActive = async (item) => {
    const newStatus = !item.isActive;
    setFaqsList((prev) =>
      prev.map((f) => (f._id === item._id ? { ...f, isActive: newStatus } : f))
    );

    try {
      const res = await fetch(`/api/faqs/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) {
        fetchFaqs();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      fetchFaqs();
    }
  };

  const toggleAccordion = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return faqsList.filter((faq) => {
      const matchesSearch =
        searchQuery === '' ||
        faq.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || faq.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [faqsList, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            Parent FAQ Accordion Editor
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Maintain questions, detailed parental guidelines, fee notices, and school timings on the Admissions page.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admissions"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-50 text-[#A01A22] hover:bg-red-100 text-xs font-bold transition border border-red-200"
          >
            <span>Live Admissions FAQ</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={fetchFaqs}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition border border-gray-200 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {feedback.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm shadow-sm ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grid: Creation Sidebar & Live Accordion Directory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Dedicated Creation Column */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-lg self-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
              <div className="p-2 bg-red-50 rounded-xl text-[#A01A22]">
                <Plus className="w-4 h-4" />
              </div>
              <span>Add FAQ Question</span>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              New Item
            </span>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Parent Question *
              </label>
              <textarea
                rows={2}
                required
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. What are the regular student timings and campus office hours?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Detailed Answer &amp; Policy *
              </label>
              <textarea
                rows={5}
                required
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="Provide accurate, clear guidance for parents including exact timings, fees, or documents required..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs leading-relaxed"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                >
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  value={newOrder}
                  onChange={(e) => setNewOrder(Number(e.target.value))}
                  placeholder="e.g. 1"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <span className="block font-bold text-gray-800 text-xs">Accordion Status</span>
                <span className="text-[11px] text-gray-500">
                  {newIsActive ? 'Visible to parents on Admissions page' : 'Draft / Hidden from public'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsActive}
                  onChange={(e) => setNewIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A01A22]"></div>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{submitting ? 'Publishing...' : 'Publish FAQ Item'}</span>
            </button>
          </form>
        </div>

        {/* Existing FAQs / Directory Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900 font-serif">
              Parent FAQ Directory ({filteredFaqs.length} of {faqsList.length})
            </h2>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or keywords..."
                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A01A22] w-full sm:w-56"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                selectedCategory === 'All'
                  ? 'bg-[#A01A22] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Categories
            </button>
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#A01A22] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 space-y-3 shadow-lg">
              <HelpCircle className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">No FAQ questions found.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add frequent parental queries using the form. They appear in an elegant interactive accordion on the admissions portal.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((item, index) => {
                const isExpanded = expandedFaqId === item._id;

                return (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition"
                  >
                    {/* Accordion Bar */}
                    <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(item._id)}
                        className="text-left flex items-start gap-3 flex-1 min-w-0 group"
                      >
                        <span className="w-6 h-6 rounded-full bg-red-50 text-[#A01A22] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#A01A22] group-hover:text-white transition">
                          {item.order || index + 1}
                        </span>

                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                              {item.category || 'General'}
                            </span>
                            {!item.isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                Draft / Hidden
                              </span>
                            )}
                          </div>

                          <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight leading-snug group-hover:text-[#A01A22] transition-colors">
                            {item.question}
                          </h3>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <button
                          onClick={() => handleToggleActive(item)}
                          className={`p-1.5 rounded-lg text-xs transition ${
                            item.isActive
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={item.isActive ? 'Hide FAQ' : 'Publish FAQ'}
                        >
                          {item.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-[#A01A22] hover:bg-gray-100 transition"
                          title="Edit FAQ via Popup Modal"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.question)}
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleAccordion(item._id)}
                          className="p-1.5 text-gray-400 hover:text-gray-700 transition"
                          aria-label="Toggle answer"
                        >
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? 'rotate-180 text-[#A01A22]' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Answer Preview */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 border-t border-gray-100 bg-slate-50/70 leading-relaxed animate-in fade-in duration-200">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sleek Centered Popup Modal with Backdrop Blur for Editing */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-t-4 border-[#A01A22] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-50 text-[#A01A22] rounded-xl">
                  <Pencil className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold font-serif text-lg text-gray-900 tracking-tight">
                    Edit Parent FAQ Item
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    Modifying questions and policies for live admissions portal
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseEditModal}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4 pt-5 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Parent Question *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editQuestion}
                  onChange={(e) => setEditQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Detailed Answer &amp; Policy *
                </label>
                <textarea
                  rows={5}
                  required
                  value={editAnswer}
                  onChange={(e) => setEditAnswer(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editOrder}
                    onChange={(e) => setEditOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs font-semibold focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <span className="block font-bold text-gray-800 text-xs">Publish Status</span>
                  <span className="text-[11px] text-gray-500">
                    {editIsActive ? 'Visible to parents on website' : 'Draft / Hidden from public'}
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A01A22]"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50 hover:shadow-lg"
                >
                  {modalSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{modalSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
