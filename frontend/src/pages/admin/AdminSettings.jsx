import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe, Shield, Save, Moon, Mail, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { settings, auth } from '@/utils/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const SettingsSection = ({ title, description, children, icon: Icon }) => (
  <motion.div variants={fadeInUp} className="bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 space-y-6">
    <div className="flex items-start gap-4">
      <div className="p-2.5 rounded-xl bg-brand-purple-600/10 text-brand-purple-500">
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
    </div>
    <div className="pt-2">{children}</div>
  </motion.div>
);

const Toggle = ({ enabled, onToggle }) => (
  <div 
    onClick={onToggle}
    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${enabled ? 'bg-brand-purple-600' : 'bg-white/10'}`}
  >
    <motion.div 
      layout
      className={`absolute top-1 w-4 h-4 rounded-full ${enabled ? 'bg-white right-1' : 'bg-neutral-500 left-1'}`}
    />
  </div>
);

const AdminSettings = () => {
  const { userData, setUserData } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Local state for form
  const [profile, setProfile] = useState({
    fullName: '',
    email: ''
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [prefs, setPrefs] = useState({
    maintenance: false,
    publicReg: true
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settings.get();
        if (res.data?.success) {
          setProfile({
            fullName: res.data.account?.fullName || userData?.fullName || 'Super Admin',
            email: res.data.account?.email || userData?.email || 'admin@stryper.com'
          });
          if (res.data.preferences) {
            setPrefs(res.data.preferences);
          }
        }
      } catch (error) {
        console.error('Failed to fetch admin settings:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userData]);

  const handleSave = async () => {
    try {
      setSaving(true);

      // If new password is provided, change password first
      if (newPassword.trim()) {
        if (!currentPassword.trim()) {
          toast.error("Current password is required to change password");
          setSaving(false);
          return;
        }
        await auth.changePassword({
          currentPassword,
          newPassword
        });
      }

      const res = await settings.update({
        email: profile.email,
        profile: { fullName: profile.fullName },
        preferences: { publicReg: prefs.publicReg, maintenance: prefs.maintenance }
      });

      if (res.data?.success) {
        toast.success('Settings saved successfully!');
        setCurrentPassword('');
        setNewPassword('');
        if (setUserData) {
          setUserData({ 
            ...userData, 
            email: res.data.account?.email, 
            fullName: res.data.account?.fullName 
          });
        }
      }
    } catch (error) {
      console.error('Failed to save admin settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = () => {
    toast('Use the Admin Profile section above to set a new password directly.', { icon: '🔑' });
  };

  const handle2FAToggle = () => {
    toast('2FA configuration is currently simulated. Contact system administrator for details.', { icon: '🔐' });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-brand-purple-500" />
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest animate-pulse">Loading settings...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Control Panel Settings</h2>
          <p className="text-neutral-500 text-sm mt-1">Configure your administrative preferences and system behavior.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold hover:bg-brand-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-brand-purple-600/20"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Settings */}
        <SettingsSection 
          title="Admin Profile" 
          description="Update your personal details and how others see you." 
          icon={User}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Full Name</label>
              <input 
                type="text" 
                value={profile.fullName}
                onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Email Address</label>
              <input 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50" 
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Current Password</label>
              <input 
                type="password" 
                placeholder="Enter current password to change password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50" 
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">New Password</label>
              <input 
                type="password" 
                placeholder="Leave blank to keep current password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-purple-600/50" 
              />
            </div>
          </div>
        </SettingsSection>

        {/* System Preferences */}
        <SettingsSection 
          title="System Preferences" 
          description="Global configuration for the platform behavior." 
          icon={Globe}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl">
              <div>
                <p className="text-sm font-bold text-white">Public Registration</p>
                <p className="text-xs text-neutral-500 mt-0.5">Allow new candidates and companies to sign up.</p>
              </div>
              <Toggle 
                enabled={prefs.publicReg} 
                onToggle={() => {
                  const val = !prefs.publicReg;
                  setPrefs({...prefs, publicReg: val});
                  toast(val ? 'Registrations opened.' : 'Registrations closed.', { icon: '🚪' });
                }} 
              />
            </div>
          </div>
        </SettingsSection>

        {/* Security */}
        <SettingsSection 
          title="Security & Access" 
          description="Manage your password and account security." 
          icon={Shield}
        >
          <div className="space-y-4">
            <button 
              onClick={handlePasswordReset}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Lock size={16} className="text-neutral-500" />
              Change Password Instructions
            </button>
            <button 
              onClick={handle2FAToggle}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Shield size={16} className="text-neutral-500" />
              Configure Two-Factor Authentication (2FA)
            </button>
          </div>
        </SettingsSection>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
