import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import heroImg from "@/assets/image/hero.jpeg";
import StatCard from "./StatCard";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 17a6 6 0 10-12 0"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 11a3 3 0 010 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClientIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="5" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 5V4a4 4 0 018 0v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IndustryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M2 17V9l5-4 5 4v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17V7l6-3v13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 8.5a3.5 3.5 0 017 0c0 2-2 3-2 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="15.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

const STATS = [
  { value: "250+", label: "Workforce Deployed", icon: <PeopleIcon /> },
  { value: "15+", label: "Clients Served", icon: <ClientIcon /> },
  { value: "10+", label: "Industries Covered", icon: <IndustryIcon /> },
  { value: "24/7", label: "Dedicated Support", icon: <SupportIcon /> },
];

const Hero = () => {
  const { isLoggedIn } = useAuth();
  const [authModal, setAuthModal] = useState({ open: false, view: 'signup-hire-workforce' });

  const handleFindJobClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setAuthModal({ open: true, view: 'signup-find-job' });
    }
  };

  return (
    <section className="relative pt-[68px] lg:pt-[104px]" aria-label="Hero section">
      {/* ── Full-width hero image banner ── */}
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[440px] md:h-[480px] lg:h-[540px]">
        {/* Background image */}
        <img
          src={heroImg}
          alt="Stryper Solution workforce professionals"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.2) 100%)",
          }}
          aria-hidden="true"
        />

        {/* Hero text — Centered for balanced professional look */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container-base w-full">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mx-auto px-6 max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-white/80 text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4"
              >
                Stryper Solution Pvt. Ltd.
              </motion.p>
              <h1
                className="font-display font-bold text-white leading-[1.1] mb-6"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3.8rem)",
                  textShadow: "0 2px 16px rgba(0,0,0,0.5)",
                }}
              >
                Your Ambition. Our People. <br className="hidden sm:block" /> Zero Friction.
              </h1>
              <p className="text-white/85 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
                The strategic workforce partner for industrial and warehouse leaders.
                We deliver vetted talent and manage complete compliance, ensuring
                your operations run at peak efficiency.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 px-5 sm:px-10 py-2.5 sm:py-4 rounded-xl font-bold text-white transition-all duration-300"
                    style={{
                      background: "linear-gradient(135deg, #8B3A8F, #6d2b70)",
                      boxShadow: "0 10px 25px -5px rgba(139,58,143,0.5)",
                      fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)"
                    }}
                  >
                    Get Consultation
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sm:w-[18px] sm:h-[18px]">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="flex items-center justify-center gap-2 px-5 sm:px-10 py-2.5 sm:py-4 rounded-xl font-bold border-2 transition-all duration-300 hover:bg-white/10"
                    style={{
                      borderColor: "#F5A623",
                      color: "white",
                      background: "transparent",
                      fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)"
                    }}
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Two-column CTA strip — ShaleenJobs style ── */}
      <div className="bg-white border-b border-neutral-100">
        <div className="container-base">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
            {/* Company */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col items-center justify-center py-10 px-8 text-center group hover:bg-neutral-50 transition-colors duration-200"
            >
              <p className="text-sm font-semibold mb-1" style={{ color: "#8B3A8F" }}>Partner with Us</p>
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-4">I am a Company</h3>
              <button
                onClick={() => setAuthModal({ open: true, view: 'signin' })}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
                style={{ background: "#8B3A8F" }}
              >
                Company Login
              </button>
            </motion.div>

            {/* Job Seeker */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.62 }}
              className="flex flex-col items-center justify-center py-10 px-8 text-center group hover:bg-neutral-50 transition-colors duration-200"
            >
              <p className="text-sm font-semibold mb-1" style={{ color: "#F5A623" }}>Looking for Opportunities?</p>
              <h3 className="text-xl font-display font-bold text-neutral-900 mb-4">I am a Job Seeker</h3>
              <Link
                to="/careers"
                onClick={handleFindJobClick}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
                style={{ background: "#F5A623" }}
              >
                Find a Job
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ background: "#faf5fb" }} className="border-b border-neutral-100">
        <div className="container-base py-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
          >
            {STATS.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </motion.div>
        </div>
      </div>

      <AuthModal
        isOpen={authModal.open}
        onClose={() => setAuthModal(p => ({ ...p, open: false }))}
        defaultView={authModal.view}
      />
    </section>
  );
};

export default Hero;
