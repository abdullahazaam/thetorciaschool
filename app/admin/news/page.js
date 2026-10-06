'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Newspaper,
  Plus,
  Upload,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ImageIcon,
} from 'lucide-react';

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('News');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      if (res.ok) {
        const data = await res.json();
        setNewsList(data.news || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFeedback({ type: '', message: '' });

    try {
      let uploadedImageUrl = '';
      let uploadedImagePublicId = '';

      // 1. If an image was selected, upload it to Cloudinary via /api/upload
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append('file', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadData,
        });

        if (uploadRes.ok) {
          const uploadJson = await uploadRes.json();
          uploadedImageUrl = uploadJson.url || '';
          uploadedImagePublicId = uploadJson.public_id || '';
        }
      }

      // 2. Save news document to MongoDB via /api/news
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content,
          eventDate: eventDate || new Date().toISOString(),
          imageUrl: uploadedImageUrl,
          imagePublicId: uploadedImagePublicId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to publish news');
      }

      setFeedback({ type: 'success', message: 'Article successfully published!' });

      // Reset form
      setTitle('');
      setExcerpt('');
      setContent('');
      setEventDate('');
      setImageFile(null);
      setImagePreview('');

      // Refresh list
      fetchNews();
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      const res = await fetch(`/api/news?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchNews();
      }
    } catch (err) {
      console.error(err);
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
            Publish updates, upload event photos to Cloudinary, and manage campus announcements.
          </p>
        </div>
        <button
          onClick={fetchNews}
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

      {/* Grid: Creation Form & News List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-lg">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
            <div className="p-2 bg-red-50 rounded-xl text-[#A01A22]">
              <Plus className="w-4 h-4" />
            </div>
            <span>Create News / Event</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                >
                  <option value="News">News</option>
                  <option value="Event">Event</option>
                  <option value="Announcement">Announcement</option>
                  <option value="Achievement">Achievement</option>
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Event Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Short Excerpt *
              </label>
              <textarea
                rows={2}
                required
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief 1-2 sentence preview for cards..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none resize-none text-xs"
              ></textarea>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Full Content / Article *
              </label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Detailed information regarding the news or upcoming event..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none resize-none text-xs"
              ></textarea>
            </div>

            {/* Cloudinary Image Picker */}
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Event Photo (Cloudinary Upload)
              </label>
              <div className="border border-dashed border-red-200 rounded-xl p-4 text-center hover:border-[#A01A22] transition bg-red-50/30">
                <input
                  type="file"
                  accept="image/*"
                  id="newsImage"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="newsImage" className="cursor-pointer block">
                  <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1.5" />
                  <span className="text-gray-800 font-semibold block text-xs">Click to select photo</span>
                  <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                </label>
              </div>

              {imagePreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-32 w-full">
                  <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
            >
              <Newspaper className="w-4 h-4" />
              <span>{submitting ? 'Uploading & Publishing...' : 'Publish News Item'}</span>
            </button>
          </form>
        </div>

        {/* Existing News List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 font-serif">Database Records ({newsList.length})</h2>
          </div>

          {newsList.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 space-y-3 shadow-lg">
              <Newspaper className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">No articles stored in MongoDB yet.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Use the form on the left to create announcements. They will sync directly to the public website.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {newsList.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-md hover:shadow-lg transition"
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
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#A01A22]">
                          {item.category}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-sm truncate">{item.title}</h3>
                      <p className="text-xs text-gray-600 truncate">{item.excerpt}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition shrink-0"
                    title="Delete item from MongoDB"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
