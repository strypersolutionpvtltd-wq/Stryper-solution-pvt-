import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Loader2, 
  Plus, 
  Trash2, 
  User, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  X,
  MapPin,
  Mail,
  Phone,
  Layout,
  Clock,
  CircleDollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';

const ResumeParser = () => {
  const [isParsing, setIsParsing] = useState(false);
  const [parsed, setParsed] = useState(false);
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    personal_info: {
      full_name: '',
      email: '',
      phone: '',
      current_title: '',
      location: '',
      summary: ''
    },
    career_details: {
      total_experience: '',
      preferred_role: '',
      salary_expectation: '',
      notice_period: '',
      employment_type: 'Full-time'
    },
    skills: [],
    work_experience: [],
    education: []
  });

  const [newSkill, setNewSkill] = useState('');

  // Mock API Handler
  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParsed(false);

    // Simulate AI Reading Delay
    setTimeout(() => {
      const mockData = {
        personal_info: { 
          full_name: "Rahul Sharma", 
          email: "rahul.sharma@gmail.com", 
          phone: "+919876543210", 
          current_title: "Senior Frontend Developer", 
          summary: "Passionate frontend developer with 4+ years of experience in building scalable web applications using React and modern CSS frameworks.", 
          location: "Delhi, India" 
        },
        career_details: { 
          total_experience: "4 Years", 
          preferred_role: "Senior React Developer",
          salary_expectation: "₹18,00,000 PA",
          notice_period: "30 Days",
          employment_type: "Full-time"
        },
        skills: [
          { name: "React.js", proficiency: "Expert" }, 
          { name: "Tailwind CSS", proficiency: "Advanced" },
          { name: "Node.js", proficiency: "Intermediate" },
          { name: "TypeScript", proficiency: "Advanced" }
        ],
        work_experience: [
          { 
            job_title: "Frontend Developer", 
            company_name: "TechCorp Solutions", 
            duration: "Jan 2022 - Present", 
            responsibilities: "Lead the development of the main customer dashboard. Improved page load speed by 40% using code-splitting and optimization techniques." 
          },
          { 
            job_title: "Junior Web Developer", 
            company_name: "WebFlow Agency", 
            duration: "June 2020 - Dec 2021", 
            responsibilities: "Assisted in building responsive websites for various clients. Collaborated with UI/UX designers to implement pixel-perfect designs." 
          }
        ],
        education: [
          { 
            degree: "B.Tech in Computer Science", 
            institution: "Delhi Technological University", 
            passing_year: "2020" 
          }
        ]
      };

      setFormData(mockData);
      setIsParsing(false);
      setParsed(true);
      toast.success("Resume parsed successfully! Form auto-filled.");
    }, 2500);
  };

  const handleSave = () => {
    toast.success('Profile updated with resume data!', {
      icon: '👤',
      style: { borderRadius: '12px', background: '#333', color: '#fff' }
    });
    setTimeout(() => navigate('/career-hub/profile'), 1500);
  };

  // Helper to update deep state
  const updateNestedState = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Skills logic
  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), proficiency: 'Intermediate' }]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  // Dynamic Repeaters logic
  const addWorkExp = () => {
    setFormData(prev => ({
      ...prev,
      work_experience: [...prev.work_experience, { job_title: '', company_name: '', duration: '', responsibilities: '' }]
    }));
  };

  const removeWorkExp = (index) => {
    setFormData(prev => ({
      ...prev,
      work_experience: prev.work_experience.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', passing_year: '' }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const updateArrayField = (section, index, field, value) => {
    setFormData(prev => {
      const updated = [...prev[section]];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [section]: updated };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* 1. Upload Section */}
      <div className="bg-white rounded-3xl border-2 border-dashed border-neutral-200 p-8 transition-all hover:border-brand-purple-400 group relative overflow-hidden">
        {isParsing && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-10 h-10 text-brand-purple-600 animate-spin" />
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-800">AI is reading your resume...</h3>
              <p className="text-sm text-neutral-500 uppercase tracking-widest font-medium">Please wait</p>
            </div>
          </div>
        )}

        <input 
          type="file" 
          onChange={handleResumeUpload}
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          accept=".pdf,.docx,.doc"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-brand-purple-50 flex items-center justify-center text-brand-purple-600 group-hover:scale-110 transition-transform duration-300">
            <Upload size={32} />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-neutral-800">Upload Resume to Auto-Fill Form</h2>
            <p className="text-neutral-500 text-sm mt-1">Drag and drop your PDF or DOCX file here</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-50 border border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">
            Supported: PDF, DOCX (Max 5MB)
          </div>
        </div>
      </div>

      {/* 2. Personal Info Section */}
      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="bg-neutral-50/50 px-8 py-4 border-b border-neutral-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <User size={18} />
          </div>
          <h3 className="font-bold text-neutral-800">Personal Information</h3>
          {parsed && <span className="ml-auto flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase"><CheckCircle2 size={10}/> AI Filled</span>}
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            label="Full Name" 
            icon={<User size={16}/>} 
            value={formData.personal_info.full_name} 
            onChange={(v) => updateNestedState('personal_info', 'full_name', v)}
          />
          <InputField 
            label="Email Address" 
            icon={<Mail size={16}/>} 
            value={formData.personal_info.email} 
            onChange={(v) => updateNestedState('personal_info', 'email', v)}
          />
          <InputField 
            label="Phone Number" 
            icon={<Phone size={16}/>} 
            value={formData.personal_info.phone} 
            onChange={(v) => updateNestedState('personal_info', 'phone', v)}
          />
          <InputField 
            label="Current Job Title" 
            icon={<Briefcase size={16}/>} 
            value={formData.personal_info.current_title} 
            onChange={(v) => updateNestedState('personal_info', 'current_title', v)}
          />
          <div className="md:col-span-2">
            <InputField 
              label="Location" 
              icon={<MapPin size={16}/>} 
              value={formData.personal_info.location} 
              onChange={(v) => updateNestedState('personal_info', 'location', v)}
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Professional Summary</label>
            <textarea 
              className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 focus:border-brand-purple-600/50 min-h-[120px] transition-all"
              value={formData.personal_info.summary}
              onChange={(e) => updateNestedState('personal_info', 'summary', e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>
      </section>

      {/* 3. Career Details */}
      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="bg-neutral-50/50 px-8 py-4 border-b border-neutral-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Layout size={18} />
          </div>
          <h3 className="font-bold text-neutral-800">Career Details</h3>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            label="Total Experience" 
            icon={<Clock size={16}/>} 
            value={formData.career_details.total_experience} 
            onChange={(v) => updateNestedState('career_details', 'total_experience', v)}
          />
          <InputField 
            label="Preferred Role" 
            icon={<Briefcase size={16}/>} 
            value={formData.career_details.preferred_role} 
            onChange={(v) => updateNestedState('career_details', 'preferred_role', v)}
          />
          <InputField 
            label="Salary Expectation" 
            icon={<CircleDollarSign size={16}/>} 
            value={formData.career_details.salary_expectation} 
            onChange={(v) => updateNestedState('career_details', 'salary_expectation', v)}
          />
          <InputField 
            label="Notice Period" 
            icon={<Clock size={16}/>} 
            value={formData.career_details.notice_period} 
            onChange={(v) => updateNestedState('career_details', 'notice_period', v)}
          />
        </div>
      </section>

      {/* 4. Skills Section */}
      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="bg-neutral-50/50 px-8 py-4 border-b border-neutral-100 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Layout size={18} />
          </div>
          <h3 className="font-bold text-neutral-800">Skills & Expertise</h3>
        </div>
        
        <div className="p-8 space-y-6">
          <div className="flex gap-2">
            <input 
              type="text"
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20"
              placeholder="Add a skill (e.g. React, Java, UI Design)"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <button 
              onClick={addSkill}
              className="px-4 py-2 bg-brand-purple-600 text-white rounded-xl font-bold text-sm hover:bg-brand-purple-700 transition-all flex items-center gap-2"
            >
              <Plus size={16} /> Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {formData.skills.length === 0 && (
              <p className="text-neutral-400 text-sm italic">No skills added yet.</p>
            )}
            {formData.skills.map((skill, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-brand-purple-50 border border-brand-purple-100 text-brand-purple-700 rounded-xl group animate-in fade-in zoom-in duration-300">
                <span className="text-sm font-bold">{skill.name}</span>
                <span className="text-[10px] uppercase font-bold text-brand-purple-400/70 border-l border-brand-purple-200 pl-2">{skill.proficiency}</span>
                <button 
                  onClick={() => removeSkill(i)}
                  className="p-1 hover:bg-brand-purple-100 rounded-lg transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Work Experience */}
      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="bg-neutral-50/50 px-8 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Briefcase size={18} />
            </div>
            <h3 className="font-bold text-neutral-800">Work Experience</h3>
          </div>
          <button 
            onClick={addWorkExp}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-purple-600 hover:underline"
          >
            <Plus size={14} /> Add Experience
          </button>
        </div>
        
        <div className="p-8 space-y-8">
          {formData.work_experience.length === 0 && (
            <div className="text-center py-8">
               <p className="text-neutral-400 text-sm italic">Add your career history to show recruiters your experience.</p>
            </div>
          )}
          {formData.work_experience.map((work, i) => (
            <div key={i} className="relative p-6 bg-neutral-50/50 rounded-2xl border border-neutral-100 space-y-6 group animate-in slide-in-from-top-4 duration-300">
              <button 
                onClick={() => removeWorkExp(i)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  label="Job Title" 
                  value={work.job_title} 
                  onChange={(v) => updateArrayField('work_experience', i, 'job_title', v)}
                />
                <InputField 
                  label="Company Name" 
                  value={work.company_name} 
                  onChange={(v) => updateArrayField('work_experience', i, 'company_name', v)}
                />
                <InputField 
                  label="Duration" 
                  placeholder="e.g. Jan 2022 - Present"
                  value={work.duration} 
                  onChange={(v) => updateArrayField('work_experience', i, 'duration', v)}
                />
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Key Responsibilities</label>
                  <textarea 
                    className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 min-h-[100px]"
                    value={work.responsibilities}
                    onChange={(e) => updateArrayField('work_experience', i, 'responsibilities', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Education */}
      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="bg-neutral-50/50 px-8 py-4 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <GraduationCap size={18} />
            </div>
            <h3 className="font-bold text-neutral-800">Education</h3>
          </div>
          <button 
            onClick={addEducation}
            className="flex items-center gap-1.5 text-xs font-bold text-brand-purple-600 hover:underline"
          >
            <Plus size={14} /> Add Education
          </button>
        </div>
        
        <div className="p-8 space-y-6">
          {formData.education.map((edu, i) => (
            <div key={i} className="relative grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-neutral-50/50 rounded-2xl border border-neutral-100 group animate-in slide-in-from-top-4 duration-300">
              <button 
                onClick={() => removeEducation(i)}
                className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
              
              <InputField 
                label="Degree / Course" 
                value={edu.degree} 
                onChange={(v) => updateArrayField('education', i, 'degree', v)}
              />
              <InputField 
                label="Institution" 
                value={edu.institution} 
                onChange={(v) => updateArrayField('education', i, 'institution', v)}
              />
              <InputField 
                label="Passing Year" 
                value={edu.passing_year} 
                onChange={(v) => updateArrayField('education', i, 'passing_year', v)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-neutral-100">
        <button 
          onClick={() => setFormData({ personal_info: {}, career_details: {}, skills: [], work_experience: [], education: [] })}
          className="px-8 py-3 rounded-2xl text-sm font-bold text-neutral-500 hover:bg-neutral-50 transition-all"
        >
          Clear All
        </button>
        <button 
          onClick={handleSave}
          className="px-10 py-3 rounded-2xl text-sm font-bold bg-brand-purple-600 text-white shadow-xl shadow-brand-purple-600/20 hover:bg-brand-purple-700 transition-all"
        >
          Save Profile
        </button>
      </div>

    </div>
  );
};

// Reusable Input Component
const InputField = ({ label, icon, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.15em] ml-1">{label}</label>
    <div className="relative flex items-center group">
      {icon && <div className="absolute left-4 text-neutral-400 transition-colors group-focus-within:text-brand-purple-500">{icon}</div>}
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-neutral-50 border border-neutral-200 rounded-2xl py-3 px-4 ${icon ? 'pl-11' : ''} text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-purple-600/20 focus:border-brand-purple-600/50 transition-all`}
      />
    </div>
  </div>
);

export default ResumeParser;
