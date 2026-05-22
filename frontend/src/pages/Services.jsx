import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import img2 from "@/assets/image/2.jpeg";
import img5 from "@/assets/image/5.jpeg";
import img6 from "@/assets/image/6.jpeg";
import ServiceCard from "@/components/services/ServiceCard";
import ProcessCard from "@/components/about/ProcessCard";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, viewportOnce } from "@/utils/animations";

const PURPLE = "#8B3A8F";
const GOLD   = "#F5A623";

function ManpowerIcon() { return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6"/><circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 20c0-4.42 3.13-8 7-8s7 3.58 7 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/><path d="M17 13c2.76 0 5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function LogisticsIcon() { return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="1" y="8" width="15" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.6"/><path d="M16 11h4l3 4v3h-7V11z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><circle cx="5.5" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="18.5" cy="19.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/></svg>); }
function FacilityIcon() { return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="5" y="11" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4"/><rect x="16" y="11" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.4"/></svg>); }
function PayrollIcon() { return (<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 13h4M7 16h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><path d="M15 12.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function CheckIcon() { return (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function AnalysisIcon() { return (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="4" y="3" width="18" height="20" rx="2" stroke="white" strokeWidth="1.6"/><path d="M8 9h10M8 13h10M8 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>); }
function PlanningIcon() { return (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="4" width="20" height="18" rx="2" stroke="white" strokeWidth="1.6"/><path d="M3 9h20" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 3v3M18 3v3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M8 14l3 3 7-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function DeployIcon() { return (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><circle cx="10" cy="8" r="3.5" stroke="white" strokeWidth="1.5"/><path d="M3 22c0-4.42 3.13-8 7-8s7 3.58 7 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M19 5l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>); }
function MonitorIcon() { return (<svg width="26" height="26" viewBox="0 0 26 26" fill="none"><rect x="3" y="4" width="20" height="14" rx="2" stroke="white" strokeWidth="1.6"/><path d="M9 22h8M13 18v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/><path d="M7 14l3.5-4 3 3 3.5-5 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>); }

const OVERVIEW_CARDS = [
  { id: "manpower",  title: "Industrial Manpower",            description: "Industrial Manpower: We find skilled, semi-skilled, and even entry-level workers for factories, production lines, and plant operations. Everyone we send is thoroughly checked and ready to start.", icon: <ManpowerIcon />,  href: "#manpower"  },
  { id: "logistics", title: "Logistics & Warehouse Staffing", description: "Logistics and Warehouse Staff: We provide all the staff you need for warehouses, your supply chain, and even last-mile deliveries, making sure your operations run smoothly without a hitch.", icon: <LogisticsIcon />, href: "#logistics"  },
  { id: "facility",  title: "Facility Management",            description: "Taking Care of Your Facilities: This includes things like cleaning, security, maintenance, and other support services. Our teams are trained and supervised to do a great job.", icon: <FacilityIcon />,  href: "#facility"   },
  { id: "payroll",   title: "Payroll & Compliance",           description: "Payroll and Legal Stuff: We handle everything related to payroll, from processing salaries to making sure all the necessary contributions like PF, ESI, PT, and TDS are managed correctly and on time.", icon: <PayrollIcon />,   href: "#payroll"    },
];

const PROCESS_STEPS = [
  { step: 1, title: "Understanding What You Need",    description: "We sit down with you to really understand what kind of workers you need, when you need them, and any legal rules we need to follow.", icon: <AnalysisIcon /> },
  { step: 2, title: "Planning Your Team",               description: "We create a specific staffing plan for you. This includes how we'll find people, match their skills to your jobs, and when they'll start, all to help you reach your goals.", icon: <PlanningIcon /> },
  { step: 3, title: "Getting People Started",  description: "Our thoroughly checked workers are sent out on time. They get a full onboarding, all paperwork is handled, and they're ready to work from day one.", icon: <DeployIcon /> },
  { step: 4, title: "Keeping an Eye On Things", description: "We continuously track attendance, review performance, and conduct audits to make sure everything stays up to standard and follows the rules.", icon: <MonitorIcon /> },
];

const WHY_FEATURES = [
  { title: "Skilled Workforce ecosystem",       desc: "Every person we send has a background check, their skills are tested, and they get training before they ever start working.",     accent: "purple" },
  { title: "Fast Delivery Response",         desc: "We can get someone in place within 48 to 72 hours from when you tell us what you need. This means your business keeps moving without interruptions.",             accent: "gold"   },
  { title: "Operational Consistency",  desc: "Our clear processes and quality checks mean you'll always get reliable service.",           accent: "purple" },
  { title: "Audit Ready Compliance",        desc: "We handle everything related to payroll and manage all the tricky parts of labor laws for you smoothly.",         accent: "gold"   },
  { title: "Personal Touch Support",  desc: "Work with Stryper Solution Pvt. Ltd. to get flexible staffing and top-notch operations delivered with a personal touch.",             accent: "purple" },
  { title: "Flexible Staffing Model",      desc: "We do more than just find people to fill jobs. We help build a whole system of workers that runs smoothly, follows all the rules, and can grow.",   accent: "gold"   },
];

const DETAIL_SERVICES = [
  { id: "manpower",  eyebrow: "Industrial Manpower",  title: "Workers for Industry",         description: "We send out trained and thoroughly checked industrial workers to manufacturing sites, production lines, and various plant settings. We have people with all sorts of skills, from technicians with ITI certifications to seasoned machine operators.", features: ["Skilled Technicians & ITI Holders","Machine Operators","Production Workforce","Quality Inspection Staff","Diploma & Certified Workers"], stat1: { val: "300+", lbl: "Industrial Workers" }, stat2: { val: "48hr", lbl: "Avg. Deployment" }, accent: PURPLE, flip: false },
  { id: "logistics", eyebrow: "Logistics & Warehouse", title: "Logistics and Warehouse Staff",        description: "Whether it's the warehouse floor or getting products to their final destination, we supply trained logistics staff to ensure your supply chain keeps running. Our workers get a full briefing on safety rules, how inventory systems work, and all the standard operating procedures.", features: ["Loaders & Packers","Warehouse Assistants","Pickers & Sorters","Inventory Executives","Forklift Operators"], stat1: { val: "150+", lbl: "Logistics Staff" }, stat2: { val: "99%", lbl: "On-Time Deployment" }, accent: GOLD, flip: true },
  { id: "facility",  eyebrow: "Facility Management",  title: "Taking Care of Your Facilities",      description: "We take care of all aspects of facility support, from everyday cleaning to complex technical maintenance. Our supervised teams work in all sorts of places: commercial buildings, corporate offices, hospitals, and industrial sites.", features: ["Housekeeping Staff","Office Support Personnel","Deep Cleaning Services","Electrical & Plumbing Support","Commercial Facility Services"], stat1: { val: "80+", lbl: "Facility Clients" }, stat2: { val: "100%", lbl: "SLA Compliance" }, accent: PURPLE, flip: false },
  { id: "payroll",   eyebrow: "Payroll & Compliance", title: "Payroll and Legal Stuff", description: "We manage the entire payroll process, from keeping track of attendance to paying salaries, all while making sure we follow every legal requirement. You can stay prepared for audits, as we handle all the tricky parts of labor laws for you.", features: ["Payroll Processing","Attendance Management","Contract Staffing Documentation","Employee Documentation","PF, ESI, PT, TDS Compliance"], stat1: { val: "100%", lbl: "Compliance Rate" }, stat2: { val: "0", lbl: "Audit Failures" }, accent: GOLD, flip: true },
];

const ServicesOverview = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="overview-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full opacity-[0.06] -translate-y-1/3 translate-x-1/4" style={{ background: "radial-gradient(circle, #8B3A8F, transparent)" }} />
    </div>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-2xl mx-auto mb-14">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{ background: "#faf5fb", borderColor: "#e4d0e9", color: PURPLE }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />Here's what we do
          </span>
        </motion.div>
        <motion.h2 id="overview-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: "clamp(1.9rem,3.2vw,2.75rem)" }}>
          We have <span style={{ color: PURPLE }}>four main service areas</span> that cover everything you might need for your team and daily operations.
        </motion.h2>
        <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto mb-5" style={{ background: "linear-gradient(90deg, #8B3A8F, #F5A623)" }} />
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        {OVERVIEW_CARDS.map((s, i) => <ServiceCard key={s.id} icon={s.icon} title={s.title} description={s.description} href={s.href} index={i} />)}
      </div>
    </div>
  </section>
);

const DetailedServices = () => (
  <section className="relative overflow-hidden section-padding" aria-label="Detailed services"
           style={{ background: 'linear-gradient(180deg,#fafafa 0%,#f5f0fb 50%,#fafafa 100%)' }}>
    <div className="container-base relative z-10 space-y-20 lg:space-y-28">
      {DETAIL_SERVICES.map((svc, i) => (
        <ServiceDetailRow key={svc.id} svc={svc} index={i} />
      ))}
    </div>
  </section>
);

const ServiceDetailRow = ({ svc }) => (
  <div id={svc.id} className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center scroll-mt-24">
    <motion.div variants={svc.flip ? fadeInRight : fadeInLeft} initial="hidden" whileInView="visible" viewport={viewportOnce}
      className={`flex flex-col ${svc.flip ? 'lg:order-2' : ''}`}>
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase mb-6 w-fit"
            style={{ background: svc.accent === PURPLE ? '#faf5fb' : '#fffbf0', borderColor: svc.accent + '33', color: svc.accent }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: svc.accent }} />{svc.eyebrow}
      </span>
      <h2 className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5" style={{ fontSize: 'clamp(1.7rem,2.8vw,2.4rem)' }}>{svc.title}</h2>
      <p className="text-neutral-500 text-[1.02rem] leading-relaxed mb-7">{svc.description}</p>
      <ul className="space-y-2.5 mb-8" role="list">
        {svc.features.map((f) => (
          <li key={f} className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: svc.accent + '18', color: svc.accent }}>
              <CheckIcon />
            </span>
            <span className="text-sm text-neutral-700 font-medium">{f}</span>
          </li>
        ))}
      </ul>
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-fit">
        <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white transition-colors duration-200" style={{ background: svc.accent }}>
          Get This Service
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </motion.div>
    </motion.div>

    <motion.div variants={svc.flip ? fadeInLeft : fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}
      className={svc.flip ? 'lg:order-1' : ''}>
      <div className="relative w-full aspect-[4/3.6] max-w-[480px] mx-auto">
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-medium">
      <img src={svc.flip ? img6 : img5} alt={svc.title} className="w-full h-full object-cover object-center" />
      <div className="absolute inset-0" style={{ background: `linear-gradient(145deg, rgba(30,10,50,0.78) 0%, rgba(60,20,80,0.6) 100%)` }} aria-hidden="true" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,0.5) 1px,transparent 1px)', backgroundSize: '28px 28px' }} aria-hidden="true" />
          <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: svc.accent + 'aa' }}>Service Overview</p>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold" style={{ background: svc.accent + '18', color: svc.accent }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: svc.accent }} />Active
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[svc.stat1, svc.stat2].map((s) => (
                <div key={s.lbl} className="rounded-2xl px-4 py-3.5 text-center border" style={{ background: 'white', borderColor: svc.accent + '20' }}>
                  <p className="text-2xl font-bold font-display leading-none mb-1" style={{ color: svc.accent }}>{s.val}</p>
                  <p className="text-[10px] text-neutral-500 font-medium">{s.lbl}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 rounded-2xl px-4 py-4 border" style={{ background: 'white', borderColor: svc.accent + '15' }}>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={{ color: svc.accent + 'aa' }}>Included</p>
              <div className="space-y-2">
                {svc.features.slice(0, 4).map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: svc.accent }} />
                    <span className="text-[11px] text-neutral-600 font-medium">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={viewportOnce} transition={{ duration: 0.45, delay: 0.5 }} className="absolute -bottom-4 -right-4 z-10">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-medium border border-neutral-100">
            <span className="w-2 h-2 rounded-full" style={{ background: svc.accent }} aria-hidden="true" />
            <span className="text-[11px] font-semibold text-neutral-700">Pan-India Coverage</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

const ProcessHighlights = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="process-svc-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.05] -translate-y-1/2" style={{ background: 'radial-gradient(circle, #8B3A8F, transparent)' }} />
    </div>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-14">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{ background: '#faf5fb', borderColor: '#e4d0e9', color: PURPLE }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />How We Manage Your Workforce
          </span>
        </motion.div>
        <motion.h2 id="process-svc-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: 'clamp(1.9rem,3.2vw,2.75rem)' }}>
          A Structured Approach To <span style={{ color: PURPLE }}>Workforce Management</span>
        </motion.h2>
        <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto" style={{ background: 'linear-gradient(90deg, #8B3A8F, #F5A623)' }} />
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
        {PROCESS_STEPS.map((step, i) => (
          <ProcessCard key={step.step} step={step.step} icon={step.icon} title={step.title} description={step.description} index={i} isLast={i === PROCESS_STEPS.length - 1} />
        ))}
      </div>
    </div>
  </section>
);

const WhyChooseServices = () => (
  <section className="relative overflow-hidden section-padding" aria-labelledby="why-svc-heading"
           style={{ background: 'linear-gradient(180deg,#fafafa 0%,#f5f0fb 55%,#fafafa 100%)' }}>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-14">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{ background: '#faf5fb', borderColor: '#e4d0e9', color: PURPLE }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: PURPLE }} />Why Companies Work With Us
          </span>
        </motion.div>
        <motion.h2 id="why-svc-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: "clamp(1.9rem,3.2vw,2.75rem)" }}>
          Why Businesses <span style={{ color: PURPLE }}>Choose Our Services</span>
        </motion.h2>
        <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto mb-5" style={{ background: 'linear-gradient(90deg, #8B3A8F, #F5A623)' }} />
        <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed">We do more than just find people to fill jobs. We help build a whole system of workers that runs smoothly, follows all the rules, and can grow with your business.</motion.p>
        </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WHY_FEATURES.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.45, delay: i * 0.08 }} whileHover={{ y: -4, transition: { duration: 0.18 } }}
            className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: 'linear-gradient(145deg,rgba(139,58,143,0.04) 0%,rgba(245,166,35,0.03) 100%)' }} aria-hidden="true" />
            <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                 style={{ background: f.accent === 'purple' ? PURPLE : GOLD }} aria-hidden="true" />
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: f.accent === 'purple' ? '#faf5fb' : '#fffbf0', color: f.accent === 'purple' ? PURPLE : GOLD }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2l7 3v4c0 3.5-2.5 6-7 7-4.5-1-7-3.5-7-7V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="font-display font-semibold text-neutral-900 text-base mb-2">{f.title}</h3>
            <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ServicesCTA = () => (
  <section className="relative overflow-hidden py-20 lg:py-28" aria-labelledby="svc-cta-heading"
           style={{ background: 'linear-gradient(135deg, #3d1940 0%, #662a6b 45%, #8B3A8F 100%)' }}>
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl opacity-20" style={{ background: GOLD }} />
      <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full blur-3xl opacity-15" style={{ background: PURPLE }} />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
    </div>
    <div className="container-sm relative z-10 text-center">
      <motion.div variants={staggerContainer(0.12)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase" style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />Work with Stryper Solution Pvt. Ltd.
          </span>
        </motion.div>
        <motion.h2 id="svc-cta-heading" variants={fadeInUp} className="font-display font-bold text-white leading-[1.08] tracking-tight mb-5 text-balance" style={{ fontSize: 'clamp(2rem,4vw,3.2rem)' }}>
          Need Reliable <span style={{ background: 'linear-gradient(90deg,#F5A623,#fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Workforce Solutions?</span>
        </motion.h2>
        <motion.p variants={fadeInUp} className="text-white/65 text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Get flexible staffing and top-notch operations. We deliver it all with accuracy, making sure all rules are followed, and with a personal touch.
        </motion.p>
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold transition-colors duration-200" style={{ background: GOLD, boxShadow: '0 4px 20px rgba(245,166,35,0.4)' }}>
              Get Consultation
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold border transition-colors duration-200" style={{ borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)' }}>
              Contact Our Team
            </Link>
          </motion.div>
        </motion.div>
        <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2 mt-8">
          {['You don\'t have to commit to anything','We\'ll get back to you within 24 hours','Your first chat with us is free'].map((t) => (
            <span key={t} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
              <span className="font-bold text-base leading-none" style={{ color: GOLD }}>✓</span>{t}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  </section>
);

const Services = () => (
  <>
    <PageHero title="Complete Help for Your Staff and Operations." subtitle="We provide flexible staffing, help manage your team, take care of logistics, and handle other operational tasks. We customize these services for today's businesses and industries." breadcrumb="Services" image={img2} />
    <ServicesOverview />
    <DetailedServices />
    <ProcessHighlights />
    <WhyChooseServices />
    <ServicesCTA />
  </>
);
export default Services;