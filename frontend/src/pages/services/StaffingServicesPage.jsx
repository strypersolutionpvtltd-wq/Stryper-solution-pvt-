import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img5 from '@/assets/image/5.jpeg';

const StaffingServicesPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="Staffing Agency in Jaipur | Contract & Permanent Staffing | Stryper Solution"
      seoDescription="Trusted staffing agency in Jaipur offering flexible contract staffing, temporary workforce solutions, and third-party payroll management across Rajasthan & India."
      seoKeywords="staffing agency in Jaipur, permanent staffing services, temporary staffing services, contract staffing agency, workforce solutions, staffing agency Rajasthan, staffing agency Delhi NCR, trusted staffing agency in Jaipur, third party payroll staffing"
      canonicalPath="/staffing"
      heroTitle="Staffing Agency in Jaipur"
      heroSubtitle="Flexible contract staffing, temporary manpower, and third-party workforce management built for business scalability."
      heroImage={img5}
      breadcrumbLabel="Staffing Solutions"
      introHeading="Agile Staffing & Workforce Solutions for Modern Businesses"
      introParagraph1="Stryper Solution Pvt Ltd is a trusted staffing agency in Jaipur providing flexible temporary staffing, contract staffing, and workforce management for enterprises throughout Rajasthan, Delhi NCR, and nationwide."
      introParagraph2="We help businesses adapt quickly to seasonal peaks, project expansions, and specialized short-term requirements without increasing permanent headcounts or administrative liabilities."
      offerings={[
        {
          title: "Contract Staffing",
          description: "Deploy skilled professionals on Stryper Solution payroll for predefined project timelines with complete statutory compliance.",
          features: ["Zero long-term liability", "End-to-end employee lifecycle management", "Immediate scalability"]
        },
        {
          title: "Temporary & Contingent Workforce",
          description: "Quickly scale team sizes during seasonal demand spikes, events, or product launches with trained temporary personnel.",
          features: ["On-demand staffing support", "Rapid deployment within 48h", "Flexible tenure agreements"]
        },
        {
          title: "Third-Party Payroll Staffing",
          description: "Transfer contractor administration and payroll management to us while retaining operational supervision of your team.",
          features: ["PF, ESIC, PT & TDS handling", "Timely salary disbursements", "Audit-ready documentation"]
        },
        {
          title: "Temp-to-Perm Staffing",
          description: "Evaluate candidate performance and organizational fitment on a contract basis before extending a permanent full-time offer.",
          features: ["Risk-free talent trial", "Seamless role transition", "Performance evaluation data"]
        },
        {
          title: "Industrial & Factory Staffing",
          description: "Shift-based assembly line workers, technical operators, and plant support personnel deployed for continuous factory production.",
          features: ["Safety briefing compliance", "Attendance & shift tracking", "Backup worker availability"]
        },
        {
          title: "Commercial & Office Support Staffing",
          description: "Administrative staff, data entry operators, front desk executives, and back-office workforce for corporate offices.",
          features: ["Professional screening", "Communication checks", "Ready for immediate join"]
        }
      ]}
      roles={[
        "Warehouse Associates", "Assembly Line Operators", "Contract Developers",
        "Front Desk Executives", "Data Entry Operators", "Billing Clerks",
        "Field Executives", "Quality Control Inspectors", "Forklift Drivers",
        "Telecallers", "Machine Helpers", "Inventory Assistants"
      ]}
      processSteps={[
        { title: "Staffing Consultation", description: "Understanding required headcounts, skill sets, shift timings, and deployment duration." },
        { title: "Candidate Allocation", description: "Deploying vetted staff from our active talent database with all background checks completed." },
        { title: "Onboarding & Payroll Setup", description: "Handling appointment letters, PF/ESIC enrollment, safety gear, and attendance punch." },
        { title: "Ongoing Supervision", description: "Continuous attendance monitoring, replacement management, and timely salary processing." }
      ]}
      whyUs={[
        { title: "Complete Compliance", desc: "We manage 100% PF, ESIC, statutory bonus, and labor law compliance with zero legal burden on clients." },
        { title: "Flexible Scaling", desc: "Easily increase or decrease team sizes with short notice periods to align with business demand." },
        { title: "Transparent Billing", desc: "Clear, itemized monthly invoices with documented attendance and statutory challans." }
      ]}
      faqs={[
        { q: "What is contract staffing and how does it work?", a: "In contract staffing, employees are hired on Stryper Solution's payroll and deployed at your company to work under your operational supervision, while we handle all salary and compliance tasks." },
        { q: "How are statutory compliances managed for contract staff?", a: "We manage all PF, ESIC, Professional Tax, TDS deductions, and labor law returns, providing monthly deposit challans to clients." },
        { q: "Can we convert a contract employee into a permanent employee?", a: "Yes, we support smooth temp-to-perm transitions based on mutual agreement after a specified contract duration." }
      ]}
      relatedServices={[
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "Manpower Consultancy", path: "/manpower" },
        { label: "HR Consultancy", path: "/hr-consultancy" },
        { label: "Corporate Hiring", path: "/corporate-hiring" }
      ]}
    />
  );
};

export default StaffingServicesPage;
