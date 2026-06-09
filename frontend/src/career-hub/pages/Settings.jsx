import { useState } from 'react';
import toast from 'react-hot-toast';

const SettingRow = ({ label, description, children }) => (
  <div className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0">
    <div>
      <p className="text-sm font-medium text-neutral-800">{label}</p>
      {description && <p className="text-xs text-neutral-400 mt-0.5">{description}</p>}
    </div>
    {children}
  </div>
);

const Toggle = ({ defaultOn = false }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(p => !p)}
      className="relative w-11 h-6 rounded-full transition-colors duration-200"
      style={{ background: on ? '#8B3A8F' : '#E5E7EB' }}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};

const Settings = () => {
  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const handleDeactivate = () => {
    if (window.confirm('Are you sure you want to deactivate your account? You can reactivate it later by logging in.')) {
      toast.success('Account deactivated');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('WARNING: Are you sure you want to delete your account? This action is permanent and all your data will be lost.')) {
      toast.error('Account deleted permanently');
    }
  };

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
              defaultValue="rahul.sharma@gmail.com"
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
              className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-800 focus:outline-none"
              onFocus={e => e.target.style.boxShadow = '0 0 0 2px #8B3A8F40'}
              onBlur={e => e.target.style.boxShadow = ''}
            />
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90"
            style={{ background: '#8B3A8F' }}
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Privacy</h2>
        <SettingRow label="Profile Visibility" description="Allow recruiters to find your profile">
          <Toggle defaultOn={true} />
        </SettingRow>
        <SettingRow label="Resume Visibility" description="Show resume to recruiters">
          <Toggle defaultOn={true} />
        </SettingRow>
        <SettingRow label="Show Current Employer" description="Display your current company on profile">
          <Toggle defaultOn={false} />
        </SettingRow>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Notification Preferences</h2>
        <SettingRow label="Job Recommendations" description="Get notified about matching jobs">
          <Toggle defaultOn={true} />
        </SettingRow>
        <SettingRow label="Application Updates" description="Status changes on your applications">
          <Toggle defaultOn={true} />
        </SettingRow>
        <SettingRow label="Recruiter Messages" description="When a recruiter contacts you">
          <Toggle defaultOn={true} />
        </SettingRow>
        <SettingRow label="Profile Views" description="When someone views your profile">
          <Toggle defaultOn={false} />
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
