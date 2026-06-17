import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Users, IndianRupee, Trash2, CheckCircle, Clock, Eye, X, Save, Loader2 } from 'lucide-react';
import { admin, jobs as jobsApi } from '@/utils/api';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const PostJobModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ 
    title: '', location: '', salary: '', experience: '', type: 'Full-time', industry: '', skills: '', desc: '', status: 'Active' 
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="font-bold text-lg">Stryper Post Job</h3>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Job Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Industry</label>
                  <input value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Location</label>
                  <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Salary Range</label>
                  <input value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Experience</label>
                  <input value={formData.experience} placeholder="e.g. 3-5 Years" onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Job Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full mt-1 bg-[#161616] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none">
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 uppercase">Skills (comma separated)</label>
                  <input value={formData.skills} placeholder="React, Node.js, AWS" onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase">Description</label>
                <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} rows={3} className="w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none resize-none" />
              </div>
            </div>
            <div className="p-6 bg-white/5 flex gap-3 justify-end shrink-0">
              <button onClick={() => { onSave({...formData, status: 'Draft', isStryper: true}); onClose(); }} className="px-6 py-2 rounded-xl text-sm font-bold text-neutral-400 hover:text-white transition-colors">Save as Draft</button>
              <button onClick={() => { onSave({...formData, isStryper: true}); onClose(); }} className="px-6 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-bold hover:bg-brand-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-purple-600/20">
                <Save size={16}/> Publish Job
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ViewJobModal = ({ isOpen, onClose, job, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);
  if (!isOpen || !job) return null;

  const raw = job.raw || {};
  const postedDate = raw.createdAt ? new Date(raw.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';
  const deadline = raw.deadline ? new Date(raw.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Not set';
  const salary = raw.salaryMin && raw.salaryMax
    ? `₹${(raw.salaryMin / 100000).toFixed(1)}L – ₹${(raw.salaryMax / 100000).toFixed(1)}L`
    : 'Not disclosed';

  const statusOptions = ['Active', 'Draft', 'Closed', 'Archived'];
  const statusColors = {
    Active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Draft: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20',
    Closed: 'bg-red-500/10 text-red-400 border-red-500/20',
    Archived: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await onStatusChange(job.id, newStatus);
    setUpdating(false);
  };

  const initials = (job.company || 'SC').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple-600/20 border border-brand-purple-600/30 flex items-center justify-center text-brand-purple-400 font-bold text-lg shrink-0">
                {initials}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white leading-tight">{job.title}</h3>
                <p className="text-neutral-400 text-sm mt-0.5">{job.company}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {raw.workMode && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-purple-600/10 text-brand-purple-400 border border-brand-purple-600/20">{raw.workMode}</span>
                  )}
                  {raw.employmentType && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-neutral-400 border border-white/10">{raw.employmentType}</span>
                  )}
                  {raw.department && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-gold-500/10 text-brand-gold-500 border border-brand-gold-500/20">{raw.department}</span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[job.status] || statusColors.Draft}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition-colors shrink-0"><X size={20}/></button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto no-scrollbar flex-1 p-6 space-y-6">

            {/* Key Stats Bar */}
            <div className="grid grid-cols-3 divide-x divide-white/5 bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
              {[
                { label: 'Location', value: job.location || 'N/A', icon: MapPin },
                { label: 'Salary', value: salary, icon: IndianRupee },
                { label: 'Experience', value: raw.experience || 'N/A', icon: Briefcase },
              ].map((item, i) => (
                <div key={i} className="p-4 text-center">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{item.label}</p>
                  <p className="text-sm font-bold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            {/* Job Details Grid */}
            <div>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Details</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Job Type', value: raw.employmentType || 'N/A' },
                  { label: 'Work Mode', value: raw.workMode || 'N/A' },
                  { label: 'Openings', value: raw.openings || 1 },
                  { label: 'Applicants', value: job.applicants },
                  { label: 'Posted', value: postedDate },
                  { label: 'Deadline', value: deadline },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <p className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-neutral-200">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            {raw.description && (
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Description</p>
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                  <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{raw.description}</p>
                </div>
              </div>
            )}

            {/* Skills */}
            {raw.skills?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {raw.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-bold px-3 py-1.5 rounded-full bg-brand-purple-600/10 text-brand-purple-400 border border-brand-purple-600/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {raw.requirements?.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Requirements</p>
                <ul className="space-y-2">
                  {raw.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500 mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer — Status Change */}
          <div className="p-5 bg-white/[0.02] border-t border-white/5 shrink-0">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3">Change Status</p>
            <div className="flex items-center gap-2 flex-wrap">
              {statusOptions.map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={job.status === s || updating}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    job.status === s
                      ? (statusColors[s] || 'bg-white/10 text-white border-white/20') + ' cursor-default'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {updating && job.status !== s ? s : (job.status === s ? `● ${s}` : s)}
                </button>
              ))}
              <button onClick={onClose} className="ml-auto px-5 py-2 rounded-xl text-xs font-bold text-neutral-500 hover:text-white hover:bg-white/5 transition-colors border border-white/5">
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AdminJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('company'); 
  const [searchTerm, setSearchText] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await admin.getAllJobs({ limit: 1000 });
      if (res.data?.success) {
        const mappedJobs = (res.data.jobs || []).map(j => ({
          id: j._id,
          title: j.title,
          company: j.companyId?.companyName || 'Stryper Solution',
          location: j.location || 'Remote',
          applicants: j.applicationCount || 0,
          salary: j.salaryMin && j.salaryMax ? `₹${(j.salaryMin/100000).toFixed(0)}L - ₹${(j.salaryMax/100000).toFixed(0)}L` : 'N/A',
          status: j.status || 'Active',
          isStryper: j.isStryper === true,
          raw: j
        }));
        setJobs(mappedJobs);
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handlePostJob = async (newJob) => {
    try {
      const jobPayload = {
        title: newJob.title,
        description: newJob.desc,
        employmentType: newJob.type,
        location: newJob.location,
        experience: newJob.experience,
        skills: newJob.skills.split(',').map(s => s.trim()).filter(Boolean),
        status: newJob.status || 'Active',
        department: newJob.industry || '',
        isStryper: newJob.isStryper === true,
      };
      
      const res = await jobsApi.create(jobPayload);
      if (res.data?.success) {
        toast.success(`Job successfully ${newJob.status === 'Draft' ? 'saved to drafts' : 'posted'}!`);
        fetchJobs();
      } else {
        toast.error("Failed to post job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to post job to server");
    }
  };

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = (j.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (j.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesCategory = activeCategory === 'stryper' ? j.isStryper === true : j.isStryper !== true;

      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchTerm, activeCategory]);

  const handleDelete = async (id, title) => {
    try {
      const res = await jobsApi.delete(id);
      if (res.data?.success) {
        setJobs(jobs.filter(j => j.id !== id));
        toast.success(`Job "${title}" has been removed.`);
      } else {
        toast.error("Failed to delete job");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while deleting job");
    }
  };

  const handleStatusToggle = async (id, current) => {
    let next = 'Draft';
    if (current === 'Draft' || current === 'Pending') next = 'Active';
    else if (current === 'Active') next = 'Closed';
    else if (current === 'Closed') next = 'Draft';

    try {
      const res = await jobsApi.update(id, { status: next });
      if (res.data?.success) {
        setJobs(jobs.map(j => j.id === id ? { ...j, status: next } : j));
        toast.success(`Job status set to ${next}`);
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error while toggling status");
    }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6 pb-10 text-white"
    >
      <PostJobModal 
        isOpen={isPostModalOpen} 
        onClose={() => setIsPostModalOpen(false)} 
        onSave={handlePostJob} 
      />
      <ViewJobModal 
        isOpen={!!viewingJob} 
        job={viewingJob} 
        onClose={() => setViewingJob(null)}
        onStatusChange={async (id, newStatus) => {
          try {
            const res = await jobsApi.update(id, { status: newStatus });
            if (res.data?.success) {
              setJobs(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
              setViewingJob(prev => prev ? { ...prev, status: newStatus } : prev);
              toast.success(`Status set to ${newStatus}`);
            }
          } catch {
            toast.error('Failed to update status');
          }
        }}
      />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Job Moderation</h2>
          <p className="text-neutral-500 text-sm mt-1">Review and manage {jobs.length} job postings.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-lg hover:shadow-brand-purple-500/20"
            style={{ background: '#8B3A8F' }}
          >
            <Briefcase size={16} />
            Post Stryper Job
          </button>
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
        <button
          onClick={() => setActiveCategory('company')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'company' ? 'bg-[#8B3A8F] text-white shadow-lg' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
        >
          Company Jobs
        </button>
        <button
          onClick={() => setActiveCategory('stryper')}
          className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeCategory === 'stryper' ? 'bg-[#8B3A8F] text-white shadow-lg' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
        >
          Stryper Internal Jobs
        </button>
      </div>

      <motion.div 
        variants={fadeInUp}
        className="bg-[#0f0f0f] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Job Title & Company</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Salary Range</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 size={24} className="animate-spin text-brand-purple-500" />
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading Jobs...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-neutral-500 text-sm">
                      No jobs found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filtered.map((job) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={job.id} 
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-brand-gold-500/10 flex items-center justify-center text-brand-gold-500 border border-brand-gold-500/20">
                            <Briefcase size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{job.title}</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">{job.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                          <MapPin size={12} />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
                          <Users size={12} />
                          {job.applicants} Applied
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                          <IndianRupee size={12} />
                          {job.salary}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                          job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                          job.status === 'Paused' ? 'bg-amber-500/10 text-amber-500' :
                          job.status === 'Draft' ? 'bg-neutral-500/10 text-neutral-400' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setViewingJob(job); }}
                            title="View Details"
                            className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                          >
                            <Eye size={16} />
                          </button>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleStatusToggle(job.id, job.status); }}
                            title="Change Status"
                            className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-brand-purple-400 transition-colors"
                          >
                            {job.status === 'Draft' || job.status === 'Pending' ? <CheckCircle size={16} /> : <Clock size={16} />}
                          </button>

                          <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(job.id, job.title); }}
                            title="Delete Listing"
                            className="p-2 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminJobs;
