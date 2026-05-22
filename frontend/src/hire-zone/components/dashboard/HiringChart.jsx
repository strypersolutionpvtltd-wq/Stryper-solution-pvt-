import { useState } from 'react';
import { motion } from 'framer-motion';
import { CHART_DATA } from '@/hire-zone/data/mockDashboard';

const MAX_VAL = Math.max(...CHART_DATA.map(d => d.applications));

const HiringChart = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6 h-full">
      {/* Header */}
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

      {/* Chart */}
      <div className="flex items-end gap-2 h-44 relative">
        {/* Y-axis guide lines */}
        {[0, 25, 50, 75, 100].map(pct => (
          <div
            key={pct}
            className="absolute left-0 right-0 border-t border-neutral-50"
            style={{ bottom: `${pct}%` }}
            aria-hidden="true"
          />
        ))}

        {CHART_DATA.map(({ month, applications, hired }, i) => {
          const appH = (applications / MAX_VAL) * 100;
          const hireH = (hired / MAX_VAL) * 100;
          const isHov = hovered === i;

          return (
            <div
              key={month}
              className="flex flex-col items-center gap-1 flex-1 relative"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Tooltip */}
              {isHov && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-14 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-10 shadow-lg"
                >
                  <p className="font-semibold">{month}</p>
                  <p>{applications} applied · {hired} hired</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900" />
                </motion.div>
              )}

              {/* Bars side by side */}
              <div className="flex items-end gap-0.5 w-full h-full">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: 'easeOut' }}
                  style={{
                    height: `${appH}%`,
                    background: isHov ? '#6d2b71' : '#8B3A8F',
                    minHeight: 6,
                    originY: 1,
                  }}
                  className="flex-1 rounded-t-md transition-colors duration-150"
                />
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.07 + 0.05, ease: 'easeOut' }}
                  style={{
                    height: `${hireH}%`,
                    background: isHov ? '#0f766e' : '#2dd4bf',
                    minHeight: 4,
                    originY: 1,
                  }}
                  className="flex-1 rounded-t-md transition-colors duration-150"
                />
              </div>

              <span className="text-[10px] text-neutral-400 mt-1">{month}</span>
            </div>
          );
        })}
      </div>

      {/* Summary row */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-50">
        <div className="text-center">
          <p className="text-lg font-bold text-neutral-900">181</p>
          <p className="text-[10px] text-neutral-400">Total Applications</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-teal-600">22</p>
          <p className="text-[10px] text-neutral-400">Total Hired</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-purple-600">12.2%</p>
          <p className="text-[10px] text-neutral-400">Hire Rate</p>
        </div>
      </div>
    </div>
  );
};

export default HiringChart;
