import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { interviews as interviewsApi } from '@/utils/api';

const COLORS = ['#8B3A8F','#2563eb','#059669','#d97706','#dc2626','#7c3aed'];

const Interviews = () => {
  const [data, setData]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await interviewsApi.getCandidateInterviews();
        setData(res.data?.interviews || []);
      } catch (err) {
        console.error('Failed to fetch interviews:', err);
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusColor = (s) => {
    if (!s) return 'bg-neutral-50 text-neutral-500 border-neutral-100';
    const m = { Scheduled:'bg-blue-50 text-blue-600 border-blue-100', Completed:'bg-green-50 text-green-600 border-green-100', Cancelled:'bg-red-50 text-red-500 border-red-100' };
    return m[s] || 'bg-neutral-50 text-neutral-500 border-neutral-100';
  };

  if (loading) return (
    <div className="text-center py-16 text-neutral-400">
      <p className="text-sm">Loading interviews...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">My Interviews</h1>
        <p className="text-sm text-neutral-500 mt-1">Keep track of your upcoming and past interview sessions.</p>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-100 py-20 text-center">
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📅</div>
          <h3 className="text-lg font-bold text-neutral-800">No Interviews Scheduled</h3>
          <p className="text-sm text-neutral-500 max-w-xs mx-auto mt-1">When companies invite you for an interview, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.map((iv, i) => {
            const company  = iv.companyId?.companyName || 'Company';
            const jobTitle = iv.jobId?.title || 'Job Position';
            const color    = COLORS[i % COLORS.length];
            const dateStr  = iv.interviewDate
              ? new Date(iv.interviewDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—';

            // Show Join button only if Scheduled AND within 10 min of interview time
            const isJoinable = (() => {
              if (iv.status !== 'Scheduled' || !iv.interviewLink) return false;
              if (!iv.interviewDate || !iv.interviewTime) return true; // no time data, show anyway
              try {
                // Parse "2:24 AM" style time
                const [timePart, ampm] = iv.interviewTime.split(' ');
                const [hStr, mStr] = timePart.split(':');
                let h = parseInt(hStr);
                const m = parseInt(mStr || '0');
                if (ampm === 'PM' && h !== 12) h += 12;
                if (ampm === 'AM' && h === 12) h = 0;
                const interviewDt = new Date(iv.interviewDate);
                interviewDt.setHours(h, m, 0, 0);
                const now = Date.now();
                const diff = interviewDt.getTime() - now; // ms until interview
                return diff <= 10 * 60 * 1000; // within 10 min before or already started
              } catch {
                return true;
              }
            })();

            return (
              <motion.div key={iv._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl border border-neutral-100 p-5 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-5">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold shrink-0"
                    style={{ background: color }}>
                    {company.charAt(0).toUpperCase()}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-neutral-900 truncate">{company}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${statusColor(iv.status)}`}>
                        {iv.status || 'Scheduled'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#8B3A8F' }}>{jobTitle}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        {dateStr}
                      </span>
                      {iv.interviewTime && (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {iv.interviewTime}
                        </span>
                      )}
                      {iv.interviewType && (
                        <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                          {iv.interviewType}
                        </span>
                      )}
                      {iv.duration && (
                        <span className="text-xs text-neutral-500">{iv.duration} min</span>
                      )}
                    </div>
                    {iv.notes && <p className="text-xs text-neutral-400 mt-2 line-clamp-1">{iv.notes}</p>}
                  </div>

                  {/* Action */}
                  <div className="shrink-0 flex flex-col gap-2 items-end">
                    {iv.status === 'Cancelled' || iv.status === 'Completed' ? null
                    : isJoinable ? (
                      <a href={iv.interviewLink} target="_blank" rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-green-600 hover:bg-green-700 flex items-center gap-2 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        Join Meeting
                      </a>
                    ) : iv.interviewLink ? (
                      <div className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-500 bg-neutral-50 border border-neutral-100 flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        Link ready at -{' '}
                        {iv.interviewTime}
                      </div>
                    ) : (
                      <div className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 bg-neutral-50 border border-neutral-100 flex items-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        Waiting for link
                      </div>
                    )}
                    {iv.interviewLocation && (
                      <p className="text-[10px] text-neutral-400">📍 {iv.interviewLocation}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Interviews;
