import React from 'react';
import { motion } from 'framer-motion';
import PageHero from '@/components/shared/PageHero';
import SEO from '@/components/shared/SEO';
import { fadeInUp, staggerContainer, viewportOnce } from '@/utils/animations';
import img6 from '@/assets/image/6.jpeg';

const GOLD = "#F5A623";

const LogisticsWarehouse = () => {
  return (
    <div className="bg-white">
      <SEO
        title="Logistics & Warehouse Staffing Services | Stryper Solution Pvt Ltd"
        description="Specialized warehouse staffing, logistics manpower, supply chain workforce solutions, and fulfillment hiring across Jaipur, Rajasthan, Delhi NCR, and India."
        keywords="warehouse staffing, logistics recruitment agency Jaipur, workforce solutions, bulk hiring services, staffing agency in Jaipur, contract staffing agency, supply chain manpower"
        canonicalUrl="https://strypersolution.com/services/logistics-warehouse"
      />
      <PageHero 
        title="Logistics & Warehouse Staffing in Jaipur" 
        subtitle="Optimizing supply chain, fulfillment center, and warehouse operations with vetted, trained logistics manpower across India." 
        breadcrumb="Services / Logistics & Warehouse"
        image={img6}
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
              Staffing Solutions for Logistics & Supply Chain
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-neutral-600 mb-8 leading-relaxed">
              We provide all the staff you need for warehouses, your supply chain, and even last-mile deliveries. 
              Our workers ensure your operations run smoothly without a hitch, from the warehouse floor 
              to getting products to their final destination.
            </motion.p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Roles We Provide</h3>
                <ul className="space-y-3">
                  {["Loaders & Packers", "Warehouse Assistants", "Pickers & Sorters", "Inventory Executives", "Forklift Operators"].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
                      <span className="text-neutral-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-neutral-50 p-8 rounded-3xl border border-neutral-100">
                <h3 className="text-xl font-bold mb-4">Operational Excellence</h3>
                <p className="text-neutral-600">
                  Our workers get a full briefing on safety rules, inventory systems, and standard operating procedures 
                  to ensure on-time deployment and 99% accuracy in your logistics chain.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LogisticsWarehouse;
