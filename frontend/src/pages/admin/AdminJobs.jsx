import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, Briefcase, MapPin, Users, IndianRupee, Trash2, CheckCircle, Clock, Eye } from 'lucide-react';
import { ALL_JOBS } from '@/data/adminData';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AdminJobs = () => {
  const [jobs, setJobs] = useState(ALL_JOBS);
  const [searchTerm, setSearchText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);

  const filtered = useMemo(() => {
    return jobs.filter(j => 
      (j.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (j.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const handleDelete = (id, title) => {
    setJobs(jobs.filter(j => j.id !== id));
    toast.success(`Job "${title}" has been removed.`);
    setActiveMenu(null);
  };

  const handleStatusToggle = (id, current) => {
    const next = current === 'Active' ? 'Pending' : 'Active';
    setJobs(jobs.map(j => j.id === id ? { ...j, status: next } : j));
    toast.success(`Job status set to ${next}`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Job Moderation</h2>
          <p className="text-neutral-500 text-sm mt-1">Review and manage {jobs.length} job postings.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchText(e.target.value)}
              className="bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50 w-full sm:w-64 text-white"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm font-medium hover:bg-white/10 transition-colors">
            <Filter size={16} />
            Filters
          </button>
        </div>
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
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${job.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toast.success(`Viewing live job post: ${job.title}`); }}
                          className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === job.id ? null : job.id); }}
                            className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors"
                          >
                            <MoreVertical size={16} />
                          </button>
                          
                          {activeMenu === job.id && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 py-1 overflow-hidden text-left">
                              <button 
                                onClick={() => handleStatusToggle(job.id, job.status)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-white/5 transition-colors"
                              >
                                {job.status === 'Active' ? <Clock size={14} /> : <CheckCircle size={14} />}
                                {job.status === 'Active' ? 'Set as Pending' : 'Approve Job'}
                              </button>
                              <button 
                                onClick={() => handleDelete(job.id, job.title)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={14} />
                                Delete Listing
                              </button>
                            </div>
                          )}
                        </div>
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
