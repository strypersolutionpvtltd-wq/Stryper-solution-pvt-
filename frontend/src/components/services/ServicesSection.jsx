import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import { fadeInUp, staggerContainer, viewportOnce } from "@/utils/animations";

/* ── Icons FIRST ── */
const ManpowerIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="17" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M2 20c0-4.42 3.13-8 7-8s7 3.58 7 8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M17 13c2.76 0 5 2.24 5 5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const LogisticsIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="1"
      y="8"
      width="15"
      height="10"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M16 11h4l3 4v3h-7V11z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <circle
      cx="5.5"
      cy="19.5"
      r="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle
      cx="18.5"
      cy="19.5"
      r="1.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M5 8V5h8v3"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);
const FacilityIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 21V9l9-6 9 6v12"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <rect
      x="9"
      y="14"
      width="6"
      height="7"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <rect
      x="5"
      y="11"
      width="3"
      height="3"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
    <rect
      x="16"
      y="11"
      width="3"
      height="3"
      rx="0.5"
      stroke="currentColor"
      strokeWidth="1.4"
    />
  </svg>
);
const PayrollIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <rect
      x="3"
      y="4"
      width="18"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path
      d="M3 9h18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 13h4M7 16h3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M15 12.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5.67-1.5 1.5.67 1.5 1.5 1.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
    <path
      d="M15 12v.5M15 17v.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

/* ── Data AFTER icons ── */
const SERVICES = [
  {
    id: "industrial-manpower",
    title: "Industrial Manpower",
    description:
      "Deployment of skilled, semi-skilled, and unskilled workers for manufacturing, production, and plant operations - vetted, trained, and ready to perform.",
    href: "/services#industrial-manpower",
    icon: <ManpowerIcon />,
  },
  {
    id: "warehouse-logistics",
    title: "Warehouse & Logistics Staffing",
    description:
      "End-to-end staffing for warehousing, supply chain, and last-mile delivery operations. We ensure your logistics workforce is always at full strength.",
    href: "/services#warehouse-logistics",
    icon: <LogisticsIcon />,
  },
  {
    id: "facility-management",
    title: "Facility Management",
    description:
      "Comprehensive facility support - housekeeping, security, maintenance, and soft services - delivered through trained, supervised teams.",
    href: "/services#facility-management",
    icon: <FacilityIcon />,
  },
  {
    id: "payroll-compliance",
    title: "Payroll & Compliance Management",
    description:
      "Full-cycle payroll processing with statutory compliance - PF, ESI, PT, TDS - handled accurately and on time so you stay audit-ready.",
    href: "/services#payroll-compliance",
    icon: <PayrollIcon />,
  },
];

const ServicesSection = () => (
  <section
    className="relative overflow-hidden section-padding"
    aria-labelledby="services-heading"
    style={{
      background: "linear-gradient(180deg,#fafafa 0%,#f5f3ff 50%,#fafafa 100%)",
    }}
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-brand-purple-100/30 blur-[140px]" />
    </div>
    <div className="container-base relative z-10">
      <motion.div
        variants={staggerContainer(0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="text-center max-w-2xl mx-auto mb-14 lg:mb-16"
      >
        <motion.div variants={fadeInUp} className="mb-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
            <span
              className="w-1.5 h-1.5 rounded-full bg-brand-purple-500"
              aria-hidden="true"
            />
            Our Services
          </span>
        </motion.div>
        <motion.h2
          id="services-heading"
          variants={fadeInUp}
          className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4"
          style={{ fontSize: "clamp(1.9rem,3.2vw,2.75rem)" }}
        >
          Comprehensive Workforce{" "}
          <span className="text-gradient-brand">&amp; Business Solutions</span>
        </motion.h2>
        <motion.div
          variants={fadeInUp}
          className="divider-brand mx-auto mb-5"
        />
        <motion.p
          variants={fadeInUp}
          className="text-neutral-500 text-[1.05rem] leading-relaxed"
        >
          End-to-end staffing and operational services tailored for industrial,
          logistics, and corporate sectors.
        </motion.p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mb-12">
        {SERVICES.map((s, i) => (
          <ServiceCard
            key={s.id}
            icon={s.icon}
            title={s.title}
            description={s.description}
            href={s.href}
            index={i}
          />
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-neutral-200/60"
      >
        <p className="text-neutral-500 text-sm">
          Need a custom workforce solution for your business?
        </p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold shadow-purple hover:bg-brand-purple-700 transition-all duration-250"
          >
            Get a Free Consultation
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2.5 7h9M7.5 3l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default ServicesSection;
