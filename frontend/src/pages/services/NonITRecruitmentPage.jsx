import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img3 from '@/assets/image/1.jpeg';

const NonITRecruitmentPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="Non-IT Recruitment Agency in Jaipur | Sales, Finance & BPO Hiring"
      seoDescription="Leading Non-IT recruitment agency in Jaipur. Expert hiring for sales, accounts, finance, HR, marketing, customer support, and operations across Rajasthan & India."
      seoKeywords="non IT recruitment agency Jaipur, sales recruitment agency Jaipur, accounts recruitment agency, HR recruitment services Jaipur, BPO recruitment agency Jaipur, non IT staffing Jaipur, placement consultancy in Jaipur, commercial hiring agency"
      canonicalPath="/non-it-recruitment"
      heroTitle="Non-IT Recruitment Agency in Jaipur"
      heroSubtitle="Reliable talent acquisition for sales, finance, accounts, human resources, customer service, and business operations."
      heroImage={img3}
      breadcrumbLabel="Non-IT Recruitment"
      introHeading="Comprehensive Non-Technical Staffing & Business Recruitment"
      introParagraph1="Stryper Solution Pvt Ltd is a premier Non-IT recruitment agency in Jaipur, specializing in finding commercial, operational, and managerial talent across retail, real estate, manufacturing, education, finance, and corporate sectors in Rajasthan and India."
      introParagraph2="We source qualified professionals for sales, business development, accounting, tax compliance, digital marketing, BPO, customer support, and administrative functions who deliver measurable business impact from day one."
      offerings={[
        {
          title: "Sales & Business Development",
          description: "Target-driven B2B/B2C sales executives, territory managers, business development leads, and inside sales specialists.",
          features: ["Proven sales track record check", "Negotiation & communication assessment", "Field vs desk sales alignment"]
        },
        {
          title: "Accounting, Finance & Tax",
          description: "Chartered Accountants, finance managers, GST compliance officers, Tally/SAP accountants, and billing clerks.",
          features: ["Statutory tax & GST knowledge check", "Accounting software validation", "Audit readiness experience"]
        },
        {
          title: "BPO & Customer Operations",
          description: "Customer care executives, technical support reps, voice & non-voice process associates, and team leads.",
          features: ["Language & voice screening", "Typing speed & accuracy testing", "Shift availability confirmation"]
        },
        {
          title: "Human Resources & Admin",
          description: "HR generalists, talent acquisition specialists, payroll officers, office administrators, and executive assistants.",
          features: ["Labor compliance understanding", "People management skills", "Recruitment domain background"]
        },
        {
          title: "Marketing & Digital Growth",
          description: "Digital marketing managers, performance marketing leads, SEO specialists, graphic designers, and content creators.",
          features: ["Portfolio & campaign reviews", "ROI-driven mindset evaluation", "Multi-channel advertising skills"]
        },
        {
          title: "Supply Chain & Operations",
          description: "Procurement specialists, supply chain planners, fleet managers, inventory controllers, and operations executives.",
          features: ["Vendor management expertise", "Cost optimization experience", "ERP system familiarity"]
        }
      ]}
      roles={[
        "Business Development Managers", "Senior Accountants", "GST & Tax Executives",
        "Telecalling & BPO Leads", "HR Generalists", "Digital Marketers",
        "Inside Sales Representatives", "Office Administrators", "Customer Support Associates",
        "Procurement Officers", "Billing Executives", "Operations Coordinators"
      ]}
      processSteps={[
        { title: "Job Profiling", description: "Documenting required target achievements, software expertise, language fluency, and experience levels." },
        { title: "Rigorous Screening", description: "Conducting communication interviews, trade skill evaluations, and reference background checks." },
        { title: "Interview Scheduling", description: "Coordinating face-to-face and virtual interview rounds directly with hiring managers." },
        { title: "Offer & Joining", description: "Facilitating compensation alignment, document collection, and onboarding confirmation." }
      ]}
      whyUs={[
        { title: "Extensive Local Candidate Pool", desc: "Thousands of active sales, finance, and operations candidates based in Jaipur and Rajasthan." },
        { title: "Fast-Track Shortlisting", desc: "Qualified and verified candidate profiles delivered within 48 hours for urgent openings." },
        { title: "Replacement Assurance", desc: "Structured replacement warranty ensuring long-term value and organizational continuity." }
      ]}
      faqs={[
        { q: "What roles are included under Non-IT recruitment in Jaipur?", a: "Non-IT recruitment covers sales, business development, accounting & finance, human resources, customer support, BPO, digital marketing, supply chain, and office administration." },
        { q: "How do you evaluate sales and accounting candidates?", a: "We verify past target achievements, conduct mock sales calls, and assess accounting candidates on GST, TDS, Tally, SAP, and financial reporting skills." },
        { q: "Can you manage high-volume bulk recruitment for customer support or sales?", a: "Yes, we regularly conduct mass recruitment drives capable of hiring 50+ candidates in short turnaround times." }
      ]}
      relatedServices={[
        { label: "IT Recruitment", path: "/it-recruitment" },
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "Corporate Hiring", path: "/corporate-hiring" },
        { label: "Staffing Agency", path: "/staffing" }
      ]}
    />
  );
};

export default NonITRecruitmentPage;
