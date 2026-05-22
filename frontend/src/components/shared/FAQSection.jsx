import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: "How long does the recruitment process typically take?",
    answer:
      "Our standard recruitment process takes between 48 to 72 hours from requirement analysis to candidate deployment, depending on the specialization required.",
  },
  {
    question: "Do you provide staffing services across India?",
    answer:
      "Yes, Stryper Solution Pvt. Ltd. has a Pan-India service coverage, operating across all major industrial and commercial hubs in the country.",
  },
  {
    question: "What types of staffing solutions do you offer?",
    answer:
      "We offer Permanent Staffing, Contractual Staffing, Executive Search, and RPO (Recruitment Process Outsourcing) services tailored to your business needs.",
  },
  {
    question: "How do you ensure candidate quality and verification?",
    answer:
      "Every candidate undergoes a rigorous screening process, including skill assessments, multiple interview rounds, and comprehensive background & document verification.",
  },
  {
    question: "Is there a dedicated support manager for clients?",
    answer:
      "Yes, we assign a dedicated Account Manager to every client to ensure seamless communication, faster deployment, and dedicated compliance support.",
  },
  {
    question: "Do you handle payroll and statutory compliance?",
    answer:
      "Yes, we provide end-to-end payroll management along with full statutory compliance, including PF, ESI, TDS, and other labor law requirements.",
  },
  {
    question: "How do I share my job requirements with Stryper Solution?",
    answer:
      "You can simply fill out the contact form on our website, email us at Strypersolutionpvtltd@gmail.com, or call our support team directly at +91 8448590303.",
  },
  {
    question: "Do candidates have to pay any registration fees?",
    answer:
      "No, Stryper Solution Pvt. Ltd. does not charge any registration or processing fees from candidates for job placements.",
  },
  {
    question: "How do you handle bulk hiring for large projects?",
    answer:
      "We have a specialized team for volume hiring that uses advanced sourcing tools and a large database to close bulk requirements in record time.",
  },
  {
    question: "What industries do you specialize in?",
    answer:
      "We cater to a wide range of sectors including IT, BFSI, Healthcare, Manufacturing, E-commerce, and Facility Management.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-20 bg-neutral-50">
      <div className="container-base max-w-3xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-neutral-900 mb-4">
            Frequently Asked{" "}
            <span className="text-[#8B3A8F]">Questions</span>
          </h2>

          <p className="text-neutral-500">
            Everything you need to know about our services.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span className="font-semibold text-neutral-800">
                  {faq.question}
                </span>

                <motion.span
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  className="text-[#8B3A8F]"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="p-5 pt-0 text-neutral-600 border-t border-neutral-100">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;