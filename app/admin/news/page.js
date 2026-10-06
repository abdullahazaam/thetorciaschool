'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Newspaper,
  Plus,
  Upload,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ImageIcon,
  Calendar,
  X,
} from 'lucide-react';

export default function AdminNewsPage() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Create Form State (dedicated strictly to adding new items)
  const [title, setTitle] = useState('');
  const [type, setType] = useState('news');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState('news');
  const [editDate, setEditDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?all=true');
      if (res.ok) {
        const json = await res.json();
        setEventsList(json.data || json.events || []);
      }
    } catch (e) {
      console.error('Error fetching events:', e);
      setFeedback({ type: 'error', message: 'Failed to fetch events from database.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetCreateForm = () => {
    setTitle('');
    setType('news');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setImageUrl('');
    setIsActive(true);
    setImageFile(null);
    setImagePreview('');
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || '');
    setEditType(item.type || 'news');
    setEditDate(
      item.date
        ? new Date(item.date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    );
    setEditDescription(item.description || '');
    setEditImageUrl(item.imageUrl || '');
    setEditImagePreview(item.imageUrl || '');
    setEditImageFile(null);
    setEditIsActive(item.isActive !== undefined ? item.isActive : true);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setEditImageFile(null);
    setEditImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // POST new event/news
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      let finalImageUrl = imageUrl;

      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          finalImageUrl = uploadJson.url || finalImageUrl;
        }
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        type,
        imageUrl: finalImageUrl,
        isActive,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish item');
      }

      setFeedback({ type: 'success', message: `"${title}" successfully published!` });
      resetCreateForm();
      fetchEvents();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  // PUT update event/news in modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setEditSubmitting(true);
    try {
      let finalImageUrl = editImageUrl;

      if (editImageFile) {
        const uploadData = new FormData();
        uploadData.append('file', editImageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          finalImageUrl = uploadJson.url || finalImageUrl;
        }
      }

      const payload = {
        title: editTitle.trim(),
        description: editDescription.trim(),
        date: editDate ? new Date(editDate).toISOString() : new Date().toISOString(),
        type: editType,
        imageUrl: finalImageUrl,
        isActive: editIsActive,
      };

      const res = await fetch(`/api/events/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update item');
      }

      // Optimistically update local state immediately
      setEventsList((prev) =>
        prev.map((item) =>
          item._id === editingItem._id
            ? { ...item, ...payload, updatedAt: new Date().toISOString() }
            : item
        )
      );

      setFeedback({ type: 'success', message: `"${editTitle}" successfully updated!` });
      setEditingItem(null);
      fetchEvents();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update item.' });
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (id, itemTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${itemTitle || 'this item'}"?`);
    if (!confirmed) return;

    // Optimistically remove from state immediately
    setEventsList((prev) => prev.filter((item) => item._id !== id));
    if (editingItem && editingItem._id === id) {
      setEditingItem(null);
    }

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Item deleted successfully.' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete item');
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to delete item.' });
      fetchEvents();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            News &amp; Events Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Publish updates, manage campus announcements, and schedule events with date synchronization.
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold self-start transition border border-gray-200 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Database</span>
        </button>
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

      {/* Grid: Creation Form (Dedicated to Add New) & Events List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Create Form */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
              <div className="p-2 bg-red-50 rounded-xl text-[#A01A22]">
                <Plus className="w-4 h-4" />
              </div>
              <span>Add New Event / News</span>
            </div>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Headline / Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Sports & Speech Competition"
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none transition text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                >
                  <option value="news">News</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Date (Calendar Sync) *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <span className="block font-bold text-gray-800 text-xs">Active Status</span>
                <span className="text-[11px] text-gray-500">
                  {isActive ? 'Visible to public on website' : 'Hidden from public website'}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#A01A22]"></div>
              </label>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Description / Details *
              </label>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed information regarding the news announcement or campus event..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none resize-none text-xs"
              ></textarea>
            </div>

            {/* Image Picker / URL */}
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Event Photo (Upload or URL)
              </label>
              <div className="border border-dashed border-red-200 rounded-xl p-4 text-center hover:border-[#A01A22] transition bg-red-50/30">
                <input
                  type="file"
                  accept="image/*"
                  id="eventImage"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="eventImage" className="cursor-pointer block">
                  <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1.5" />
                  <span className="text-gray-800 font-semibold block text-xs">
                    {imageFile ? imageFile.name : 'Click to select photo'}
                  </span>
                  <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                </label>
              </div>

              {imagePreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-32 w-full">
                  <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
              >
                <Newspaper className="w-4 h-4" />
                <span>{submitting ? 'Publishing...' : 'Publish Event / News'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Existing Events / News List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 font-serif">
              Database Records ({eventsList.length})
            </h2>
          </div>

          {eventsList.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 space-y-3 shadow-lg">
              <Newspaper className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">No events or news stored in MongoDB yet.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Use the form on the left to create announcements and events. They sync live across the campus portal and calendar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventsList.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white border rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md hover:shadow-lg transition ${
                    editingItem?._id === item._id ? 'border-[#A01A22] ring-1 ring-[#A01A22]' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {item.imageUrl ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <Image src={item.imageUrl} alt={item.title} fill sizes="56px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#A01A22] shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            item.type === 'event'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-[#A01A22]'
                          }`}
                        >
                          {item.type || 'news'}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          {new Date(item.date || item.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                        {item.isActive === false && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-600">
                            Draft
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#A01A22] transition"
                      title="Edit item"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.title)}
                      className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                      title="Delete item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal Popup */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-gray-200 my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-50 text-[#A01A22] rounded-xl">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-gray-900">Edit Event / News</h3>
                  <p className="text-xs text-gray-500">Update event details, dates, or media synchronization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Edit Form */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Annual Sports & Speech Competition"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Type *
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                  >
                    <option value="news">News</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Date (Calendar Sync) *
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <span className="block font-bold text-gray-800 text-xs">Active Status</span>
                  <span className="text-[11px] text-gray-500">
                    {editIsActive ? 'Visible to public on website' : 'Hidden from public website'}
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

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Description / Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Detailed information regarding the news announcement or campus event..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none resize-none text-xs"
                ></textarea>
              </div>

              {/* Image URL & File Upload */}
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Image URL / Photo Attachment
                </label>
                <input
                  type="text"
                  value={editImageUrl}
                  onChange={(e) => {
                    setEditImageUrl(e.target.value);
                    setEditImagePreview(e.target.value);
                  }}
                  placeholder="https://... or /images/..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs mb-2"
                />

                <div className="border border-dashed border-red-200 rounded-xl p-3 text-center bg-red-50/20 hover:border-[#A01A22] transition">
                  <input
                    type="file"
                    accept="image/*"
                    id="editEventImage"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                  <label htmlFor="editEventImage" className="cursor-pointer block">
                    <Upload className="w-4 h-4 text-[#A01A22] mx-auto mb-1" />
                    <span className="text-gray-800 font-semibold block text-xs">
                      {editImageFile ? editImageFile.name : 'Upload replacement photo'}
                    </span>
                    <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                  </label>
                </div>

                {editImagePreview && (
                  <div className="mt-2.5 relative rounded-xl overflow-hidden border border-gray-200 h-28 w-full">
                    <Image src={editImagePreview} alt="Preview" fill unoptimized className="object-cover" />
                  </div>
                )}
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-2.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center gap-2 disabled:opacity-50 hover:shadow-lg"
                >
                  {editSubmitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>{editSubmitting ? 'Saving Changes...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
