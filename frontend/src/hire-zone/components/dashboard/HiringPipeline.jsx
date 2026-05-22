import { motion } from 'framer-motion';
import { PIPELINE_STATS } from '@/hire-zone/data/mockDashboard';

const total = PIPELINE_STATS[0].count;

const HiringPipeline = () => (
  <div className="bg-white rounded-2xl border border-neutral-100 p-5">
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-neutral-800">Hiring Pipeline</h3>
      <p className="text-xs text-neutral-400 mt-0.5">Candidate funnel overview</p>
    </div>

    <div className="space-y-3">
      {PIPELINE_STATS.map((stage, i) => {
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
        {Math.round((PIPELINE_STATS[PIPELINE_STATS.length - 1].count / total) * 100)}%
      </span>
    </div>
  </div>
);

export default HiringPipeline;
