import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import JobCard from '@/hire-zone/components/jobs/JobCard';
import EmptyState from '@/hire-zone/components/shared/EmptyState';
import { MOCK_JOBS } from '@/hire-zone/data/mockJobs';

const STATUS_FILTERS = ['All', 'Active', 'Paused', 'Closed'];

const ManageJobs = () => {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
                        j.department.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAction = (id, action) => {
    setJobs(prev => prev.map(j => {
      if (j.id !== id) return j;
      if (action === 'toggle') return { ...j, status: j.status === 'Active' ? 'Paused' : 'Active' };
      if (action === 'close')  return { ...j, status: 'Closed' };
      return j;
    }));
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
          {/* Search */}
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

          {/* Status tabs */}
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
                <JobCard key={job.id} job={job} onAction={handleAction} />
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
    </div>
  );
};

export default ManageJobs;
