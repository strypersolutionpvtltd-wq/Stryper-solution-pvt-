import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { dashboard as dashboardAPI } from '@/utils/api';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const DEPT_COLORS = ['#8B3A8F','#2563eb','#16a34a','#d97706','#0d9488','#ea580c','#6366f1'];

// ── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonBlock = ({ h = 'h-8', w = 'w-full' }) => (
  <div className={`${h} ${w} bg-neutral-100 rounded-lg animate-pulse`} />
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, color, delay, loading }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    className="bg-white rounded-2xl border border-neutral-100 p-5"
  >
    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">{label}</p>
    {loading ? (
      <SkeletonBlock h="h-10" w="w-24" />
    ) : (
      <p className="text-4xl font-bold" style={{ color }}>{value}</p>
    )}
    {sub && !loading && <p className="text-xs text-neutral-400 mt-1">{sub}</p>}
  </motion.div>
);

// ── Main ──────────────────────────────────────────────────────────────────────
const Analytics = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.getCompanyAnalytics()
      .then(res => setData(res.data.analytics))
      .catch(err => {
        console.error('Analytics fetch failed:', err);
        toast.error('Failed to load analytics');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = () => {
    toast.loading('Generating report...');
    setTimeout(() => { toast.dismiss(); window.print(); }, 800);
  };

  const kpis    = data?.kpis          || {};
  const chart   = data?.chartData     || [];
  const funnel  = data?.pipelineStages || [];
  const depts   = data?.deptData      || [];
  const tth     = data?.timeToHire    || [];

  const maxApps  = chart.length  ? Math.max(...chart.map(d => d.applications), 1)  : 1;
  const maxDays  = tth.length    ? Math.max(...tth.map(d => d.days), 1)            : 1;
  const maxFunnel = funnel.length ? Math.max(...funnel.map(f => f.count), 1)       : 1;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <style>{`@media print { aside,header,button{display:none!important} body{background:white!important} .max-w-6xl{max-width:100%!important} }`}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
          <SectionHeader title="Analytics" subtitle="Deep-dive into your hiring performance metrics." />
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B3A8F] text-white text-sm font-semibold hover:bg-[#7a327d] transition-all shadow-lg shadow-purple-600/20 shrink-0"
        >
          <Download size={18} />
          Download PDF Report
        </motion.button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Applications" value={kpis.totalApplications ?? '—'} sub="All time"              color="#8B3A8F" delay={0.05} loading={loading} />
        <StatCard label="Hire Rate"          value={kpis.hireRate != null ? `${kpis.hireRate}%` : '—'}         sub="Applications → hired"    color="#16a34a" delay={0.10} loading={loading} />
        <StatCard label="Avg. Time to Hire"  value={kpis.avgTimeToHire != null ? `${kpis.avgTimeToHire}d` : '—'} sub="Days per position"    color="#2563eb" delay={0.15} loading={loading} />
        <StatCard label="Offer Acceptance"   value={kpis.offerAcceptance != null ? `${kpis.offerAcceptance}%` : '—'} sub="Offers accepted" color="#d97706" delay={0.20} loading={loading} />
      </div>

      {/* Row 2: Chart + Source */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Monthly trend */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6">
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
          {loading ? (
            <div className="flex items-end gap-3 h-40">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="flex-1 flex items-end gap-0.5" style={{ height: 140 }}>
                  <div className="flex-1 rounded-t-md bg-neutral-100 animate-pulse" style={{ height: `${40 + i * 15}%` }} />
                  <div className="flex-1 rounded-t-md bg-neutral-50 animate-pulse" style={{ height: `${10 + i * 5}%` }} />
                </div>
              ))}
            </div>
          ) : chart.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-xs text-neutral-400">No application data yet</div>
          ) : (
            <div className="flex items-end gap-3 h-40">
              {chart.map(({ month, applications, hired }, i) => (
                <div key={month} className="flex flex-col items-center gap-1 flex-1">
                  <div className="flex items-end gap-0.5 w-full" style={{ height: 140 }}>
                    <motion.div
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                      style={{ height: `${(applications / maxApps) * 100}%`, background: '#8B3A8F', minHeight: 4, originY: 1 }}
                      className="flex-1 rounded-t-md"
                    />
                    <motion.div
                      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.07 + 0.05, ease: 'easeOut' }}
                      style={{ height: `${(hired / maxApps) * 100}%`, background: '#2dd4bf', minHeight: hired > 0 ? 4 : 0, originY: 1 }}
                      className="flex-1 rounded-t-md"
                    />
                  </div>
                  <span className="text-[10px] text-neutral-400">{month}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Hiring funnel */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-neutral-100 p-6">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">Hiring Funnel</h3>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <SkeletonBlock key={i} h="h-5" />)}</div>
          ) : funnel.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8">No pipeline data yet</p>
          ) : (
            <div className="space-y-3">
              {funnel.map(({ stage, count, color }) => (
                <div key={stage}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-700">{stage}</span>
                    <span className="text-xs font-bold text-neutral-800">{count}</span>
                  </div>
                  <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${(count / maxFunnel) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Row 3: Dept + Time to hire */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Dept breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-neutral-100 p-6">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">Hiring by Department</h3>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <SkeletonBlock key={i} h="h-5" />)}</div>
          ) : depts.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8">No department data yet</p>
          ) : (
            <div className="space-y-3">
              {depts.map(({ dept, openings, filled, color }, i) => (
                <div key={dept}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-neutral-700">{dept}</span>
                    <span className="text-xs text-neutral-500">{filled}/{openings} filled</span>
                  </div>
                  <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: openings > 0 ? `${(filled / openings) * 100}%` : '0%' }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Time to hire */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-neutral-100 p-6">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4">Time to Hire (days)</h3>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map(i => <SkeletonBlock key={i} h="h-5" />)}</div>
          ) : tth.length === 0 ? (
            <p className="text-xs text-neutral-400 text-center py-8">No hired candidates yet</p>
          ) : (
            <>
              <div className="space-y-3">
                {tth.map(({ role, days }, i) => (
                  <div key={role} className="flex items-center gap-3">
                    <span className="text-xs text-neutral-600 w-36 shrink-0 truncate">{role}</span>
                    <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${(days / maxDays) * 100}%` }}
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
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
