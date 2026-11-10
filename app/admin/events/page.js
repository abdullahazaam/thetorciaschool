'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Plus,
  Pencil,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'Academic',
  'Early Years',
  'STEM & Innovation',
  'Cultural & Values',
  'Character Building',
  'Co-Curricular',
  'Parent-Teacher Consultation',
  'Exam & Assessments',
  'Campus Event',
];

export default function AdminEventsPage() {
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dedicated Creation Sidebar State
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [newTime, setNewTime] = useState('9:00 AM – 12:00 PM');
  const [newLocation, setNewLocation] = useState('Main Campus, Nazimabad');
  const [newCategory, setNewCategory] = useState('Academic');
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');

  // Dedicated Edit Popup Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editCategory, setEditCategory] = useState('Academic');
  const [editDescription, setEditDescription] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events?all=true');
      if (res.ok) {
        const json = await res.json();
        setEventsList(json.data || []);
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
    setNewTitle('');
    setNewDate(new Date().toISOString().split('T')[0]);
    setNewTime('9:00 AM – 12:00 PM');
    setNewLocation('Main Campus, Nazimabad');
    setNewCategory('Academic');
    setNewDescription('');
    setNewImageUrl('');
    setNewIsActive(true);
    setNewImageFile(null);
    setNewImagePreview('');
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || '');
    setEditDate(item.date ? new Date(item.date).toISOString().split('T')[0] : '');
    setEditTime(item.time || '9:00 AM – 12:00 PM');
    setEditLocation(item.location || 'Main Campus, Nazimabad');
    setEditCategory(item.category || 'Academic');
    setEditDescription(item.description || '');
    setEditImageUrl(item.imageUrl || '');
    setEditImagePreview(item.imageUrl || '');
    setEditIsActive(item.isActive !== undefined ? item.isActive : true);
    setEditImageFile(null);
  };

  const handleCloseEditModal = () => {
    setEditingItem(null);
  };

  const handleCreateImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImageFile(file);
      setEditImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Create (Sidebar Form)
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      let finalImageUrl = newImageUrl;

      if (newImageFile) {
        const uploadData = new FormData();
        uploadData.append('file', newImageFile);

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
        title: newTitle.trim(),
        description: newDescription.trim(),
        date: newDate ? new Date(newDate).toISOString() : new Date().toISOString(),
        time: newTime.trim(),
        location: newLocation.trim(),
        category: newCategory.trim(),
        type: 'event',
        imageUrl: finalImageUrl,
        isActive: newIsActive,
      };

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule event');
      }

      setEventsList((prev) => [data.data, ...prev]);
      setFeedback({
        type: 'success',
        message: `Event "${newTitle}" scheduled and published to the dynamic calendar!`,
      });

      resetCreateForm();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit (Inside Popup Modal)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setModalSubmitting(true);
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
        time: editTime.trim(),
        location: editLocation.trim(),
        category: editCategory.trim(),
        type: 'event',
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
        throw new Error(data.error || 'Failed to update event');
      }

      setEventsList((prev) =>
        prev.map((evt) => (evt._id === editingItem._id ? data.data : evt))
      );

      setFeedback({
        type: 'success',
        message: `Event "${editTitle}" updated successfully!`,
      });

      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update event.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDelete = async (id, eventTitle) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${eventTitle || 'this event'}"?`);
    if (!confirmed) return;

    setEventsList((prev) => prev.filter((item) => item._id !== id));
    if (editingItem && editingItem._id === id) {
      handleCloseEditModal();
    }

    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Event deleted successfully.' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete event');
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to delete event.' });
      fetchEvents();
    }
  };

  const handleToggleActive = async (item) => {
    const newStatus = !item.isActive;
    setEventsList((prev) =>
      prev.map((e) => (e._id === item._id ? { ...e, isActive: newStatus } : e))
    );

    try {
      const res = await fetch(`/api/events/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      });
      if (!res.ok) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      fetchEvents();
    }
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return eventsList.filter((evt) => {
      const matchesSearch =
        searchQuery === '' ||
        evt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'All' || evt.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [eventsList, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            Academic Calendar &amp; Events Manager
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Schedule academic milestones, workshops, and school events that automatically reflect on the public dynamic calendar.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/news#calendar"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-50 text-[#A01A22] hover:bg-red-100 text-xs font-bold transition border border-red-200"
          >
            <span>Live Calendar</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={fetchEvents}
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

      {/* Grid: Creation Sidebar & Events Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation Column (Never mutates into an edit form) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-lg self-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
              <div className="p-2 bg-red-50 rounded-xl text-[#A01A22]">
                <Plus className="w-4 h-4" />
              </div>
              <span>Schedule New Event</span>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              New Event
            </span>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Event Title *
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. STEM Robotics &amp; Coding Discovery Lab"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Event Date *
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Time / Schedule
                </label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 9:00 AM – 11:30 AM"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Campus Location
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. STEM Lab, Block 5C"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Event Description &amp; Details *
              </label>
              <textarea
                rows={3}
                required
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Explain the event objective, activities involved, and which grades should participate..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs resize-none"
              ></textarea>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <span className="block font-bold text-gray-800 text-xs">Calendar Visibility</span>
                <span className="text-[11px] text-gray-500">
                  {newIsActive ? 'Published on user calendar' : 'Hidden from public calendar'}
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

            {/* Optional Banner Upload */}
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Event Poster / Flyer (Optional)
              </label>
              <div className="border border-dashed border-red-200 rounded-xl p-3.5 text-center hover:border-[#A01A22] transition bg-red-50/30">
                <input
                  type="file"
                  accept="image/*"
                  id="createEventImage"
                  onChange={handleCreateImageChange}
                  className="hidden"
                />
                <label htmlFor="createEventImage" className="cursor-pointer block">
                  <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1" />
                  <span className="text-gray-800 font-semibold block text-xs">
                    {newImageFile ? newImageFile.name : 'Upload event image'}
                  </span>
                  <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                </label>
              </div>

              {newImagePreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-24 w-full bg-slate-100">
                  <Image src={newImagePreview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{submitting ? 'Scheduling...' : 'Schedule Event'}</span>
            </button>
          </form>
        </div>

        {/* Existing Events List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900 font-serif">
              Scheduled Events ({filteredEvents.length} of {eventsList.length})
            </h2>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event, location..."
                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A01A22] w-full sm:w-52"
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
            {CATEGORIES.map((cat) => (
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

          {filteredEvents.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 space-y-3 shadow-lg">
              <CalendarIcon className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">No events found matching your criteria.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Use the form to schedule new events. They will immediately show up on the dynamic real-time calendar for parents and visitors.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((item) => {
                const eventDate = new Date(item.date);
                const day = eventDate.getDate();
                const monthName = eventDate.toLocaleString('default', { month: 'short' });
                const year = eventDate.getFullYear();

                return (
                  <div
                    key={item._id}
                    className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md hover:shadow-lg transition"
                  >
                    <div className="flex items-start gap-4 min-w-0 flex-1">
                      {/* Date Badge */}
                      <div className="w-14 h-16 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center shrink-0 text-[#A01A22] shadow-sm">
                        <span className="text-[10px] uppercase font-bold tracking-wider">{monthName}</span>
                        <span className="text-xl font-extrabold font-serif leading-none mt-0.5">{day}</span>
                        <span className="text-[9px] text-gray-500 font-medium">{year}</span>
                      </div>

                      {/* Event Details */}
                      <div className="space-y-1.5 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#A01A22]">
                            {item.category || 'Academic'}
                          </span>
                          {!item.isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600">
                              Hidden
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm sm:text-base tracking-tight leading-snug">
                          {item.title}
                        </h3>

                        <div className="flex items-center gap-3 text-[11px] text-gray-600 flex-wrap">
                          {item.time && (
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3 h-3 text-[#A01A22]" />
                              <span>{item.time}</span>
                            </span>
                          )}
                          {item.location && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              <span>{item.location}</span>
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`p-2 rounded-xl text-xs font-semibold transition ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={item.isActive ? 'Hide from calendar' : 'Show on calendar'}
                      >
                        {item.isActive ? 'Active' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#A01A22] transition text-xs font-semibold flex items-center gap-1"
                        title="Edit event via Popup Modal"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sleek Centered Popup Modal with Backdrop Blur for Editing Events */}
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
                    Edit Calendar Event
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    Modifying event date, schedule, category, and details
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
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Category *
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Time / Schedule
                  </label>
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Event Description &amp; Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <span className="block font-bold text-gray-800 text-xs">Calendar Visibility</span>
                  <span className="text-[11px] text-gray-500">
                    {editIsActive ? 'Published on live calendar' : 'Hidden from public calendar'}
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

              {/* Photo Upload */}
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Event Poster / Flyer (Optional)
                </label>
                <div className="border border-dashed border-red-200 rounded-xl p-3.5 text-center hover:border-[#A01A22] transition bg-red-50/30">
                  <input
                    type="file"
                    accept="image/*"
                    id="editEventImage"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                  <label htmlFor="editEventImage" className="cursor-pointer block">
                    <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1" />
                    <span className="text-gray-800 font-semibold block text-xs">
                      {editImageFile ? editImageFile.name : 'Upload replacement image'}
                    </span>
                    <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                  </label>
                </div>

                {editImagePreview && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-24 w-full bg-slate-100">
                    <Image src={editImagePreview} alt="Preview" fill unoptimized className="object-cover" />
                  </div>
                )}
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
                  <span>{modalSubmitting ? 'Saving Event...' : 'Save Event Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
