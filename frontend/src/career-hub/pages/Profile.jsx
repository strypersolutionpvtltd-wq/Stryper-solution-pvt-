import { useState } from 'react';
import { MOCK_CANDIDATE } from '@/career-hub/data/mockCandidate';
import toast from 'react-hot-toast';

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
    <h2 className="text-base font-semibold text-neutral-800 mb-4">{title}</h2>
    {children}
  </div>
);

const SkillBadge = ({ name, level }) => {
  const colors = {
    Expert:       'bg-purple-50 text-purple-700 border-purple-200',
    Advanced:     'bg-blue-50 text-blue-700 border-blue-200',
    Intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${colors[level] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
      {name}
      <span className="opacity-60 text-[10px]">{level}</span>
    </span>
  );
};

const inputCls = 'w-full px-4 py-2 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none focus:border-purple-400 transition-all';

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(MOCK_CANDIDATE);

  const c = form;

  const handleSave = () => {
    setEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div>
      {/* Header card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #8B3A8F, #6d2b70)' }}
            >
              {form.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <input 
                    value={form.fullName} 
                    onChange={e => setForm({...form, fullName: e.target.value})}
                    className={inputCls}
                    placeholder="Full Name"
                  />
                  <input 
                    value={form.title} 
                    onChange={e => setForm({...form, title: e.target.value})}
                    className={inputCls}
                    placeholder="Job Title"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-neutral-800 truncate">{form.fullName}</h1>
                  <p className="text-sm text-neutral-500 mt-0.5 truncate">{form.title}</p>
                </>
              )}
              <p className="text-xs text-neutral-400 mt-1">{form.location} · {form.email}</p>
            </div>
          </div>
          <div className="shrink-0 flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={() => { setForm(MOCK_CANDIDATE); setEditing(false); }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold border border-neutral-200 text-neutral-500 hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: '#8B3A8F' }}
                >
                  Save
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-colors"
                style={{ borderColor: '#8B3A8F', color: '#8B3A8F' }}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <textarea
            value={form.summary}
            onChange={e => setForm({...form, summary: e.target.value})}
            className={`${inputCls} mt-4 h-24 resize-none`}
            placeholder="Write a brief professional summary..."
          />
        ) : (
          form.summary && (
            <p className="text-sm text-neutral-600 mt-4 leading-relaxed border-t border-neutral-50 pt-4">
              {form.summary}
            </p>
          )
        )}
      </div>

      {/* Career Details */}
      <Section title="Career Details">
        <div className="grid grid-cols-2 gap-3">
          {Object.entries({
            'Preferred Role':    c.careerDetails.preferredRole,
            'Experience':        c.careerDetails.experience,
            'Salary Expectation':c.careerDetails.salaryExpectation,
            'Location':          c.careerDetails.locationPreference,
            'Employment Type':   c.careerDetails.employmentType,
            'Notice Period':     c.careerDetails.noticePeriod,
          }).map(([label, value]) => (
            <div key={label} className="bg-neutral-50 rounded-xl p-3">
              <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wide">{label}</p>
              <p className="text-sm font-semibold text-neutral-700 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Skills */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-2">
          {c.skills.map(s => <SkillBadge key={s.name} {...s} />)}
        </div>
      </Section>

      {/* Experience */}
      <Section title="Work Experience">
        <div className="space-y-4">
          {c.experience.map(ex => (
            <div key={ex.id} className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="14" rx="2" stroke="#8B3A8F" strokeWidth="1.8"/>
                  <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke="#8B3A8F" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-neutral-800 text-sm">{ex.role}</p>
                <p className="text-xs text-neutral-500">{ex.company} · {ex.location}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{ex.duration}</p>
                <p className="text-sm text-neutral-600 mt-1.5 leading-relaxed">{ex.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="Education">
        {c.education.map(ed => (
          <div key={ed.id} className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 10v6M2 10l10-5 10 5-10 5-10-5z" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6 12v5c3.33 2 8.67 2 12 0v-5" stroke="#3B82F6" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <p className="font-semibold text-neutral-800 text-sm">{ed.degree}</p>
              <p className="text-xs text-neutral-500">{ed.institution}</p>
              <p className="text-xs text-neutral-400 mt-0.5">{ed.year} · {ed.grade}</p>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
};

export default Profile;
