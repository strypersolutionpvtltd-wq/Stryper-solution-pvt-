import { useState, useEffect } from 'react';
import { jobApplications } from '@/utils/api';
import { MOCK_APPLIED_JOBS } from '@/career-hub/data/mockCandidate';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  'Under Review':        'bg-blue-50 text-blue-700 border-blue-200',
  'Applied':             'bg-blue-50 text-blue-700 border-blue-200',
  'Shortlisted':         'bg-green-50 text-green-700 border-green-200',
  'Rejected':            'bg-red-50 text-red-700 border-red-200',
  'Interview Scheduled': 'bg-purple-50 text-purple-700 border-purple-200',
  'Accepted':            'bg-green-50 text-green-700 border-green-200',
};

const AppliedJobs = () => {
  const { isLoggedIn } = useAuth();
  const [allJobs, setAllJobs] = useState(MOCK_APPLIED_JOBS);
  const [loading, setLoading] = useState(true);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await jobApplications.getMyApplications();
        const apps = (res.data.applications || []).map(app => ({
          id: app._id,
          title: app.jobId?.title || 'Job Position',
          company: app.jobId?.companyId?.companyName || 'Company',
          location: app.jobId?.location || 'Location',
          appliedDate: new Date(app.createdAt).toLocaleDateString(),
          status: app.status || 'Applied',
        }));
        setAllJobs(apps.length > 0 ? apps : MOCK_APPLIED_JOBS);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setAllJobs(MOCK_APPLIED_JOBS);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isLoggedIn]);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-neutral-800 mb-1">Applied Jobs</h1>
        <p className="text-sm text-neutral-500">{allJobs.length} applications tracked</p>
      </div>

      <div className="space-y-3">
        {allJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center">
            <p className="text-neutral-400 text-sm">No applications yet. Start applying to jobs!</p>
          </div>
        ) : (
          allJobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
              {/* Company initial */}
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 shrink-0">
                {job.company[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-800 text-sm">{job.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{job.company} · {job.location}</p>
                <p className="text-xs text-neutral-400 mt-0.5">Applied {job.appliedDate}</p>
              </div>

              <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[job.status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                {job.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
