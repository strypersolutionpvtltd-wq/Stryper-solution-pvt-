import { useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-purple-600' : 'bg-neutral-200'}`}
    style={{ height: '22px', width: '40px' }}
  >
    <span
      className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
      style={{ width: '18px', height: '18px' }}
    />
  </button>
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-neutral-50">
      <h2 className="text-sm font-bold text-neutral-800">{title}</h2>
    </div>
    <div className="divide-y divide-neutral-50">{children}</div>
  </div>
);

const SettingRow = ({ label, desc, children }) => (
  <div className="flex items-center justify-between px-6 py-4 gap-4">
    <div>
      <p className="text-sm font-medium text-neutral-800">{label}</p>
      {desc && <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Settings = () => {
  const [notifs, setNotifs] = useState({
    newApplication: true,
    interviewReminder: true,
    offerUpdates: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showSalary: false,
    allowMessages: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <SectionHeader title="Settings" subtitle="Manage your account preferences and configurations." />
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Account">
          <SettingRow label="Email Address" desc="Used for login and notifications">
            <span className="text-sm text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-lg">company@example.com</span>
          </SettingRow>
          <SettingRow label="Password" desc="Last changed 30 days ago">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors" style={{ color: '#8B3A8F', background: '#f3e8f4' }}>
              Change Password
            </button>
          </SettingRow>
          <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors">
              Enable 2FA
            </button>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Notifications">
          <SettingRow label="New Application" desc="Get notified when someone applies">
            <Toggle checked={notifs.newApplication} onChange={v => setNotifs(p => ({ ...p, newApplication: v }))} />
          </SettingRow>
          <SettingRow label="Interview Reminders" desc="Reminders 30 min before interviews">
            <Toggle checked={notifs.interviewReminder} onChange={v => setNotifs(p => ({ ...p, interviewReminder: v }))} />
          </SettingRow>
          <SettingRow label="Offer Updates" desc="When candidates accept or decline">
            <Toggle checked={notifs.offerUpdates} onChange={v => setNotifs(p => ({ ...p, offerUpdates: v }))} />
          </SettingRow>
          <SettingRow label="Weekly Report" desc="Summary of hiring activity every Monday">
            <Toggle checked={notifs.weeklyReport} onChange={v => setNotifs(p => ({ ...p, weeklyReport: v }))} />
          </SettingRow>
          <SettingRow label="Marketing Emails" desc="Product updates and tips">
            <Toggle checked={notifs.marketingEmails} onChange={v => setNotifs(p => ({ ...p, marketingEmails: v }))} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Privacy */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Privacy">
          <SettingRow label="Company Profile Visible" desc="Show your company to job seekers">
            <Toggle checked={privacy.profileVisible} onChange={v => setPrivacy(p => ({ ...p, profileVisible: v }))} />
          </SettingRow>
          <SettingRow label="Show Salary Range" desc="Display salary on job postings">
            <Toggle checked={privacy.showSalary} onChange={v => setPrivacy(p => ({ ...p, showSalary: v }))} />
          </SettingRow>
          <SettingRow label="Allow Direct Messages" desc="Candidates can message you directly">
            <Toggle checked={privacy.allowMessages} onChange={v => setPrivacy(p => ({ ...p, allowMessages: v }))} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section title="Danger Zone">
          <SettingRow label="Deactivate Account" desc="Temporarily disable your Hire Zone access">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors">
              Deactivate
            </button>
          </SettingRow>
          <SettingRow label="Delete Account" desc="Permanently delete all data — cannot be undone">
            <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </SettingRow>
        </Section>
      </motion.div>

      {/* Save button */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
        className="flex justify-end pb-2"
      >
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors shadow-sm"
          style={{ background: saved ? '#16a34a' : '#8B3A8F' }}
        >
          {saved ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              Saved!
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Save Changes
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;
