import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  fadeInLeft,
  staggerContainer,
  fadeInUp,
  viewportOnce,
} from "@/utils/animations";
import img8 from "@/assets/image/8.png";

/* ── Icons FIRST ── */
function VerifiedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2l2 3.5 4 .6-2.9 2.8.7 4L10 11l-3.8 2 .7-4L4 6.1l4-.6L10 2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 10.5l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SpeedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 3a7 7 0 100 14A7 7 0 0010 3z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 7v3.5l2.5 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 3.5l1 1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M7 10l2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 8a3.5 3.5 0 017 0c0 2-2 2.5-2 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

/* ── Data AFTER icons ── */
const FEATURES = [
  {
    icon: <VerifiedIcon />,
    title: "Verified & Skilled Workforce",
    desc: "Every worker is background-checked, skill-assessed, and trained before deployment - zero compromise on quality.",
    accent: "purple",
  },
  {
    icon: <SpeedIcon />,
    title: "Fast Deployment Process",
    desc: "From requirement to deployment in 48-72 hours. Our ready talent pool means your operations never stall.",
    accent: "gold",
  },
  {
    icon: <ShieldIcon />,
    title: "Compliance & Safety Focus",
    desc: "Full statutory compliance - PF, ESI, labour law - plus rigorous on-site safety protocols across all engagements.",
    accent: "purple",
  },
  {
    icon: <SupportIcon />,
    title: "Dedicated Client Support",
    desc: "A named account manager for every client. Real-time updates, proactive communication, and 24/7 escalation support.",
    accent: "gold",
  },
];

const WhyChooseUs = () => (
  <section
    className="relative overflow-hidden section-padding"
    aria-labelledby="why-heading"
    style={{
      background: "linear-gradient(180deg,#fafafa 0%,#f5f3ff 60%,#fafafa 100%)",
    }}
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[500px] h-[500px] rounded-full bg-brand-purple-100/25 blur-[130px]" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[400px] h-[400px] rounded-full bg-brand-gold-100/20 blur-[110px]" />
    </div>

    <div className="container-base relative z-10">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        {/* Left visual */}
        <motion.div
          variants={fadeInLeft}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="relative order-2 lg:order-1"
        >
          <WhyVisual />
        </motion.div>

        {/* Right copy */}
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col order-1 lg:order-2"
        >
          <motion.div variants={fadeInUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 text-xs font-semibold tracking-wide uppercase">
              <span
                className="w-1.5 h-1.5 rounded-full bg-brand-purple-500"
                aria-hidden="true"
              />
              Why Choose Us
            </span>
          </motion.div>

          <motion.h2
            id="why-heading"
            variants={fadeInUp}
            className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.9rem,3.2vw,2.75rem)" }}
          >
            Operational Excellence Backed By{" "}
            <span className="text-brand-purple-600">Skilled Workforce</span>{" "}
            Management
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-neutral-500 text-[1.05rem] leading-relaxed mb-10 max-w-[500px]"
          >
            We do not just fill positions - we build workforce ecosystems. Our
            end-to-end management model ensures your operations run smoothly,
            compliantly, and at scale.
          </motion.p>

          <motion.ul
            variants={staggerContainer(0.1, 0.15)}
            className="space-y-5 mb-10"
            role="list"
          >
            {FEATURES.map((f) => (
              <motion.li
                key={f.title}
                variants={fadeInUp}
                className="flex items-start gap-4 group"
              >
                <div
                  className={[
                    "shrink-0 w-11 h-11 rounded-xl flex items-center justify-center mt-0.5 transition-colors duration-200",
                    f.accent === "gold"
                      ? "bg-brand-gold-50 text-brand-gold-600 group-hover:bg-brand-gold-100"
                      : "bg-brand-purple-50 text-brand-purple-600 group-hover:bg-brand-purple-100",
                  ].join(" ")}
                >
                  {f.icon}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-neutral-800 mb-1">
                    {f.title}
                  </p>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.li>
            ))}
          </motion.ul>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold shadow-purple hover:bg-brand-purple-700 transition-all duration-250"
              >
                Partner With Us
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7.5h9M8 3.5l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/about"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-semibold hover:border-brand-purple-300 hover:text-brand-purple-700 hover:bg-brand-purple-50/50 transition-all duration-250"
              >
                Our Story
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </section>
);

const WhyVisual = () => (
  <div className="relative w-full aspect-[4/4.6] max-w-[480px] mx-auto lg:mr-auto">
    {/* Real image */}
    <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-strong">
      <img
        src={img8}
        alt="Stryper Solution workforce excellence"
        className="w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
        aria-hidden="true"
      />
    </div>

    <motion.div
      initial={{ opacity: 0, x: -16, y: 8 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.5, delay: 0.65 }}
      className="absolute -bottom-5 -left-5 z-10"
    >
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-strong border border-neutral-100">
        <div className="w-9 h-9 rounded-xl bg-brand-gold-500 flex items-center justify-center shrink-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M8 1.5l1.6 3.2 3.5.5-2.55 2.5.6 3.5L8 9.5l-3.15 1.7.6-3.5L3 5.2l3.5-.5L8 1.5z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-bold text-neutral-900 leading-none">
            Award Winning
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Best Staffing Partner 2023
          </p>
        </div>
      </div>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, x: 14 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.45, delay: 0.8 }}
      className="absolute -top-4 -right-4 z-10"
    >
      <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white shadow-medium border border-neutral-100">
        <span
          className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
          aria-hidden="true"
        />
        <span className="text-[11px] font-semibold text-neutral-700">
          Trusted Since 2014
        </span>
      </div>
    </motion.div>
  </div>
);

export default WhyChooseUs;
