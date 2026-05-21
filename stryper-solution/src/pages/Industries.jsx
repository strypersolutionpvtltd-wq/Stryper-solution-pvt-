import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import img3 from "@/assets/image/1.jpeg";
import img5 from "@/assets/image/5.jpeg";
import img6 from "@/assets/image/6.jpeg";
import IndustryCard from "@/components/industries/IndustryCard";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from "@/utils/animations";

const PURPLE = "#8B3A8F";
const GOLD   = "#F5A623";

/* ── Icons ── */
function MfgIcon()   { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="12" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="8.5" y="7" width="5" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="15" y="3" width="5" height="17" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 20h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function WareIcon()  { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M1 8.5L11 3l10 5.5V20H1V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="7" y="13" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function LogIcon()   { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="1" y="8" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 11h4l3 3.5V17h-7V11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="5" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="17" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>); }
function CorpIcon()  { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="3" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="5.5" r="1" fill="currentColor"/><circle cx="11" cy="5.5" r="1" fill="currentColor"/><rect x="6" y="12" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="12" y="12" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>); }
function PlantIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 20V10l4-3v3l4-3v3l4-3v13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 20V8l6-4v16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 20h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="15" y="12" width="3" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>); }
function CommIcon()  { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 20V7l8-5 8 5v13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="8" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="5" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="14" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 20h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function CheckIcon() { return (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }

/* ── Overview cards ── */
const OVERVIEW = [
  { id:"manufacturing",  title:"Manufacturing",          description:"Skilled operators, technicians, and line workers for production floors, assembly lines, and quality control.", accentColor:"purple", icon:<MfgIcon />   },
  { id:"warehousing",    title:"Warehousing",            description:"Trained warehouse associates, supervisors, and inventory specialists for high-throughput storage operations.", accentColor:"gold",   icon:<WareIcon />  },
  { id:"logistics",      title:"Logistics & Supply Chain",description:"Drivers, dispatchers, and supply chain coordinators keeping your freight and last-mile delivery on schedule.", accentColor:"purple", icon:<LogIcon />   },
  { id:"corporate",      title:"Corporate Offices",      description:"Administrative, front-desk, IT support, and back-office professionals for modern corporate environments.",       accentColor:"gold",   icon:<CorpIcon />  },
  { id:"industrial",     title:"Industrial Plants",      description:"Plant operators, safety officers, and maintenance crews for heavy industrial and process plant environments.",   accentColor:"purple", icon:<PlantIcon /> },
  { id:"commercial",     title:"Commercial Facilities",  description:"Housekeeping, security, and facility management staff for malls, hospitals, hotels, and commercial complexes.", accentColor:"gold",   icon:<CommIcon />  },
];

/* ── Detailed sections ── */
const DETAILS = [
  { id:"manufacturing",  eyebrow:"Manufacturing",          title:"Production-Ready Industrial Workforce",          description:"We supply trained, vetted workers for every layer of manufacturing operations - from shop floor to quality control. Our workforce is briefed on safety protocols, production SOPs, and shift-based scheduling.", features:["Production Workforce","Machine Operators","Skilled Technicians","Quality Inspection Teams","Shift-Based Staffing"],           stat1:{val:"300+",lbl:"Workers Deployed"}, stat2:{val:"15+",lbl:"Manufacturing Clients"}, accent:PURPLE, flip:false },
  { id:"warehousing",    eyebrow:"Warehousing",            title:"Efficient Warehouse Operations Workforce",       description:"From inventory handling to dispatch support, we provide trained warehouse staff who understand modern WMS systems, safety standards, and high-throughput operational demands.", features:["Inventory Handling","Pick & Pack Operations","Warehouse Associates","Dispatch Support","Material Management"],                    stat1:{val:"150+",lbl:"Warehouse Staff"},   stat2:{val:"99%",lbl:"On-Time Deployment"}, accent:GOLD,   flip:true  },
  { id:"logistics",      eyebrow:"Logistics & Supply Chain",title:"End-to-End Logistics Workforce Support",       description:"We staff logistics operations across the full supply chain - from loading docks to distribution hubs. Our workers are trained in safety, documentation, and operational efficiency.", features:["Logistics Workforce","Loading & Unloading Teams","Distribution Support","Transportation Coordination","Supply Chain Operations"], stat1:{val:"200+",lbl:"Logistics Workers"},  stat2:{val:"48hr",lbl:"Avg. Deployment"},   accent:PURPLE, flip:false },
  { id:"corporate",      eyebrow:"Corporate Offices",      title:"Professional Corporate Support Workforce",      description:"We provide trained office support professionals for corporate environments - from front desk executives to back-office data entry operators - ensuring smooth day-to-day operations.", features:["Office Support Staff","Front Desk Executives","Data Entry Operators","Administrative Workforce","Back Office Support"],          stat1:{val:"100+",lbl:"Corporate Clients"}, stat2:{val:"24hr",lbl:"Response Time"},     accent:GOLD,   flip:true  },
  { id:"industrial",     eyebrow:"Industrial Plants",      title:"Specialized Industrial Plant Workforce",        description:"Heavy industrial environments demand specialized, safety-conscious workers. We deploy plant operators, maintenance staff, and technical workforce trained for high-risk, high-output plant operations.", features:["Plant Operations Support","Maintenance Staff","Technical Workforce","Safety Compliance Teams","Production Support"],          stat1:{val:"80+",lbl:"Plant Clients"},      stat2:{val:"100%",lbl:"Safety Compliance"}, accent:PURPLE, flip:false },
  { id:"commercial",     eyebrow:"Commercial Facilities",  title:"Complete Commercial Facility Management Staff", description:"We manage the full spectrum of commercial facility staffing - from daily housekeeping to technical maintenance - across malls, hospitals, hotels, and large commercial complexes.", features:["Housekeeping Teams","Facility Supervisors","Electrical & Plumbing Support","Cleaning Operations","Maintenance Services"],          stat1:{val:"60+",lbl:"Facility Sites"},     stat2:{val:"100%",lbl:"SLA Compliance"},    accent:GOLD,   flip:true  },
];

const CAPABILITIES = [
  { title:"Skilled Workforce Deployment",    desc:"Vetted, trained workers placed across all skill levels within 48-72 hours.",          accent:"purple" },
  { title:"Fast Operational Support",        desc:"Rapid response to urgent workforce requirements without compromising quality.",         accent:"gold"   },
  { title:"Compliance Management",           desc:"Full PF, ESI, labour law compliance managed end-to-end on every engagement.",          accent:"purple" },
  { title:"Pan-India Service Coverage",      desc:"Operations across major industrial, logistics, and commercial hubs nationwide.",        accent:"gold"   },
  { title:"Flexible Staffing Solutions",     desc:"Scale your workforce up or down based on seasonal or project-based demands.",          accent:"purple" },
  { title:"Dedicated Client Coordination",   desc:"A named account manager for every client ensuring seamless communication.",            accent:"gold"   },
];

const BENEFITS = [
  { title:"Increased Operational Efficiency", desc:"Trained, ready-to-deploy workers reduce onboarding time and boost productivity from day one." },
  { title:"Reduced Hiring Burden",            desc:"We handle sourcing, screening, documentation, and onboarding - you focus on operations." },
  { title:"Flexible Workforce Scaling",       desc:"Adjust headcount based on demand without long-term commitments or overhead costs." },
  { title:"Faster Deployment",                desc:"Our ready talent pool ensures deployment within 48-72 hours of requirement confirmation." },
  { title:"Compliance-Focused Operations",    desc:"Every engagement is fully compliant with PF, ESI, and applicable labour regulations." },
  { title:"Cost-Effective Manpower Support",  desc:"Optimised staffing models reduce per-head costs while maintaining service quality." },
];

/* ── Main page ── */
const IndustriesOverview = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="ind-overview-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-[0.05] -translate-y-1/3 translate-x-1/4"
           style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
      <div className="absolute bottom-0 left-0 w-[380px] h-[380px] rounded-full opacity-[0.04] translate-y-1/3 -translate-x-1/4"
           style={{ background: `radial-gradient(circle, ${GOLD}, transparent)` }} />
    </div>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-2xl mx-auto mb-14">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase"
                style={{ background: '#faf5fb', borderColor: '#e4d0e9', color: PURPLE }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />
            Industries We Serve
          </span>
        </motion.div>
        <motion.h2 id="ind-overview-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.75rem)' }}>
          Sectors We <span style={{ color: PURPLE }}>Specialise In</span>
        </motion.h2>
        <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto mb-5" style={{ background: `linear-gradient(90deg, ${PURPLE}, ${GOLD})` }} />
        <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed">
          Six core industry verticals where we deliver consistent, compliant, and scalable workforce solutions.
        </motion.p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
        {OVERVIEW.map((ind, i) => (
          <IndustryCard key={ind.id} icon={ind.icon} title={ind.title} description={ind.description}
            href={`#${ind.id}`} index={i} accentColor={ind.accentColor} />
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 2: Detailed Industry Sections ── */
const DetailedIndustries = () => (
  <section className="relative overflow-hidden section-padding" aria-label="Detailed industries"
           style={{ background: 'linear-gradient(180deg,#fafafa 0%,#f5f0fb 50%,#fafafa 100%)' }}>
    <div className="container-base relative z-10 space-y-20 lg:space-y-28">
      {DETAILS.map((ind) => <IndustryDetailRow key={ind.id} ind={ind} />)}
    </div>
  </section>
);

const IndustryDetailRow = ({ ind }) => (
  <div id={ind.id} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center scroll-mt-24">
    {/* Copy */}
    <motion.div variants={ind.flip ? fadeInRight : fadeInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}
      className={`flex flex-col ${ind.flip ? 'lg:order-2' : ''}`}>
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase mb-6 w-fit"
            style={{ background: ind.accent === PURPLE ? '#faf5fb' : '#fffbf0', borderColor: ind.accent + '33', color: ind.accent }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: ind.accent }} />{ind.eyebrow}
      </span>
      <h2 className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5"
          style={{ fontSize: 'clamp(1.7rem,2.8vw,2.4rem)' }}>{ind.title}</h2>
      <p className="text-neutral-500 text-[1.02rem] leading-relaxed mb-7">{ind.description}</p>
      <ul className="space-y-2.5 mb-8" role="list">
        {ind.features.map((f) => (
          <li key={f} className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: ind.accent + '18', color: ind.accent }}>
              <CheckIcon />
            </span>
            <span className="text-sm text-neutral-700 font-medium">{f}</span>
          </li>
        ))}
      </ul>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-fit">
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
              style={{ background: ind.accent }}>
          Get Workforce for This Industry
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </motion.div>
    </motion.div>

    {/* Visual panel */}
    <motion.div variants={ind.flip ? fadeInLeft : fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}
      className={ind.flip ? 'lg:order-1' : ''}>
      <div className="relative w-full aspect-[4/3.6] max-w-[480px] mx-auto">
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-medium">
          <img src={ind.flip ? img6 : img5} alt={ind.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(145deg, rgba(30,10,50,0.78) 0%, rgba(60,20,80,0.6) 100%)" }} aria-hidden="true" />
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '28px 28px' }} aria-hidden="true" />
          <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: ind.accent + 'aa' }}>Industry Overview</p>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold"
                    style={{ background: ind.accent + '18', color: ind.accent }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ind.accent }} />Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[ind.stat1, ind.stat2].map((s) => (
                <div key={s.lbl} className="rounded-2xl px-4 py-3.5 text-center border"
                     style={{ background: 'white', borderColor: ind.accent + '20' }}>
                  <p className="text-2xl font-bold font-display leading-none mb-1" style={{ color: ind.accent }}>{s.val}</p>
                  <p className="text-[10px] text-neutral-500 font-medium">{s.lbl}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 rounded-2xl px-4 py-4 border" style={{ background: 'white', borderColor: ind.accent + '15' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: ind.accent + 'aa' }}>Workforce Roles</p>
              <div className="space-y-2">
                {ind.features.slice(0, 4).map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ind.accent }} />
                    <span className="text-[11px] text-neutral-600 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce} transition={{ duration: 0.45, delay: 0.5 }}
          className="absolute -bottom-4 -right-4 z-10">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-medium border border-neutral-100">
            <span className="w-2 h-2 rounded-full" style={{ background: ind.accent }} aria-hidden="true" />
            <span className="text-[11px] font-semibold text-neutral-700">Pan-India Coverage</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

/* ── Section 3: Workforce Capabilities ── */
const WorkforceCapabilities = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="cap-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.05]"
           style={{ background: `radial-gradient(circle, ${PURPLE}, transparent)` }} />
    </div>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-14">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase"
                style={{ background: '#faf5fb', borderColor: '#e4d0e9', color: PURPLE }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />
            Our Capabilities
          </span>
        </motion.div>
        <motion.h2 id="cap-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4"
                   style={{ fontSize: 'clamp(1.9rem,3.2vw,2.75rem)' }}>
          Workforce <span style={{ color: PURPLE }}>Capabilities</span> That Drive Results
        </motion.h2>
        <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto mb-5" style={{ background: `linear-gradient(90deg, ${PURPLE}, ${GOLD})` }} />
        <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed">
          Six core capabilities that make Stryper Solution the preferred workforce partner across industries.
        </motion.p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CAPABILITIES.map((c, i) => (
          <motion.div key={c.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}
            transition={{ duration: 0.45, delay: i * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.18 } }}
            className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                 style={{ background: 'linear-gradient(145deg,rgba(139,58,143,0.04) 0%,rgba(245,166,35,0.03) 100%)' }} aria-hidden="true" />
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                 style={{ background: c.accent === 'purple' ? PURPLE : GOLD }} aria-hidden="true" />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                 style={{ background: c.accent === 'purple' ? '#faf5fb' : '#fffbf0', color: c.accent === 'purple' ? PURPLE : GOLD }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 2l7 3v4c0 3.5-2.5 6-7 7-4.5-1-7-3.5-7-7V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="font-display font-semibold text-neutral-900 text-base mb-2">{c.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 4: Industry Benefits ── */
const IndustryBenefits = () => (
  <section className="relative overflow-hidden section-padding" aria-labelledby="benefits-heading"
           style={{ background: 'linear-gradient(180deg,#fafafa 0%,#f5f0fb 55%,#fafafa 100%)' }}>
    <div className="container-base relative z-10">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left: copy */}
        <motion.div variants={staggerContainer(0.1, 0.05)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col">
          <motion.div variants={fadeInUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase"
                  style={{ background: '#faf5fb', borderColor: '#e4d0e9', color: PURPLE }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />
              Why Partner With Us
            </span>
          </motion.div>
          <motion.h2 id="benefits-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5"
                     style={{ fontSize: 'clamp(1.8rem,3vw,2.5rem)' }}>
            Business Benefits That <span style={{ color: PURPLE }}>Drive Growth</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed mb-8">
            Partnering with Stryper Solution gives your business a competitive edge through reliable, compliant, and scalable workforce support.
          </motion.p>
          <motion.ul variants={staggerContainer(0.08, 0.1)} className="space-y-4" role="list">
            {BENEFITS.map((b) => (
              <motion.li key={b.title} variants={fadeInUp} className="flex items-start gap-4 group">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: PURPLE + '15', color: PURPLE }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-800 mb-0.5">{b.title}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">{b.desc}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
          <motion.div variants={fadeInUp} className="mt-10">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-fit">
              <Link to="/contact" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
                    style={{ background: PURPLE }}>
                Discuss Your Requirements
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right: stats panel */}
        <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <div className="relative w-full aspect-[4/4.2] max-w-[480px] mx-auto lg:ml-auto">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-strong"
                 style={{ background: 'linear-gradient(145deg, #1e1b4b 0%, #3d1940 50%, #662a6b 100%)' }}>
              <div className="absolute inset-0 opacity-[0.06]"
                   style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)', backgroundSize: '32px 32px' }} aria-hidden="true" />
              <div className="absolute top-0 right-0 w-56 h-56 rounded-full blur-3xl opacity-20" style={{ background: GOLD }} aria-hidden="true" />
              <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Industry Impact</p>
                <div className="grid grid-cols-2 gap-3">
                  {[{val:'6+',lbl:'Industries',c:'text-white'},{val:'500+',lbl:'Workers',c:'text-white'},{val:'50+',lbl:'Clients',c:'text-[#F5A623]'},{val:'98%',lbl:'Satisfaction',c:'text-emerald-300'}].map((s) => (
                    <div key={s.lbl} className="bg-white/10 rounded-2xl px-4 py-3.5 text-center border border-white/10">
                      <p className={`text-2xl font-bold font-display leading-none mb-1 ${s.c}`}>{s.val}</p>
                      <p className="text-white/50 text-[10px] font-medium">{s.lbl}</p>
                    </div>
                  ))}
                </div>
                {[{lbl:'Deployment Speed',pct:95,c:'from-[#8B3A8F] to-[#b280c0]'},{lbl:'Client Retention',pct:92,c:'from-[#F5A623] to-[#fbbf24]'},{lbl:'Compliance Rate',pct:100,c:'from-emerald-500 to-emerald-400'}].map((b) => (
                  <div key={b.lbl} className="bg-white/10 rounded-2xl px-4 py-3 border border-white/10">
                    <div className="flex justify-between mb-2">
                      <span className="text-white/65 text-[10px] font-semibold">{b.lbl}</span>
                      <span className="text-white/65 text-[10px] font-bold">{b.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div className={`h-full rounded-full bg-gradient-to-r ${b.c}`}
                        initial={{ width: 0 }} whileInView={{ width: `${b.pct}%` }} viewport={viewportOnce}
                        transition={{ duration: 1.1, delay: 0.3, ease: 'easeOut' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.85, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.45, delay: 0.6 }}
              className="absolute -bottom-4 -left-4 z-10">
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-strong border border-neutral-100">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: GOLD + '20', color: GOLD }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L7 8.1l-2.78 1.45.53-3.1L2.5 4.25l3.1-.45L7 1z" fill="currentColor"/></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900 leading-none">Trusted Partner</p>
                  <p className="text-[10px] text-neutral-500 mt-0.5">Since 2014</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ── Section 5: CTA ── */
const IndustriesCTA = () => (
  <section className="relative overflow-hidden py-20 lg:py-28" aria-labelledby="ind-cta-heading"
           style={{ background: 'linear-gradient(135deg, #3d1940 0%, #662a6b 45%, #8B3A8F 100%)' }}>
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl opacity-20" style={{ background: GOLD }} />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full blur-3xl opacity-15" style={{ background: PURPLE }} />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
    <div className="container-sm relative z-10 text-center">
      <motion.div variants={staggerContainer(0.12)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
                style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            Get Started Today
          </span>
        </motion.div>
        <motion.h2 id="ind-cta-heading" variants={fadeInUp} className="font-display font-bold text-white leading-[1.08] tracking-tight mb-5 text-balance"
                   style={{ fontSize: 'clamp(2rem,4vw,3.2rem)' }}>
          Need Industry-Specific{' '}
          <span style={{ background: `linear-gradient(90deg,${GOLD},#fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Workforce Solutions?
          </span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Tell us your industry and workforce requirements - we&apos;ll deliver a tailored staffing solution within 24 hours.
        </motion.p>
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold transition-colors duration-200"
                  style={{ background: GOLD, boxShadow: '0 4px 20px rgba(245,166,35,0.4)' }}>
              Get Consultation
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold border transition-colors duration-200"
                  style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}>
              Contact Team
            </Link>
          </motion.div>
        </motion.div>
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 mt-8">
          {['No commitment required','Response within 24 hours','Free initial consultation'].map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <span className="font-bold text-base leading-none" style={{ color: GOLD }}>✓</span>{t}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Industries = () => (
  <>
    <PageHero
      title="Customized Workforce Solutions Across Multiple Industries"
      subtitle="Stryper Solution Pvt. Ltd. delivers scalable manpower and operational support services tailored for industrial, logistics, commercial, and corporate business sectors."
      breadcrumb="Industries"
      image={img3}
    />
    <IndustriesOverview />
    <DetailedIndustries />
    <WorkforceCapabilities />
    <IndustryBenefits />
    <IndustriesCTA />
  </>
);

export default Industries;