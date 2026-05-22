import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PageHero from "@/components/shared/PageHero";
import { COMPANY_INFO } from "@/data/companyInfo";
import FAQSection from "@/components/shared/FAQSection";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  viewportOnce,
} from "@/utils/animations";

const PURPLE = "#8B3A8F";
const GOLD = "#F5A623";

/* ── Contact info cards data ── */
const CONTACT_CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M11 2C7.69 2 5 4.69 5 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.31-2.69-6-6-6z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle
          cx="11"
          cy="8"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
    title: "Office Address",
    lines: [
      COMPANY_INFO.address.line1,
      `${COMPANY_INFO.address.city}, ${COMPANY_INFO.address.state}`,
      `${COMPANY_INFO.address.country} - ${COMPANY_INFO.address.pin}`,
    ],
    accent: PURPLE,
    action: null,
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path
          d="M3 4C3 3.45 3.45 3 4 3h3l2 5-2.5 1.5c1 2.5 3.5 5 6 6L14 13l5 2v3c0 .55-.45 1-1 1C8.4 19 3 13.6 3 7V4z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Phone Support",
    lines: [COMPANY_INFO.phone, "Mon – Sat, 9:00AM – 6:00PM"],
    accent: GOLD,
    action: { label: "Call Now", href: `tel:${COMPANY_INFO.phone}` },
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect
          x="2"
          y="5"
          width="18"
          height="13"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M2 7l9 6 9-6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Email Support",
    lines: [COMPANY_INFO.email, "We respond within 24 hours."],
    accent: PURPLE,
    action: { label: "Send Email", href: `mailto:${COMPANY_INFO.email}` },
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle
          cx="11"
          cy="11"
          r="8.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path
          d="M11 6v5.5l3.5 2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Working Hours",
    lines: [
      "Monday – Saturday",
      "9:00 AM to 6:00 PM IST",
      "Closed Sundays & Public Holidays.",
    ],
    accent: GOLD,
    action: null,
  },
];

const SUPPORT_FEATURES = [
  {
    title: "Fast Workforce Deployment",
    desc: "48-72 hours from requirement to deployment.",
    accent: PURPLE,
  },
  {
    title: "Named Account Manager",
    desc: "Every client engagement will have a named account manager.",
    accent: GOLD,
  },
  {
    title: "Compliance-driven Operations",
    desc: "Full PF, ESI, Labour law compliance on all the projects.",
    accent: PURPLE,
  },
  {
    title: "Service Coverage Pan India",
    desc: "Operations in all major Industrial & Commercial hubs.",
    accent: GOLD,
  },
];

const SERVICE_OPTIONS = [
  "Industrial Manpower",
  "Logistics & Warehouse Staffing",
  "Facility Management",
  "Payroll & Compliance",
  "General Inquiry",
  "Other",
];

/* ── Main page ── */
const Contact = () => (
  <>
    <PageHero
      title="LET’S TALK ABOUT YOUR WORKFORCE NEEDS"
      subtitle="Stryper Solution Pvt. Ltd. Contact us for staffing solutions, workforce support, operational services and business enquiries."
      breadcrumb="Contact"
    />
    <ContactInfoGrid />
    <ContactFormSection />
    <SupportFeatures />
    <FAQSection />
    <OfficeLocation />
    <ContactCTA />
  </>
);

/* ── Section 1: Contact Info Grid ── */
const ContactInfoGrid = () => (
  <section
    className="relative overflow-hidden bg-white section-padding-sm"
    aria-label="Contact information"
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.05] -translate-y-1/3 translate-x-1/4"
        style={{
          background: `radial-gradient(circle, ${PURPLE}, transparent)`,
        }}
      />
    </div>
    <div className="container-base relative z-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CONTACT_CARDS.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.45, delay: i * 0.09 }}
            whileHover={{ y: -4, transition: { duration: 0.18 } }}
            className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden flex flex-col"
          >
            {/* Hover wash */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(145deg, ${card.accent}08 0%, ${card.accent}04 100%)`,
              }}
              aria-hidden="true"
            />
            {/* Top accent bar */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
              style={{ background: card.accent }}
              aria-hidden="true"
            />

            {/* Icon */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-200"
              style={{ background: card.accent + "12", color: card.accent }}
            >
              {card.icon}
            </div>

            <h3 className="font-display font-semibold text-neutral-900 text-base mb-3">
              {card.title}
            </h3>

            <div className="space-y-1 flex-1 mb-4">
              {card.lines.map((line, j) => (
                <p
                  key={j}
                  className={`text-sm leading-relaxed ${j === 0 ? "text-neutral-800 font-medium" : "text-neutral-500"}`}
                >
                  {line}
                </p>
              ))}
            </div>

            {card.action && (
              <a
                href={card.action.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200"
                style={{ color: card.accent }}
              >
                {card.action.label}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 6.5h9M7 2.5l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 2: Contact Form ── */
const ContactFormSection = () => (
  <section
    className="relative overflow-hidden section-padding"
    aria-labelledby="form-heading"
    style={{
      background: "linear-gradient(180deg,#fafafa 0%,#f5f0fb 55%,#fafafa 100%)",
    }}
  >
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full opacity-[0.06]"
        style={{
          background: `radial-gradient(circle, ${PURPLE}, transparent)`,
        }}
      />
    </div>
    <div className="container-base relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: copy */}
        <motion.div
          variants={staggerContainer(0.1, 0.05)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col lg:sticky lg:top-28"
        >
          <motion.div variants={fadeInUp} className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase"
              style={{
                background: "#faf5fb",
                borderColor: "#e4d0e9",
                color: PURPLE,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: PURPLE }}
              />
              Send a Message
            </span>
          </motion.div>

          <motion.h2
            id="form-heading"
            variants={fadeInUp}
            className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5"
            style={{ fontSize: "clamp(1.8rem,3vw,2.5rem)" }}
          >
            Tell us about your staffing needs.
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-neutral-500 text-[1.02rem] leading-relaxed mb-8"
          >
            Fill out the form and we will get back to you within 24 hours with a tailored workforce solution proposal.
          </motion.p>

          {/* Trust points */}
          <motion.div
            variants={staggerContainer(0.08, 0.1)}
            className="space-y-3.5"
          >
            {[
              { text: "Free initial consultation with no obligation." },
              { text: "Dedicated account manager for your request." },
              { text: "We will deliver the proposal within 24 business hours." },
              { text: "Strictest confidentiality on all business information." },
            ].map((pt) => (
              <motion.div
                key={pt.text}
                variants={fadeInUp}
                className="flex items-start gap-3"
              >
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: PURPLE + "15", color: PURPLE }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M2 5l2 2 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-sm text-neutral-600 leading-relaxed">
                  {pt.text}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact quick links */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 pt-8 border-t border-neutral-100 flex flex-col gap-3"
          >
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-1">
              Or contact us directly.
            </p>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors group"
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                style={{ background: PURPLE + "12", color: PURPLE }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M2 2.5C2 2.22 2.22 2 2.5 2h2l1 2.5-1.5 1c.5 1.5 2 3 3.5 3.5l1-1.5L11 8.5v2c0 .28-.22.5-.5.5C5.15 11 2 7.85 2 4v-1.5z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {COMPANY_INFO.phone}
            </a>
            <a
              href={`mailto:${COMPANY_INFO.email}`}
              className="flex items-center gap-3 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors group"
            >
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform"
                style={{ background: GOLD + "15", color: GOLD }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect
                    x="1.5"
                    y="3"
                    width="11"
                    height="8"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <path
                    d="M1.5 4l5.5 3.5L12.5 4"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              {COMPANY_INFO.email}
            </a>
          </motion.div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <ContactForm />
        </motion.div>
      </div>
    </div>
  </section>
);

const ContactForm = () => {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-3xl p-10 border border-neutral-100 shadow-medium text-center"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: PURPLE + "12" }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M5 14l6 6 12-12"
              stroke={PURPLE}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display font-bold text-neutral-900 text-xl mb-3">
          Thanks for reaching out.
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed mb-6">
          We will look into your inquiry and get back to you within 24 business hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-colors duration-200"
          style={{ background: PURPLE }}
        >
          Send Another Message
        </button>
      </motion.div>
    );
  }

  const inputClass = (name) =>
    [
      "w-full px-4 py-3.5 rounded-xl border text-sm text-neutral-800 bg-white",
      "placeholder-neutral-400 outline-none transition-all duration-200",
      focused === name
        ? "border-[#8B3A8F] shadow-[0_0_0_3px_rgba(139,58,143,0.12)]"
        : "border-neutral-200 hover:border-neutral-300",
    ].join(" ");

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-3xl p-7 lg:p-9 border border-neutral-100 shadow-medium space-y-5"
    >
      {/* Row 1: Name + Company */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide"
          >
            Full Name <span style={{ color: PURPLE }}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Rajesh Mehta"
            value={form.name}
            onChange={handleChange}
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused("")}
            className={inputClass("name")}
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide"
          >
            Company Name
          </label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Apex Industries Ltd."
            value={form.company}
            onChange={handleChange}
            onFocus={() => setFocused("company")}
            onBlur={() => setFocused("")}
            className={inputClass("company")}
          />
        </div>
      </div>

      {/* Row 2: Email + Phone */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide"
          >
            Email Address <span style={{ color: PURPLE }}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="rajesh@company.com"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused("")}
            className={inputClass("email")}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide"
          >
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={handleChange}
            onFocus={() => setFocused("phone")}
            onBlur={() => setFocused("")}
            className={inputClass("phone")}
          />
        </div>
      </div>

      {/* Service dropdown */}
      <div>
        <label
          htmlFor="service"
          className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide"
        >
          Service Requirement <span style={{ color: PURPLE }}>*</span>
        </label>
        <select
          id="service"
          name="service"
          required
          value={form.service}
          onChange={handleChange}
          onFocus={() => setFocused("service")}
          onBlur={() => setFocused("")}
          className={inputClass("service") + " cursor-pointer"}
        >
          <option value="" disabled>
            Select a service...
          </option>
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide"
        >
          Message <span style={{ color: PURPLE }}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="What are your labour needs, how many workers do you need, where, when..."
          value={form.message}
          onChange={handleChange}
          onFocus={() => setFocused("message")}
          onBlur={() => setFocused("")}
          className={inputClass("message") + " resize-none"}
        />
      </div>

      {/* Trust note */}
      <p className="flex items-center gap-2 text-xs text-neutral-400">
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="6.5"
            cy="6.5"
            r="5.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <path
            d="M6.5 5.5v4M6.5 4v.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        Our team typically respond within 24 hours. Your information is treated with strict confidentiality.
      </p>

      {/* Submit */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-white text-sm font-semibold transition-colors duration-200"
        style={{ background: PURPLE }}
      >
        Send Message
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2 7.5h11M8 3.5l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </form>
  );
};

/* ── Section 3: Support Features ── */
const SupportFeatures = () => (
  <section
    className="relative overflow-hidden bg-white section-padding-sm"
    aria-label="Support features"
  >
    <div className="container-base relative z-10">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SUPPORT_FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.42, delay: i * 0.08 }}
            className="group relative bg-white rounded-2xl p-5 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden text-center"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `linear-gradient(145deg, ${f.accent}06 0%, ${f.accent}03 100%)`,
              }}
              aria-hidden="true"
            />
            <div
              className="absolute bottom-0 left-4 right-4 h-[2px] rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"
              style={{ background: f.accent }}
              aria-hidden="true"
            />
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
              style={{ background: f.accent + "12", color: f.accent }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2l7 3v4c0 3.5-2.5 6-7 7-4.5-1-7-3.5-7-7V5l7-3z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 9l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-display font-semibold text-neutral-900 text-sm mb-1.5">
              {f.title}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 4: Office Location (Split Layout) ── */
const OfficeLocation = () => (
  <section
    className="relative overflow-hidden section-padding"
    aria-labelledby="location-heading"
    style={{
      background: "linear-gradient(180deg,#fafafa 0%,#fefeff 100%)",
    }}
  >
    <div
      className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40"
      aria-hidden="true"
    >
      <div className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl bg-brand-purple-100" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl bg-brand-gold-50" />
    </div>

    <div className="container-base relative z-10">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left Side: Office Details */}
        <motion.div
          className="lg:col-span-5"
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <motion.div variants={fadeInUp} className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase"
              style={{
                background: "#faf5fb",
                borderColor: "#e4d0e9",
                color: PURPLE,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: PURPLE }}
              />
              Visit Us
            </span>
          </motion.div>

          <motion.h2
            id="location-heading"
            variants={fadeInUp}
            className="font-display font-bold text-neutral-900 leading-tight mb-6"
            style={{ fontSize: "clamp(2rem,3.5vw,2.8rem)" }}
          >
            Our Registered <span style={{ color: PURPLE }}>Headquarters</span>
          </motion.h2>

          <motion.div variants={fadeInUp} className="space-y-8">
            {/* Address Block */}
            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: PURPLE + "12", color: PURPLE }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 text-lg mb-1">
                  Office Address
                </h4>
                <p className="text-neutral-500 leading-relaxed">
                  {COMPANY_INFO.address.line1},<br />
                  {COMPANY_INFO.address.city}, {COMPANY_INFO.address.state} - {" "}
                  {COMPANY_INFO.address.pin}
                </p>
              </div>
            </div>

            {/* Contact Block */}
            <div className="flex gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ background: GOLD + "15", color: GOLD }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900 text-lg mb-1">
                  Direct Contact
                </h4>
                <p className="text-neutral-500 leading-relaxed">
                  Phone: {COMPANY_INFO.phone}
                  <br />
                  Email: {COMPANY_INFO.email}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.div variants={fadeInUp} className="pt-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Pioneer+Urban+Square+Sector+62+Gurugram"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-white text-sm font-semibold transition-all duration-300 shadow-purple hover:translate-y-[-2px]"
                style={{ background: PURPLE }}
              >
                Get Directions on Google Maps
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Side: Map Container */}
        <motion.div
          className="lg:col-span-7"
          variants={fadeInRight}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-purple-200 to-brand-gold-100 rounded-[3rem] blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[10px] border-white">
              <iframe
                title="Stryper Solution Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3509.432356543883!2d77.08639237550346!3d28.406253975789715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d226a2761895b%3A0x6a0f6707f59d95f6!2sPioneer%20Urban%20Square!5e0!3m2!1sen!2sin!4v1716198000000!5m2!1sen!2sin"
                width="100%"
                height="500px"
                style={{ border: 0, display: "block" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

/* ── Section 5: Contact CTA ── */
const ContactCTA = () => (
  <section
    className="relative overflow-hidden py-20 lg:py-24"
    aria-labelledby="contact-cta-heading"
    style={{
      background: `linear-gradient(135deg, #3d1940 0%, #662a6b 45%, ${PURPLE} 100%)`,
    }}
  >
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className="absolute -top-20 -right-20 w-[380px] h-[380px] rounded-full blur-3xl opacity-20"
        style={{ background: GOLD }}
      />
      <div
        className="absolute -bottom-20 -left-20 w-[320px] h-[320px] rounded-full blur-3xl opacity-15"
        style={{ background: PURPLE }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.7) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
    </div>

    <div className="container-sm relative z-10 text-center">
      <motion.div
        variants={staggerContainer(0.12)}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <motion.div variants={fadeInUp} className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.8)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: GOLD }}
            />
            We're Ready to Help
          </span>
        </motion.div>

        <motion.h2
          id="contact-cta-heading"
          variants={fadeInUp}
          className="font-display font-bold text-white leading-[1.08] tracking-tight mb-5 text-balance"
          style={{ fontSize: "clamp(2rem,4vw,3rem)" }}
        >
          Need Reliable{" "}
          <span
            style={{
              background: `linear-gradient(90deg,${GOLD},#fbbf24)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Workforce Support?
          </span>
        </motion.h2>

        <motion.p
          variants={fadeInUp}
          className="text-white/65 text-lg leading-relaxed max-w-lg mx-auto mb-10"
        >
          Our team is available Monday to Saturday, 9 AM – 6 PM. Reach out and we'll respond within 24 hours. Take the first step towards a stable, rewarding career with one of India's growing workforce solutions companies.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold transition-colors duration-200"
              style={{
                background: GOLD,
                boxShadow: `0 4px 20px rgba(245,166,35,0.4)`,
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 3C2 2.45 2.45 2 3 2h2.5l1.5 3.75-2 1.25c.75 2.25 3 4.5 5.25 5.25l1.25-2L15 11.5V14c0 .55-.45 1-1 1C7.1 15 1 8.9 1 2.5V3z"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              Call Now
            </a>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <a
              href="#form-heading"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold border transition-colors duration-200"
              style={{
                borderColor: "rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.1)",
              }}
            >
              Send Inquiry
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default Contact;