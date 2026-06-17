import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import JobCard from '@/hire-zone/components/jobs/JobCard';
import EmptyState from '@/hire-zone/components/shared/EmptyState';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';
import { MOCK_JOBS } from '@/hire-zone/data/mockJobs';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'Active', 'Draft', 'Paused', 'Closed'];

const WORK_MODES = ['On-site', 'Remote', 'Hybrid'];
const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

// ── Edit Job Modal ──────────────────────────────────────────────────────────
const EditJobModal = ({ job, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: job?.title || '',
    department: job?.department || '',
    description: job?.description || '',
    salaryMin: job?.salaryMin || '',
    salaryMax: job?.salaryMax || '',
    experience: job?.experience || '',
    location: job?.location || '',
    employmentType: job?.employmentType || 'Full-time',
    workMode: job?.workMode || 'On-site',
    skills: (job?.skills || []).join(', '),
    deadline: job?.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    openings: job?.openings || 1,
  });

  if (!job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave({
      ...job,
      title: form.title,
      department: form.department,
      description: form.description,
      salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
      salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
      experience: form.experience,
      location: form.location,
      employmentType: form.employmentType,
      type: form.employmentType,
      workMode: form.workMode,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      deadline: form.deadline || null,
      openings: form.openings ? parseInt(form.openings) : 1,
    });
  };

  const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100';

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[70]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Edit Job</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Update job details and requirements.</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Job Title *</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inputCls} placeholder="e.g. Senior React Developer" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Department</label>
                <input type="text" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className={inputCls} placeholder="e.g. Engineering" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Job Description *</label>
              <textarea rows={5} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className={`${inputCls} resize-none leading-relaxed`} placeholder="Describe the role..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Min Salary (₹/month)</label>
                <input type="number" placeholder="e.g. 50000" value={form.salaryMin} onChange={e => setForm({ ...form, salaryMin: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Max Salary (₹/month)</label>
                <input type="number" placeholder="e.g. 120000" value={form.salaryMax} onChange={e => setForm({ ...form, salaryMax: e.target.value })} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Location</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} placeholder="e.g. Bangalore" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Experience</label>
                <input type="text" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} className={inputCls} placeholder="e.g. 2-4 years" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Employment Type</label>
                <select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value })} className={inputCls}>
                  {EMPLOYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Work Mode</label>
                <select value={form.workMode} onChange={e => setForm({ ...form, workMode: e.target.value })} className={inputCls}>
                  {WORK_MODES.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Application Deadline</label>
                <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Number of Openings</label>
                <input type="number" min="1" max="99" value={form.openings} onChange={e => setForm({ ...form, openings: e.target.value })} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Skills (comma separated)</label>
              <input type="text" placeholder="React, Node.js, TypeScript" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} className={inputCls} />
            </div>

            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
                Cancel
              </button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#8B3A8F' }}>
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Job Detail Full-Page Slide Panel ─────────────────────────────────────────
const JobDetailPanel = ({ job, onClose, onEdit }) => {
  if (!job) return null;

  const formatDate = (val) => {
    if (!val) return '—';
    const d = new Date(val);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const salaryDisplay = () => {
    if (job.salaryMin && job.salaryMax) return `₹${Number(job.salaryMin).toLocaleString('en-IN')} – ₹${Number(job.salaryMax).toLocaleString('en-IN')} / month`;
    if (job.salaryMin) return `₹${Number(job.salaryMin).toLocaleString('en-IN')}+ / month`;
    return 'Not specified';
  };

  const InfoRow = ({ label, value }) => (
    <div>
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm text-neutral-800 font-medium">{value || '—'}</p>
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-neutral-900/30 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Slide-in panel from right */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl flex flex-col"
          style={{ width: 'min(680px, 100vw)' }}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-8 py-5 border-b border-neutral-100 shrink-0">
            <div className="flex-1 min-w-0 pr-4">
              <h1 className="text-xl font-bold text-neutral-900 truncate">{job.title}</h1>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <StatusBadge status={job.status} />
                {job.department && (
                  <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md font-medium">{job.department}</span>
                )}
                {job.workMode && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-600">{job.workMode}</span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-3 divide-x divide-neutral-100 bg-neutral-50 border-b border-neutral-100 shrink-0">
            {[
              { label: 'Applicants', value: job.applicants ?? 0 },
              { label: 'Type', value: job.employmentType || job.type || '—' },
              { label: 'Status', value: job.status, color: '#8B3A8F' },
            ].map(({ label, value, color }) => (
              <div key={label} className="py-4 text-center">
                <p className="text-xl font-bold" style={color ? { color } : {}}>{value}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-7">
            {/* Basic Info */}
            <section>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Basic Information</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Location" value={job.location} />
                <InfoRow label="Work Mode" value={job.workMode} />
                <InfoRow label="Department" value={job.department} />
                <InfoRow label="Employment Type" value={job.employmentType || job.type} />
                <InfoRow label="Posted Date" value={formatDate(job.postedDate || job.createdAt)} />
                <InfoRow label="Deadline" value={formatDate(job.deadline)} />
                <InfoRow label="Openings" value={job.openings ? `${job.openings} position${job.openings > 1 ? 's' : ''}` : null} />
              </div>
            </section>

            <div className="border-t border-neutral-100" />

            {/* Compensation */}
            <section>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Compensation & Experience</h2>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <InfoRow label="Salary" value={salaryDisplay()} />
                <InfoRow label="Experience" value={job.experience} />
              </div>
            </section>

            <div className="border-t border-neutral-100" />

            {/* Description — preserve whitespace & line breaks */}
            <section>
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Job Description</h2>
              <div className="bg-neutral-50 rounded-xl border border-neutral-100 px-5 py-4 text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {job.description || '—'}
              </div>
            </section>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <>
                <div className="border-t border-neutral-100" />
                <section>
                  <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map(skill => (
                      <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Footer actions */}
          <div className="px-8 py-4 border-t border-neutral-100 bg-white flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
              Close
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => onEdit(job)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#8B3A8F' }}
            >
              Edit Job
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ManageJobs = () => {
  const [jobsList, setJobsList] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { jobs: jobsAPI } = await import('@/utils/api');
        const res = await jobsAPI.getMyJobs();
        const fetched = (res.data.jobs || []).map(j => ({
          id: j._id,
          title: j.title,
          department: j.department || '',
          description: j.description || '',
          salaryMin: j.salaryMin,
          salaryMax: j.salaryMax,
          salaryCurrency: j.salaryCurrency || 'INR',
          experience: j.experience || '',
          location: j.location || '',
          employmentType: j.employmentType || 'Full-time',
          type: j.employmentType || 'Full-time',   // alias for legacy UI
          workMode: j.workMode || '',
          skills: j.skills || [],
          deadline: j.deadline || null,
          openings: j.openings || 1,
          status: j.status || 'Active',
          postedDate: j.createdAt,
          applicants: j.applicationCount || 0,
        }));
        setJobsList(fetched);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        const saved = localStorage.getItem('hz_posted_jobs');
        setJobsList(saved ? JSON.parse(saved) : MOCK_JOBS);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const filtered = jobsList.filter(j => {
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = async (id, action) => {
    try {
      const { jobs: jobsAPI } = await import('@/utils/api');
      if (action === 'delete') {
        await jobsAPI.delete(id);
        setJobsList(prev => prev.filter(j => j.id !== id));
        toast.success('Job deleted');
      } else if (action === 'toggle') {
        const current = jobsList.find(j => j.id === id);
        const newStatus = current?.status === 'Active' ? 'Paused' : 'Active';
        await jobsAPI.update(id, { status: newStatus });
        setJobsList(prev => prev.map(j => j.id === id ? { ...j, status: newStatus } : j));
        toast.success(`Job ${newStatus === 'Active' ? 'resumed' : 'paused'}`);
      } else if (action === 'close') {
        await jobsAPI.update(id, { status: 'Closed' });
        setJobsList(prev => prev.map(j => j.id === id ? { ...j, status: 'Closed' } : j));
        toast.success('Job closed');
      }
    } catch (error) {
      console.error('Action failed:', error);
      toast.error('Failed to perform action');
    }
  };

  const handleSaveJob = async (updated) => {
    try {
      const { jobs: jobsAPI } = await import('@/utils/api');
      await jobsAPI.update(updated.id, {
        title: updated.title,
        department: updated.department,
        description: updated.description,
        salaryMin: updated.salaryMin,
        salaryMax: updated.salaryMax,
        experience: updated.experience,
        location: updated.location,
        employmentType: updated.employmentType,
        workMode: updated.workMode,
        skills: updated.skills,
        deadline: updated.deadline,
        openings: updated.openings,
      });
      setJobsList(prev => prev.map(j => j.id === updated.id ? { ...j, ...updated, type: updated.employmentType } : j));
      setEditingJob(null);
      toast.success('Job updated successfully');
    } catch (error) {
      console.error('Update failed:', error);
      toast.error('Failed to update job');
    }
  };

  const counts = {
    All:    jobsList.length,
    Active: jobsList.filter(j => j.status === 'Active').length,
    Draft:  jobsList.filter(j => j.status === 'Draft').length,
    Paused: jobsList.filter(j => j.status === 'Paused').length,
    Closed: jobsList.filter(j => j.status === 'Closed').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <SectionHeader title="Manage Jobs" subtitle="View, edit, and manage all your job postings." />
          <Link
            to="/hire-zone/post-job"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 shadow-sm"
            style={{ background: '#8B3A8F' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Post Job
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-2.5 flex-1 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-neutral-400 shrink-0">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search by title or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm text-neutral-700 placeholder-neutral-400 outline-none flex-1"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-neutral-400 hover:text-neutral-600">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === s ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {s} <span className="ml-0.5 opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#e5e7eb" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0110 10" stroke="#8B3A8F" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState title="No jobs found" message="Try adjusting your search or filter." />
            ) : (
              <div className="space-y-3">
                {filtered.map(job => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onAction={handleAction}
                    onView={(j) => setViewingJob(j)}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-neutral-400 text-center mt-4">
            Showing {filtered.length} of {jobsList.length} jobs
          </p>
        )}
      </motion.div>

      {/* Full-page slide panel for viewing */}
      {viewingJob && (
        <JobDetailPanel
          job={viewingJob}
          onClose={() => setViewingJob(null)}
          onEdit={(job) => { setViewingJob(null); setEditingJob(job); }}
        />
      )}

      {/* Edit modal */}
      {editingJob && (
        <EditJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveJob}
        />
      )}
    </div>
  );
};

export default ManageJobs;
