import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import JobCard from '@/hire-zone/components/jobs/JobCard';
import EmptyState from '@/hire-zone/components/shared/EmptyState';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';
import { MOCK_JOBS } from '@/hire-zone/data/mockJobs';
import toast from 'react-hot-toast';

const STATUS_FILTERS = ['All', 'Active', 'Paused', 'Closed'];

// ── Edit Job Modal ──────────────────────────────────────────────────────────
const EditJobModal = ({ job, onClose, onSave }) => {
  const [form, setForm] = useState({
    title: job?.title || '',
    department: job?.department || '',
    description: job?.description || '',
    salary: job?.salary || '',
    experience: job?.experience || '',
    location: job?.location || '',
    type: job?.type || 'Full-time',
    workMode: job?.workMode || 'Hybrid',
    skills: (job?.skills || []).join(', '),
    deadline: job?.deadline || '',
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
      salary: form.salary,
      experience: form.experience,
      location: form.location,
      type: form.type,
      workMode: form.workMode,
      skills: form.skills.split(',').map(s => s.trim()).filter(s => s),
      deadline: form.deadline,
    });
    toast.success('Job updated successfully');
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-[70]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Edit Job</h2>
              <p className="text-xs text-neutral-400 mt-0.5">Update job details and requirements.</p>
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
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title + Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="e.g. Senior React Developer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Department *</label>
                <input
                  type="text"
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="e.g. Engineering"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Job Description *</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
                placeholder="Describe the job role and responsibilities..."
              />
            </div>

            {/* Salary + Experience */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Salary Range</label>
                <input
                  type="text"
                  placeholder="e.g. ₹20-35 LPA"
                  value={form.salary}
                  onChange={e => setForm({ ...form, salary: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Experience Required</label>
                <input
                  type="text"
                  placeholder="e.g. 2-4 years"
                  value={form.experience}
                  onChange={e => setForm({ ...form, experience: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Location + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Location</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                  placeholder="e.g. Bangalore"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Job Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
            </div>

            {/* Work Mode + Deadline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Work Mode</label>
                <select
                  value={form.workMode}
                  onChange={e => setForm({ ...form, workMode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                >
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Onsite">Onsite</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Application Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Required Skills (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. React, TypeScript, Node.js"
                value={form.skills}
                onChange={e => setForm({ ...form, skills: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-100">
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
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: '#8B3A8F' }}
              >
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Job Detail Modal ──────────────────────────────────────────────────────────
const JobDetailModal = ({ job, onClose, onEdit }) => {
  if (!job) return null;

  const Row = ({ label, value }) => (
    <div className="flex flex-col gap-0.5">
      <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">{label}</p>
      <p className="text-sm text-neutral-800">{value || '—'}</p>
    </div>
  );

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
          className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-base font-bold text-neutral-900">{job.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge status={job.status} />
                <span className="text-xs text-neutral-400">{job.department}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors shrink-0"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-6 py-4 bg-neutral-50 border-b border-neutral-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-neutral-900">{job.applicants}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider">Applicants</p>
            </div>
            <div className="text-center border-l sm:border-x border-neutral-200">
              <p className="text-2xl font-bold text-neutral-900">{job.type}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider">Type</p>
            </div>
            <div className="text-center col-span-2 sm:col-span-1 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-200 sm:border-none">
              <p className="text-2xl font-bold" style={{ color: '#8B3A8F' }}>{job.status}</p>
              <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider">Status</p>
            </div>
          </div>

          {/* Details */}
          <div className="px-6 py-5 space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Basic Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Row label="Location" value={job.location} />
                <Row label="Work Mode" value={job.workMode} />
                <Row label="Posted Date" value={job.postedDate} />
                <Row label="Deadline" value={job.deadline} />
              </div>
            </div>

            {/* Compensation */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Compensation & Experience</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Row label="Salary" value={job.salary} />
                <Row label="Experience" value={job.experience} />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Job Description</h3>
              <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                {job.description}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 pt-4 flex gap-3 border-t border-neutral-100 bg-neutral-50">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-600 hover:bg-white transition-colors"
            >
              Close
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              style={{ background: '#8B3A8F' }}
              onClick={() => onEdit(job)}
            >
              Edit Job
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const ManageJobs = () => {
  const [jobs, setJobs]             = useState(MOCK_JOBS);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();
  const [viewingJob, setViewingJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = (id, action) => {
    if (action === 'view') {
      navigate('/hire-zone/applicants');
      return;
    }
    if (action === 'delete') {
      setJobs(prev => prev.filter(j => j.id !== id));
    } else {
      setJobs(prev => prev.map(j => {
        if (j.id !== id) return j;
        if (action === 'toggle') return { ...j, status: j.status === 'Active' ? 'Paused' : 'Active' };
        if (action === 'close')  return { ...j, status: 'Closed' };
        return j;
      }));
    }
  };

  const handleSaveJob = (updatedJob) => {
    setJobs(prev => prev.map(j => j.id === updatedJob.id ? updatedJob : j));
    setEditingJob(null);
  };

  const counts = {
    All:    jobs.length,
    Active: jobs.filter(j => j.status === 'Active').length,
    Paused: jobs.filter(j => j.status === 'Paused').length,
    Closed: jobs.filter(j => j.status === 'Closed').length,
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between mb-6">
          <SectionHeader title="Manage Jobs" subtitle="View, edit, and manage all your job postings." />
          <Link
            to="/hire-zone/post-job"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 transition-colors shadow-sm"
            style={{ background: '#8B3A8F' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Post Job
          </Link>
        </div>

        {/* Filters row */}
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
                  statusFilter === s
                    ? 'bg-white text-neutral-900 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-700'
                }`}
              >
                {s} <span className="ml-0.5 opacity-60">({counts[s]})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Job list */}
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

        {filtered.length > 0 && (
          <p className="text-xs text-neutral-400 text-center mt-4">
            Showing {filtered.length} of {jobs.length} jobs
          </p>
        )}
      </motion.div>

      {/* Job Detail Modal */}
      {viewingJob && (
        <JobDetailModal
          job={viewingJob}
          onClose={() => setViewingJob(null)}
          onEdit={(job) => { setViewingJob(null); setEditingJob(job); }}
        />
      )}

      {/* Edit Job Modal */}
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
