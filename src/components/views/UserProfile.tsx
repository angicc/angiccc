import { useState, useRef } from 'react';
import { User, Camera, Key, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Crown } from 'lucide-react';
import { useAuditStore } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

const PLAN_CONFIG = {
  starter: { label: 'Starter', color: 'text-slate-400', bg: 'bg-slate-700/30 border-slate-600/20' },
  growth: { label: 'Growth', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  agency: { label: 'Agency Enterprise', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
};

export default function UserProfile() {
  const { user, updateUser } = useAuditStore();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatarUrl);
  const [savedProfile, setSavedProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const planCfg = PLAN_CONFIG[user.plan];

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      setAvatarPreview(result);
      updateUser({ avatarUrl: result });
    };
    reader.readAsDataURL(file);
  }

  function handleSaveProfile() {
    if (!name.trim() || !email.trim()) return;
    updateUser({ name: name.trim(), email: email.trim() });
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2500);
  }

  function handlePasswordReset() {
    setPasswordError('');
    if (!currentPassword) { setPasswordError('Current password is required.'); return; }
    if (newPassword.length < 8) { setPasswordError('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
    setPasswordSaved(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">User Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Manage your account details, profile image, and security settings.</p>
      </div>

      {/* Profile card */}
      <PremiumCard glow="indigo">
        <div className="flex items-center gap-2 mb-5">
          <User className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Account Identity</span>
          <span className={`ml-auto flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${planCfg.bg} ${planCfg.color}`}>
            <Crown className="w-3 h-3" />{planCfg.label}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex items-start gap-5 mb-6">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-white/[0.1] overflow-hidden flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-slate-600">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-indigo-500 border-2 border-slate-950 flex items-center justify-center hover:bg-indigo-400 transition-colors"
            >
              <Camera className="w-3 h-3 text-white" />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-200">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Upload new photo
            </button>
            <p className="text-[10px] text-slate-700 mt-0.5">JPG, PNG or WebP. Max 5MB.</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Legal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <GlowButton
              variant="primary"
              icon={savedProfile ? <CheckCircle2 className="w-4 h-4" /> : undefined}
              onClick={handleSaveProfile}
            >
              {savedProfile ? 'Saved!' : 'Save Profile'}
            </GlowButton>
            {savedProfile && <span className="text-xs text-emerald-400">Profile updated successfully</span>}
          </div>
        </div>
      </PremiumCard>

      {/* Password reset */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-5">
          <Key className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Password & Security</span>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Current Password</label>
            <div className="relative">
              <input
                type={showPasswords ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 pr-10 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500/40 transition-all"
              />
              <button onClick={() => setShowPasswords((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500/40 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Confirm New Password</label>
              <input
                type={showPasswords ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500/40 transition-all"
              />
            </div>
          </div>
          {passwordError && (
            <div className="flex items-center gap-2 text-xs text-red-400 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{passwordError}
            </div>
          )}
          {passwordSaved && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" /> Password updated successfully
            </div>
          )}
          <GlowButton variant="secondary" icon={<Shield className="w-4 h-4" />} onClick={handlePasswordReset}>
            Update Password
          </GlowButton>
        </div>
      </PremiumCard>

      {/* Account stats */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Account Status</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Current Plan', value: planCfg.label, color: planCfg.color },
            { label: 'Member Since', value: 'Jun 2026', color: 'text-slate-300' },
            { label: 'Audits Run', value: '24', color: 'text-indigo-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-slate-900/40 border border-white/[0.05] text-center">
              <p className={`text-lg font-bold ${color}`}>{value}</p>
              <p className="text-[10px] uppercase tracking-widest text-slate-600 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </PremiumCard>
    </div>
  );
}
