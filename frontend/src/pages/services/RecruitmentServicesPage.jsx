import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img2 from '@/assets/image/2.jpeg';

const RecruitmentServicesPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="Recruitment Services in Jaipur | Stryper Solution Pvt Ltd"
      seoDescription="Top recruitment services in Jaipur by Stryper Solution Pvt Ltd. Providing corporate recruitment, permanent & contract staffing, and executive hiring across Rajasthan & India."
      seoKeywords="recruitment services in Jaipur, corporate recruitment agency, employee recruitment services, professional recruitment services, recruitment company in Jaipur, hiring agency in Jaipur, recruitment partner for businesses, bulk recruitment services in Jaipur, talent acquisition services"
      canonicalPath="/recruitment-services"
      heroTitle="Recruitment Services in Jaipur"
      heroSubtitle="End-to-end talent acquisition, executive search, and workforce hiring solutions customized for enterprises and fast-growing startups."
      heroImage={img2}
      breadcrumbLabel="Recruitment Services"
      introHeading="Comprehensive Corporate Recruitment & Talent Acquisition"
      introParagraph1="Stryper Solution Pvt Ltd is a premier recruitment agency and placement consultancy in Jaipur, delivering end-to-end hiring solutions for organizations across Rajasthan, Delhi NCR, and India. We connect leading enterprises with pre-vetted, high-caliber professionals."
      introParagraph2="Whether you need permanent employees, temporary project talent, executive leadership, or high-volume bulk recruitment, our experienced recruitment consultants handle candidate sourcing, multi-stage screening, and onboarding support with speed and precision."
      offerings={[
        {
          title: "Permanent Recruitment",
          description: "Full-lifecycle hiring for full-time core roles with guaranteed fitment, domain expertise, and retention-focused screening.",
          features: ["Rigorous technical & behavioral screening", "Background & document verification", "Replacement guarantee policy"]
        },
        {
          title: "Contract & Temporary Staffing",
          description: "Flexible workforce deployment for seasonal surges, project deadlines, or specialized short-term technical assignments.",
          features: ["Rapid 48-72h turnaround", "Payroll & statutory compliance handled", "Seamless scaling up or down"]
        },
        {
          title: "Executive Search & Leadership",
          description: "Discreet, high-touch headhunting for C-suite executives, directors, VP-level leaders, and specialized departmental heads.",
          features: ["Confidential market mapping", "Leadership assessment", "Extensive industry network"]
        },
        {
          title: "Bulk & Campus Hiring",
          description: "Large-scale recruitment drives for retail, manufacturing, logistics, and customer support with structured assessment pipelines.",
          features: ["Customized assessment tests", "Mass interview coordination", "Accelerated batch onboarding"]
        },
        {
          title: "Recruitment Process Outsourcing (RPO)",
          description: "Complete or partial outsourcing of your internal hiring operations with dedicated account managers and talent pipelines.",
          features: ["Reduced cost-per-hire", "Enhanced candidate experience", "Scalable recruitment infrastructure"]
        },
        {
          title: "Fresher & Entry-Level Placement",
          description: "Connecting fresh graduates and diploma holders from top institutes with entry-level opportunities across diverse industries.",
          features: ["Foundational skill evaluation", "Soft-skills readiness check", "Immediate availability"]
        }
      ]}
      roles={[
        "Software Developers", "HR Managers", "Sales Executives", "Accountants",
        "Operations Managers", "Civil Engineers", "Mechanical Technicians",
        "Marketing Specialists", "Customer Support Leads", "Logistics Supervisors",
        "Plant In-charges", "Quality Analysts"
      ]}
      processSteps={[
        { title: "Requirement Gathering", description: "Deep dive into job descriptions, skill requirements, cultural fit, and budget." },
        { title: "Sourcing & Screening", description: "Multi-channel candidate identification, resume shortlisting, and initial interviews." },
        { title: "Client Interviews", description: "Presenting pre-assessed top profiles and coordinating direct client evaluations." },
        { title: "Offer & Onboarding", description: "Assisting with salary negotiations, document verification, and smooth onboarding." }
      ]}
      whyUs={[
        { title: "Jaipur & Pan-India Reach", desc: "Strong local roots in Jaipur and Rajasthan backed by Pan-India talent search capabilities." },
        { title: "48-72 Hours Turnaround", desc: "Shortlisted profiles delivered within 48 to 72 hours for critical operational and business roles." },
        { title: "100% Statutory Compliance", desc: "Full adherence to labor laws, PF, ESI, minimum wage guidelines, and employment contracts." }
      ]}
      faqs={[
        { q: "What industries do you provide recruitment services for in Jaipur?", a: "Stryper Solution provides recruitment across IT, Non-IT, Manufacturing, Logistics, Warehousing, Hospitality, Construction, Accounts, BPO, and Corporate sectors." },
        { q: "How quickly can you provide candidate profiles for an open position?", a: "For standard operational and corporate roles, we share shortlisted candidates within 48 to 72 hours of receiving the job description." },
        { q: "Do you offer candidate replacement guarantee?", a: "Yes, we provide standard replacement support as per agreed service level agreements (SLAs) if a candidate leaves within the initial probation window." }
      ]}
      relatedServices={[
        { label: "Staffing Agency", path: "/staffing" },
        { label: "Manpower Consultancy", path: "/manpower" },
        { label: "IT Recruitment", path: "/it-recruitment" },
        { label: "Corporate Hiring", path: "/corporate-hiring" }
      ]}
    />
  );
};

export default RecruitmentServicesPage;
