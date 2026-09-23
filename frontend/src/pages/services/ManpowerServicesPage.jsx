import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img5 from '@/assets/image/5.jpeg';

const ManpowerServicesPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="Manpower Consultancy in Jaipur | Industrial & Skilled Labor Supply"
      seoDescription="Leading manpower consultancy in Jaipur providing skilled, semi-skilled, and technical industrial manpower recruitment across Jaipur, Rajasthan, and Delhi NCR."
      seoKeywords="manpower consultancy in Jaipur, manpower agency Jaipur, manpower recruitment agency, skilled manpower recruitment, manpower recruitment services for companies, manpower consultancy Rajasthan, industrial manpower Jaipur, factory labor supply Jaipur, construction manpower recruitment"
      canonicalPath="/manpower"
      heroTitle="Manpower Consultancy in Jaipur"
      heroSubtitle="Reliable skilled, semi-skilled, and technical manpower supply for manufacturing plants, warehouses, and industrial operations."
      heroImage={img5}
      breadcrumbLabel="Manpower Supply"
      introHeading="Industrial & Skilled Manpower Supply Across Jaipur & Rajasthan"
      introParagraph1="Stryper Solution Pvt Ltd is a premier manpower consultancy in Jaipur, supplying skilled, semi-skilled, and general workforce to factories, manufacturing facilities, warehouses, logistics hubs, and construction sites throughout Rajasthan and Delhi NCR."
      introParagraph2="We manage candidate sourcing, trade skill verification, police verification, medical checks, and complete operational onboarding, ensuring your production lines operate smoothly with zero manpower shortages."
      offerings={[
        {
          title: "Technical & ITI Manpower",
          description: "Certified electricians, fitters, welders, turners, and machinists with recognized ITI/diploma certifications and practical workshop experience.",
          features: ["Trade certificate verification", "Practical skill testing", "Safety equipment trained"]
        },
        {
          title: "Machine & Plant Operators",
          description: "Experienced operators for CNC machines, injection molding, hydraulic presses, packaging lines, and industrial boilers.",
          features: ["Shift discipline compliance", "Basic maintenance capabilities", "Production output focus"]
        },
        {
          title: "Warehouse & Logistics Labor",
          description: "Loading/unloading teams, order pickers, packers, stackers, and forklift operators for large-scale distribution centers.",
          features: ["High physical endurance", "Inventory handling training", "Flexible shift rosters"]
        },
        {
          title: "Quality Control & Assembly Labor",
          description: "Attentive inspection staff and assembly line operators trained for precision manufacturing and defect minimization.",
          features: ["Quality standards adherence", "Line supervisor reporting", "Low defect rates"]
        },
        {
          title: "Construction & Site Manpower",
          description: "Carpenters, masons, bar benders, site supervisors, and general construction labor for commercial and residential real estate.",
          features: ["Site safety training", "Tools handling experience", "Batch deployment"]
        },
        {
          title: "Facility & Housekeeping Crew",
          description: "Dedicated cleaning staff, pantry boys, security guards, and maintenance crews for corporate offices and commercial complexes.",
          features: ["Uniformed & supervised", "Background verified", "SLA-driven maintenance"]
        }
      ]}
      roles={[
        "ITI Electricians", "CNC Machine Operators", "Fitter & Welders",
        "Loaders & Unloaders", "Forklift Drivers", "Packaging Workers",
        "Assembly Line Staff", "Quality Checkers", "Maintenance Helpers",
        "Site Supervisors", "Security Guards", "Housekeeping Personnel"
      ]}
      processSteps={[
        { title: "Plant Requirement Audit", description: "Analyzing technical skill requirements, shift models, safety norms, and total manpower count." },
        { title: "Candidate Vetting", description: "Conducting trade tests, background checks, Aadhaar/ID verification, and medical readiness checks." },
        { title: "Batch Deployment", description: "Dispatching trained manpower on-site with required safety gear and supervisor coordination." },
        { title: "Daily Attendance & Audits", description: "Automated biometric/roster attendance tracking and continuous compliance audits." }
      ]}
      whyUs={[
        { title: "Ready Candidate Pipeline", desc: "Thousands of pre-verified skilled and semi-skilled candidates ready for fast deployment in 48-72 hours." },
        { title: "On-Site Supervision", desc: "Dedicated field supervisors to coordinate shift rotations, resolve grievances, and track daily attendance." },
        { title: "Zero Labor Disputes", desc: "Strict adherence to minimum wages, timely bank salary transfers, PF, and ESI insurance coverage." }
      ]}
      faqs={[
        { q: "What types of industrial manpower do you supply in Jaipur?", a: "We supply ITI certified technicians, machine operators, assembly workers, warehouse loaders/packers, quality inspectors, maintenance helpers, and general labor." },
        { q: "How do you ensure candidate background verification?", a: "We conduct Aadhaar/ID verification, previous employment reference checks, trade skill tests, and police verification for every deployed worker." },
        { q: "Can you supply large batches of manpower on short notice?", a: "Yes, we maintain an active talent pool in Rajasthan and Delhi NCR capable of supporting bulk deployments of 50 to 300+ workers within 3 to 5 business days." }
      ]}
      relatedServices={[
        { label: "Staffing Agency", path: "/staffing" },
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "Logistics Warehouse", path: "/services/logistics-warehouse" },
        { label: "HR Consultancy", path: "/hr-consultancy" }
      ]}
    />
  );
};

export default ManpowerServicesPage;
