import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { dashboard } from '@/utils/api';

const HiringChart = () => {
  const [chartData, setChartData] = useState([]);
  const [hovered, setHovered]     = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await dashboard.getCompany();
        setChartData(res.data?.dashboard?.chartData || []);
      } catch (err) {
        console.error('Chart fetch error:', err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const maxVal     = Math.max(...chartData.map(d => d.applications), 1);
  const totalApps  = chartData.reduce((s, d) => s + d.applications, 0);
  const totalHired = chartData.reduce((s, d) => s + d.hired, 0);
  const hireRate   = totalApps ? ((totalHired / totalApps) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold text-neutral-800">Application Trends</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Applications vs Hires — last 6 months</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#8B3A8F' }} />
            Applications
          </span>
          <span className="flex items-center gap-1.5 text-neutral-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-teal-400" />
            Hired
          </span>
        </div>
      </div>

      {loading ? (
        <div className="h-44 flex items-center justify-center text-neutral-300 text-sm">Loading...</div>
      ) : chartData.length === 0 ? (
        <div className="h-44 flex items-center justify-center text-neutral-400 text-sm">No data yet</div>
      ) : (
        <div className="flex items-end gap-2 h-44 relative">
          {[0, 25, 50, 75, 100].map(pct => (
            <div key={pct} className="absolute left-0 right-0 border-t border-neutral-50" style={{ bottom: `${pct}%` }} />
          ))}
          {chartData.map(({ month, applications, hired }, i) => {
            const appH  = (applications / maxVal) * 100;
            const hireH = (hired / maxVal) * 100;
            const isHov = hovered === i;
            return (
              <div key={month} className="flex flex-col items-center gap-1 flex-1 relative"
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {isHov && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-14 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg">
                    <p className="font-semibold">{month}</p>
                    <p>{applications} applied · {hired} hired</p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                  </motion.div>
                )}
                <div className="flex items-end gap-0.5 w-full h-full">
                  <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                    style={{ height: `${appH}%`, background: isHov ? '#6d2b71' : '#8B3A8F', minHeight: 6, originY: 1 }}
                    className="flex-1 rounded-t-md transition-colors duration-150" />
                  <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: i * 0.07 + 0.05, ease: 'easeOut' }}
                    style={{ height: `${hireH}%`, background: isHov ? '#0f766e' : '#2dd4bf', minHeight: 4, originY: 1 }}
                    className="flex-1 rounded-t-md transition-colors duration-150" />
                </div>
                <span className="text-[10px] text-neutral-400 mt-1">{month}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">{totalApps}</p>
          <p className="text-[10px] text-neutral-400">Total Applications</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-teal-600">{totalHired}</p>
          <p className="text-[10px] text-neutral-400">Total Hired</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">{hireRate}%</p>
          <p className="text-[10px] text-neutral-400">Hire Rate</p>
        </div>
      </div>
    </div>
  );
};

export default HiringChart;
