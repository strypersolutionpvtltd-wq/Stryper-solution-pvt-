import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fadeInRight, staggerContainer, fadeInUp, viewportOnce } from '@/utils/animations';
import img6 from '@/assets/image/6.jpeg';

/* ── Icons FIRST ── */
const WorkforceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="9" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 16c0-3.87 3.13-7 7-7s7 3.13 7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const ComplianceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 7h6M6 10h4M6 13h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
const IndustryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 16V9l4-3 4 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 16V7l6-3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 16h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const ScaleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M3 13l4-4 3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 7h3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Data AFTER icons ── */
const FEATURES = [
  { icon: <WorkforceIcon />, title: 'Skilled Workforce Deployment', desc: 'Rapid placement of vetted, trained professionals across industrial and corporate roles.' },
  { icon: <ComplianceIcon />, title: 'Compliance Driven Operations', desc: 'Full statutory compliance - PF, ESI, labour law - managed end-to-end.' },
  { icon: <IndustryIcon />, title: 'Industry-Focused Solutions', desc: 'Tailored staffing models built around the specific demands of your sector.' },
  { icon: <ScaleIcon />, title: 'Scalable Business Support', desc: 'Flex your workforce up or down without operational friction.' },
];

const AboutPreview = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="about-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-purple-50/70 blur-[120px] -translate-y-1/3 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-brand-gold-50/60 blur-[100px] translate-y-1/3 -translate-x-1/4" />
    </div>

    <div className="container-base relative z-10">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* Left copy */}
        <motion.div variants={staggerContainer(0.1, 0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col">
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
              About Stryper Solution
            </span>
          </motion.div>

          <motion.h2 id="about-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5" style={{ fontSize: 'clamp(1.9rem, 3.2vw, 2.75rem)' }}>
            Building Reliable Workforce Solutions{' '}
            <span className="relative inline-block">
              <span className="text-brand-purple-600">For Modern</span>
              <motion.span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full bg-gradient-to-r from-brand-purple-500 to-brand-gold-400" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={viewportOnce} transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }} style={{ transformOrigin: 'left' }} />
            </span>{' '}Industries
          </motion.h2>

          <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed mb-9 max-w-[500px]">
            We provide professional manpower, staffing, logistics, and operational support services designed to help businesses scale efficiently with trusted workforce solutions.
          </motion.p>

          <motion.ul variants={staggerContainer(0.09, 0.2)} className="space-y-4 mb-10" role="list">
            {FEATURES.map((f) => (
              <motion.li key={f.title} variants={fadeInUp} className="flex items-start gap-4 group">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-purple-50 flex items-center justify-center text-brand-purple-600 group-hover:bg-brand-purple-100 transition-colors duration-200 mt-0.5">
                  {f.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800 mb-0.5">{f.title}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeInUp}>
            <motion.div className="inline-block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/about" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold shadow-purple hover:bg-brand-purple-700 transition-all duration-250">
                Learn More About Us
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right visual */}
        <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce} className="relative">
          <AboutVisual />
        </motion.div>
      </div>
    </div>
  </section>
);

const AboutVisual = () => (
  <div className="relative w-full aspect-[4/4.5] max-w-[500px] mx-auto lg:ml-auto">
    {/* Real image */}
    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-strong">
      <img
        src={img6}
        alt="Stryper Solution workforce operations"
        className="w-full h-full object-cover object-center"
      />
      {/* Subtle overlay for card readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />
    </div>
    <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.5, delay: 0.6 }} className="absolute -bottom-5 -left-5 z-10">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white shadow-strong border border-neutral-100">
        <div className="w-10 h-10 rounded-xl bg-brand-purple-600 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <circle cx="9" cy="6" r="2.5" stroke="white" strokeWidth="1.5" />
            <path d="M4 15c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M13 3l1.5 1.5M13 9l1.5-1.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-neutral-900 leading-none">Quality Engineers</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Vetted & Certified Talent</p>
        </div>
      </div>
    </motion.div>
    <motion.div initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={viewportOnce} transition={{ duration: 0.45, delay: 0.75 }} className="absolute -top-4 -right-4 z-10">
      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-purple-600 text-white shadow-purple">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400 animate-pulse" aria-hidden="true" />
        <span className="text-[11px] font-semibold">Pan-India Operations</span>
      </div>
    </motion.div>
  </div>
);

export default AboutPreview;
