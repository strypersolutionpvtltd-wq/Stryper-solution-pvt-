import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageHero from '@/components/shared/PageHero';
import img4 from '@/assets/image/4.jpeg';
import { fadeInUp, fadeInRight, staggerContainer, viewportOnce } from '@/utils/animations';

const P = '#8B3A8F';
const G = '#F5A623';

function Chk() {
  return (<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l2.5 2.5 5.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>);
}

const JOBS = [
  { id:1, title:'Business Development Executive (BDE)', location:'Gurugram, HR', type:'Full-Time', exp:'1-3 yrs', desc:'Drive business growth by identifying new clients, building relationships, and pitching Stryper staffing solutions. Walk-in interviews at Sector 62, Gurugram.' },
  { id:2, title:'Admin Executive',                      location:'Jaipur, RJ',   type:'Full-Time', exp:'1-2 yrs', desc:'Handle office tasks, manage phone calls & emails, coordinate meetings, maintain office supplies, and support management with administrative tasks.' },
  { id:3, title:'Client Handling Executive',            location:'Pune, MH',     type:'Full-Time', exp:'0-1 yr',  desc:'Freshers welcome. Communicate with clients, manage queries via email/phone/chat, maintain client relationships, and ensure timely service delivery.' },
  { id:4, title:'Guest Handling Executive',             location:'Lucknow / Pune / Jaipur', type:'Full-Time', exp:'0-2 yrs', desc:'Greet and welcome guests professionally, handle inquiries, assist with check-in/check-out, manage reservations, and maintain a customer-focused attitude.' },
  { id:5, title:'Multi-Skilled Technician',             location:'Lucknow / Pune', type:'Full-Time', exp:'1-3 yrs', desc:'Perform maintenance, repair & installation tasks. Troubleshoot electrical, plumbing, HVAC, and mechanical systems. Read technical manuals and blueprints.' },
  { id:6, title:'Factory Helpers & Workers',            location:'Multiple Sites', type:'Full-Time', exp:'0-2 yrs', desc:'Helpers: assembly line support, material handling, packaging. Workers: machine operation, quality control, fabrication. For manufacturing plants & factories.' },
];

const WHY = [
  { title:'Career Growth Opportunities', desc:'Structured career paths with regular performance reviews and promotion opportunities.', a:'p' },
  { title:'Safe Work Environment',       desc:'Strict safety protocols and compliance standards across all client sites.',            a:'g' },
  { title:'Professional Training',       desc:'On-the-job training, skill development programs, and certification support.',         a:'p' },
  { title:'Timely Salary Support',       desc:'Guaranteed on-time salary disbursement with full statutory benefits.',               a:'g' },
  { title:'Long-Term Stability',         desc:'Consistent work engagements with reputed clients across multiple industries.',        a:'p' },
  { title:'Supportive Management',       desc:'Dedicated HR support and a responsive management team for every employee.',          a:'g' },
];

const STEPS = [
  { s:1, t:'Submit Application',       d:'Fill out our online form or drop your resume. We review every application personally.' },
  { s:2, t:'Profile Review',           d:'Our HR team reviews your profile and skill set to match you with the right opportunity.' },
  { s:3, t:'Interview & Verification', d:'A brief interview and document verification to confirm your eligibility and preferences.' },
  { s:4, t:'Deployment & Onboarding',  d:'Once selected, we handle onboarding, documentation, and ensure a smooth first-day experience.' },
];

const POS = ['Business Development Executive (BDE)','Admin Executive','Client Handling Executive','Guest Handling Executive','Multi-Skilled Technician','Factory Helper / Worker','Other'];

function CareersIntro() {
  return (
    <section className="relative overflow-hidden bg-white section-padding">
      <div className="container-base relative z-10">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div variants={staggerContainer(0.1,0.05)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col">
            <motion.div variants={fadeInUp} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{background:'#faf5fb',borderColor:'#e4d0e9',color:P}}>
                <span className="w-1.5 h-1.5 rounded-full" style={{background:P}}/>Life at Stryper Solution
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5" style={{fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>
              A Workplace Built On <span style={{color:P}}>Trust &amp; Growth</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed mb-5">At Stryper Solution Pvt. Ltd., we believe our people are our greatest asset. We create an environment where every team member is valued, supported, and given the tools to grow.</motion.p>
            <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed mb-8">Whether you are starting your career or looking for a stable long-term opportunity, we offer structured roles, timely compensation, and a management team that genuinely cares about your professional journey.</motion.p>
            <motion.ul variants={staggerContainer(0.08,0.1)} className="space-y-3 mb-8" role="list">
              {['Structured career paths with regular reviews','On-time salary with full statutory benefits','Training and skill development support','Dedicated HR team for every employee'].map(pt=>(
                <motion.li key={pt} variants={fadeInUp} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{background:P+'15',color:P}}><Chk/></span>
                  <span className="text-sm text-neutral-700 font-medium">{pt}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={fadeInUp}>
              <a href="#positions" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-semibold text-white w-fit" style={{background:P}}>
                View Open Positions
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </motion.div>
          </motion.div>

          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            <div className="relative w-full aspect-[4/4.2] max-w-[480px] mx-auto lg:ml-auto">
              <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-strong">
                <img src={img4} alt="Stryper Solution team" className="w-full h-full object-cover object-center"/>
                <div className="absolute inset-0" style={{background:'linear-gradient(145deg,rgba(30,10,50,0.75) 0%,rgba(60,20,80,0.5) 100%)'}} aria-hidden="true"/>
                <div className="relative z-10 p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-center justify-between">
                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-medium">Company Overview</p>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"/>Hiring
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{val:'500+',lbl:'Workforce',c:'text-white'},{val:'50+',lbl:'Clients',c:'text-[#F5A623]'},{val:'10+',lbl:'Industries',c:'text-emerald-300'},{val:'2014',lbl:'Est. Year',c:'text-white/70'}].map(s=>(
                      <div key={s.lbl} className="bg-white/10 rounded-2xl px-3 py-3 text-center border border-white/10">
                        <p className={'text-xl font-bold font-display leading-none mb-1 '+s.c}>{s.val}</p>
                        <p className="text-white/45 text-[9px] font-medium">{s.lbl}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/10 rounded-2xl px-4 py-3.5 border border-white/10 flex-1">
                    <p className="text-white/60 text-[10px] uppercase tracking-widest mb-3">Open Roles</p>
                    <div className="space-y-2">
                      {['BDE','Admin Executive','Client Handling'].map(r=>(
                        <div key={r} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"/>
                            <span className="text-white/75 text-[10px] font-medium">{r}</span>
                          </div>
                          <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">Open</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <motion.div initial={{opacity:0,scale:0.85}} whileInView={{opacity:1,scale:1}} viewport={viewportOnce} transition={{duration:0.45,delay:0.6}} className="absolute -bottom-4 -left-4 z-10">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white shadow-strong border border-neutral-100">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{background:G+'20',color:G}}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L7 8.1l-2.78 1.45.53-3.1L2.5 4.25l3.1-.45L7 1z" fill="currentColor"/></svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-neutral-900 leading-none">Great Place to Work</p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">Trusted by 500+ workers</p>
                  </div>
                </div>
              </motion.div>
              <motion.div initial={{opacity:0,x:12}} whileInView={{opacity:1,x:0}} viewport={viewportOnce} transition={{duration:0.45,delay:0.75}} className="absolute -top-4 -right-4 z-10">
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white shadow-medium border border-neutral-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"/>
                  <span className="text-[11px] font-semibold text-neutral-700">Now Hiring</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function OpenPositions() {
  return (
    <section id="positions" className="relative overflow-hidden section-padding scroll-mt-20" style={{background:'linear-gradient(180deg,#fafafa 0%,#f5f0fb 55%,#fafafa 100%)'}}>
      <div className="container-base relative z-10">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-14">
          <motion.div variants={fadeInUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{background:'#faf5fb',borderColor:'#e4d0e9',color:P}}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Now Hiring
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{fontSize:'clamp(1.9rem,3.2vw,2.75rem)'}}>
            Current <span style={{color:P}}>Open Positions</span>
          </motion.h2>
          <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto mb-5" style={{background:'linear-gradient(90deg,#8B3A8F,#F5A623)'}}/>
          <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed">We are actively hiring across multiple roles. Find the right opportunity and apply today.</motion.p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {JOBS.map((job,i)=>(
            <motion.article key={job.id} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={viewportOnce} transition={{duration:0.45,delay:i*0.08}} whileHover={{y:-4,transition:{duration:0.18}}}
              className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden flex flex-col">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{background:i%2===0?P:G}} aria-hidden="true"/>
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-display font-semibold text-neutral-900 text-base leading-snug pr-2">{job.title}</h3>
                <span className="shrink-0 text-[9px] font-bold px-2 py-1 rounded-full" style={{background:i%2===0?P+'15':G+'15',color:i%2===0?P:G}}>{job.type}</span>
              </div>
              <div className="flex flex-wrap gap-3 mb-3">
                <span className="text-[11px] text-neutral-500">{job.location}</span>
                <span className="text-[11px] text-neutral-500">{job.exp}</span>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed flex-1 mb-5">{job.desc}</p>
              <a href="#apply" className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{background:i%2===0?P:G}}>Apply Now</a>
            </motion.article>
          ))}
        </div>
        <p className="text-center text-sm text-neutral-400 mt-8">
          Do not see your role? <a href="#apply" className="font-semibold" style={{color:P}}>Submit your resume anyway</a> - we will reach out when a match opens.
        </p>
      </div>
    </section>
  );
}

function WhyWorkWithUs() {
  return (
    <section className="relative overflow-hidden bg-white section-padding">
      <div className="container-base relative z-10">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-14">
          <motion.div variants={fadeInUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{background:'#faf5fb',borderColor:'#e4d0e9',color:P}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{background:P}}/>Why Join Us
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{fontSize:'clamp(1.9rem,3.2vw,2.75rem)'}}>
            Why Work With <span style={{color:P}}>Stryper Solution</span>
          </motion.h2>
          <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto mb-5" style={{background:'linear-gradient(90deg,#8B3A8F,#F5A623)'}}/>
          <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed">We are more than a staffing company - we are a career partner committed to your long-term success.</motion.p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {WHY.map((f,i)=>(
            <motion.div key={f.title} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={viewportOnce} transition={{duration:0.45,delay:i*0.08}} whileHover={{y:-4,transition:{duration:0.18}}}
              className="group relative bg-white rounded-2xl p-6 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" style={{background:f.a==='p'?P:G}} aria-hidden="true"/>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{background:f.a==='p'?'#faf5fb':'#fffbf0',color:f.a==='p'?P:G}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2l7 3v4c0 3.5-2.5 6-7 7-4.5-1-7-3.5-7-7V5l7-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h3 className="font-display font-semibold text-neutral-900 text-base mb-2">{f.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ApplicationProcess() {
  return (
    <section className="relative overflow-hidden section-padding" style={{background:'linear-gradient(180deg,#fafafa 0%,#f5f0fb 55%,#fafafa 100%)'}}>
      <div className="container-base relative z-10">
        <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="text-center max-w-xl mx-auto mb-14">
          <motion.div variants={fadeInUp} className="mb-5">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{background:'#faf5fb',borderColor:'#e4d0e9',color:P}}>
              <span className="w-1.5 h-1.5 rounded-full" style={{background:P}}/>How to Apply
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-4" style={{fontSize:'clamp(1.9rem,3.2vw,2.75rem)'}}>
            Our <span style={{color:P}}>Application Process</span>
          </motion.h2>
          <motion.div variants={fadeInUp} className="w-16 h-1 rounded-full mx-auto" style={{background:'linear-gradient(90deg,#8B3A8F,#F5A623)'}}/>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {STEPS.map((step,i)=>(
            <motion.div key={step.s} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={viewportOnce} transition={{duration:0.48,delay:i*0.12}} whileHover={{y:-4,transition:{duration:0.18}}}
              className="group relative flex flex-col items-center text-center bg-white rounded-3xl px-6 pt-8 pb-7 border border-neutral-100 shadow-soft hover:shadow-medium transition-all duration-300 overflow-hidden">
              <div className="relative mb-6">
                <div className="w-[100px] h-[100px] rounded-full border-2 border-dashed flex items-center justify-center" style={{borderColor:P+'30'}}>
                  <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center text-white" style={{background:'linear-gradient(135deg,#8B3A8F,#662a6b)'}}>
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      {step.s===1&&<><rect x="4" y="3" width="18" height="20" rx="2" stroke="white" strokeWidth="1.6"/><path d="M8 9h10M8 13h10M8 17h6" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
                      {step.s===2&&<><circle cx="13" cy="10" r="5" stroke="white" strokeWidth="1.6"/><path d="M4 22c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
                      {step.s===3&&<><path d="M13 3l9 4v5c0 5-3.5 8-9 9-5.5-1-9-4-9-9V7l9-4z" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 13l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></>}
                      {step.s===4&&<><circle cx="13" cy="9" r="4" stroke="white" strokeWidth="1.5"/><path d="M4 22c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></>}
                    </svg>
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold" style={{background:G}}>{step.s}</div>
              </div>
              <h3 className="text-[0.95rem] font-display font-semibold text-neutral-900 mb-2.5 leading-snug">{step.t}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResumeSubmission() {
  const [form, setForm] = useState({name:'',phone:'',email:'',position:'',experience:'',file:null});
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const handleChange = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const handleFile  = e => setForm(p=>({...p,file:e.target.files[0]||null}));
  const handleSubmit = e => { e.preventDefault(); setSubmitted(true); };
  const ic = name => ['w-full px-4 py-3.5 rounded-xl border text-sm text-neutral-800 bg-white placeholder-neutral-400 outline-none transition-all duration-200', focused===name?'border-[#8B3A8F] shadow-[0_0_0_3px_rgba(139,58,143,0.12)]':'border-neutral-200 hover:border-neutral-300'].join(' ');

  return (
    <section id="apply" className="relative overflow-hidden bg-white section-padding scroll-mt-20">
      <div className="container-base relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={viewportOnce} className="flex flex-col lg:sticky lg:top-28">
            <motion.div variants={fadeInUp} className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold tracking-wide uppercase" style={{background:'#faf5fb',borderColor:'#e4d0e9',color:P}}>
                <span className="w-1.5 h-1.5 rounded-full" style={{background:P}}/>Submit Your Resume
              </span>
            </motion.div>
            <motion.h2 variants={fadeInUp} className="font-display font-bold text-neutral-900 leading-[1.1] tracking-tight mb-5" style={{fontSize:'clamp(1.8rem,3vw,2.5rem)'}}>
              Take the First Step Towards Your <span style={{color:P}}>Next Opportunity</span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-neutral-500 text-[1.02rem] leading-relaxed mb-8">Fill in your details and upload your resume. Our HR team reviews every application and will reach out within 48 hours if there is a match.</motion.p>
            <motion.ul variants={staggerContainer(0.08,0.1)} className="space-y-3" role="list">
              {['Every application is personally reviewed','Response within 48 business hours','No application fee - ever','Your data is kept strictly confidential'].map(pt=>(
                <motion.li key={pt} variants={fadeInUp} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{background:P+'15',color:P}}><Chk/></span>
                  <span className="text-sm text-neutral-700 font-medium">{pt}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          <motion.div variants={fadeInRight} initial="hidden" whileInView="visible" viewport={viewportOnce}>
            {submitted ? (
              <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:0.4}} className="bg-white rounded-3xl p-10 border border-neutral-100 shadow-medium text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{background:P+'12'}}>
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M5 14l6 6 12-12" stroke={P} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h3 className="font-display font-bold text-neutral-900 text-xl mb-3">Application Submitted!</h3>
                <p className="text-neutral-500 text-sm leading-relaxed mb-6">Thank you for applying. Our HR team will review your profile and reach out within 48 hours.</p>
                <button onClick={()=>setSubmitted(false)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white" style={{background:P}}>Submit Another Application</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="bg-white rounded-3xl p-7 lg:p-9 border border-neutral-100 shadow-medium space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cname" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">Full Name <span style={{color:P}}>*</span></label>
                    <input id="cname" name="name" type="text" required placeholder="Rahul Sharma" value={form.name} onChange={handleChange} onFocus={()=>setFocused('name')} onBlur={()=>setFocused('')} className={ic('name')}/>
                  </div>
                  <div>
                    <label htmlFor="cphone" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">Phone <span style={{color:P}}>*</span></label>
                    <input id="cphone" name="phone" type="tel" required placeholder="+91 98765 43210" value={form.phone} onChange={handleChange} onFocus={()=>setFocused('phone')} onBlur={()=>setFocused('')} className={ic('phone')}/>
                  </div>
                </div>
                <div>
                  <label htmlFor="cemail" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">Email <span style={{color:P}}>*</span></label>
                  <input id="cemail" name="email" type="email" required placeholder="rahul@email.com" value={form.email} onChange={handleChange} onFocus={()=>setFocused('email')} onBlur={()=>setFocused('')} className={ic('email')}/>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cpos" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">Position <span style={{color:P}}>*</span></label>
                    <select id="cpos" name="position" required value={form.position} onChange={handleChange} onFocus={()=>setFocused('position')} onBlur={()=>setFocused('')} className={ic('position')+' cursor-pointer'}>
                      <option value="" disabled>Select position...</option>
                      {POS.map(p=><option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="cexp" className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">Experience</label>
                    <select id="cexp" name="experience" value={form.experience} onChange={handleChange} onFocus={()=>setFocused('experience')} onBlur={()=>setFocused('')} className={ic('experience')+' cursor-pointer'}>
                      <option value="" disabled>Select...</option>
                      {['Fresher (0 yrs)','0-1 Year','1-3 Years','3-5 Years','5+ Years'].map(e=><option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5 uppercase tracking-wide">Resume / CV</label>
                  <label htmlFor="resume" className={`flex flex-col items-center justify-center w-full py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 ${dragOver?'border-[#8B3A8F] bg-[#faf5fb]':'border-neutral-200 hover:border-[#8B3A8F] hover:bg-[#faf5fb]'}`}
                    onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)}
                    onDrop={e=>{e.preventDefault();setDragOver(false);setForm(p=>({...p,file:e.dataTransfer.files[0]||null}));}}>
                    <input id="resume" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleFile}/>
                    {form.file ? (
                      <div className="flex items-center gap-2 text-sm font-medium" style={{color:P}}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
                        {form.file.name}
                      </div>
                    ) : (
                      <>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="mb-2" style={{color:P+'60'}}><path d="M14 18V8M10 12l4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 22h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                        <p className="text-sm text-neutral-500">Drag & drop or <span className="font-semibold" style={{color:P}}>browse</span></p>
                        <p className="text-xs text-neutral-400 mt-1">PDF, DOC, DOCX - max 5MB</p>
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-neutral-400">Our HR team reviews every application personally and responds within 48 hours.</p>
                <motion.button type="submit" whileHover={{scale:1.02}} whileTap={{scale:0.97}} className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-white text-sm font-semibold" style={{background:P}}>
                  Submit Application
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M2 7.5h11M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </motion.button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CareersCTA() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-28" style={{background:'linear-gradient(135deg,#3d1940 0%,#662a6b 45%,#8B3A8F 100%)'}}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full blur-3xl opacity-20" style={{background:G}}/>
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] rounded-full blur-3xl opacity-15" style={{background:P}}/>
      </div>
      <div className="container-sm relative z-10 text-center">
        <motion.div variants={staggerContainer(0.12)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.div variants={fadeInUp} className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase" style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.8)'}}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{background:G}}/>Join Our Team
            </span>
          </motion.div>
          <motion.h2 variants={fadeInUp} className="font-display font-bold text-white leading-[1.08] tracking-tight mb-5 text-balance" style={{fontSize:'clamp(2rem,4vw,3.2rem)'}}>
            Ready To Join Our{' '}
            <span style={{background:`linear-gradient(90deg,${G},#fbbf24)`,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>Workforce Network?</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-white/65 text-lg leading-relaxed max-w-lg mx-auto mb-10">Take the first step towards a stable, rewarding career with one of India&apos;s growing workforce solutions companies.</motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center justify-center gap-4">
            <motion.div whileHover={{scale:1.04}} whileTap={{scale:0.97}}>
              <a href="#apply" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold" style={{background:G,boxShadow:'0 4px 20px rgba(245,166,35,0.4)'}}>
                Apply Now
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M3 7.5h9M8 3.5l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </motion.div>
            <motion.div whileHover={{scale:1.04}} whileTap={{scale:0.97}}>
              <Link to="/contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-white text-base font-semibold border" style={{borderColor:'rgba(255,255,255,0.3)',background:'rgba(255,255,255,0.1)'}}>
                Contact HR Team
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Careers() {
  return (
    <>
      <PageHero title="Build Your Career With Stryper Solution Pvt. Ltd." subtitle="Join a growing workforce solutions company committed to operational excellence, professional growth, and industry-leading manpower services." breadcrumb="Careers" image={img4}/>
      <CareersIntro/>
      <OpenPositions/>
      <WhyWorkWithUs/>
      <ApplicationProcess/>
      <ResumeSubmission/>
      <CareersCTA/>
    </>
  );
}

export default Careers;
