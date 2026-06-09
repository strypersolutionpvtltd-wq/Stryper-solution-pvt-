import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Users, IndianRupee, Trash2, CheckCircle, Clock, Eye, X, Save } from 'lucide-react';
import { ALL_JOBS } from '@/data/adminData';
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="grid grid-cols-2 gap-4">
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
              <button onClick={() => { onSave({...formData, status: 'Draft'}); onClose(); }} className="px-6 py-2 rounded-xl text-sm font-bold text-neutral-400 hover:text-white transition-colors">Save as Draft</button>
              <button onClick={() => { onSave(formData); onClose(); }} className="px-6 py-2 rounded-xl bg-brand-purple-600 text-white text-sm font-bold hover:bg-brand-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-brand-purple-600/20">
                <Save size={16}/> Publish Job
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ViewJobModal = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0f0f0f] border border-white/10 rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden text-white flex flex-col">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-bold text-lg">Job Details</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full"><X size={20}/></button>
          </div>
          <div className="p-8 space-y-6">
            <div>
              <h4 className="text-xl font-bold text-brand-purple-400">{job.title}</h4>
              <p className="text-neutral-400">{job.company}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Location</p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} className="text-brand-gold-500" />
                  {job.location}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Salary Range</p>
                <div className="flex items-center gap-2 text-sm">
                  <IndianRupee size={14} className="text-emerald-500" />
                  {job.salary}
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Status</p>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 
                  job.status === 'Paused' ? 'bg-amber-500/10 text-amber-500' :
                  job.status === 'Draft' ? 'bg-neutral-500/10 text-neutral-400' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {job.status}
                </span>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <p className="text-[10px] uppercase font-bold text-neutral-500 mb-1">Applicants</p>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Users size={14} className="text-brand-purple-400" />
                  {job.applicants}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-neutral-500 leading-relaxed">
                This job was posted by <span className="font-bold text-white">{job.company}</span>. 
                Currently, it has {job.applicants} active applications.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AdminJobs = () => {
  const navigate = useNavigate();
  const initialJobs = useMemo(() => {
    const stryperJobs = [
      { id: 'S01', title: 'HR Manager', company: 'Stryper Solution', location: 'Delhi', applicants: 12, salary: '₹8L - ₹12L', status: 'Active', isStryper: true },
      { id: 'S02', title: 'Operations Executive', company: 'Stryper Solution', location: 'Gurgaon', applicants: 45, salary: '₹4L - ₹6L', status: 'Active', isStryper: true },
    ];
    return [...ALL_JOBS, ...stryperJobs];
  }, []);

  const [activeCategory, setActiveCategory] = useState('company'); 
  const [jobs, setJobs] = useState(initialJobs);
  const [searchTerm, setSearchText] = useState('');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [viewingJob, setViewingJob] = useState(null);

  const handlePostJob = (newJob) => {
    const jobWithDetails = {
      ...newJob,
      id: `J${Date.now()}`,
      company: 'Stryper Solution',
      applicants: 0,
      isStryper: true,
      featured: true,
      skills: newJob.skills.split(',').map(s => s.trim()).filter(Boolean)
    };
    
    // Add to local state
    setJobs([jobWithDetails, ...jobs]);
    
    // Attempt to push to public array if it exists (for demo purposes)
    import('@/data/adminData').then(module => {
      if (module.PUBLIC_JOBS) {
        module.PUBLIC_JOBS.unshift(jobWithDetails);
      }
    }).catch(() => {});

    toast.success(`Stryper Job successfully ${newJob.status === 'Draft' ? 'saved to drafts' : 'posted'}!`);
  };

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const matchesSearch = (j.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (j.company?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const isStryper = j.company === 'Stryper Solution' || j.isStryper;
      const matchesCategory = activeCategory === 'stryper' ? isStryper : !isStryper;

      return matchesSearch && matchesCategory;
    });
  }, [jobs, searchTerm, activeCategory]);

  const handleDelete = (id, title) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success(`Job "${title}" has been removed.`);
  };

  const handleStatusToggle = (id, current) => {
    let next = 'Draft';
    if (current === 'Draft' || current === 'Pending') next = 'Active';
    else if (current === 'Active') next = 'Paused';
    else if (current === 'Paused') next = 'Closed';
    else if (current === 'Closed') next = 'Draft';

    setJobs(jobs.map(j => j.id === id ? { ...j, status: next } : j));
    toast.success(`Job status set to ${next}`);
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
                {filtered.map((job) => (
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
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminJobs;
