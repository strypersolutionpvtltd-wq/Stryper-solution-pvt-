import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '@/hire-zone/components/shared/SectionHeader';
import { useAuth } from '@/context/AuthContext';
import { settings, auth } from '@/utils/api';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative rounded-full transition-colors duration-200 shrink-0 ${checked ? 'bg-purple-600' : 'bg-neutral-200'}`}
    style={{ height: '22px', width: '40px' }}
  >
    <span
      className={`absolute top-0.5 left-0.5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
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
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [notifs, setNotifs] = useState({
    newApplication: true,
    interviewReminder: true,
    offerUpdates: true,
    weeklyReport: false,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({ profileVisible: true });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settings.get();
        if (res.data?.success) {
          setEmail(res.data.account?.email || userData?.email || '');
          if (res.data.notifications) setNotifs(res.data.notifications);
          if (res.data.privacy) setPrivacy(res.data.privacy);
        }
      } catch {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [userData]);

  // Password-only save — only runs when newPassword is filled
  const handleSave = async () => {
    if (!newPassword.trim()) return;
    if (!currentPassword.trim()) {
      toast.error('Current password is required to change password');
      return;
    }
    try {
      setSaving(true);
      await auth.changePassword({ currentPassword, newPassword });
      setSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      toast.success('Password updated successfully');
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  // Auto-save privacy on toggle
  const handlePrivacyChange = async (val) => {
    const prev = privacy;
    const updated = { profileVisible: val };
    setPrivacy(updated);
    try {
      await settings.update({ email, privacy: updated, notifications: notifs });
      toast.success(`Company profile set to ${val ? 'Public' : 'Private'}`);
    } catch {
      setPrivacy(prev);
      toast.error('Failed to update privacy settings');
    }
  };

  // Auto-save notification on toggle
  const handleNotifChange = async (key, val) => {
    const prev = notifs;
    const updated = { ...notifs, [key]: val };
    setNotifs(updated);
    try {
      await settings.update({ email, privacy, notifications: updated });
      toast.success('Notification preference updated');
    } catch {
      setNotifs(prev);
      toast.error('Failed to update notifications');
    }
  };

  const handleDeactivate = async () => {
    if (!window.confirm('Are you sure you want to deactivate your account? This will temporarily hide your job postings.')) return;
    try {
      const res = await settings.deactivate();
      if (res.data?.success) {
        toast.success('Account deactivated');
        logout();
        navigate('/', { replace: true });
      }
    } catch {
      toast.error('Failed to deactivate account');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('CRITICAL: This will permanently delete your account and all data. This CANNOT be undone. Are you sure?')) return;
    const password = window.prompt('Enter your current password to confirm deletion:');
    if (!password?.trim()) { toast.error('Password is required'); return; }
    try {
      const res = await auth.deleteAccount({ password });
      if (res.data?.success) {
        toast.success('Account deleted permanently');
        logout();
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Incorrect password. Deletion failed.');
    }
  };

  const SaveButton = () => (
    <motion.button
      whileHover={{ scale: newPassword ? 1.02 : 1 }}
      whileTap={{ scale: newPassword ? 0.97 : 1 }}
      onClick={handleSave}
      disabled={saving || !newPassword.trim()}
      className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: saved ? '#16a34a' : '#8B3A8F' }}
    >
      {saving && <Loader2 size={14} className="animate-spin" />}
      {saved ? (
        <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>Saved!</>
      ) : 'Save Changes'}
    </motion.button>
  );

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-purple-600" />
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest animate-pulse">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-5">
      {/* Header with Save button */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4">
        <SectionHeader title="Settings" subtitle="Manage your account preferences and configurations." />
        <SaveButton />
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Section title="Account">
          {/* Email — disabled/read-only */}
          <SettingRow label="Email Address" desc="Used for login and notifications">
            <input
              type="email"
              value={email}
              disabled
              readOnly
              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-sm bg-neutral-50 text-neutral-400 cursor-not-allowed w-52"
            />
          </SettingRow>
          <SettingRow label="Current Password" desc="Enter current password to change password">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 w-44"
            />
          </SettingRow>
          <SettingRow label="New Password" desc="Change your account password">
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="px-3 py-1.5 rounded-xl border border-neutral-200 text-sm text-neutral-700 outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-100 w-44"
            />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Notifications — auto-save on toggle */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Section title="Notifications">
          <SettingRow label="New Application" desc="Get notified when someone applies">
            <Toggle checked={notifs.newApplication} onChange={v => handleNotifChange('newApplication', v)} />
          </SettingRow>
          <SettingRow label="Interview Reminders" desc="Reminders 30 min before interviews">
            <Toggle checked={notifs.interviewReminder} onChange={v => handleNotifChange('interviewReminder', v)} />
          </SettingRow>
          <SettingRow label="Offer Updates" desc="When candidates accept or decline">
            <Toggle checked={notifs.offerUpdates} onChange={v => handleNotifChange('offerUpdates', v)} />
          </SettingRow>
          <SettingRow label="Weekly Report" desc="Summary of hiring activity every Monday">
            <Toggle checked={notifs.weeklyReport} onChange={v => handleNotifChange('weeklyReport', v)} />
          </SettingRow>
          <SettingRow label="Marketing Emails" desc="Product updates and tips">
            <Toggle checked={notifs.marketingEmails} onChange={v => handleNotifChange('marketingEmails', v)} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Privacy — single toggle, auto-save */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Section title="Privacy">
          <SettingRow
            label="Company Profile Privacy"
            desc="Public: Your company profile and jobs are visible to job seekers. Private: Your jobs are hidden and candidates cannot view your company profile."
          >
            <Toggle checked={privacy.profileVisible} onChange={handlePrivacyChange} />
          </SettingRow>
        </Section>
      </motion.div>

      {/* Danger Zone */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Section title="Danger Zone">
          <SettingRow label="Deactivate Account" desc="Temporarily disable your Hire Zone access">
            <button onClick={handleDeactivate} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors">
              Deactivate
            </button>
          </SettingRow>
          <SettingRow label="Delete Account" desc="Permanently delete all data — cannot be undone">
            <button onClick={handleDeleteAccount} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </SettingRow>
        </Section>
      </motion.div>
    </div>
  );
};

export default Settings;
