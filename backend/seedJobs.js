require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/user.model");
const CompanyProfile = require("./src/models/companyProfile.model");
const Job = require("./src/models/job.model");
const connectDB = require("./src/config/db");

const jobsToSeed = [
  {
    title: "Furniture Designer",
    department: "Design & Creative",
    description: "We are seeking a talented Furniture Designer to create functional, aesthetically pleasing, and ergonomic furniture designs. The ideal candidate will have strong knowledge of materials, manufacturing processes, and design software.",
    requirements: [
      "Bachelor's degree in Furniture Design, Product Design, or a related field.",
      "Proven experience as a Furniture Designer or similar role.",
      "Proficiency in CAD, SolidWorks, Rhino, or other 3D modeling software.",
      "Strong understanding of manufacturing, materials (wood, metal, plastic), and construction methods."
    ],
    responsibilities: [
      "Create detailed sketches, 3D models, and technical drawings for new furniture pieces.",
      "Collaborate with production teams to ensure design feasibility and cost efficiency.",
      "Select appropriate materials, finishes, and hardware for designs.",
      "Research market trends, consumer needs, and competitor products."
    ],
    employmentType: "Full-time",
    salaryMin: 400000,
    salaryMax: 800000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "2-5 Years",
    workMode: "On-site",
    skills: ["AutoCAD", "SolidWorks", "3D Modeling", "Sketching", "Furniture Design", "Material Knowledge"],
    openings: 2,
    isStryper: true,
    status: "Active"
  },
  {
    title: "Admin Executive",
    department: "Administration",
    description: "We are looking for an Admin Executive to manage our daily office operations and perform administrative tasks. Your role is to ensure our office runs smoothly, support staff, and handle facility management.",
    requirements: [
      "Bachelor's degree in Business Administration or related field.",
      "Proven experience as an Admin Executive, Office Administrator, or similar role.",
      "Superb organizational and time management skills.",
      "Excellent written and verbal communication skills."
    ],
    responsibilities: [
      "Manage office supplies stock, vendor relationships, and place orders.",
      "Coordinate office activities and operations to secure efficiency.",
      "Maintain office cleanliness, facilities management, and handle front-desk duties.",
      "Assist in travel bookings, scheduling meetings, and guest hospitality."
    ],
    employmentType: "Full-time",
    salaryMin: 300000,
    salaryMax: 500000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "1-3 Years",
    workMode: "On-site",
    skills: ["Office Administration", "Facility Management", "MS Office", "Vendor Management", "Communication"],
    openings: 1,
    isStryper: true,
    status: "Active"
  },
  {
    title: "Purchase Executive",
    department: "Procurement & Supply Chain",
    description: "We are hiring a Purchase Executive to manage our company's procurement activities. You will be responsible for sourcing goods, negotiating prices, tracking shipments, and maintaining inventory levels.",
    requirements: [
      "Bachelor's degree in Supply Chain Management, Business, or related field.",
      "Proven working experience as a Purchase Executive or Procurement Officer.",
      "Strong negotiation and networking skills.",
      "Familiarity with sourcing and vendor management."
    ],
    responsibilities: [
      "Research potential vendors, compare prices, and negotiate purchasing terms.",
      "Track orders, manage shipping logs, and ensure timely delivery of goods.",
      "Inspect the quality of purchased products and resolve discrepancies.",
      "Maintain updated records of invoices, contracts, and inventory."
    ],
    employmentType: "Full-time",
    salaryMin: 350000,
    salaryMax: 600000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "2-4 Years",
    workMode: "On-site",
    skills: ["Procurement", "Negotiation", "Vendor Management", "Sourcing", "Inventory Control", "Invoicing"],
    openings: 1,
    isStryper: true,
    status: "Active"
  },
  {
    title: "Account Executive",
    department: "Finance & Accounts",
    description: "We are looking for an Account Executive to manage our financial transactions, bookkeeping, and tax compliance. You will help keep our financial operations transparent and compliant.",
    requirements: [
      "Bachelor's degree in Commerce (B.Com), Accounting, or Finance.",
      "Proven experience as an Account Executive, Accountant, or bookkeeper.",
      "Hands-on experience with Tally, QuickBooks, or similar accounting software.",
      "Knowledge of GST, TDS, and other Indian tax regulations."
    ],
    responsibilities: [
      "Manage daily accounts transactions, payments, and receipts.",
      "Prepare and file GST, TDS returns, and handle tax audits.",
      "Perform monthly bank reconciliation and assist in preparing balance sheets.",
      "Manage employee payroll and expense reimbursements."
    ],
    employmentType: "Full-time",
    salaryMin: 400000,
    salaryMax: 700000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "2-5 Years",
    workMode: "On-site",
    skills: ["Tally Prime", "Bookkeeping", "GST Filing", "TDS Compliance", "MS Excel", "Financial Reporting"],
    openings: 1,
    isStryper: true,
    status: "Active"
  },
  {
    title: "Multi Skill Technician",
    department: "Maintenance & Facilities",
    description: "We are seeking a reliable Multi Skill Technician to handle general facility maintenance, including electrical, plumbing, carpentry, and HVAC systems. You will ensure safe and functional operations within the workspace.",
    requirements: [
      "ITI Certificate or Diploma in Electrical, Mechanical, or relevant technical field.",
      "Proven experience as a multi-skilled technician or maintenance staff.",
      "Broad knowledge of electrical wiring, plumbing, and HVAC systems.",
      "Ability to troubleshoot technical problems and work independently."
    ],
    responsibilities: [
      "Perform routine maintenance checks and repairs across all facility systems.",
      "Diagnose and fix electrical faults, plumbing leaks, and structural damages.",
      "Respond quickly to maintenance requests and emergency facility issues.",
      "Ensure compliance with safety standards and maintain equipment logs."
    ],
    employmentType: "Full-time",
    salaryMin: 250000,
    salaryMax: 400000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "2-5 Years",
    workMode: "On-site",
    skills: ["Electrical Maintenance", "Plumbing", "HVAC Repairs", "Troubleshooting", "Carpentry", "Safety Compliance"],
    openings: 2,
    isStryper: true,
    status: "Active"
  },
  {
    title: "Graphics Designer",
    department: "Design & Creative",
    description: "We are looking for a creative Graphics Designer to design digital and print materials. You will shape the visual aspects of websites, product packaging, social media graphics, and corporate branding.",
    requirements: [
      "Degree or Diploma in Graphic Design, Fine Arts, or related field.",
      "A strong portfolio of graphic design work.",
      "Proficiency in Adobe Creative Suite (Photoshop, Illustrator, InDesign).",
      "Good eye for aesthetics, layout, typography, and detail."
    ],
    responsibilities: [
      "Conceptualize visuals based on design requirements and branding guidelines.",
      "Prepare rough drafts and present creative ideas to management.",
      "Design social media creatives, brochures, banners, logos, and print layouts.",
      "Amend designs after feedback and ensure high-quality output."
    ],
    employmentType: "Full-time",
    salaryMin: 350000,
    salaryMax: 650000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "1-4 Years",
    workMode: "Hybrid",
    skills: ["Photoshop", "Illustrator", "InDesign", "Typography", "Branding", "Creative Design"],
    openings: 1,
    isStryper: true,
    status: "Active"
  },
  {
    title: "Guest Handling",
    department: "Front Office & Hospitality",
    description: "We are looking for a professional Guest Handling & Front Desk officer to manage guest relations, reception, and hospitality duties. You will represent our brand as the first point of contact for clients, candidates, and visitors.",
    requirements: [
      "Diploma or degree in Hospitality Management, Front Office, or related field.",
      "Proven experience in front desk, reception, or guest relations.",
      "Warm personality, professional appearance, and outstanding telephone etiquette.",
      "Excellent fluency in English and Hindi."
    ],
    responsibilities: [
      "Greet and welcome guests warmly upon arrival, ensuring their comfort.",
      "Answer incoming phone calls, redirect inquiries, and take detailed messages.",
      "Manage the reception area, coordinate incoming/outgoing mail, and track visitor logs.",
      "Provide hospitality support for corporate meetings and VIP arrivals."
    ],
    employmentType: "Full-time",
    salaryMin: 280000,
    salaryMax: 450000,
    salaryCurrency: "INR",
    location: "Noida, Uttar Pradesh",
    experience: "1-3 Years",
    workMode: "On-site",
    skills: ["Guest Relations", "Reception Duties", "Communication Skills", "Hospitality", "Telephone Etiquette", "Problem Solving"],
    openings: 1,
    isStryper: true,
    status: "Active"
  }
];

const seed = async () => {
  try {
    await connectDB();

    console.log("Checking for admin user...");
    let adminUser = await User.findOne({ role: "ADMIN" });

    if (!adminUser) {
      console.log("No ADMIN user found. Creating a default ADMIN user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = await User.create({
        email: "admin@stryper.com",
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
        fullName: "Stryper Admin",
        accountStatus: "Active"
      });
      console.log("Default ADMIN user created (admin@stryper.com / admin123)");
    } else {
      console.log(`Found existing ADMIN user: ${adminUser.email}`);
    }

    console.log("Checking for Stryper Solution company profile...");
    let companyProfile = await CompanyProfile.findOne({ userId: adminUser._id });

    if (!companyProfile) {
      console.log("Creating default CompanyProfile for Stryper Solution...");
      companyProfile = await CompanyProfile.create({
        userId: adminUser._id,
        companyName: "Stryper Solution",
        industry: "Human Resources & Recruiting",
        companySize: "50-200",
        companyDescription: "Stryper Solution is a premium hiring and recruitment partner specializing in placement, staffing, and internal executive searches.",
        email: "hr@strypersolution.com",
        phone: "+91-9876543210",
        location: "Noida, Uttar Pradesh",
        isVerifiedCompany: true,
        isStryperPartner: true
      });
      console.log("Stryper Solution CompanyProfile created successfully.");
    } else {
      console.log("Stryper CompanyProfile already exists. Updating its name to Stryper Solution...");
      companyProfile.companyName = "Stryper Solution";
      await companyProfile.save();
    }

    console.log("Inserting the 7 LinkedIn internal hiring jobs...");
    let addedCount = 0;
    for (const jobData of jobsToSeed) {
      // Check if job with this title and companyId already exists to avoid duplicates
      const exists = await Job.findOne({ title: jobData.title, companyId: companyProfile._id, isStryper: true });
      if (!exists) {
        await Job.create({
          ...jobData,
          companyId: companyProfile._id,
          postedBy: adminUser._id
        });
        console.log(`Added job: ${jobData.title}`);
        addedCount++;
      } else {
        console.log(`Job already exists: ${jobData.title}`);
      }
    }

    console.log(`Seed completed successfully! Added ${addedCount} new jobs.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
