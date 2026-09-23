import React from 'react';
import ServiceLandingTemplate from '@/components/shared/ServiceLandingTemplate';
import img1 from '@/assets/image/1.jpeg';

const ITRecruitmentPage = () => {
  return (
    <ServiceLandingTemplate
      seoTitle="IT Recruitment Agency in Jaipur | Tech & Software Developer Hiring"
      seoDescription="Top IT recruitment agency in Jaipur. Specialized technical hiring for full-stack developers, software engineers, DevOps, QA, and IT leaders across India."
      seoKeywords="IT recruitment agency Jaipur, technical recruitment agency Jaipur, software developer hiring Jaipur, IT staffing agency Jaipur, tech recruiters Rajasthan, IT talent acquisition Jaipur, IT recruitment consultancy"
      canonicalPath="/it-recruitment"
      heroTitle="IT Recruitment Agency in Jaipur"
      heroSubtitle="Specialized technical talent acquisition for high-growth tech companies, software consultancies, and digital enterprises."
      heroImage={img1}
      breadcrumbLabel="IT Recruitment"
      introHeading="Connecting Top Tech Talent with Growing Companies"
      introParagraph1="Stryper Solution Pvt Ltd is a premier IT recruitment agency in Jaipur, bridging the gap between innovative software enterprises and top-tier engineering talent. We understand modern tech stacks, coding frameworks, and specialized skill requirements."
      introParagraph2="From front-end and back-end engineers to cloud architects, AI/ML developers, and VP-level engineering leadership, our technical recruitment team screens candidates on code quality, problem-solving, and domain fitment."
      offerings={[
        {
          title: "Full-Stack & Web Developers",
          description: "Proficient engineers experienced in React, Next.js, Node.js, Python, Java, .NET, Angular, Vue, PHP, and modern microservices.",
          features: ["Hands-on coding assessment", "Framework expertise validation", "Clean architecture experience"]
        },
        {
          title: "Mobile App Developers",
          description: "Skilled iOS, Android, Flutter, and React Native engineers with proven track records in scalable consumer and enterprise applications.",
          features: ["Native & cross-platform proficiency", "API integration mastery", "App Store deployment experience"]
        },
        {
          title: "Cloud & DevOps Engineers",
          description: "Infrastructure architects and DevOps specialists proficient in AWS, Azure, GCP, Docker, Kubernetes, CI/CD, and Terraform.",
          features: ["Cloud security compliance", "Automation pipeline mastery", "Cost-effective infra scaling"]
        },
        {
          title: "QA & Test Automation",
          description: "Manual testers and automation engineers skilled in Selenium, Cypress, Playwright, Jest, Appium, and performance testing.",
          features: ["Bug tracking excellence", "End-to-end test suites", "Agile release readiness"]
        },
        {
          title: "Data Science & AI/ML",
          description: "Data engineers, ML specialists, BI analysts, and NLP developers working with Python, TensorFlow, PyTorch, SQL, and Power BI.",
          features: ["Statistical modeling expertise", "Data pipeline architecture", "Predictive analytics focus"]
        },
        {
          title: "Engineering Leadership",
          description: "CTOs, Engineering Managers, Product Managers, and Tech Leads with proven experience leading distributed software teams.",
          features: ["Technical roadmap leadership", "Team mentoring track record", "System design mastery"]
        }
      ]}
      roles={[
        "React / Next.js Developers", "Node.js / Python Backend Engineers", "Java / Spring Boot Developers",
        "DevOps & Cloud Engineers", "QA Automation Engineers", "Data Engineers",
        "Flutter / React Native Developers", "UI/UX Designers", "Technical Project Managers",
        "Database Administrators", "Cybersecurity Analysts", "Solutions Architects"
      ]}
      processSteps={[
        { title: "Technical Scope Alignment", description: "Analyzing required tech stack, seniority, architectural complexity, and culture fit." },
        { title: "Code & Skill Vetting", description: "Reviewing GitHub repositories, technical credentials, problem-solving ability, and communication." },
        { title: "Client Interviews", description: "Direct technical rounds with your engineering leads, supported by our interview coordination." },
        { title: "Offer & Notice Buyout", description: "Managing notice period tracking, counter-offer mitigation, and smooth joining support." }
      ]}
      whyUs={[
        { title: "Deep Tech Domain Insight", desc: "Our tech recruiters understand programming languages, frameworks, and engineering nuances." },
        { title: "High Offer-to-Join Ratio", desc: "Proactive candidate engagement that minimizes last-minute dropouts and counter-offer risks." },
        { title: "Pre-Screened Talent Network", desc: "Immediate access to passive and active software professionals across Jaipur and India." }
      ]}
      faqs={[
        { q: "What IT technologies and roles do you recruit for in Jaipur?", a: "We recruit for full-stack developers (MERN, Python, Java, .NET), mobile app developers (Flutter, React Native, iOS, Android), DevOps/Cloud architects (AWS, Azure), QA automation, Data Science, and UI/UX designers." },
        { q: "How do you evaluate candidates' technical skills?", a: "We evaluate candidates based on their portfolio/GitHub projects, live coding proficiency, architectural fundamentals, and real-world system design knowledge." },
        { q: "Can you help hire remote developers across India?", a: "Yes, we support on-site, hybrid, and 100% remote developer hiring across India." }
      ]}
      relatedServices={[
        { label: "Non-IT Recruitment", path: "/non-it-recruitment" },
        { label: "Recruitment Services", path: "/recruitment-services" },
        { label: "Corporate Hiring", path: "/corporate-hiring" },
        { label: "Staffing Agency", path: "/staffing" }
      ]}
    />
  );
};

export default ITRecruitmentPage;
