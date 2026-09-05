require("dotenv").config();
const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  console.warn("DNS override failed:", e.message);
}

const mongoose = require("mongoose");
mongoose.set("bufferCommands", false);
const bcrypt = require("bcryptjs");

const connectDB = require("./src/config/db");
const User = require("./src/models/user.model");
const Project = require("./src/models/project.model");
const Blog = require("./src/models/blog.model");
const Testimonial = require("./src/models/testimonial.model");
const Gallery = require("./src/models/gallery.model");
const Inquiry = require("./src/models/inquiry.model");
const SystemSettings = require("./src/models/systemSettings.model");

const DEFAULT_PROJECTS = [
  {
    slug: 'luxury-villa',
    title: 'Luxury Villa Restoration',
    location: 'Jaipur',
    category: 'Residential',
    client: 'Singhal Family',
    area: '12,500 sq.ft.',
    duration: '14 Months',
    description: 'A complete architectural and interior transformation of a sprawling private estate, combining traditional Rajasthani elements with ultra-modern luxury amenities.',
    features: ['Custom Italian Marble Flooring', 'Smart Home Automation', 'Bespoke Joinery', 'Landscape Integration'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'minimalist-apartment',
    title: 'Minimalist Penthouse',
    location: 'Delhi NCR',
    category: 'Residential',
    client: 'Kapoor Residence',
    area: '4,200 sq.ft.',
    duration: '5 Months',
    description: 'A sleek, minimalist approach to high-rise living. This project focused on maximizing natural light, clean lines, and integrated storage solutions.',
    features: ['Concealed Storage', 'Minimalist Lighting', 'Neutral Color Palette', 'High-end Fixtures'],
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'heritage-hotel-fit-out',
    title: 'Heritage Palace Fit-out',
    location: 'Udaipur',
    category: 'Hospitality',
    client: 'Mewar Palace Resorts',
    area: '80,000 sq.ft.',
    duration: '22 Months',
    description: 'A sensitive yet extensive restoration and fit-out of a historic property, ensuring modern structural integrity while preserving its royal heritage.',
    features: ['Structural Reinforcement', 'Heritage Conservation', 'Luxury Suite Fit-outs', 'Custom Brass Fabrication'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'royal-boutique-hotel',
    title: 'Royal Boutique Hotel',
    location: 'Jodhpur',
    category: 'Hospitality',
    client: 'Desert Palms Group',
    area: '35,000 sq.ft.',
    duration: '12 Months',
    description: 'A premium boutique hotel featuring high-end modular fittings, carved wooden screens, and contemporary brass claddings.',
    features: ['Traditional Jali Partitions', 'Royal Suite Wood Joinery', 'Designer LED Mirrors', 'All-weather Outdoor Lounge'],
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'modern-it-office',
    title: 'Smart Tech Workstations',
    location: 'Gurugram',
    category: 'Commercial',
    client: 'InnoTech Solutions',
    area: '45,000 sq.ft.',
    duration: '8 Months',
    description: 'A highly functional and agile workspace designed for a leading technology firm, fostering collaboration and productivity through open-plan layouts and ergonomic design.',
    features: ['Acoustic Meeting Pods', 'Ergonomic Workstations', 'Biophilic Design Elements', 'Advanced HVAC Systems'],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'premium-banquet-hall',
    title: 'Grand Crystal Banquet',
    location: 'Jaipur',
    category: 'Commercial',
    client: 'Nirala Events',
    area: '25,000 sq.ft.',
    duration: '9 Months',
    description: 'A grand commercial space engineered for large-scale events, featuring advanced acoustic treatments, dynamic lighting rigs, and opulent finishes.',
    features: ['Crystal Chandeliers', 'Acoustic Wall Paneling', 'Heavy-duty HVAC', 'Commercial Kitchen Setup'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'industrial-plant-fit-out',
    title: 'Heavy Machining Center',
    location: 'Neemrana',
    category: 'Infrastructure',
    client: 'IndoAuto Components',
    area: '120,000 sq.ft.',
    duration: '18 Months',
    description: 'A heavy-duty industrial infrastructure project requiring precise fabrication, specialized flooring, and robust structural planning.',
    features: ['Epoxy Industrial Flooring', 'Heavy Machinery Foundations', 'Steel Fabrication', 'Safety Compliance Implementation'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  },
  {
    slug: 'peb-logistics-shed',
    title: 'PEB Structural Warehouse',
    location: 'Bhiwadi',
    category: 'Infrastructure',
    client: 'Stellar Warehousing',
    area: '85,000 sq.ft.',
    duration: '10 Months',
    description: 'A high-span pre-engineered building shed built for large-scale logistics operations. Completed with high wind load planning and certified quality control.',
    features: ['PEB Steel Portal Frames', 'Double-lock Standing Seam Roof', 'High-density Epoxy Flooring', 'Fire Hydrant Infrastructure'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000&auto=format&fit=crop',
    status: 'Active'
  }
];

const DEFAULT_TESTIMONIALS = [
  {
    name: 'Vikram Malhotra',
    role: 'CEO, Malhotra Infra',
    text: 'Stryper handled our corporate office fit-out in Mumbai with extreme professionalism. Their site execution is unmatched in the industry.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    rating: 5
  },
  {
    name: 'Ananya Iyer',
    role: 'Principal Architect, AI Design',
    text: 'Collaborating with Stryper on luxury residential projects in Bangalore has been a pleasure. Their attention to material quality is top-tier.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop',
    rating: 5
  },
  {
    name: 'Siddharth Saxena',
    role: 'MD, Saxena Hospitality',
    text: 'The infrastructure execution for our resort in Alibaug was delivered ahead of schedule. Truly a partner you can trust for large-scale sites.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop',
    rating: 5
  },
  {
    name: 'Meera Deshmukh',
    role: 'Homeowner, Jaipur',
    text: 'Their modular kitchen and wardrobe team changed our home completely. High quality materials, excellent fit, and very polite installation staff.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&h=200&auto=format&fit=crop',
    rating: 5
  },
  {
    name: 'Rajesh Kumar',
    role: 'VP Operations, Neemrana Logistics',
    text: 'Stryper fabricated our 80,000 sq ft PEB shed in record time. Incredible accuracy and structural safety compliance.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop',
    rating: 5
  }
];

const DEFAULT_BLOGS = [
  {
    slug: 'modular-kitchen-trends-2026',
    title: 'Modular Kitchen Trends for 2026',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?q=80&w=2000&auto=format&fit=crop',
    author: 'Sunidhi Rawat (Lead Architect)',
    readTime: '5 Min Read',
    content: 'Kitchens are no longer just utilitarian spaces. In 2026, the trend shifts towards seamless integrations, anti-fingerprint textures, smart sensory LED lighting, and L-shaped profiles. German soft-close drawers and Italian quartz countertops not only enhances durability but adds a timeless prestige to your home.',
    status: 'Active'
  },
  {
    slug: 'benefits-peb-industrial-sheds',
    title: 'The Economic & Structural Benefits of PEB Sheds',
    category: 'Infrastructure',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2000&auto=format&fit=crop',
    author: 'Vikramjit Singh (Structural Specialist)',
    readTime: '7 Min Read',
    content: 'Pre-Engineered Buildings (PEB) have revolutionized industrial infrastructure. With high-tensile steel frames manufactured off-site, they offer quick erection, cost predictability, and superior seismic resistance. From manufacturing plants to cargo warehouses, PEB structures maximize clear-span layouts, giving operational freedom without column obstructions.',
    status: 'Active'
  },
  {
    slug: 'office-acoustics-workplace-efficiency',
    title: 'Acoustics & Lighting in Modern Office Design',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2000&auto=format&fit=crop',
    author: 'Amitabh Sharma (Corporate Consultant)',
    readTime: '6 Min Read',
    content: 'Open office layouts improve communication but often raise noise levels. By introducing WPC acoustic wall panels, floating fabric baffles, and linear cluster desks, companies can design a highly productive, low-noise environment. Coupled with human-centric lighting, this layout reduces stress and fatigue for high-performing tech teams.',
    status: 'Active'
  }
];

const DEFAULT_INQUIRIES = [
  {
    name: 'Yashika Kanwar',
    email: 'yashika@myproject.com',
    phone: '+91 98765 43210',
    service: 'Full Home Interior',
    message: 'Looking to renovate a 4 BHK villa in Vaishali Nagar, Jaipur. Need smart wardrobes and a premium kitchen.',
    status: 'new'
  },
  {
    name: 'Rahul Chhabra',
    email: 'rahul@chhabralogistics.com',
    phone: '+91 99999 88888',
    service: 'Industrial Fabrication',
    message: 'Need estimation for a PEB industrial warehouse of 50,000 sq ft near Bhiwadi industrial area.',
    status: 'new'
  }
];

const DEFAULT_GALLERY = [
  { title: "Jaipur Villa Lounge", category: "Residential", image: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?q=80&w=600" },
  { title: "Bhiwadi Assembly Floor", category: "Infrastructure", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600" },
  { title: "Smart Office Reception", category: "Commercial", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600" },
  { title: "Heritage Suite Terrace", category: "Hospitality", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600" }
];

const seed = async () => {
  try {
    await connectDB();

    // 1. Admin User
    let admin = await User.findOne({ role: "ADMIN" });
    if (!admin) {
      const password = process.env.ADMIN_PASSWORD || "infra@@2026";
      const hashed = await bcrypt.hash(password, 10);
      admin = await User.create({
        email: "admin@stryper.com",
        password: hashed,
        role: "ADMIN",
        fullName: "Stryper Admin",
        accountStatus: "Active",
        isVerified: true
      });
      console.log("Admin seeded.");
    }

    // 2. Projects
    for (const proj of DEFAULT_PROJECTS) {
      const exists = await Project.findOne({ slug: proj.slug });
      if (!exists) {
        await Project.create(proj);
        console.log(`Seeded project: ${proj.title}`);
      }
    }

    // 3. Testimonials
    for (const test of DEFAULT_TESTIMONIALS) {
      const exists = await Testimonial.findOne({ name: test.name });
      if (!exists) {
        await Testimonial.create(test);
        console.log(`Seeded testimonial: ${test.name}`);
      }
    }

    // 4. Blogs
    for (const blog of DEFAULT_BLOGS) {
      const exists = await Blog.findOne({ slug: blog.slug });
      if (!exists) {
        await Blog.create(blog);
        console.log(`Seeded blog: ${blog.title}`);
      }
    }

    // 5. Inquiries
    for (const inq of DEFAULT_INQUIRIES) {
      const exists = await Inquiry.findOne({ email: inq.email, message: inq.message });
      if (!exists) {
        await Inquiry.create(inq);
        console.log(`Seeded inquiry from: ${inq.name}`);
      }
    }

    // 6. Gallery
    for (const gal of DEFAULT_GALLERY) {
      const exists = await Gallery.findOne({ title: gal.title });
      if (!exists) {
        await Gallery.create(gal);
        console.log(`Seeded gallery item: ${gal.title}`);
      }
    }

    // 7. Settings
    let settings = await SystemSettings.findOne();
    if (!settings) {
      await SystemSettings.create({
        phone: "+91 9565310410",
        email: "recruiter@strypersolution.com",
        address: "Pan India Projects",
        whatsapp: "918448590303",
        est: "2010",
        website: "www.stryperinteriorandinfra.com"
      });
      console.log("Seeded system settings.");
    }

    console.log("All Stryper collections seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seed();
