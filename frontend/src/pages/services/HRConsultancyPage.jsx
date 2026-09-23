import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img2 from '@/assets/image/2.jpeg';

const HRConsultancyPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="HR Consultancy in Jaipur | Payroll & Compliance Services | Stryper Solution"
      seoDescription="Top HR consultancy in Jaipur. Providing end-to-end human resource solutions, statutory compliance (PF/ESIC/Labor Laws), payroll outsourcing, and HR advisory."
      seoKeywords="HR consultancy in Jaipur, HR consultancy Rajasthan, HR recruitment services Jaipur, HR consultancy for small businesses Jaipur, HR consultancy services, payroll compliance Jaipur, human resources consulting India"
      canonicalPath="/hr-consultancy"
      heroTitle="HR Consultancy in Jaipur"
      heroSubtitle="End-to-end human resource advisory, payroll management, statutory labor compliance, and talent strategy for modern enterprises."
      heroImage={img2}
      breadcrumbLabel="HR Consultancy"
      introHeading="Strategic HR Advisory, Payroll & Statutory Compliance"
      introParagraph1="Stryper Solution Pvt Ltd is a leading HR consultancy in Jaipur, empowering small, medium, and large businesses to build efficient workforce ecosystems, streamline payroll operations, and maintain 100% statutory labor compliance."
      introParagraph2="From designing employee handbooks and performance appraisal systems to managing complex Provident Fund (PF), ESIC, Professional Tax, and labor law audits, our experienced HR consultants handle the entire employee lifecycle."
      offerings={[
        {
          title: "Statutory Labor Compliance",
          description: "Complete management of Factories Act, Shops & Establishment Act, Minimum Wages, PF, ESIC, Bonus, Gratuity, and Maternity benefits.",
          features: ["Audit-ready statutory registers", "Monthly online return filings", "Labor inspectorate liaison support"]
        },
        {
          title: "Payroll Outsourcing & Processing",
          description: "Accurate, automated monthly payroll calculations, salary disbursements, tax deductions (TDS), pay-slip generation, and form 16 support.",
          features: ["100% on-time salary processing", "Custom attendance integration", "Confidential salary administration"]
        },
        {
          title: "HR Policy Design & Employee Handbooks",
          description: "Formulating compliant leave policies, POSH guidelines, code of conduct, remote work rules, and standardized employment contracts.",
          features: ["Legally sound documentation", "Customized for industry norms", "Employee onboarding kits"]
        },
        {
          title: "Performance Management Systems (PMS)",
          description: "Designing OKR and KPI frameworks, annual appraisal cycles, 360-degree reviews, and incentive structures that motivate high performance.",
          features: ["Goal tracking frameworks", "Appraisal scorecard design", "Promotion & increment guidelines"]
        },
        {
          title: "HR Audit & Risk Assessment",
          description: "Comprehensive audits of employment contracts, wage records, safety registers, and HR processes to eliminate compliance penalties.",
          features: ["Gap identification report", "Corrective action roadmap", "Labor law risk mitigation"]
        },
        {
          title: "SME & Startup HR Setup",
          description: "Fractional / Virtual HR management for emerging businesses seeking professional HR infrastructure without full-time department costs.",
          features: ["Affordable monthly retainer", "Dedicated HR account manager", "End-to-end employee support"]
        }
      ]}
      roles={[
        "Chief Human Resources Officers", "HR Business Partners (HRBP)", "Statutory Compliance Officers",
        "Payroll Managers", "Employee Relations Leads", "Training & Development Heads",
        "Talent Acquisition Specialists", "POSH Committee Advisors", "Compensation & Benefits Analysts",
        "HR Operations Specialists", "HR Generalists", "Admin Coordinators"
      ]}
      processSteps={[
        { title: "HR Health Check", description: "Evaluating current HR operations, employment contracts, payroll systems, and statutory registers." },
        { title: "Custom Solution Design", description: "Creating tailored policies, compliance workflows, and payroll automation suited for your business." },
        { title: "Implementation & Training", description: "Deploying standardized processes, employee handbooks, and briefing management teams." },
        { title: "Ongoing Advisory & Audits", description: "Monthly compliance filing, payroll management, and periodic compliance health checks." }
      ]}
      whyUs={[
        { title: "100% Audit Compliance", desc: "Zero penalties and flawless track record with labor authorities, PF commissioners, and ESIC inspectors." },
        { title: "Cost Savings for Businesses", desc: "Outsourced HR reduces internal overhead costs by up to 60% compared to managing full in-house HR teams." },
        { title: "Local Jaipur & Pan-India Expertise", desc: "Deep understanding of Rajasthan State labor notifications as well as Central Government labor codes." }
      ]}
      faqs={[
        { q: "Why should a business in Jaipur outsource HR and compliance to Stryper Solution?", a: "Outsourcing ensures strict compliance with labor laws, eliminates penalties, reduces overhead costs, and allows business owners to focus on core operations." },
        { q: "What statutory compliances are covered under your HR consultancy services?", a: "We cover PF, ESIC, Professional Tax, Minimum Wages Act, Payment of Bonus Act, Gratuity Act, Maternity Benefit Act, POSH, and Shops & Establishments registrations." },
        { q: "Do you provide fractional / virtual HR services for small businesses and startups in Jaipur?", a: "Yes, we offer tailored fractional HR retainers designed specifically for startups and growing SMEs." }
      ]}
      relatedServices={[
        { label: "Payroll & Compliance", path: "/services/payroll-compliance" },
        { label: "Staffing Agency", path: "/staffing" },
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "Corporate Hiring", path: "/corporate-hiring" }
      ]}
    />
  );
};

export default HRConsultancyPage;
