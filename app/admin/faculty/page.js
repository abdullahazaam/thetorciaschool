'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  User,
  X,
  Briefcase,
  Award,
  Calendar,
} from 'lucide-react';

export default function AdminFacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Form & Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [name, setName] = useState('');
  const [degree, setDegree] = useState('');
  const [designation, setDesignation] = useState('');
  const [experience, setExperience] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faculty?all=true');
      if (res.ok) {
        const json = await res.json();
        setFacultyList(json.data || []);
      }
    } catch (e) {
      console.error('Error fetching faculty:', e);
      setFeedback({ type: 'error', message: 'Failed to fetch faculty list.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const resetForm = () => {
    setEditingItem(null);
    setName('');
    setDegree('');
    setDesignation('');
    setExperience('');
    setImageUrl('');
    setIsActive(true);
    setImageFile(null);
    setImagePreview('');
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setName(item.name || '');
    setDegree(item.degree || '');
    setDesignation(item.designation || '');
    setExperience(item.experience || '');
    setImageUrl(item.imageUrl || '');
    setImagePreview(item.imageUrl || '');
    setIsActive(item.isActive !== undefined ? item.isActive : true);
    setImageFile(null);
    setFeedback({ type: '', message: '' });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    resetForm();
    setFeedback({ type: '', message: '' });
  };

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
      let finalImageUrl = imageUrl;

      // Upload photo if new file selected
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
        name: name.trim(),
        degree: degree.trim(),
        designation: designation.trim(),
        experience: experience.trim(),
        imageUrl: finalImageUrl,
        isActive,
      };

      if (editingItem) {
        // UPDATE existing faculty
        const res = await fetch(`/api/faculty/${editingItem._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update faculty member');
        }

        // Optimistically update local UI state
        setFacultyList((prev) =>
          prev.map((f) => (f._id === editingItem._id ? data.data : f))
        );
        setFeedback({ type: 'success', message: `"${name}" profile updated successfully!` });
      } else {
        // CREATE new faculty member
        const res = await fetch('/api/faculty', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to add faculty member');
        }

        // Optimistically prepend to list
        setFacultyList((prev) => [data.data, ...prev]);
        setFeedback({ type: 'success', message: `"${name}" added to faculty successfully!` });
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Something went wrong.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, memberName) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${memberName || 'this faculty member'}"?`);
    if (!confirmed) return;

    // Immediately remove from local state without full reload
    setFacultyList((prev) => prev.filter((item) => item._id !== id));
    if (editingItem && editingItem._id === id) {
      resetForm();
    }

    try {
      const res = await fetch(`/api/faculty/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Faculty member removed successfully.' });
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete faculty member');
      }
    } catch (err) {
      console.error(err);
      setFeedback({ type: 'error', message: err.message || 'Failed to delete faculty member.' });
      fetchFaculty();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            Faculty &amp; Teaching Staff Management
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Maintain teacher profiles, professional degrees, credentials, and campus designations.
          </p>
        </div>
        <button
          onClick={fetchFaculty}
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

      {/* Grid: Form & List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
              <div className="p-2 bg-red-50 rounded-xl text-[#A01A22]">
                {editingItem ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </div>
              <span>{editingItem ? 'Edit Faculty Member' : 'Add New Faculty Member'}</span>
            </div>
            {editingItem && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mrs. Tahira Siddiqui"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-sm"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Designation / Position *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Senior Montessori Directress"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Degree / Qualifications *
                </label>
                <input
                  type="text"
                  required
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. M.Ed, AMI Certified"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 8+ Years"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <span className="block font-bold text-gray-800 text-xs">Active Status</span>
                <span className="text-[11px] text-gray-500">
                  {isActive ? 'Published on school website' : 'Hidden from public directory'}
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

            {/* Photo Upload */}
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Faculty Photo
              </label>
              <div className="border border-dashed border-red-200 rounded-xl p-4 text-center hover:border-[#A01A22] transition bg-red-50/30">
                <input
                  type="file"
                  accept="image/*"
                  id="facultyImage"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="facultyImage" className="cursor-pointer block">
                  <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1.5" />
                  <span className="text-gray-800 font-semibold block text-xs">
                    {imageFile ? imageFile.name : 'Click to select teacher photo'}
                  </span>
                  <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                </label>
              </div>

              {imagePreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-32 w-32 mx-auto">
                  <Image src={imagePreview} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
              >
                {editingItem ? <Pencil className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                <span>
                  {submitting
                    ? 'Saving...'
                    : editingItem
                      ? 'Save Profile Changes'
                      : 'Add Faculty Member'}
                </span>
              </button>

              {editingItem && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-5 py-3.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Existing Faculty List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 font-serif">
              Faculty Directory ({facultyList.length})
            </h2>
          </div>

          {facultyList.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 space-y-3 shadow-lg">
              <GraduationCap className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">No faculty members stored in MongoDB yet.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add certified educators using the form. They will appear live on the public Academics &amp; Teaching Quality pages.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {facultyList.map((item) => (
                <div
                  key={item._id}
                  className={`bg-white border rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition ${
                    editingItem?._id === item._id ? 'border-[#A01A22] ring-1 ring-[#A01A22]' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {item.imageUrl ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                        <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#A01A22] shrink-0">
                        <User className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                        {item.isActive === false && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-gray-200 text-gray-600">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#A01A22] truncate">{item.designation}</p>
                      <p className="text-[11px] text-gray-600 truncate flex items-center gap-1">
                        <Award className="w-3 h-3 text-gray-400 shrink-0" />
                        <span>{item.degree}</span>
                      </p>
                      {item.experience && (
                        <p className="text-[11px] text-gray-500 truncate flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{item.experience}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#A01A22] transition text-xs font-semibold flex items-center gap-1"
                      title="Edit member"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1"
                      title="Delete member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
