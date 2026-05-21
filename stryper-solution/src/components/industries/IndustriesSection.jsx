import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import IndustryCard from "./IndustryCard";
import { fadeInUp, staggerContainer, viewportOnce } from "@/utils/animations";

function MfgIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="12" width="5" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="8.5" y="7" width="5" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="15" y="3" width="5" height="17" rx="1" stroke="currentColor" strokeWidth="1.5"/><path d="M2 20h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function WareIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M1 8.5L11 3l10 5.5V20H1V8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="7" y="13" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.4"/><path d="M7 10h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }
function LogIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="1" y="8" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M14 11h4l3 3.5V17h-7V11z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="5" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/><circle cx="17" cy="18.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/></svg>); }
function CorpIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="2" y="3" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="7" cy="5.5" r="1" fill="currentColor"/><circle cx="11" cy="5.5" r="1" fill="currentColor"/><rect x="6" y="12" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="12" y="12" width="4" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>); }
function PlantIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M2 20V10l4-3v3l4-3v3l4-3v13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 20V8l6-4v16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M2 20h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><rect x="15" y="12" width="3" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.3"/></svg>); }
function CommIcon() { return (<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 20V7l8-5 8 5v13" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><rect x="8" y="14" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4"/><rect x="5" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><rect x="14" y="10" width="3" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 20h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>); }

const INDUSTRIES = [
  { id: "manufacturing", title: "Manufacturing", description: "Skilled operators, technicians, and line workers for production floors, assembly lines, and quality control.", accentColor: "purple", icon: <MfgIcon /> },
  { id: "warehousing", title: "Warehousing", description: "Trained warehouse associates, supervisors, and inventory specialists for high-throughput storage operations.", accentColor: "gold", icon: <WareIcon /> },
  { id: "logistics", title: "Logistics", description: "Drivers, dispatchers, and supply chain coordinators keeping your freight and last-mile delivery on schedule.", accentColor: "purple", icon: <LogIcon /> },
  { id: "corporate", title: "Corporate Offices", description: "Administrative, front-desk, IT support, and back-office professionals for modern corporate environments.", accentColor: "gold", icon: <CorpIcon /> },
  { id: "industrial-plants", title: "Industrial Plants", description: "Plant operators, safety officers, and maintenance crews for heavy industrial and process plant environments.", accentColor: "purple", icon: <PlantIcon /> },
  { id: "commercial-facilities", title: "Commercial Facilities", description: "Housekeeping, security, and facility management staff for malls, hospitals, hotels, and commercial complexes.", accentColor: "gold", icon: <CommIcon /> },
];

const IndustriesSection = () => (
  <section className="relative overflow-hidden bg-white section-padding" aria-labelledby="industries-heading">
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full bg-brand-purple-50/80 blur-[110px]" />
      <div className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full bg-brand-gold-50/70 blur-[100px]" />
    </div>
    <div className="container-base relative z-10">
      <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-2xl mx-auto mb-14 lg:mb-16">
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-purple-500" aria-hidden="true" />
            Industries We Serve
          </span>
        </motion.div>
        <motion.h2 id="industries-heading" variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{ fontSize: "clamp(1.9rem,3.2vw,2.75rem)" }}>
          Supporting Diverse Business Sectors <span className="text-gradient-brand">With Skilled Workforce</span>
        </motion.h2>
        <motion.div variants={fadeInUp} className="divider-brand mx-auto mb-5" />
        <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.05rem] leading-relaxed">
          We deliver customized staffing and operational support services across multiple industries and business environments.
        </motion.p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-12">
        {INDUSTRIES.map((ind, i) => (
          <IndustryCard key={ind.id} icon={ind.icon} title={ind.title} description={ind.description} href={"/industries#" + ind.id} index={i} accentColor={ind.accentColor} />
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-neutral-100">
        <p className="text-neutral-500 text-sm text-center">Do not see your industry? We work across many more sectors.</p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link to="/industries" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-brand-purple-200 text-brand-purple-700 text-sm font-semibold hover:bg-brand-purple-50 hover:border-brand-purple-400 transition-all duration-250">
            View All Industries
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default IndustriesSection;