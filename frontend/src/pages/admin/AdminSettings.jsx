import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Globe, Shield, Save, Moon, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

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
  
  // Local state for form
  const [profile, setProfile] = useState({
    fullName: userData?.fullName || 'Super Admin',
    email: userData?.email || 'admin@stryper.com'
  });
  
  const [prefs, setPrefs] = useState({
    maintenance: false,
    publicReg: true
  });

  const handleSave = () => {
    // Update global state
    if (setUserData) {
      setUserData({ ...userData, ...profile });
    }
    toast.success('Settings saved successfully!');
  };

  const handlePasswordReset = () => {
    toast('Password reset link sent to your email.', { icon: '📧' });
  };

  const handle2FAToggle = () => {
    toast('2FA configuration modal opened. (Mock)', { icon: '🔐' });
  };

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
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-purple-600 text-white text-sm font-semibold hover:bg-brand-purple-700 transition-all shadow-lg shadow-brand-purple-600/20"
        >
          <Save size={16} />
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
              Change Password
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
