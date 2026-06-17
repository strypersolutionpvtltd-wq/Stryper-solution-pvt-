import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { settings, auth } from '@/utils/api';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0">
    <div className="pr-4">
      <p className="text-sm font-medium text-neutral-800">{label}</p>
      {description && <p className="text-xs text-neutral-400 mt-0.5">{description}</p>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0"
      style={{ background: checked ? '#8B3A8F' : '#E5E7EB' }}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};

const Settings = () => {
  const { userData, updateUserData, logout } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    resumeVisibility: true,
    showCurrentEmployer: false,
  });

  const [notifications, setNotifications] = useState({
    jobRecommendations: true,
    applicationUpdates: true,
    recruiterMessages: true,
    profileViews: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await settings.get();
        if (res.data?.success) {
          setEmail(res.data.account?.email || userData?.email || '');
          if (res.data.privacy) {
            setPrivacy(res.data.privacy);
          }
          if (res.data.notifications) {
            setNotifications(res.data.notifications);
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
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
        email,
        privacy,
        notifications,
      });

      if (res.data?.success) {
        toast.success('Account settings saved successfully');
        setCurrentPassword('');
        setNewPassword('');
        // Sync email in context
        updateUserData({ email: res.data.account?.email });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePrivacyChange = async (val) => {
    const updatedPrivacy = { profileVisibility: val, resumeVisibility: val };
    setPrivacy(updatedPrivacy);
    try {
      await settings.update({
        email,
        privacy: updatedPrivacy,
        notifications,
      });
      toast.success('Profile privacy updated');
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
      toast.error('Failed to update privacy settings');
      // Revert state
      setPrivacy(privacy);
    }
  };

  const handleNotifChange = async (key, val) => {
    const updatedNotifs = { ...notifications, [key]: val };
    setNotifications(updatedNotifs);
    try {
      await settings.update({
        email,
        privacy,
        notifications: updatedNotifs,
      });
      toast.success('Notification preference updated');
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      toast.error('Failed to update notifications');
      // Revert state
      setNotifications(notifications);
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
      try {
        const res = await settings.deactivate();
        if (res.data?.success) {
          toast.success('Account deactivated successfully');
          logout();
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Failed to deactivate account:', error);
        toast.error('Failed to deactivate account');
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('WARNING: Are you sure you want to delete your account? This action is permanent and all your data will be lost.')) {
      const password = window.prompt("Please enter your current password to confirm account deletion:");
      if (password === null) return; // cancelled
      if (!password.trim()) {
        toast.error("Password is required to delete account");
        return;
      }

      try {
        const res = await auth.deleteAccount({ password });
        if (res.data?.success) {
          toast.success('Account deleted permanently');
          logout();
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Failed to delete account:', error);
        toast.error(error.response?.data?.message || 'Incorrect password. Account deletion failed.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 size={36} className="animate-spin text-purple-600" />
        <p className="text-sm font-bold text-neutral-500 uppercase tracking-widest animate-pulse">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Account */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-neutral-800 mb-2">Account</h2>
        <p className="text-xs text-neutral-400 mb-4">Manage your login credentials.</p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Email Address</label>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
              onBlur={e => e.target.style.boxShadow = ''}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Current Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
              onBlur={e => e.target.style.boxShadow = ''}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-600 mb-1.5">New Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
              onBlur={e => e.target.style.boxShadow = ''}
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            style={{ background: '#8B3A8F' }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Privacy</h2>
        <SettingRow 
          label="Profile Privacy" 
          description="Public: Companies can view your profile and download your resume. Private: Recruiters will not be able to find you or view your details."
        >
          <Toggle 
            checked={privacy.profileVisibility} 
            onChange={handlePrivacyChange} 
          />
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Notification Preferences</h2>
        <SettingRow label="Job Recommendations" description="Get notified about matching jobs">
          <Toggle checked={notifications.jobRecommendations} onChange={v => handleNotifChange('jobRecommendations', v)} />
        </SettingRow>
        <SettingRow label="Application Updates" description="Status changes on your applications">
          <Toggle checked={notifications.applicationUpdates} onChange={v => handleNotifChange('applicationUpdates', v)} />
        </SettingRow>
        <SettingRow label="Recruiter Messages" description="When a recruiter contacts you">
          <Toggle checked={notifications.recruiterMessages} onChange={v => handleNotifChange('recruiterMessages', v)} />
        </SettingRow>
        <SettingRow label="Profile Views" description="When someone views your profile">
          <Toggle checked={notifications.profileViews} onChange={v => handleNotifChange('profileViews', v)} />
        </SettingRow>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-red-600 mb-1">Danger Zone</h2>
        <p className="text-xs text-neutral-400 mb-4">These actions are permanent and cannot be undone.</p>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDeactivate}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-amber-200 text-amber-600 hover:bg-amber-50 transition-colors"
          >
            Deactivate Account
          </button>
          <button 
            onClick={handleDeleteAccount}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
