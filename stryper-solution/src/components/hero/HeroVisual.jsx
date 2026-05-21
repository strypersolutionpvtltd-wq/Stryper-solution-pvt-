import { motion } from 'framer-motion';

/**
 * HeroVisual - premium workforce dashboard panel.
 * Floating cards are positioned outside the dashboard frame edges
 * so they never cover internal content.
 */
const HeroVisual = () => (
  /*
   * Outer wrapper has extra horizontal padding (px-10) so the
   * left/right floating cards (-left-10 / -right-8) have room
   * to sit outside the frame without being clipped.
   */
  <div className="relative w-full aspect-[4/4.6] max-w-[500px] ml-auto select-none px-2 pb-6">

    {/* ── Main dashboard frame ── */}
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full h-full rounded-3xl overflow-hidden shadow-strong"
      style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #4c1d95 100%)' }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Ambient glows — contained inside frame */}
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-brand-gold-500/12 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full bg-brand-purple-400/18 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* ── Dashboard content ── */}
      <div className="relative z-10 p-5 flex flex-col gap-3 h-full">

        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/45 text-[9px] uppercase tracking-widest font-medium">
              Workforce Dashboard
            </p>
            <p className="text-white text-[13px] font-semibold mt-0.5">Stryper Solution</p>
          </div>
          {/* Live badge — inside header, not floating */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/25">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span className="text-emerald-300 text-[9px] font-semibold">Live</span>
          </div>
        </div>

        {/* KPI row — 3 equal tiles */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { val: '500+', lbl: 'Workers',   color: 'text-white'            },
            { val: '50+',  lbl: 'Clients',   color: 'text-brand-gold-300'   },
            { val: '98%',  lbl: 'Retention', color: 'text-emerald-300'      },
          ].map((k) => (
            <div
              key={k.lbl}
              className="bg-white/[0.07] rounded-xl px-2 py-2.5 border border-white/[0.08] text-center"
            >
              <p className={`text-lg font-bold font-display ${k.color} leading-none`}>{k.val}</p>
              <p className="text-white/45 text-[9px] mt-1 font-medium">{k.lbl}</p>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-white/[0.07] rounded-xl px-3.5 py-3 border border-white/[0.08]">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-white/65 text-[10px] font-semibold">Monthly Deployments</span>
            <span className="text-brand-gold-300 text-[10px] font-bold">↑ 24%</span>
          </div>
          <div className="flex items-end gap-1 h-12">
            {[40, 65, 45, 80, 60, 90, 75, 95, 70, 88, 82, 100].map((h, i) => (
              <motion.div
                key={i}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.35, delay: 0.85 + i * 0.035, ease: 'easeOut' }}
                style={{
                  height: `${h}%`,
                  flex: 1,
                  borderRadius: '3px 3px 0 0',
                  background:
                    i === 11
                      ? 'linear-gradient(180deg,#fbbf24,#d97706)'
                      : 'rgba(255,255,255,0.16)',
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {['Jan', 'Mar', 'May', 'Jul', 'Sep', 'Nov'].map((m) => (
              <span key={m} className="text-white/25 text-[8px]">{m}</span>
            ))}
          </div>
        </div>

        {/* Active deployments list */}
        <div className="bg-white/[0.07] rounded-xl px-3.5 py-3 border border-white/[0.08] flex-1 min-h-0">
          <p className="text-white/65 text-[10px] font-semibold mb-2">Active Deployments</p>
          <div className="space-y-1.5">
            {[
              { role: 'Industrial Operators', count: '48 workers', status: 'Active',     dot: 'bg-emerald-400' },
              { role: 'Warehouse Associates', count: '32 workers', status: 'Active',     dot: 'bg-emerald-400' },
              { role: 'Facility Staff',       count: '24 workers', status: 'Onboarding', dot: 'bg-brand-gold-400' },
            ].map((job) => (
              <div
                key={job.role}
                className="flex items-center justify-between py-1.5 border-b border-white/[0.06] last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${job.dot} shrink-0`} aria-hidden="true" />
                  <div className="min-w-0">
                    <p className="text-white/80 text-[10px] font-medium leading-none truncate">{job.role}</p>
                    <p className="text-white/35 text-[9px] mt-0.5">{job.count}</p>
                  </div>
                </div>
                <span
                  className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${
                    job.status === 'Active'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-brand-gold-500/20 text-brand-gold-300'
                  }`}
                >
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom compliance strip — inside frame, no overlap */}
        <div className="flex items-center gap-3 bg-white/[0.06] rounded-xl px-3.5 py-2.5 border border-white/[0.08]">
          <span className="text-white/50 text-[9px] font-semibold uppercase tracking-wide shrink-0">
            Compliance
          </span>
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-gold-400 to-brand-gold-300"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.2, delay: 1.4, ease: 'easeOut' }}
            />
          </div>
          <span className="text-brand-gold-300 text-[10px] font-bold shrink-0">100%</span>
        </div>
      </div>
    </motion.div>

    {/* ── Floating card: New Placement notification ──
        Anchored to the BOTTOM-LEFT corner of the wrapper,
        sitting below the frame — no content overlap.        ── */}
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="absolute -bottom-2 -left-4 z-10"
    >
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-white shadow-medium border border-neutral-100">
        <div className="w-7 h-7 rounded-lg bg-brand-purple-600 flex items-center justify-center shrink-0">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <circle cx="6" cy="3.5" r="2" stroke="white" strokeWidth="1.3" />
            <path d="M1 10c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-neutral-800 leading-none">New Placement</p>
          <p className="text-[9px] text-neutral-500 mt-0.5">Just now · Mumbai</p>
        </div>
      </div>
    </motion.div>

    {/* ── ISO badge ──
        Top-right, outside the frame edge — clear of dashboard header. ── */}
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 1.15 }}
      className="absolute -top-3 -right-2 z-10"
    >
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-soft border border-neutral-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
        <span className="text-[10px] font-semibold text-neutral-700">ISO Certified</span>
      </div>
    </motion.div>
  </div>
);

export default HeroVisual;
