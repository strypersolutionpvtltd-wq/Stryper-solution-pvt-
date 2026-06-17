import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { dashboard } from '@/utils/api';

const STAGE_COLORS = { Applied:'#6366f1', Shortlisted:'#8B3A8F', Interview:'#f59e0b', Offer:'#10b981', Hired:'#0d9488', Rejected:'#ef4444' };

const HiringPipeline = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboard.getCompany();
        const pipeline = res.data?.dashboard?.pipeline || {};
        const stages = ['Applied','Shortlisted','Interview','Offer','Hired'];
        const data = stages
          .filter(s => pipeline[s] !== undefined)
          .map(s => ({ stage: s, count: pipeline[s] || 0, color: STAGE_COLORS[s] || '#8B3A8F' }));
        setStats(data.length ? data : []);
      } catch (err) {
        console.error('Pipeline fetch error:', err);
        setStats([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = stats[0]?.count || 1;

  if (!loading && stats.length === 0) return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5">
      <h3 className="text-sm font-semibold text-neutral-800 mb-2">Hiring Pipeline</h3>
      <p className="text-xs text-neutral-400 text-center py-6">No application data yet.</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-neutral-800">Hiring Pipeline</h3>
        <p className="text-xs text-neutral-400 mt-0.5">Candidate funnel overview</p>
      </div>

      <div className="space-y-3">
        {stats.map((stage, i) => {
          const pct = Math.round((stage.count / total) * 100);
          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: stage.color }}
                  />
                  <span className="text-xs font-medium text-neutral-700">{stage.stage}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-800">{stage.count}</span>
                  <span className="text-[10px] text-neutral-400 w-8 text-right">{pct}%</span>
                </div>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: stage.color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Conversion rate */}
      <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center justify-between">
        <span className="text-xs text-neutral-400">Overall conversion</span>
        <span className="text-sm font-bold" style={{ color: '#8B3A8F' }}>
          {Math.round((stats[stats.length - 1]?.count || 0 / total) * 100)}%
        </span>
      </div>
    </div>
  );
};

export default HiringPipeline;
