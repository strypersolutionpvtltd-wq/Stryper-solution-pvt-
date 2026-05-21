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
      <rect
        x="2"
        y="5"
        width="16"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M6 5V4a4 4 0 018 0v1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IndustryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M2 17V9l5-4 5 4v8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 17V7l6-3v13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 17h16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function SupportIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.5 8.5a3.5 3.5 0 017 0c0 2-2 3-2 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="10" cy="15.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

const STATS = [
  { value: "500+", label: "Workforce Deployed", icon: <PeopleIcon /> },
  { value: "50+", label: "Clients Served", icon: <ClientIcon /> },
  { value: "10+", label: "Industries Covered", icon: <IndustryIcon /> },
  { value: "24/7", label: "Dedicated Support", icon: <SupportIcon /> },
];

const Hero = () => {
  const { isLoggedIn } = useAuth();
  const [authModal, setAuthModal] = useState({ open: false, view: 'signup-hire-workforce' });

  const handleHireClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setAuthModal({ open: true, view: 'signup-hire-workforce' });
    }
  };

  const handleFindJobClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      setAuthModal({ open: true, view: 'signup-find-job' });
    }
  };

  return (
  <section
    className="relative"
    aria-label="Hero section"
    style={{ paddingTop: "104px" }}
  >
    {/* ── Full-width hero image banner ── */}
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "420px" }}
    >
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
          background:
            "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.15) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Hero text — centered like ShaleenJobs */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center px-6 max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-white/80 text-sm font-medium tracking-widest uppercase mb-3"
          >
            Stryper Solution Pvt. Ltd.
          </motion.p>
          <h1
            className="font-display font-bold text-white leading-tight mb-6"
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3rem)",
              textShadow: "0 2px 12px rgba(0,0,0,0.4)",
            }}
          >
            Driven by People &amp; Powered by Talent
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Hiring aur compliance ka tension humein dein. Industrial workers se
            lekar warehouse teams tak, hum vetted staff provide karte hain jo
            aapke business ko rukne nahi deta.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
                style={{
                  background: "#8B3A8F",
                  boxShadow: "0 4px 20px rgba(139,58,143,0.45)",
                }}
              >
                Explore Services
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold border-2 transition-colors duration-200"
                style={{
                  borderColor: "#F5A623",
                  color: "white",
                  background: "rgba(245,166,35,0.15)",
                }}
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>

    {/* ── Two-column CTA strip — ShaleenJobs style ── */}
    <div className="bg-white border-b border-neutral-100">
      <div className="container-base">
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-neutral-100">
          {/* Employer */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center justify-center py-10 px-8 text-center group hover:bg-neutral-50 transition-colors duration-200"
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "#8B3A8F" }}
            >
              Looking for Workforce?
            </p>
            <h3 className="text-xl font-display font-bold text-neutral-900 mb-4">
              I am an Employer
            </h3>
            <Link
              to="/contact"
              onClick={handleHireClick}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg text-sm font-semibold text-white transition-colors duration-200"
              style={{ background: "#8B3A8F" }}
            >
              Hire Workforce
            </Link>
          </motion.div>

          {/* Job Seeker */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.62 }}
            className="flex flex-col items-center justify-center py-10 px-8 text-center group hover:bg-neutral-50 transition-colors duration-200"
          >
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: "#F5A623" }}
            >
              Looking for Opportunities?
            </p>
            <h3 className="text-xl font-display font-bold text-neutral-900 mb-4">
              I am a Job Seeker
            </h3>
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
    <div
      style={{ background: "#faf5fb" }}
      className="border-b border-neutral-100"
    >
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
