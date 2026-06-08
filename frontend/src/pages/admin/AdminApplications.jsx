import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, FileText, Calendar, Building2, User, Trash2, CheckCircle2, XCircle, Briefcase, Phone, MapPin } from 'lucide-react';
import { ALL_APPLICATIONS, STRYPER_APPLICATIONS } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const STATUS_STYLE = {
  Shortlisted: 'bg-emerald-500/10 text-emerald-500',
  Rejected:    'bg-red-500/10 text-red-500',
  Interview:   'bg-purple-500/10 text-purple-400',
  Hired:       'bg-teal-500/10 text-teal-400',
  Applied:     'bg-blue-500/10 text-blue-500',
};

const AdminApplications = () => {
  const [activeTab, setActiveTab]   = useState('company'); // 'company' | 'stryper'
  const [companyApps, setCompanyApps]   = useState(ALL_APPLICATIONS);
  const [stryperApps, setStryperApps]   = useState(STRYPER_APPLICATIONS);
  const [searchTerm, setSearchText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  // ── Derived data ─────────────────────────────────────────────────────────
  const apps    = activeTab === 'company' ? companyApps : stryperApps;
  const setApps = activeTab === 'company' ? setCompanyApps : setStryperApps;

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return apps.filter(a =>
      (a.candidate?.toLowerCase() || '').includes(q) ||
      (a.job?.toLowerCase()       || '').includes(q) ||
      (a.company?.toLowerCase()   || '').includes(q)
    );
  }, [apps, searchTerm]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleDelete = (id, candidate) => {
    setApps(prev => prev.filter(a => a.id !== id));
    toast.success(`Application for ${candidate} removed.`);
    setActiveMenu(null);
  };

  const handleStatusUpdate = (id, newStatus) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    toast.success(`Application marked as ${newStatus}`);
    setActiveMenu(null);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6 pb-10 text-white"
      onClick={() => setActiveMenu(null)}
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Application Tracking</h2>
          <p className="text-neutral-500 text-sm mt-1">
            Monitor {apps.length} candidates through the hiring pipeline.
          </p>
        </div>
        <div className="relative flex items-center">
          <Search className="absolute left-3 text-neutral-500" size={16} />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={e => { setSearchText(e.target.value); setActiveMenu(null); }}
            className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
          />
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
        <button
          onClick={() => { setActiveTab('company'); setSearchText(''); }}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'company'
              ? 'bg-[#8B3A8F] text-white shadow-lg'
              : 'text-neutral-500 hover:text-white hover:bg-white/5'
          }`}
        >
          Company Applications
        </button>
        <button
          onClick={() => { setActiveTab('stryper'); setSearchText(''); }}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'stryper'
              ? 'bg-[#8B3A8F] text-white shadow-lg'
              : 'text-neutral-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase size={12} />
          Stryper Applications
        </button>
      </div>

      {/* ── Table ── */}
      <motion.div variants={fadeInUp} className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              {activeTab === 'company' ? (
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Job Position</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applied Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applied Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Experience</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applied Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-neutral-500 text-sm">
                      No applications found.
                    </td>
                  </tr>
                ) : filtered.map(app => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={app.id}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Candidate */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-white text-sm font-bold">
                        <User size={14} className="text-neutral-500 shrink-0" />
                        <div>
                          <p>{app.candidate}</p>
                          {activeTab === 'stryper' && app.location && (
                            <p className="text-[11px] text-neutral-500 font-normal flex items-center gap-1 mt-0.5">
                              <MapPin size={10} /> {app.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Job / Role */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-400 text-sm">
                        <FileText size={14} className="text-brand-purple-400 shrink-0" />
                        {app.job}
                      </div>
                    </td>

                    {/* Company (company tab) / Experience (stryper tab) */}
                    <td className="px-6 py-4">
                      {activeTab === 'company' ? (
                        <div className="flex items-center gap-2 text-neutral-400 text-sm">
                          <Building2 size={14} className="text-brand-gold-500 shrink-0" />
                          {app.company}
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-neutral-400 bg-white/5 px-2 py-1 rounded-md">
                          {app.experience}
                        </span>
                      )}
                    </td>

                    {/* Applied Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
                        <Calendar size={12} />
                        {app.date}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_STYLE[app.status] || 'bg-neutral-500/10 text-neutral-400'}`}>
                        {app.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right relative">
                      <button
                        onClick={e => { e.stopPropagation(); setActiveMenu(activeMenu === app.id ? null : app.id); }}
                        className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenu === app.id && (
                        <div className="absolute right-0 top-full mt-2 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden text-left">
                          {app.status !== 'Shortlisted' && (
                            <button
                              onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                            >
                              <CheckCircle2 size={14} />
                              Mark Shortlisted
                            </button>
                          )}
                          {app.status !== 'Interview' && activeTab === 'stryper' && (
                            <button
                              onClick={() => handleStatusUpdate(app.id, 'Interview')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-purple-400 hover:bg-purple-500/10 transition-colors"
                            >
                              <Briefcase size={14} />
                              Move to Interview
                            </button>
                          )}
                          {app.status !== 'Rejected' && (
                            <button
                              onClick={() => handleStatusUpdate(app.id, 'Rejected')}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                              <XCircle size={14} />
                              Mark Rejected
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(app.id, app.candidate)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-400 hover:bg-white/5 transition-colors border-t border-white/5 mt-1"
                          >
                            <Trash2 size={14} />
                            Delete Record
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminApplications;
