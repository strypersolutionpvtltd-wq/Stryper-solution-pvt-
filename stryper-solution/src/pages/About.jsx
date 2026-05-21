import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import img1 from '@/assets/image/1.jpeg';
import chairmanImg from '@/assets/image/chariman.jpg';
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from '@/utils/animations';

/* ── Value icons ── */
function IntegrityIcon() { return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ReliabilityIcon() { return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function CommitmentIcon() { return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3a7 7 0 100 14A7 7 0 0010 3z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function ExcellenceIcon() { return (<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l2 4 4.5.7-3.25 3.15.77 4.5L10 12.2l-4.02 2.15.77-4.5L3.5 6.7 8 6 10 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>); }

const VALUES = [
  { icon: <IntegrityIcon />,   title: 'Integrity',   desc: 'Honest, transparent dealings with every client, worker, and partner — always.' },
  { icon: <ReliabilityIcon />, title: 'Reliability',  desc: 'Consistent delivery, on-time deployment, and dependable workforce support.' },
  { icon: <CommitmentIcon />,  title: 'Commitment',   desc: 'Dedicated to long-term client success, not just short-term placements.' },
  { icon: <ExcellenceIcon />,  title: 'Excellence',   desc: 'Continuous improvement in service quality, compliance, and workforce standards.' },
];

const MISSION_POINTS = [
  'Deliver high-quality workforce solutions',
  'Build long-term client relationships',
  'Maintain operational excellence',
  'Ensure compliance and workforce safety',
  'Provide scalable staffing support',
];

const About = () => (
  <>
    <PageHero
      title="About Stryper Solution"
      subtitle="Where Talent Meets Opportunity and Businesses Grow."
      breadcrumb="About"
      image={img1}
    />

    {/* ── Who We Are ── */}
    <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="who-heading">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-brand-purple-50/60 blur-[120px] -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full bg-brand-gold-50/50 blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </div>
      <div className="container-base relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Left copy */}
          <motion.div variants={staggerContainer(0.1, 0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col">
            <motion.div variants={fadeInUp} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
                Who We Are
              </span>
            </motion.div>
            <motion.h2 id="who-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.75rem)' }}>
              A Professionally Managed{' '}
              <span className="text-brand-purple-600">Workforce Solutions</span>{' '}Company
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed mb-5">
              Stryper Solution Pvt. Ltd. is a professionally managed workforce and operational solutions company dedicated to helping businesses achieve efficiency, productivity, and sustainable growth through reliable manpower support services.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed mb-5">
              We specialize in industrial manpower, warehouse staffing, facility management, payroll support, and workforce operations tailored to modern business environments.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed mb-8">
              Our company focuses on delivering structured staffing solutions and operational excellence that help organizations streamline workforce management while maintaining compliance, safety, and productivity standards. With a client-centric approach and commitment to service quality, Stryper Solution Pvt. Ltd. continues to build long-term partnerships across multiple industries.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link to="/contact" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold shadow-purple hover:bg-brand-purple-700 transition-all duration-250">
                Partner With Us
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </motion.div>
          </motion.div>
          {/* Right visual */}
          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <AboutDashboard />
          </motion.div>
        </div>
      </div>
    </section>

    {/* ── Vision & Mission ── */}
    <VisionMission />

    {/* ── Core Values ── */}
    <CoreValues />

    {/* ── Leadership Message ── */}
    <LeadershipMessage />
  </>
);

/* ── About page dashboard visual ── */
const AboutDashboard = () => (
  <div className="relative w-full aspect-[4/4.5] max-w-[500px] mx-auto lg:ml-auto">
    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-strong" style={{ background: 'linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)' }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '28px 28px' }} aria-hidden="true" />
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-brand-gold-500/15 blur-3xl" aria-hidden="true" />
      <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between">
          <p className="text-white/60 text-[10px] uppercase tracking-widest font-medium">Company Overview</p>
          <span className="text-brand-gold-300 text-[10px] font-bold">Est. 2014</span>
        </div>
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {[{ val: '500+', lbl: 'Active Workers', c: 'text-white' }, { val: '50+', lbl: 'Clients', c: 'text-brand-gold-300' }, { val: '10+', lbl: 'Industries', c: 'text-emerald-300' }, { val: '98%', lbl: 'Satisfaction', c: 'text-brand-purple-300' }].map((s) => (
            <div key={s.lbl} className="bg-white/8 rounded-2xl px-3 py-3 border border-white/10 text-center">
              <p className={`text-xl font-bold font-display ${s.c} leading-none`}>{s.val}</p>
              <p className="text-white/45 text-[10px] mt-1">{s.lbl}</p>
            </div>
          ))}
        </div>
        {/* Service bars */}
        <div className="bg-white/8 rounded-2xl px-4 py-3.5 border border-white/10 flex-1">
          <p className="text-white/60 text-[10px] uppercase tracking-widest mb-3">Service Coverage</p>
          <div className="space-y-2.5">
            {[{ lbl: 'Industrial Manpower', pct: 92 }, { lbl: 'Warehouse Staffing', pct: 85 }, { lbl: 'Facility Management', pct: 78 }, { lbl: 'Payroll & Compliance', pct: 95 }].map((b, i) => (
              <div key={b.lbl}>
                <div className="flex justify-between mb-1">
                  <span className="text-white/65 text-[10px]">{b.lbl}</span>
                  <span className="text-white/65 text-[10px] font-semibold">{b.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: i % 2 === 0 ? 'linear-gradient(90deg,#7c3aed,#a78bfa)' : 'linear-gradient(90deg,#d97706,#fbbf24)' }} initial={{ width: 0 }} whileInView={{ width: `${b.pct}%` }} viewport={viewportOnce} transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: 'easeOut' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    {/* Floating badge */}
    <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.5, delay: 0.6 }} className="absolute -bottom-5 -left-5 z-10">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white shadow-strong border border-neutral-100">
        <div className="w-10 h-10 rounded-xl bg-brand-gold-500 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2l1.8 3.6 4 .6-2.9 2.8.7 4L9 11l-3.6 1.9.7-4L3.2 6.2l4-.6L9 2z" fill="white"/></svg>
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

/* ── Vision & Mission section ── */
const VisionMission = () => (
  <section className="relative overflow-hidden section-padding" style={{ background: 'linear-gradient(180deg,#fafafa 0%,#f5f3ff 55%,#fafafa 100%)' }} aria-labelledby="vision-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-brand-purple-100/25 blur-[130px]" />
    </div>
    <div className="container-base relative z-10">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Vision */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.55 }} className="relative bg-white rounded-3xl p-8 border border-neutral-100 shadow-soft overflow-hidden group hover:shadow-medium transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple-500 to-brand-gold-400 rounded-t-3xl" aria-hidden="true" />
          <div className="w-12 h-12 rounded-2xl bg-brand-purple-50 flex items-center justify-center text-brand-purple-600 mb-5">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.6"/><path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.93 4.93l1.41 1.41M15.66 15.66l1.41 1.41M4.93 17.07l1.41-1.41M15.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h3 id="vision-heading" className="font-display font-bold text-neutral-900 text-xl mb-3">Our Vision</h3>
          <p className="text-neutral-500 leading-relaxed text-[1.02rem]">
            To become a trusted and leading workforce solutions provider delivering reliable manpower and operational support services across industries.
          </p>
        </motion.div>

        {/* Mission */}
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.55, delay: 0.1 }} className="relative bg-white rounded-3xl p-8 border border-neutral-100 shadow-soft overflow-hidden group hover:shadow-medium transition-shadow duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-gold-400 to-brand-purple-500 rounded-t-3xl" aria-hidden="true" />
          <div className="w-12 h-12 rounded-2xl bg-brand-gold-50 flex items-center justify-center text-brand-gold-600 mb-5">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M11 2l2.5 5 5.5.8-4 3.9 1 5.5L11 14.5l-5 2.7 1-5.5L3 7.8l5.5-.8L11 2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
          </div>
          <h3 className="font-display font-bold text-neutral-900 text-xl mb-4">Our Mission</h3>
          <ul className="space-y-2.5" role="list">
            {MISSION_POINTS.map((pt) => (
              <li key={pt} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 5l2 2 4-4" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
                <span className="text-neutral-600 text-sm leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ── Core Values ── */
const CoreValues = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="values-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute -top-16 -right-16 w-[380px] h-[380px] rounded-full bg-brand-purple-50/70 blur-[100px]" />
      <div className="absolute -bottom-16 -left-16 w-[320px] h-[320px] rounded-full bg-brand-gold-50/60 blur-[90px]" />
    </div>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-12">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
            Core Values
          </span>
        </motion.div>
        <motion.h2 id="values-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.75rem)' }}>
          The Principles That <span className="text-gradient-brand">Drive Us</span>
        </motion.h2>
        <motion.div variants={fadeInUp} className="divider-brand mx-auto" />
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {VALUES.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.48, delay: i * 0.1 }} whileHover={{ y: -5, transition: { duration: 0.2 } }} className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-medium hover:border-brand-purple-100 transition-all duration-300 overflow-hidden text-center">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(145deg,rgba(124,58,237,0.04) 0%,rgba(217,119,6,0.03) 100%)' }} aria-hidden="true" />
            <div className="absolute bottom-0 left-4 right-4 h-[2px] rounded-t-full bg-gradient-to-r from-brand-purple-500 to-brand-gold-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" aria-hidden="true" />
            <div className="w-12 h-12 rounded-2xl bg-brand-purple-50 text-brand-purple-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple-100 transition-colors duration-200">
              {v.icon}
            </div>
            <h3 className="font-display font-semibold text-neutral-900 text-base mb-2">{v.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Leadership Message ── */
const LeadershipMessage = () => (
  <section className="relative overflow-hidden section-padding" style={{ background: 'linear-gradient(145deg,#1e1b4b 0%,#312e81 50%,#4c1d95 100%)' }} aria-labelledby="leadership-heading">
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-brand-gold-500/12 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full bg-brand-purple-400/15 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
    <div className="container-sm relative z-10 text-center">
      <motion.div variants={staggerContainer(0.12)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold-400" aria-hidden="true" />
            Leadership Message
          </span>
        </motion.div>

        {/* Quote mark */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-6" aria-hidden="true">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center">
            <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
              <path d="M0 20V11.2C0 4.98 3.52 1.28 10.56 0l1.44 1.92C8.64 2.88 6.56 4.8 6.08 7.68H9.6V20H0zm13.44 0V11.2C13.44 4.98 16.96 1.28 24 0l1.44 1.92c-3.36.96-5.44 2.88-5.92 5.76H23.04V20H13.44z" fill="rgba(251,191,36,0.6)"/>
            </svg>
          </div>
        </motion.div>

        <motion.blockquote variants={fadeInUp}>
          <p id="leadership-heading" className="font-display font-medium text-white leading-relaxed text-balance mb-8" style={{ fontSize: 'clamp(1.15rem,2.2vw,1.45rem)' }}>
            &quot;At Stryper Solution Pvt. Ltd., we believe that workforce strength is the foundation of every successful business. Our mission is to provide dependable staffing and operational support solutions that help organizations focus on growth while we manage workforce efficiency.&quot;
          </p>
        </motion.blockquote>

        <motion.div variants={fadeInUp} className="flex flex-col items-center gap-1">
          <div className="relative mb-2">
            <img
              src={chairmanImg}
              alt="Kartikey Niranjan — Chairman"
              className="w-20 h-20 rounded-full object-cover border-3 border-brand-gold-400 shadow-gold"
              style={{ border: '3px solid #F5A623' }}
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand-gold-500 flex items-center justify-center shadow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M6 1l1.2 2.4 2.7.4-1.95 1.9.46 2.7L6 7.2 3.59 8.46l.46-2.7L2.1 3.8l2.7-.4L6 1z" fill="white"/>
              </svg>
            </span>
          </div>
          <p className="text-white font-bold text-base">Kartikey Niranjan</p>
          <p className="text-brand-gold-400 text-sm font-medium">Chairman, Stryper Solution Pvt. Ltd.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {['HR Management', 'Business Operations', 'Workforce Management', 'Strategic Planning'].map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs">
                {tag}
              </span>
            ))}
          </div>
          <a
            href="https://linkedin.com/in/kartikey-niranjan-493115188"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="14" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.4"/><path d="M4 6.5v5M4 4.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7.5 11.5V9c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M7.5 6.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            linkedin.com/in/kartikey-niranjan-493115188
          </a>
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10">
          <Link to="/contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-brand-gold-500 text-white text-sm font-semibold shadow-gold hover:bg-brand-gold-600 transition-all duration-250">
            Get In Touch
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default About;
