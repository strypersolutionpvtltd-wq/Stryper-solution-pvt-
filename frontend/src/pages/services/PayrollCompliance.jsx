import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/shared/PageHero';
import SEO from '@/components/shared/SEO';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img2 from '@/assets/image/2.jpeg';

const GOLD = "#F5A623";

const PayrollCompliance = () => {
  return (
    <div className="bg-white">
      <SEO
        title="HR Consultancy & Payroll Compliance Services Jaipur | Stryper Solution"
        description="End-to-end HR consultancy, statutory compliance (PF, ESIC, PT, TDS), payroll outsourcing, and labor law management for businesses in Jaipur, Rajasthan & India."
        keywords="HR consultancy in Jaipur, HR recruitment services Jaipur, HR consultancy for small businesses Jaipur, payroll compliance services, outsourced HR services Jaipur, staffing agency in Jaipur"
        canonicalUrl="https://strypersolution.com/services/payroll-compliance"
      />
      <PageHero 
        title="Payroll Outsourcing & Compliance in Jaipur" 
        subtitle="End-to-end HR advisory, PF, ESIC, labor law adherence, and precision monthly payroll management across India." 
        breadcrumb="Services / Payroll & Compliance"
        image={img2}
      />
      
      <section className="section-padding">
        <div className="container-base">
          <motion.div 
            variants={staggerContainer(0.1)} 
            initial="hidden" 
            whileInView="visible" 
            viewport={viewportOnce}
            className="max-w-4xl mx-auto"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl font-bold mb-6" style={{ color: GOLD }}>
              Payroll and Legal Compliance
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-neutral-600 mb-8 leading-relaxed">
              We manage the entire payroll process, from keeping track of attendance to paying salaries, 
              all while making sure we follow every legal requirement. You can stay prepared for audits, 
              as we handle all the tricky parts of labor laws for you.
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Our Compliance Services</h3>
                <ul className="space-y-3">
                  {["Payroll Processing", "Attendance Management", "Contract Staffing Documentation", "Employee Documentation", "PF, ESI, PT, TDS Compliance"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Peace of Mind</h3>
                <p className="text-neutral-600">
                  With a 100% compliance rate and zero audit failures, we ensure your business stays legal 
                  and your employees are paid accurately and on time, every time.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default PayrollCompliance;
