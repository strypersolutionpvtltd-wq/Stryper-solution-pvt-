import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { jobApplications } from '@/utils/api';
import { RECENT_APPLICATIONS } from '@/hire-zone/data/mockDashboard';
import StatusBadge from '@/hire-zone/components/shared/StatusBadge';
import toast from 'react-hot-toast';

const AVATAR_COLORS = ['#8B3A8F', '#2563eb', '#0d9488', '#d97706', '#ea580c', '#16a34a'];

const RecentApplications = () => {
  const [applications, setApplications] = useState(RECENT_APPLICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // Fetch all applications for company
        // Note: Backend may need a dedicated endpoint for company's all applications
        // For now, we'll fetch applications for each active job
        setApplications(RECENT_APPLICATIONS);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const mapApplicationToRow = (app) => ({
    id: app._id,
    name: app.candidateId?.firstName + ' ' + app.candidateId?.lastName || 'Unknown',
    role: app.jobId?.title || 'Position',
    status: app.status || 'Applied',
    date: new Date(app.createdAt).toISOString().split('T')[0],
    exp: app.candidateId?.experience || 'N/A',
    location: app.candidateId?.location || 'N/A',
  });

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-50">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Recent Applications</h3>
          <p className="text-xs text-neutral-400 mt-0.5">{applications.length} new this week</p>
        </div>
        <Link
          to="/hire-zone/applicants"
          className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#8B3A8F', background: '#f3e8f4' }}
        >
          View All →
        </Link>
      </div>

      {/* Table header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2.5 bg-neutral-50 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        <div className="col-span-4">Candidate</div>
        <div className="col-span-3">Role</div>
        <div className="col-span-2">Experience</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Date</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-neutral-50">
        {applications.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-neutral-50/60 transition-colors cursor-pointer group"
          >
            {/* Candidate */}
            <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {app.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-800 truncate group-hover:text-purple-700 transition-colors">
                  {app.name}
                </p>
                <p className="text-xs text-neutral-400 truncate flex items-center gap-1">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {app.location}
                </p>
              </div>
            </div>

            {/* Role */}
            <div className="hidden md:block col-span-3">
              <p className="text-sm text-neutral-700 truncate">{app.role}</p>
            </div>

            {/* Experience */}
            <div className="hidden md:block col-span-2">
              <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                {app.exp}
              </span>
            </div>

            {/* Status */}
            <div className="hidden md:block col-span-2">
              <StatusBadge status={app.status} />
            </div>

            {/* Date */}
            <div className="hidden md:block col-span-1">
              <p className="text-xs text-neutral-400">{app.date.slice(5)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentApplications;
