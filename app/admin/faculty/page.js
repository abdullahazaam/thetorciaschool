'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Layers,
  Sparkles,
  Search,
} from 'lucide-react';

const DEPARTMENTS = [
  'Montessori & Early Years',
  'Primary Section',
  'STEM & Robotics',
  'Islamic Studies & Adab',
  'Languages & Arts',
  'Physical Education',
  'Administration & Leadership',
];

export default function AdminFacultyPage() {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalSubmitting, setModalSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filtering & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  // Dedicated Creation Sidebar State
  const [newName, setNewName] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newDepartment, setNewDepartment] = useState('Montessori & Early Years');
  const [newStandards, setNewStandards] = useState('');
  const [newExperience, setNewExperience] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newIsActive, setNewIsActive] = useState(true);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState('');

  // Dedicated Edit Popup Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDegree, setEditDegree] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editDepartment, setEditDepartment] = useState('Montessori & Early Years');
  const [editStandards, setEditStandards] = useState('');
  const [editExperience, setEditExperience] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');

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

  const resetCreateForm = () => {
    setNewName('');
    setNewDegree('');
    setNewDesignation('');
    setNewDepartment('Montessori & Early Years');
    setNewStandards('');
    setNewExperience('');
    setNewImageUrl('');
    setNewIsActive(true);
    setNewImageFile(null);
    setNewImagePreview('');
  };

  // Open Edit Popup Modal
  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setEditName(item.name || '');
    setEditDegree(item.degree || '');
    setEditDesignation(item.designation || '');
    setEditDepartment(item.department || 'Montessori & Early Years');
    setEditStandards(item.standards || '');
    setEditExperience(item.experience || '');
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
        name: newName.trim(),
        degree: newDegree.trim(),
        designation: newDesignation.trim(),
        department: newDepartment.trim(),
        standards: newStandards.trim(),
        experience: newExperience.trim(),
        imageUrl: finalImageUrl,
        isActive: newIsActive,
      };

      const res = await fetch('/api/faculty', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to add faculty member');
      }

      setFacultyList((prev) => [data.data, ...prev]);
      setFeedback({ type: 'success', message: `"${newName}" added to faculty successfully!` });
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
        name: editName.trim(),
        degree: editDegree.trim(),
        designation: editDesignation.trim(),
        department: editDepartment.trim(),
        standards: editStandards.trim(),
        experience: editExperience.trim(),
        imageUrl: finalImageUrl,
        isActive: editIsActive,
      };

      const res = await fetch(`/api/faculty/${editingItem._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update faculty member');
      }

      // Optimistically update local list
      setFacultyList((prev) =>
        prev.map((f) => (f._id === editingItem._id ? data.data : f))
      );
      setFeedback({ type: 'success', message: `"${editName}" profile updated successfully!` });

      // Automatically close modal
      handleCloseEditModal();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to update profile.');
    } finally {
      setModalSubmitting(false);
    }
  };

  const handleDelete = async (id, memberName) => {
    const confirmed = window.confirm(`Are you sure you want to remove "${memberName || 'this faculty member'}"?`);
    if (!confirmed) return;

    setFacultyList((prev) => prev.filter((item) => item._id !== id));
    if (editingItem && editingItem._id === id) {
      handleCloseEditModal();
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

  // Filtered faculty list
  const filteredFaculty = useMemo(() => {
    return facultyList.filter((f) => {
      const matchesSearch =
        searchQuery === '' ||
        f.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.degree?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.standards?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDept === 'All' || f.department === selectedDept;

      return matchesSearch && matchesDept;
    });
  }, [facultyList, searchQuery, selectedDept]);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black font-serif text-gray-900 tracking-tight">
            Faculty &amp; Teaching Standards Manager
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Maintain educator profiles, academic qualifications, teaching criteria, and campus designations.
          </p>
        </div>
        <button
          onClick={fetchFaculty}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold self-start transition border border-gray-200 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
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

      {/* Grid: Creation Sidebar & Directory Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Creation Column (Never mutates into an edit form) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-lg self-start">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg font-serif">
              <div className="p-2 bg-red-50 rounded-xl text-[#A01A22]">
                <Plus className="w-4 h-4" />
              </div>
              <span>Add Educator / Standard</span>
            </div>
            <span className="text-[11px] font-semibold text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">
              New Profile
            </span>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Full Name / Lead Title *
              </label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
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
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                placeholder="e.g. Senior Montessori Directress"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Department *
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Experience
                </label>
                <input
                  type="text"
                  value={newExperience}
                  onChange={(e) => setNewExperience(e.target.value)}
                  placeholder="e.g. 8+ Years"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Degree &amp; Credentials *
              </label>
              <input
                type="text"
                required
                value={newDegree}
                onChange={(e) => setNewDegree(e.target.value)}
                placeholder="e.g. M.Ed, AMI Certified, B.Sc Honours"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Teaching Standard / Specialized Criteria
              </label>
              <input
                type="text"
                value={newStandards}
                onChange={(e) => setNewStandards(e.target.value)}
                placeholder="e.g. ECE Montessori Certified, Monthly Child Psychology Training"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
              <div>
                <span className="block font-bold text-gray-800 text-xs">Publish Status</span>
                <span className="text-[11px] text-gray-500">
                  {newIsActive ? 'Published on website' : 'Hidden from public directory'}
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

            {/* Photo Upload */}
            <div>
              <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                Educator Photo (Optional)
              </label>
              <div className="border border-dashed border-red-200 rounded-xl p-3.5 text-center hover:border-[#A01A22] transition bg-red-50/30">
                <input
                  type="file"
                  accept="image/*"
                  id="createFacultyImage"
                  onChange={handleCreateImageChange}
                  className="hidden"
                />
                <label htmlFor="createFacultyImage" className="cursor-pointer block">
                  <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1" />
                  <span className="text-gray-800 font-semibold block text-xs">
                    {newImageFile ? newImageFile.name : 'Select teacher photo'}
                  </span>
                  <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                </label>
              </div>

              {newImagePreview && (
                <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-24 w-24 mx-auto bg-slate-100 flex items-center justify-center p-1">
                  <Image src={newImagePreview} alt="Preview" fill unoptimized className="object-cover rounded-lg" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-full bg-[#A01A22] hover:bg-[#87131A] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{submitting ? 'Adding...' : 'Add Faculty Member'}</span>
            </button>
          </form>
        </div>

        {/* Existing Faculty List Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-gray-900 font-serif">
              Faculty Directory ({filteredFaculty.length} of {facultyList.length})
            </h2>

            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, qualification..."
                className="pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#A01A22] w-full sm:w-56"
              />
            </div>
          </div>

          {/* Department Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setSelectedDept('All')}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                selectedDept === 'All'
                  ? 'bg-[#A01A22] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All Wings
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1 rounded-full font-semibold transition shrink-0 ${
                  selectedDept === dept
                    ? 'bg-[#A01A22] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {filteredFaculty.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-500 space-y-3 shadow-lg">
              <GraduationCap className="w-10 h-10 text-gray-400 mx-auto" />
              <p className="text-sm font-medium text-gray-700">No faculty members found.</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {searchQuery || selectedDept !== 'All'
                  ? 'Try clearing the search query or selecting a different department filter.'
                  : 'Add certified educators using the form. They appear on the Academics & Teaching Quality pages.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFaculty.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between shadow-md hover:shadow-lg transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3.5">
                      {item.imageUrl ? (
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-gray-200 flex items-center justify-center p-0.5">
                          <Image src={item.imageUrl} alt={item.name} fill sizes="56px" className="object-cover rounded-lg" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-[#A01A22] shrink-0 font-bold text-lg font-serif">
                          {item.name ? item.name.charAt(0) : <User className="w-6 h-6" />}
                        </div>
                      )}

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                          {item.isActive === false && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-gray-200 text-gray-600">
                              Hidden
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

                    {/* Department Pill & Standards */}
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      {item.department && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-700">
                          <Layers className="w-3 h-3 text-[#A01A22] shrink-0" />
                          <span className="font-semibold">{item.department}</span>
                        </div>
                      )}
                      {item.standards && (
                        <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2 text-[10.5px] text-amber-900 flex items-start gap-1.5">
                          <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item.standards}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 pt-3 mt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-[#A01A22] transition text-xs font-semibold flex items-center gap-1"
                      title="Edit educator via Popup Modal"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.name)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition text-xs font-semibold flex items-center gap-1"
                      title="Delete educator"
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

      {/* Sleek Centered Popup Modal with Backdrop Blur for Editing Faculty */}
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
                    Edit Faculty Profile
                  </h3>
                  <span className="text-[11px] text-gray-500">
                    Updating teacher credentials, standards, and designations
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
                  Full Name / Lead Title *
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Designation / Position *
                </label>
                <input
                  type="text"
                  required
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Department *
                  </label>
                  <select
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-xs focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none font-medium"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={editExperience}
                    onChange={(e) => setEditExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Degree &amp; Credentials *
                </label>
                <input
                  type="text"
                  required
                  value={editDegree}
                  onChange={(e) => setEditDegree(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block uppercase tracking-wider text-gray-700 font-bold mb-1.5">
                  Teaching Standard / Specialized Criteria
                </label>
                <input
                  type="text"
                  value={editStandards}
                  onChange={(e) => setEditStandards(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 focus:border-[#A01A22] focus:ring-1 focus:ring-[#A01A22] outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <span className="block font-bold text-gray-800 text-xs">Publish Status</span>
                  <span className="text-[11px] text-gray-500">
                    {editIsActive ? 'Visible to public on website' : 'Hidden from public directory'}
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
                  Educator Photo (Optional)
                </label>
                <div className="border border-dashed border-red-200 rounded-xl p-3.5 text-center hover:border-[#A01A22] transition bg-red-50/30">
                  <input
                    type="file"
                    accept="image/*"
                    id="editFacultyImage"
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                  <label htmlFor="editFacultyImage" className="cursor-pointer block">
                    <Upload className="w-5 h-5 text-[#A01A22] mx-auto mb-1" />
                    <span className="text-gray-800 font-semibold block text-xs">
                      {editImageFile ? editImageFile.name : 'Select replacement photo'}
                    </span>
                    <span className="text-[10px] text-gray-500">Auto-uploaded to Cloudinary</span>
                  </label>
                </div>

                {editImagePreview && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200 h-24 w-24 mx-auto bg-slate-100 flex items-center justify-center p-1">
                    <Image src={editImagePreview} alt="Preview" fill unoptimized className="object-cover rounded-lg" />
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
                  <span>{modalSubmitting ? 'Saving Profile...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
