import { useState, useEffect } from 'react';
import { MOCK_SAVED_JOBS } from '@/career-hub/data/mockCandidate';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { savedJobs as savedJobsAPI, jobApplications } from '@/utils/api';

const SavedJobs = () => {
  const { isLoggedIn } = useAuth();
  const [jobs, setJobs] = useState(MOCK_SAVED_JOBS.map(j => ({ ...j, applied: false })));
  const [loading, setLoading] = useState(true);

  // Fetch saved jobs from backend
  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const res = await savedJobsAPI.getAll();
        const data = (res.data.savedJobs || []).map(sj => ({
          id: sj.jobId?._id || sj.jobId,
          title: sj.jobId?.title || 'Job Position',
          company: sj.jobId?.companyId?.companyName || 'Company',
          location: sj.jobId?.location || 'Location',
          salary: sj.jobId?.salaryMin && sj.jobId?.salaryMax 
            ? `₹${sj.jobId.salaryMin}-${sj.jobId.salaryMax}` 
            : 'Not disclosed',
          type: sj.jobId?.employmentType || 'Full-time',
          postedDate: new Date(sj.jobId?.createdAt).toLocaleDateString(),
          applied: false,
        }));
        setJobs(data.length > 0 ? data : MOCK_SAVED_JOBS.map(j => ({ ...j, applied: false })));
      } catch (error) {
        console.error('Failed to fetch saved jobs:', error);
        setJobs(MOCK_SAVED_JOBS.map(j => ({ ...j, applied: false })));
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [isLoggedIn]);

  const handleApply = async (id) => {
    const job = jobs.find(j => j.id === id);
    if (job.applied) return;

    try {
      await jobApplications.apply({ jobId: id });
      setJobs(prev => prev.map(j => j.id === id ? { ...j, applied: true } : j));
      toast.success(`Applied for ${job.title} at ${job.company}!`);
    } catch (error) {
      console.error('Failed to apply:', error);
      toast.error('Failed to apply for job');
    }
  };

  const handleRemove = async (id) => {
    try {
      await savedJobsAPI.remove(id);
      setJobs(prev => prev.filter(j => j.id !== id));
      toast.success('Job removed from saved list');
    } catch (error) {
      console.error('Failed to remove:', error);
      toast.error('Failed to remove job');
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <h1 className="text-lg font-bold text-neutral-800 mb-1">Saved Jobs</h1>
        <p className="text-sm text-neutral-500">{jobs.length} jobs bookmarked</p>
      </div>

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-100 py-12 text-center">
            <p className="text-3xl mb-3">🔖</p>
            <p className="text-sm text-neutral-500">No saved jobs yet.</p>
          </div>
        ) : (
          jobs.map(job => (
            <div key={job.id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center text-sm font-bold text-neutral-600 shrink-0">
                {job.company[0]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-neutral-800 text-sm">{job.title}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{job.company} · {job.location}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-neutral-400">{job.salary}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="text-xs text-neutral-400">{job.type}</span>
                  <span className="w-1 h-1 rounded-full bg-neutral-300" />
                  <span className="text-xs text-neutral-400">Posted {job.postedDate}</span>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={job.applied}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    job.applied 
                      ? 'bg-green-50 text-green-600 border border-green-200 cursor-default' 
                      : 'text-white hover:opacity-90 active:scale-95'
                  }`}
                  style={!job.applied ? { background: '#8B3A8F' } : {}}
                >
                  {job.applied ? '✓ Applied' : 'Apply Now'}
                </button>
                <button 
                  onClick={() => handleRemove(job.id)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SavedJobs;
