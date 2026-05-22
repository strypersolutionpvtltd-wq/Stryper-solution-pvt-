import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ACTIVE_JOBS } from '@/hire-zone/data/mockDashboard';

const ActiveJobsWidget = () => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold text-neutral-800">Active Jobs</h3>
        <p className="text-xs text-neutral-400 mt-0.5">Live postings</p>
      </div>
      <Link
        to="/hire-zone/manage-jobs"
        className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
        style={{ color: '#8B3A8F', background: '#f3e8f4' }}
      >
        Manage →
      </Link>
    </div>

    <div className="space-y-3">
      {ACTIVE_JOBS.map((job, i) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="group"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-neutral-800 group-hover:text-purple-700 transition-colors truncate">
              {job.title}
            </p>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-xs text-neutral-500">{job.applicants} applied</span>
              {job.newToday > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-600">
                  +{job.newToday} today
                </span>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${job.progress}%` }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(to right, #8B3A8F, #b06ab3)' }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 shrink-0">{job.daysLeft}d left</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

export default ActiveJobsWidget;
