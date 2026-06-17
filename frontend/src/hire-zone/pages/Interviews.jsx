import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { interviews as interviewsAPI, jobApplications as applicationsAPI } from '@/utils/api';
import toast from 'react-hot-toast';

const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a', '#6366f1'];
const FILTERS = ['All', 'Scheduled', 'Completed', 'Cancelled'];

const TYPE_STYLE = {
  Video:        { bg: '#dbeafe', text: '#2563eb', emoji: '🎥' },
  'In-person':  { bg: '#dcfce7', text: '#16a34a', emoji: '🏢' },
  Phone:        { bg: '#fef3c7', text: '#d97706', emoji: '📞' },
  'Online Test':{ bg: '#ede9fe', text: '#7c3aed', emoji: '💻' },
};

const STATUS_STYLE = {
  Scheduled:   'bg-blue-100 text-blue-700',
  Completed:   'bg-green-100 text-green-700',
  Cancelled:   'bg-red-100 text-red-500',
  Rescheduled: 'bg-yellow-100 text-yellow-600',
  'No-show':   'bg-neutral-100 text-neutral-500',
};

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all';

// ── Edit Meeting Link Modal ────────────────────────────────────────────────
const EditLinkModal = ({ interview, onClose, onSave }) => {
  const [link, setLink] = useState(interview?.link || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (link && !link.startsWith('http')) {
      toast.error('Please enter a valid URL starting with http:// or https://');
      return;
    }
    setSaving(true);
    try {
      await interviewsAPI.update(interview.id, { interviewLink: link });
      onSave(interview.id, link);
      toast.success('Meeting link updated');
      onClose();
    } catch {
      toast.error('Failed to update link');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Edit Meeting Link</h2>
              <p className="text-xs text-neutral-400 mt-0.5">{interview?.candidate} — {interview?.role}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Meeting Link</label>
              <input
                type="text"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={link}
                onChange={e => setLink(e.target.value)}
                className={inputCls}
                autoFocus
              />
              <p className="text-xs text-neutral-400 mt-1">Supports Google Meet, Zoom, Teams, or any URL</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-70" style={{ background: '#8B3A8F' }}>
                {saving ? 'Saving...' : 'Save Link'}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Schedule Interview Modal ────────────────────────────────────────────────
const ScheduleModal = ({ onClose, onSubmit, applications }) => {
  const [form, setForm] = useState({
    applicationId: '', date: '', time: '', type: 'Video',
    interviewLink: '', interviewLocation: '', notes: '', duration: 30,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  const validate = () => {
    const e = {};
    if (!form.applicationId) e.applicationId = 'Select a candidate';
    if (!form.date)           e.date          = 'Required';
    if (!form.time)           e.time          = 'Required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    // Convert time input (HH:MM) → display string
    const [h, m] = form.time.split(':');
    const hr = parseInt(h); const ampm = hr >= 12 ? 'PM' : 'AM';
    const timeDisplay = `${hr % 12 || 12}:${m} ${ampm}`;

    onSubmit({
      applicationId:     form.applicationId,
      interviewDate:     form.date,
      interviewTime:     timeDisplay,
      interviewType:     form.type,
      interviewLink:     form.interviewLink,
      interviewLocation: form.interviewLocation,
      notes:             form.notes,
      duration:          parseInt(form.duration) || 30,
    });
  };

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Schedule Interview</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Pick an applicant and set the interview details.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Candidate picker */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Candidate <span className="text-red-400">*</span></label>
              {applications.length === 0 ? (
                <p className="text-xs text-neutral-400 bg-neutral-50 rounded-xl p-3">No pending applications to schedule.</p>
              ) : (
                <select
                  value={form.applicationId}
                  onChange={e => set('applicationId', e.target.value)}
                  className={`${inputCls} ${errors.applicationId ? 'border-red-300 bg-red-50' : ''}`}
                >
                  <option value="">Select a candidate...</option>
                  {applications.map(a => (
                    <option key={a.id} value={a.id}>{a.name} — {a.appliedRole}</option>
                  ))}
                </select>
              )}
              {errors.applicationId && <p className="text-xs text-red-500 mt-1">{errors.applicationId}</p>}
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Date <span className="text-red-400">*</span></label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={`${inputCls} ${errors.date ? 'border-red-300 bg-red-50' : ''}`} />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Time <span className="text-red-400">*</span></label>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={`${inputCls} ${errors.time ? 'border-red-300 bg-red-50' : ''}`} />
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Interview type */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-2">Interview Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['Video', 'In-person', 'Phone', 'Online Test'].map(t => {
                  const s = TYPE_STYLE[t]; const active = form.type === t;
                  return (
                    <button key={t} type="button" onClick={() => set('type', t)}
                      className="flex flex-col items-center py-2.5 rounded-xl text-[11px] font-semibold border-2 transition-all"
                      style={active ? { borderColor: s.text, background: s.bg, color: s.text } : { borderColor: '#e5e7eb', color: '#6b7280' }}>
                      <span className="text-base mb-0.5">{s.emoji}</span>{t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Link / Location */}
            {(form.type === 'Video' || form.type === 'Online Test') && (
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Meeting Link</label>
                <input type="text" placeholder="https://meet.google.com/..." value={form.interviewLink} onChange={e => set('interviewLink', e.target.value)} className={inputCls} />
              </div>
            )}
            {form.type === 'In-person' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Location / Address</label>
                <input type="text" placeholder="Office address or room number" value={form.interviewLocation} onChange={e => set('interviewLocation', e.target.value)} className={inputCls} />
              </div>
            )}

            {/* Duration + Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Duration (mins)</label>
                <select value={form.duration} onChange={e => set('duration', e.target.value)} className={inputCls}>
                  {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Notes</label>
                <input type="text" placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm" style={{ background: '#8B3A8F' }}>
                Schedule Interview
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const Interviews = () => {
  const [filter, setFilter]         = useState('All');
  const [interviewsList, setInterviewsList] = useState([]);
  const [applications, setApplications]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showModal, setShowModal]   = useState(false);
  const [editingLink, setEditingLink] = useState(null); // interview to edit link for

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ivRes, appRes] = await Promise.all([
        interviewsAPI.getCompanyInterviews(),
        applicationsAPI.getCompanyApplicants(),
      ]);

      const ivs = (ivRes.data.interviews || []).map(iv => ({
        id:          iv._id,
        candidate:   iv.candidateId ? `${iv.candidateId.firstName} ${iv.candidateId.lastName}`.trim() : 'Unknown',
        profilePicture: iv.candidateId?.profilePicture || '',
        avatar:      (iv.candidateId?.firstName || 'U').charAt(0).toUpperCase(),
        role:        iv.jobId?.title || '—',
        date:        new Date(iv.interviewDate).toISOString().split('T')[0],
        time:        iv.interviewTime,
        type:        iv.interviewType,
        status:      iv.status,
        link:        iv.interviewLink || '',
        location:    iv.interviewLocation || '',
        notes:       iv.notes || '',
        duration:    iv.duration || 30,
        applicationId: iv.applicationId?._id || iv.applicationId,
      }));

      setInterviewsList(ivs);

      // Only exclude applications that have an ACTIVE (non-cancelled) interview
      const scheduledAppIds = new Set(
        ivs.filter(iv => iv.status !== 'Cancelled').map(iv => String(iv.applicationId))
      );
      const pending = (appRes.data.applications || []).filter(
        a => !scheduledAppIds.has(String(a.id))
      );
      setApplications(pending);
    } catch (err) {
      console.error('Failed to load interviews:', err);
      toast.error('Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSchedule = async (formData) => {
    try {
      const res = await interviewsAPI.schedule(formData);
      const iv = res.data.interview;
      const app = applications.find(a => a.id === formData.applicationId);

      const newIv = {
        id:          iv._id,
        candidate:   app?.name || 'Candidate',
        profilePicture: app?.profilePicture || '',
        avatar:      (app?.name || 'C').charAt(0).toUpperCase(),
        role:        app?.appliedRole || '—',
        date:        formData.interviewDate,
        time:        formData.interviewTime,
        type:        formData.interviewType,
        status:      'Scheduled',
        link:        formData.interviewLink || '',
        location:    formData.interviewLocation || '',
        notes:       formData.notes || '',
        duration:    formData.duration || 30,
        applicationId: formData.applicationId,
      };

      setInterviewsList(prev => [newIv, ...prev]);
      setApplications(prev => prev.filter(a => a.id !== formData.applicationId));
      setShowModal(false);
      toast.success(`Interview scheduled for ${newIv.candidate}`);
    } catch (err) {
      console.error('Schedule failed:', err);
      toast.error(err.response?.data?.message || 'Failed to schedule interview');
    }
  };

  const handleCancel = async (iv) => {
    try {
      await interviewsAPI.cancel(iv.id);
      setInterviewsList(prev => prev.map(x => x.id === iv.id ? { ...x, status: 'Cancelled' } : x));
      toast.success('Interview cancelled');
    } catch (err) {
      toast.error('Failed to cancel interview');
    }
  };

  const handleMarkComplete = async (iv) => {
    try {
      await interviewsAPI.update(iv.id, { status: 'Completed' });
      setInterviewsList(prev => prev.map(x => x.id === iv.id ? { ...x, status: 'Completed' } : x));
      toast.success('Marked as completed');
    } catch (err) {
      toast.error('Failed to update interview');
    }
  };

  const handleSaveLink = (id, link) => {
    setInterviewsList(prev => prev.map(x => x.id === id ? { ...x, link } : x));
  };

  const filtered = filter === 'All' ? interviewsList : interviewsList.filter(i => i.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? interviewsList.length : interviewsList.filter(i => i.status === f).length;
    return acc;
  }, {});

  const grouped = filtered.reduce((acc, iv) => {
    const d = iv.date;
    if (!acc[d]) acc[d] = [];
    acc[d].push(iv);
    return acc;
  }, {});

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const formatDate = (d) => {
    if (d === today) return 'Today';
    if (d === tomorrow) return 'Tomorrow';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <SectionHeader title="Interviews" subtitle="Schedule and track all candidate interviews." />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 shadow-sm"
            style={{ background: '#8B3A8F' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Schedule Interview
          </motion.button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Scheduled', color: '#2563eb' },
            { label: 'Completed', color: '#16a34a' },
            { label: 'Cancelled', color: '#ea580c' },
          ].map(({ label, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-neutral-100 p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilter(label)}>
              <p className="text-3xl font-bold" style={{ color }}>{loading ? '—' : counts[label]}</p>
              <p className="text-xs text-neutral-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 mb-5 w-fit">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {f} ({loading ? '…' : counts[f]})
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-5 flex items-center gap-4 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-neutral-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-neutral-200 rounded w-1/3" />
                  <div className="h-3 bg-neutral-100 rounded w-1/4" />
                </div>
                <div className="h-4 w-16 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 py-16 text-center">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-sm text-neutral-500">
              {interviewsList.length === 0 ? 'No interviews scheduled yet.' : 'No interviews in this category.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, ivs]) => (
                <div key={date}>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {formatDate(date)}
                  </p>
                  <div className="space-y-3">
                    {ivs.map((iv, i) => {
                      const t = TYPE_STYLE[iv.type] ?? TYPE_STYLE.Video;
                      return (
                        <motion.div key={iv.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl border border-neutral-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                          {iv.profilePicture ? (
                            <img src={iv.profilePicture} alt={iv.candidate} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                              style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                              {iv.avatar}
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-neutral-900">{iv.candidate}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[iv.status] || 'bg-neutral-100 text-neutral-500'}`}>
                                {iv.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{iv.role}</p>
                            {iv.duration > 0 && <p className="text-xs text-neutral-400 mt-0.5">{iv.duration} min</p>}
                            {iv.notes && <p className="text-xs text-neutral-400 mt-0.5 italic">"{iv.notes}"</p>}
                            {iv.link && (
                              <p className="text-[10px] text-green-600 font-medium mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                Meeting link ready
                              </p>
                            )}
                            {iv.location && !iv.link && (
                              <p className="text-xs text-neutral-400 mt-0.5">📍 {iv.location}</p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-neutral-800">{iv.time}</p>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 inline-block"
                              style={{ background: t.bg, color: t.text }}>
                              {t.emoji} {iv.type}
                            </span>
                          </div>

                          {iv.status === 'Scheduled' && (
                            <div className="flex gap-2 shrink-0 ml-2">
                              {iv.link && (
                                <a href={iv.link} target="_blank" rel="noopener noreferrer"
                                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors">
                                  Join
                                </a>
                              )}
                              <button onClick={() => setEditingLink(iv)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                                {iv.link ? 'Edit Link' : 'Add Link'}
                              </button>
                              <button onClick={() => handleMarkComplete(iv)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-200 text-green-600 hover:bg-green-50 transition-colors">
                                Done
                              </button>
                              <button onClick={() => handleCancel(iv)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
                                Cancel
                              </button>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <ScheduleModal
            onClose={() => setShowModal(false)}
            onSubmit={handleSchedule}
            applications={applications}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editingLink && (
          <EditLinkModal
            interview={editingLink}
            onClose={() => setEditingLink(null)}
            onSave={handleSaveLink}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interviews;
