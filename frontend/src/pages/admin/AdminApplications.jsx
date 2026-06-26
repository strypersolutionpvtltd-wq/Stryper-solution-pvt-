import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Eye, FileText, Calendar, Building2, User, Trash2, Briefcase, MapPin, X, CheckCircle, Loader2 } from 'lucide-react';
import { admin, jobApplications } from '@/utils/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const STATUS_FLOW = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];

const STATUS_STYLE = {
  Applied:     'bg-blue-500/10 text-blue-500',
  Screening:   'bg-amber-500/10 text-amber-500',
  Interview:   'bg-purple-500/10 text-purple-400',
  Offer:       'bg-pink-500/10 text-pink-400',
  Hired:       'bg-teal-500/10 text-teal-400',
  Rejected:    'bg-red-500/10 text-red-500',
};

const AppViewModal = ({ isOpen, onClose, app, onStatusUpdate, activeTab }) => {
  if (!isOpen || !app) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white">Application Details</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors"><X size={20}/></button>
          </div>
          
          <div className="p-8 space-y-6 overflow-y-auto">
            {/* Candidate Summary */}
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 rounded-full bg-brand-purple-600/10 flex items-center justify-center text-brand-purple-500 font-bold text-xl border border-brand-purple-600/20">
                {app.candidate.charAt(0)}
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{app.candidate}</h4>
                <p className="text-sm text-neutral-400">{app.job}</p>
                {app.email && <p className="text-xs text-neutral-400 mt-0.5">✉ {app.email}</p>}
                {app.phone && <p className="text-xs text-neutral-400">📞 {app.phone}</p>}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Company</p>
                <p className="text-sm font-medium">{activeTab === 'stryper' ? 'Stryper Solution' : app.company}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Applied Date</p>
                <p className="text-sm font-medium">{app.date}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Experience</p>
                <p className="text-sm font-medium">{app.experience || 'Not specified'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Location</p>
                <p className="text-sm font-medium">{app.location || 'Not specified'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Expected Salary</p>
                <p className="text-sm font-medium">{app.expectedSalary || 'Not specified'}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[10px] text-neutral-500 uppercase font-bold mb-1">Notice Period</p>
                <p className="text-sm font-medium">{app.noticePeriod || 'Not specified'}</p>
              </div>
            </div>

            {/* Skills Section */}
            {app.skills && app.skills.length > 0 && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {app.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 text-neutral-300 border border-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter Section */}
            {app.coverLetter && (
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Cover Letter</h5>
                <p className="text-sm text-neutral-400 leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {app.coverLetter}
                </p>
              </div>
            )}

            {/* Documents */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Documents</h5>
              {app.resumeUrl ? (
                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      toast.success("Opening Resume...");
                      window.open(app.resumeUrl, '_blank');
                    }} 
                    className="w-full p-4 rounded-xl border border-brand-purple-600/20 bg-brand-purple-600/5 hover:bg-brand-purple-600/10 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-3 text-brand-purple-400">
                      <FileText size={18} />
                      <div className="text-left">
                        <span className="font-medium text-sm block">Resume</span>
                        <span className="text-[10px] text-neutral-400">Uploaded by candidate</span>
                      </div>
                    </div>
                    <Eye size={16} className="text-neutral-500" />
                  </button>
                  <button
                    onClick={() => {
                      toast.success("Downloading resume...");
                      const link = document.createElement('a');
                      link.href = app.resumeUrl;
                      link.download = `${app.candidate}_Resume.pdf`;
                      link.click();
                    }}
                    className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold border border-brand-purple-600/30 text-brand-purple-400 hover:bg-brand-purple-600/5 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download Resume
                  </button>
                </div>
              ) : (
                <div className="w-full p-4 rounded-xl border border-neutral-500/20 bg-neutral-500/5 text-center">
                  <p className="text-xs text-neutral-400">No resume uploaded</p>
                </div>
              )}
            </div>

            {/* Status Management */}
            <div className="space-y-3">
              <h5 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Status Flow</h5>
              <div className="flex flex-wrap gap-2">
                {STATUS_FLOW.map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      onStatusUpdate(app.id, s);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                      app.status === s ? 'bg-brand-purple-600 text-white' : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {app.status === s && <CheckCircle size={12} />}
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AdminApplications = () => {
  const [activeTab, setActiveTab]   = useState('company');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchText] = useState('');
  
  const [viewAppId, setViewAppId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await admin.getAllApplications({ limit: 1000 });
      if (res.data?.success) {
        const mapped = (res.data.applications || []).map(a => {
          // Parse guest info from notes field (Stryper job applications)
          let guestInfo = {};
          if (a.notes) {
            try { guestInfo = JSON.parse(a.notes); } catch {}
          }

          const candidateName = a.candidateId
            ? `${a.candidateId.firstName} ${a.candidateId.lastName}`.trim()
            : guestInfo.guestName || 'N/A';

          return {
            id: a._id,
            candidate: candidateName,
            job: a.jobId?.title || 'N/A',
            company: a.companyId?.companyName || 'Stryper Solution',
            date: a.appliedDate ? new Date(a.appliedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
            status: a.status || 'Applied',
            experience: (a.candidateId?.totalExperience || '').trim() || 'Not specified',
            location: (a.candidateId?.location || '').trim() || (guestInfo.guestPhone ? `Ph: ${guestInfo.guestPhone}` : 'Not specified'),
            expectedSalary: a.salaryExpectation ? `₹${a.salaryExpectation}` : 'Not specified',
            noticePeriod: (a.noticePeriod || '').trim() || 'Not specified',
            skills: a.candidateId?.skills || [],
            coverLetter: a.coverLetter || '',
            resumeUrl: a.resume || a.resumeUrl || a.candidateId?.resume || '',
            email: guestInfo.guestEmail || a.candidateId?.userId?.email || '',
            phone: guestInfo.guestPhone || a.candidateId?.phone || '',
            isStryper: a.isStryperApplication === true || !a.companyId,
          };
        });
        setApplications(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch applications", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const apps = useMemo(() => {
    return applications.filter(a => activeTab === 'stryper' ? a.isStryper : !a.isStryper);
  }, [applications, activeTab]);

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return apps.filter(a =>
      (a.candidate?.toLowerCase() || '').includes(q) ||
      (a.job?.toLowerCase()       || '').includes(q) ||
      (a.company?.toLowerCase()   || '').includes(q)
    );
  }, [apps, searchTerm]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await jobApplications.updateStatus(id, { status: newStatus });
      if (res.data?.success) {
        setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
        toast.success(`Application updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error communicating status update to server");
    }
  };

  const selectedApp = useMemo(() => applications.find(a => a.id === viewAppId), [applications, viewAppId]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6 pb-10 text-white"
    >
      <AppViewModal 
        isOpen={!!viewAppId} 
        onClose={() => setViewAppId(null)} 
        app={selectedApp} 
        onStatusUpdate={handleStatusUpdate}
        activeTab={activeTab}
      />

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
            onChange={e => setSearchText(e.target.value)}
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
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">View</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Candidate</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applied Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Experience</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applied Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">View</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 size={24} className="animate-spin text-brand-purple-500" />
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
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
                    className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setViewAppId(app.id)}
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

                    {/* Actions -> View */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={e => { e.stopPropagation(); setViewAppId(app.id); }}
                        className="p-2 rounded-lg bg-white/5 hover:bg-brand-purple-600/20 text-neutral-400 hover:text-brand-purple-400 transition-colors inline-flex items-center justify-center"
                      >
                        <Eye size={16} />
                      </button>
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
