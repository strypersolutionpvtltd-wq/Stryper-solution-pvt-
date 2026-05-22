import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProcessCard from './ProcessCard';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';

/* ── Icons defined BEFORE data array ── */
function AnalysisIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="4" y="3" width="18" height="20" rx="2" stroke="white" strokeWidth="1.6" />
      <path d="M8 9h10M8 13h10M8 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="19" cy="19" r="4" fill="rgba(255,255,255,0.15)" stroke="white" strokeWidth="1.4" />
      <path d="M21.5 21.5l2 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
function PlanningIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="20" height="18" rx="2" stroke="white" strokeWidth="1.6" />
      <path d="M3 9h20" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 3v3M18 3v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 14l3 3 7-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DeployIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="10" cy="8" r="3.5" stroke="white" strokeWidth="1.5" />
      <circle cx="18" cy="9" r="2.5" stroke="white" strokeWidth="1.4" />
      <path d="M3 22c0-4.42 3.13-8 7-8s7 3.58 7 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18 14c2.76 0 5 2.24 5 5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19 5l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="20" height="14" rx="2" stroke="white" strokeWidth="1.6" />
      <path d="M9 22h8M13 18v4" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 14l3.5-4 3 3 3.5-5 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STEPS = [
  { step: 1, title: 'Requirement Analysis', description: 'We conduct a thorough discovery session to understand your workforce needs, timelines, compliance requirements, and operational environment.', icon: <AnalysisIcon /> },
  { step: 2, title: 'Workforce Planning', description: 'Our team designs a tailored staffing plan - sourcing strategy, skill mapping, and deployment schedule - aligned to your business objectives.', icon: <PlanningIcon /> },
  { step: 3, title: 'Deployment & Execution', description: 'Vetted, trained workers are deployed on schedule. We handle onboarding, documentation, and day-one readiness so you can focus on operations.', icon: <DeployIcon /> },
  { step: 4, title: 'Performance Monitoring', description: 'Ongoing attendance tracking, performance reviews, and compliance audits ensure sustained quality and continuous workforce optimisation.', icon: <MonitorIcon /> },
];

const ProcessSection = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="process-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand-purple-50/60 blur-[120px] -translate-y-1/2" />
      <div className="absolute inset-0 opacity-[0.018]" style={{ backgroundImage: 'radial-gradient(#7c3aed 1.5px,transparent 1.5px)', backgroundSize: '28px 28px' }} />
    </div>

    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
            Our Process
          </span>
        </motion.div>
        <motion.h2 id="process-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.75rem)' }}>
          A Structured Approach To{' '}
          <span className="text-gradient-brand">Workforce Management</span>
        </motion.h2>
        <motion.div variants={fadeInUp} className="divider-brand mx-auto mb-5" />
        <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed">
          Four deliberate steps that take you from requirement to a fully operational, compliant workforce - every time.
        </motion.p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5 mb-14">
        {STEPS.map((step, i) => (
          <ProcessCard key={step.step} step={step.step} icon={step.icon} title={step.title} description={step.description} index={i} isLast={i === STEPS.length - 1} />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.55, delay: 0.3 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-purple-700 via-brand-purple-600 to-brand-purple-700 px-8 py-10 lg:px-14 lg:py-12">
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-brand-gold-500/15 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <p className="text-white/60 text-sm font-medium mb-1 uppercase tracking-wide">Ready to get started?</p>
            <h3 className="font-display font-bold text-white text-2xl lg:text-3xl leading-tight">Let&apos;s Build Your Workforce Solution</h3>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-brand-gold-500 text-white text-sm font-semibold shadow-gold hover:bg-brand-gold-600 transition-all duration-250">
                Start the Process
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/services" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-white text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all duration-250">
                View Services
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProcessSection;
