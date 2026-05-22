import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';

const MOCK_INTERVIEWS = [
  { id: 1, candidate: 'Rahul Verma',  role: 'DevOps Engineer',    date: '2025-01-13', time: '2:00 PM',  type: 'Video',     status: 'Scheduled', interviewer: 'Amit Kumar',  avatar: 'R', color: '#2563eb' },
  { id: 2, candidate: 'Priya Sharma', role: 'Frontend Developer', date: '2025-01-13', time: '4:30 PM',  type: 'In-person', status: 'Scheduled', interviewer: 'Sneha Joshi', avatar: 'P', color: '#8B3A8F' },
  { id: 3, candidate: 'Karan Mehta',  role: 'Backend Developer',  date: '2025-01-14', time: '11:00 AM', type: 'Video',     status: 'Scheduled', interviewer: 'Ravi Sharma', avatar: 'K', color: '#d97706' },
  { id: 4, candidate: 'Neha Gupta',   role: 'Product Manager',    date: '2025-01-15', time: '3:00 PM',  type: 'Phone',     status: 'Scheduled', interviewer: 'Priya Nair',  avatar: 'N', color: '#0d9488' },
  { id: 5, candidate: 'Anjali Singh', role: 'HR Manager',         date: '2025-01-10', time: '10:00 AM', type: 'In-person', status: 'Completed', interviewer: 'Amit Kumar',  avatar: 'A', color: '#16a34a' },
  { id: 6, candidate: 'Amit Joshi',   role: 'Data Analyst',       date: '2025-01-09', time: '2:30 PM',  type: 'Video',     status: 'Completed', interviewer: 'Sneha Joshi', avatar: 'A', color: '#ea580c' },
  { id: 7, candidate: 'Vikram Nair',  role: 'Product Manager',    date: '2025-01-08', time: '4:00 PM',  type: 'Phone',     status: 'Cancelled', interviewer: 'Ravi Sharma', avatar: 'V', color: '#6366f1' },
];

const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a', '#6366f1'];

const TYPE_STYLE = {
  Video:       { bg: '#dbeafe', text: '#2563eb', emoji: '🎥' },
  'In-person': { bg: '#dcfce7', text: '#16a34a', emoji: '🏢' },
  Phone:       { bg: '#fef3c7', text: '#d97706', emoji: '📞' },
};

const STATUS_STYLE = {
  Scheduled: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-500',
};

const FILTERS = ['All', 'Scheduled', 'Completed', 'Cancelled'];

const EMPTY_FORM = {
  candidate: '', role: '', date: '', time: '',
  type: 'Video', interviewer: '', notes: '',
};

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all';

/* ── Schedule Interview Modal ── */
const ScheduleModal = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.candidate.trim()) e.candidate = 'Required';
    if (!form.role.trim())      e.role      = 'Required';
    if (!form.date)             e.date      = 'Required';
    if (!form.time.trim())      e.time      = 'Required';
    if (!form.interviewer.trim()) e.interviewer = 'Required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-neutral-900/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
            <div>
              <h2 className="text-base font-bold text-neutral-900">Schedule Interview</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Fill in the details to book an interview slot.</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Candidate + Role */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  Candidate Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={form.candidate}
                  onChange={e => set('candidate', e.target.value)}
                  className={`${inputCls} ${errors.candidate ? 'border-red-300 bg-red-50' : ''}`}
                />
                {errors.candidate && <p className="text-xs text-red-500 mt-1">{errors.candidate}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  Applied Role <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={form.role}
                  onChange={e => set('role', e.target.value)}
                  className={`${inputCls} ${errors.role ? 'border-red-300 bg-red-50' : ''}`}
                />
                {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
              </div>
            </div>

            {/* Date + Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => set('date', e.target.value)}
                  className={`${inputCls} ${errors.date ? 'border-red-300 bg-red-50' : ''}`}
                />
                {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                  Time <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={e => {
                    // Convert 24h to 12h display
                    const [h, m] = e.target.value.split(':');
                    const hr = parseInt(h);
                    const ampm = hr >= 12 ? 'PM' : 'AM';
                    const hr12 = hr % 12 || 12;
                    set('time', `${hr12}:${m} ${ampm}`);
                    set('_timeRaw', e.target.value);
                  }}
                  className={`${inputCls} ${errors.time ? 'border-red-300 bg-red-50' : ''}`}
                />
                {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* Interview Type */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-2">Interview Type</label>
              <div className="flex gap-2">
                {['Video', 'In-person', 'Phone'].map(t => {
                  const s = TYPE_STYLE[t];
                  const active = form.type === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => set('type', t)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all"
                      style={active
                        ? { borderColor: s.text, background: s.bg, color: s.text }
                        : { borderColor: '#e5e7eb', color: '#6b7280' }
                      }
                    >
                      <span>{s.emoji}</span> {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interviewer */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Interviewer <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Amit Kumar"
                value={form.interviewer}
                onChange={e => set('interviewer', e.target.value)}
                className={`${inputCls} ${errors.interviewer ? 'border-red-300 bg-red-50' : ''}`}
              />
              {errors.interviewer && <p className="text-xs text-red-500 mt-1">{errors.interviewer}</p>}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">
                Notes <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <textarea
                rows={3}
                placeholder="Any special instructions or topics to cover..."
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
                style={{ background: '#8B3A8F' }}
              >
                Schedule Interview
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ── Success toast ── */
const Toast = ({ name, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-green-200 rounded-2xl px-5 py-3.5 shadow-xl"
  >
    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div>
      <p className="text-sm font-semibold text-neutral-800">Interview Scheduled!</p>
      <p className="text-xs text-neutral-500">{name}'s interview has been added.</p>
    </div>
    <button onClick={onClose} className="ml-2 text-neutral-300 hover:text-neutral-500">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  </motion.div>
);

/* ── Main page ── */
const Interviews = () => {
  const [filter, setFilter]       = useState('All');
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast]         = useState(null);

  const filtered = filter === 'All' ? interviews : interviews.filter(i => i.status === filter);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === 'All' ? interviews.length : interviews.filter(i => i.status === f).length;
    return acc;
  }, {});

  const grouped = filtered.reduce((acc, iv) => {
    if (!acc[iv.date]) acc[iv.date] = [];
    acc[iv.date].push(iv);
    return acc;
  }, {});

  const formatDate = (d) => {
    if (d === '2025-01-13') return 'Today';
    if (d === '2025-01-14') return 'Tomorrow';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleSchedule = (form) => {
    const newId = Math.max(...interviews.map(i => i.id)) + 1;
    const colorIdx = newId % AVATAR_COLORS.length;
    setInterviews(prev => [
      ...prev,
      {
        id:          newId,
        candidate:   form.candidate,
        role:        form.role,
        date:        form.date,
        time:        form.time,
        type:        form.type,
        status:      'Scheduled',
        interviewer: form.interviewer,
        avatar:      form.candidate.charAt(0).toUpperCase(),
        color:       AVATAR_COLORS[colorIdx],
        notes:       form.notes,
      },
    ]);
    setShowModal(false);
    setToast(form.candidate);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <SectionHeader title="Interviews" subtitle="Schedule and track all candidate interviews." />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 shadow-sm"
            style={{ background: '#8B3A8F' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Schedule Interview
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Scheduled', color: '#2563eb' },
            { label: 'Completed', color: '#16a34a' },
            { label: 'Cancelled', color: '#ea580c' },
          ].map(({ label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-neutral-100 p-4 text-center cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setFilter(label)}
            >
              <p className="text-3xl font-bold" style={{ color }}>{counts[label]}</p>
              <p className="text-xs text-neutral-500 mt-1">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1 mb-5 w-fit">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === f ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {f} ({counts[f]})
            </button>
          ))}
        </div>

        {/* Grouped list */}
        {Object.keys(grouped).length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 py-16 text-center">
            <p className="text-3xl mb-3">📅</p>
            <p className="text-sm text-neutral-500">No interviews in this category.</p>
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
                        <motion.div
                          key={iv.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-white rounded-2xl border border-neutral-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
                        >
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base shrink-0"
                            style={{ background: iv.color }}
                          >
                            {iv.avatar}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="text-sm font-semibold text-neutral-900">{iv.candidate}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLE[iv.status]}`}>
                                {iv.status}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-0.5">{iv.role}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">Interviewer: {iv.interviewer}</p>
                            {iv.notes && (
                              <p className="text-xs text-neutral-400 mt-0.5 italic">"{iv.notes}"</p>
                            )}
                          </div>

                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-neutral-800">{iv.time}</p>
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md mt-1 inline-block"
                              style={{ background: t.bg, color: t.text }}
                            >
                              {t.emoji} {iv.type}
                            </span>
                          </div>

                          {iv.status === 'Scheduled' && (
                            <div className="flex gap-2 shrink-0 ml-2">
                              <button
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                                style={{ background: '#8B3A8F' }}
                              >
                                Join
                              </button>
                              <button
                                onClick={() => setInterviews(p => p.map(x => x.id === iv.id ? { ...x, status: 'Cancelled' } : x))}
                                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                              >
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

      {/* Schedule modal */}
      <AnimatePresence>
        {showModal && (
          <ScheduleModal
            onClose={() => setShowModal(false)}
            onSubmit={handleSchedule}
          />
        )}
      </AnimatePresence>

      {/* Success toast */}
      <AnimatePresence>
        {toast && <Toast name={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default Interviews;
