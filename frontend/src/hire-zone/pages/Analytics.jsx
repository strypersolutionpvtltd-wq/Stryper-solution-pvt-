import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { CHART_DATA, PIPELINE_STATS } from '@/hire-zone/data/mockDashboard';

const MAX_APP = Math.max(...CHART_DATA.map(d => d.applications));

const DEPT_DATA = [
  { dept: 'Engineering',     openings: 8, filled: 5, color: '#8B3A8F' },
  { dept: 'Design',          openings: 3, filled: 2, color: '#2563eb' },
  { dept: 'Human Resources', openings: 2, filled: 2, color: '#16a34a' },
  { dept: 'Analytics',       openings: 4, filled: 1, color: '#d97706' },
  { dept: 'Product',         openings: 3, filled: 2, color: '#0d9488' },
];

const SOURCE_DATA = [
  { source: 'Direct Apply',  count: 68, pct: 48, color: '#8B3A8F' },
  { source: 'LinkedIn',      count: 34, pct: 24, color: '#2563eb' },
  { source: 'Referral',      count: 22, pct: 15, color: '#16a34a' },
  { source: 'Job Boards',    count: 18, pct: 13, color: '#d97706' },
];

const TIME_TO_HIRE = [
  { role: 'Frontend Developer', days: 18 },
  { role: 'DevOps Engineer',    days: 24 },
  { role: 'HR Manager',         days: 12 },
  { role: 'Backend Developer',  days: 21 },
  { role: 'UI/UX Designer',     days: 15 },
];
const MAX_DAYS = Math.max(...TIME_TO_HIRE.map(d => d.days));

const StatCard = ({ label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl border border-neutral-100 p-5"
  >
    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{label}</p>
    <p className="text-4xl font-bold" style={{ color }}>{value}</p>
    {sub && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
  </motion.div>
);

const Analytics = () => (
  <div className="p-6 max-w-6xl mx-auto space-y-6">
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <SectionHeader title="Analytics" subtitle="Deep-dive into your hiring performance metrics." />
    </motion.div>

    {/* Top KPIs */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Applications" value="142" sub="This quarter"       color="#8B3A8F" delay={0.05} />
      <StatCard label="Hire Rate"          value="12%" sub="Industry avg: 8%"   color="#16a34a" delay={0.10} />
      <StatCard label="Avg. Time to Hire"  value="18d" sub="Days per position"  color="#2563eb" delay={0.15} />
      <StatCard label="Offer Acceptance"   value="87%" sub="Offers accepted"    color="#d97706" delay={0.20} />
    </div>

    {/* Row 2: Application trend + Source breakdown */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

      {/* Application trend chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-neutral-800">Monthly Applications vs Hires</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Last 6 months</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#8B3A8F' }} />Applied</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-teal-400" />Hired</span>
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {CHART_DATA.map(({ month, applications, hired }, i) => (
            <div key={month} className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-end gap-0.5 w-full" style={{ height: '140px' }}>
                <motion.div
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                  style={{ height: `${(applications / MAX_APP) * 100}%`, background: '#8B3A8F', minHeight: 6, originY: 1 }}
                  className="flex-1 rounded-t-md"
                />
                <motion.div
                  initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.07 + 0.05, ease: 'easeOut' }}
                  style={{ height: `${(hired / MAX_APP) * 100}%`, background: '#2dd4bf', minHeight: 4, originY: 1 }}
                  className="flex-1 rounded-t-md"
                />
              </div>
              <span className="text-[10px] text-neutral-400">{month}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Source breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-neutral-100 p-6"
      >
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">Application Sources</h3>
        <div className="space-y-3">
          {SOURCE_DATA.map(({ source, count, pct, color }) => (
            <div key={source}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-neutral-700">{source}</span>
                <span className="text-xs font-bold text-neutral-800">{count} <span className="text-neutral-400 font-normal">({pct}%)</span></span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>

    {/* Row 3: Dept hiring + Time to hire */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Department breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white rounded-2xl border border-neutral-100 p-6"
      >
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">Hiring by Department</h3>
        <div className="space-y-3">
          {DEPT_DATA.map(({ dept, openings, filled, color }) => (
            <div key={dept}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-neutral-700">{dept}</span>
                <span className="text-xs text-neutral-500">{filled}/{openings} filled</span>
              </div>
              <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(filled / openings) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Time to hire */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-neutral-100 p-6"
      >
        <h3 className="text-sm font-semibold text-neutral-800 mb-4">Time to Hire (days)</h3>
        <div className="space-y-3">
          {TIME_TO_HIRE.map(({ role, days }, i) => (
            <div key={role} className="flex items-center gap-3">
              <span className="text-xs text-neutral-600 w-36 shrink-0 truncate">{role}</span>
              <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(days / MAX_DAYS) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.07, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: days > 20 ? '#ea580c' : days > 15 ? '#d97706' : '#16a34a' }}
                />
              </div>
              <span className="text-xs font-bold text-neutral-700 w-8 text-right">{days}d</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-neutral-400 mt-4">🟢 &lt;15d  🟡 15-20d  🔴 &gt;20d</p>
      </motion.div>
    </div>

    {/* Pipeline funnel */}
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="bg-white rounded-2xl border border-neutral-100 p-6"
    >
      <h3 className="text-sm font-semibold text-neutral-800 mb-5">Hiring Funnel</h3>
      <div className="flex items-end justify-center gap-4">
        {PIPELINE_STATS.map(({ stage, count, color }, i) => {
          const maxCount = PIPELINE_STATS[0].count;
          const h = Math.max((count / maxCount) * 160, 24);
          return (
            <div key={stage} className="flex flex-col items-center gap-2">
              <span className="text-sm font-bold" style={{ color }}>{count}</span>
              <motion.div
                initial={{ height: 0 }} animate={{ height: h }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
                className="w-16 rounded-t-xl"
                style={{ background: color, opacity: 0.85 }}
              />
              <span className="text-[10px] text-neutral-500 font-medium text-center">{stage}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  </div>
);

export default Analytics;
