import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { admin, interviews as interviewsAPI } from '@/utils/api';
import toast from 'react-hot-toast';
import { Calendar, Plus, Video, Building2, Phone, Laptop, MapPin, X, Check, Loader2, Save } from 'lucide-react';

const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a', '#6366f1'];
const FILTERS = ['All', 'Scheduled', 'Completed', 'Cancelled'];

const TYPE_STYLE = {
  Video:        { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Video },
  'In-person':  { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', icon: Building2 },
  Phone:        { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: Phone },
  'Online Test':{ bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', icon: Laptop },
};

const STATUS_STYLE = {
  Scheduled:   'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  Completed:   'bg-green-500/10 text-green-400 border border-green-500/20',
  Cancelled:   'bg-red-500/10 text-red-400 border border-red-500/20',
  Rescheduled: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  'No-show':   'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20',
};

const labelCls = 'block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1.5';
const inputCls = 'w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 transition-all';
const selectCls = 'w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-neutral-400 focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 transition-all';

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
      <motion.div className="fixed inset-0 z-[120] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md text-white overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <div>
              <h2 className="text-base font-bold">Edit Meeting Link</h2>
              <p className="text-xs text-neutral-500 mt-0.5">{interview?.candidate} — {interview?.role}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className={labelCls}>Meeting Link</label>
              <input
                type="text"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={link}
                onChange={e => setLink(e.target.value)}
                className={inputCls}
                autoFocus
              />
              <p className="text-[10px] text-neutral-500 mt-1">Supports Google Meet, Zoom, Teams, or any URL</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors">
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-purple-600 hover:bg-brand-purple-700 disabled:opacity-70 transition-all">
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
const ScheduleModal = ({ scheduleType, onClose, onSubmit, applications, companies = [] }) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState('');
  const [form, setForm] = useState({
    applicationId: '', date: '', time: '', type: 'Video',
    interviewLink: '', interviewLocation: '', notes: '', duration: 30,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })); };

  // Clear selected candidate when company changes
  useEffect(() => {
    set('applicationId', '');
  }, [selectedCompanyId]);

  const filteredApps = useMemo(() => {
    if (scheduleType === 'Internal') return applications;
    if (!selectedCompanyId) return [];
    const res = applications.filter(a => String(a.companyId) === String(selectedCompanyId));
    console.log('ScheduleModal filteredApps:', { selectedCompanyId, applications, filtered: res });
    return res;
  }, [applications, scheduleType, selectedCompanyId]);

  const validate = () => {
    const e = {};
    if (scheduleType === 'External' && !selectedCompanyId) {
      e.companyId = 'Select a company';
    }
    if (!form.applicationId) e.applicationId = 'Select a candidate';
    if (!form.date)           e.date          = 'Required';
    if (!form.time)           e.time          = 'Required';

    if (form.date && form.time) {
      const scheduledDateTime = new Date(`${form.date}T${form.time}:00`);
      const minAllowedTime = new Date(Date.now() + 30 * 60 * 1000);
      if (scheduledDateTime < minAllowedTime) {
        e.time = 'Time must be at least 30 minutes in the future';
      }
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

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
        <motion.div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto text-white flex flex-col z-[130]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 sticky top-0 bg-[#0f0f0f] z-10">
            <div>
              <h2 className="text-base font-bold">Schedule {scheduleType} Interview</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Select a candidate applied to {scheduleType === 'Internal' ? 'Stryper Jobs' : 'Company Jobs'}.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:bg-white/5 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Company picker (External only) */}
            {scheduleType === 'External' && (
              <div>
                <label className={labelCls}>Company <span className="text-red-400">*</span></label>
                <select
                  value={selectedCompanyId}
                  onChange={e => {
                    setSelectedCompanyId(e.target.value);
                    setErrors(p => ({ ...p, companyId: '' }));
                  }}
                  className={`${selectCls} ${errors.companyId ? 'border-red-500/50 bg-red-500/5' : ''}`}
                >
                  <option value="" className="bg-[#0f0f0f] text-neutral-400">Select a company...</option>
                  {companies.map(c => (
                    <option key={c._id} value={c._id} className="bg-[#0f0f0f] text-white">{c.companyName}</option>
                  ))}
                </select>
                {errors.companyId && <p className="text-xs text-red-500 mt-1">{errors.companyId}</p>}
              </div>
            )}

            {/* Candidate picker */}
            <div>
              <label className={labelCls}>Candidate <span className="text-red-400">*</span></label>
              {scheduleType === 'External' && !selectedCompanyId ? (
                <p className="text-xs text-neutral-500 bg-white/5 border border-white/5 rounded-xl p-3">Please select a company first.</p>
              ) : filteredApps.length === 0 ? (
                <p className="text-xs text-neutral-500 bg-white/5 border border-white/5 rounded-xl p-3">No pending applications to schedule.</p>
              ) : (
                <select
                  value={form.applicationId}
                  onChange={e => set('applicationId', e.target.value)}
                  className={`${selectCls} ${errors.applicationId ? 'border-red-500/50 bg-red-500/5' : ''}`}
                >
                  <option value="" className="bg-[#0f0f0f] text-neutral-400">Select a candidate...</option>
                  {filteredApps.map(a => (
                    <option key={a.id} value={a.id} className="bg-[#0f0f0f] text-white">{a.name} — {a.appliedRole}</option>
                  ))}
                </select>
              )}
              {errors.applicationId && <p className="text-xs text-red-500 mt-1">{errors.applicationId}</p>}
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date <span className="text-red-400">*</span></label>
                <input type="date" value={form.date} onChange={e => set('date', e.target.value)} className={`${inputCls} ${errors.date ? 'border-red-500/50 bg-red-500/5' : ''}`} />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className={labelCls}>Time <span className="text-red-400">*</span></label>
                <input type="time" value={form.time} onChange={e => set('time', e.target.value)} className={`${inputCls} ${errors.time ? 'border-red-500/50 bg-red-500/5' : ''}`} />
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Interview type */}
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest mb-2">Interview Type</label>
              <div className="grid grid-cols-4 gap-2">
                {['Video', 'In-person', 'Phone', 'Online Test'].map(t => {
                  const s = TYPE_STYLE[t]; const active = form.type === t;
                  const Icon = s.icon;
                  return (
                    <button key={t} type="button" onClick={() => set('type', t)}
                      className={`flex flex-col items-center py-2.5 rounded-xl text-[11px] font-semibold border transition-all ${
                        active 
                          ? `${s.bg} ${s.text} ${s.border}` 
                          : 'border-white/5 bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon size={16} className="mb-1" />
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Link / Location */}
            {(form.type === 'Video' || form.type === 'Online Test') && (
              <div>
                <label className={labelCls}>Meeting Link</label>
                <input type="text" placeholder="https://meet.google.com/..." value={form.interviewLink} onChange={e => set('interviewLink', e.target.value)} className={inputCls} />
              </div>
            )}
            {form.type === 'In-person' && (
              <div>
                <label className={labelCls}>Location / Address</label>
                <input type="text" placeholder="Office address or room number" value={form.interviewLocation} onChange={e => set('interviewLocation', e.target.value)} className={inputCls} />
              </div>
            )}

            {/* Duration + Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Duration (mins)</label>
                <select value={form.duration} onChange={e => set('duration', e.target.value)} className={selectCls}>
                  {[15, 30, 45, 60, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Notes</label>
                <input type="text" placeholder="Optional notes..." value={form.notes} onChange={e => set('notes', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-white/10 text-neutral-400 hover:bg-white/5 transition-colors">Cancel</button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-purple-600 hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20">
                Schedule
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page ───────────────────────────────────────────────────────────────
const AdminInterviews = () => {
  const [activeTab, setActiveTab]   = useState('company'); // 'company' = External, 'stryper' = Internal
  const [filter, setFilter]         = useState('All');
  const [interviewsList, setInterviewsList] = useState([]);
  const [allApplications, setAllApplications] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [modalType, setModalType]   = useState(null); // 'Internal' or 'External'
  const [editingLink, setEditingLink] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ivRes, appRes, compRes] = await Promise.all([
        interviewsAPI.getCompanyInterviews(), // Admin gets all interviews in system
        admin.getAllApplications({ limit: 1000 }),
        admin.getCompanyList(),
      ]);

      const ivs = (ivRes.data.interviews || []).map(iv => {
        const isStryper = iv.applicationId?.isStryperApplication === true || !iv.companyId;
        return {
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
          isStryper,
          companyName: iv.companyId?.companyName || '',
          companyId:   iv.companyId?._id || (typeof iv.companyId === 'string' ? iv.companyId : null),
        };
      });

      setInterviewsList(ivs);

      const apps = (appRes.data.applications || []).map(a => {
        let guestInfo = {};
        if (a.notes) {
          try { guestInfo = JSON.parse(a.notes); } catch {}
        }
        const candidateName = a.candidateId
          ? `${a.candidateId.firstName} ${a.candidateId.lastName}`.trim()
          : guestInfo.guestName || 'N/A';
        return {
          id: a._id,
          name: candidateName,
          appliedRole: a.jobId?.title || 'N/A',
          isStryper: a.isStryperApplication === true || !a.companyId,
          profilePicture: a.candidateId?.profilePicture || '',
          companyId: a.companyId?._id || (typeof a.companyId === 'string' ? a.companyId : null),
        };
      });

      console.log('AdminInterviews: Mapped Applications:', apps);
      setAllApplications(apps);
      setCompaniesList(compRes.data.companies || []);
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
      const app = allApplications.find(a => a.id === formData.applicationId);
      const comp = companiesList.find(c => String(c._id) === String(app?.companyId));

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
        isStryper:   modalType === 'Internal',
        companyName: comp?.companyName || '',
        companyId:   app?.companyId,
      };

      setInterviewsList(prev => [newIv, ...prev]);
      setModalType(null);
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

  // Filter interviews by active tab (Stryper vs Company) and then by category filter
  const currentTabIvs = useMemo(() => {
    return interviewsList.filter(iv => activeTab === 'stryper' ? iv.isStryper : !iv.isStryper);
  }, [interviewsList, activeTab]);

  const filtered = useMemo(() => {
    return filter === 'All' ? currentTabIvs : currentTabIvs.filter(i => i.status === filter);
  }, [currentTabIvs, filter]);

  const counts = useMemo(() => {
    return FILTERS.reduce((acc, f) => {
      acc[f] = f === 'All' ? currentTabIvs.length : currentTabIvs.filter(i => i.status === f).length;
      return acc;
    }, {});
  }, [currentTabIvs]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, iv) => {
      const d = iv.date;
      if (!acc[d]) acc[d] = [];
      acc[d].push(iv);
      return acc;
    }, {});
  }, [filtered]);

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const formatDate = (d) => {
    if (d === today) return 'Today';
    if (d === tomorrow) return 'Tomorrow';
    return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const pendingApplications = useMemo(() => {
    const isInternal = modalType === 'Internal';
    return allApplications.filter(a => {
      const matchType = isInternal ? a.isStryper : !a.isStryper;
      return matchType;
    });
  }, [allApplications, modalType]);

  return (
    <div className="space-y-6 pb-10 text-white">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Interview Scheduling</h2>
            <p className="text-neutral-500 text-sm mt-1">Schedule and track interviews for Stryper internal roles and external companies.</p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModalType('Internal')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-purple-600 hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20"
            >
              <Plus size={14} /> Schedule Internal
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setModalType('External')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-300 border border-white/10 hover:bg-white/5 transition-all"
            >
              <Plus size={14} /> Schedule External
            </motion.button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5 mb-6">
          <button
            onClick={() => { setActiveTab('company'); setFilter('All'); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'company'
                ? 'bg-brand-purple-600 text-white shadow-lg'
                : 'text-neutral-500 hover:text-white hover:bg-white/5'
            }`}
          >
            External Interviews
          </button>
          <button
            onClick={() => { setActiveTab('stryper'); setFilter('All'); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'stryper'
                ? 'bg-brand-purple-600 text-white shadow-lg'
                : 'text-neutral-500 hover:text-white hover:bg-white/5'
            }`}
          >
            Internal Interviews
          </button>
        </div>

        {/* KPI blocks */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Scheduled', color: 'text-blue-400' },
            { label: 'Completed', color: 'text-green-400' },
            { label: 'Cancelled', color: 'text-red-400' },
          ].map(({ label, color }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-4 text-center cursor-pointer hover:border-brand-purple-600/20 transition-all"
              onClick={() => setFilter(label)}>
              <p className={`text-2xl font-bold ${color}`}>{loading ? '—' : counts[label]}</p>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1 font-bold">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl w-fit border border-white/5 mb-6">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${filter === f ? 'bg-brand-purple-600 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}>
              {f} ({loading ? '…' : counts[f]})
            </button>
          ))}
        </div>

        {/* Content list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 flex items-center gap-4 animate-pulse">
                <div className="w-11 h-11 rounded-xl bg-white/5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-white/5 rounded w-1/3" />
                  <div className="h-3 bg-white/5 rounded w-1/4" />
                </div>
                <div className="h-4 w-16 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : Object.keys(grouped).length === 0 ? (
          <div className="bg-[#0f0f0f] border border-white/5 rounded-2xl py-16 text-center text-neutral-500">
            <Calendar className="mx-auto mb-3 text-neutral-600" size={32} />
            <p className="text-sm">
              {interviewsList.length === 0 ? 'No interviews scheduled yet.' : 'No interviews in this category.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(grouped)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, ivs]) => (
                <div key={date}>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" />
                    {formatDate(date)}
                  </p>
                  <div className="space-y-3">
                    {ivs.map((iv, i) => {
                      const t = TYPE_STYLE[iv.type] ?? TYPE_STYLE.Video;
                      const TypeIcon = t.icon;
                      return (
                        <motion.div key={iv.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-5 flex items-center gap-4 hover:border-white/10 transition-colors">
                          
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
                              <p className="text-sm font-bold text-white">{iv.candidate}</p>
                              {!iv.isStryper && iv.companyName && (
                                <span className="text-xs text-neutral-400 font-medium">
                                  at <span className="text-brand-purple-400 font-semibold">{iv.companyName}</span>
                                </span>
                              )}
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[iv.status] || 'bg-white/5 text-neutral-400 border border-white/5'}`}>
                                {iv.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-0.5">{iv.role}</p>
                            {iv.duration > 0 && <p className="text-xs text-neutral-500 mt-0.5">{iv.duration} min</p>}
                            {iv.notes && <p className="text-xs text-neutral-500 mt-0.5 italic">"{iv.notes}"</p>}
                            {iv.link && (
                              <p className="text-[10px] text-green-400 font-bold mt-1 flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                Meeting link ready
                              </p>
                            )}
                            {iv.location && !iv.link && (
                              <p className="text-xs text-neutral-500 mt-0.5">📍 {iv.location}</p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-neutral-200">{iv.time}</p>
                            <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-md mt-1 inline-flex items-center gap-1 border ${t.bg} ${t.text} ${t.border}`}>
                              <TypeIcon size={10} />
                              {iv.type}
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
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 text-neutral-300 hover:bg-white/5 transition-colors">
                                {iv.link ? 'Edit Link' : 'Add Link'}
                              </button>
                              <button onClick={() => handleMarkComplete(iv)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-green-500/20 text-green-400 hover:bg-green-500/10 transition-colors">
                                Done
                              </button>
                              <button onClick={() => handleCancel(iv)}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors">
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
        {modalType && (
          <ScheduleModal
            scheduleType={modalType}
            onClose={() => setModalType(null)}
            onSubmit={handleSchedule}
            applications={pendingApplications}
            companies={companiesList}
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

export default AdminInterviews;
