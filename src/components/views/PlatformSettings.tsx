import { useState } from 'react';
import { Settings, Bell, Mail, Globe, Code, Shield, CheckCircle2, Copy, Eye, EyeOff, ToggleLeft, ToggleRight } from 'lucide-react';
import { useAuditStore, type PlatformLanguage } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

const LANGUAGES: { code: PlatformLanguage; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
];

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-white/[0.04] last:border-0">
      <div className="flex-1 pr-6">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex-shrink-0 flex items-center gap-2 text-xs transition-colors"
      >
        {value ? (
          <><ToggleRight className="w-8 h-8 text-emerald-400" /><span className="text-emerald-400 font-semibold w-6">ON</span></>
        ) : (
          <><ToggleLeft className="w-8 h-8 text-slate-600" /><span className="text-slate-600 font-semibold w-6">OFF</span></>
        )}
      </button>
    </div>
  );
}

export default function PlatformSettings() {
  const { platformSettings, updatePlatformSettings, user, updateUser } = useAuditStore();
  const [savedSettings, setSavedSettings] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  function handleSave() {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  }

  function handleCopyKey() {
    navigator.clipboard.writeText(user.apiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  }

  async function handleRegenerateKey() {
    setRegenerating(true);
    await new Promise((res) => setTimeout(res, 1000));
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const newKey = 'oa_live_sk_' + Array.from({ length: 20 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    updateUser({ apiKey: newKey });
    setRegenerating(false);
  }

  const maskedKey = user.apiKey.slice(0, 12) + '•'.repeat(16);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Platform Settings</h2>
        <p className="text-sm text-slate-500 mt-1">Configure notifications, reporting, language preferences, and developer access.</p>
      </div>

      {/* Notifications */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Notification Preferences</span>
        </div>
        <ToggleRow
          label="Real-Time Alert Notifications"
          description="Receive in-app alerts when system diagnostics detect critical deliverability or DNS failures."
          value={platformSettings.notifications}
          onChange={(v) => updatePlatformSettings({ notifications: v })}
        />
        <ToggleRow
          label="Weekly Metric Email Reports"
          description="Receive a weekly performance digest including sequence health scores, domain trends, and agency rankings."
          value={platformSettings.weeklyReports}
          onChange={(v) => updatePlatformSettings({ weeklyReports: v })}
        />
      </PremiumCard>

      {/* Language */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Language & Localization</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {LANGUAGES.map((lang) => {
            const isActive = platformSettings.language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => updatePlatformSettings({ language: lang.code })}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-150 ${isActive ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-slate-900/40 border-white/[0.06] hover:border-white/10'}`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span className={`text-xs font-medium ${isActive ? 'text-indigo-300' : 'text-slate-400'}`}>{lang.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-700 mt-3">Selected: {LANGUAGES.find((l) => l.code === platformSettings.language)?.label}</p>
      </PremiumCard>

      {/* Developer settings */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-1">
          <Code className="w-4 h-4 text-emerald-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Developer Access</span>
        </div>
        <ToggleRow
          label="Developer Mode"
          description="Enable advanced JSON payload inspection, raw API response logging, and extended diagnostic output in the AI Terminal."
          value={platformSettings.developerMode}
          onChange={(v) => updatePlatformSettings({ developerMode: v })}
        />
        <div className="mt-4">
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">API Key</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                readOnly
                value={showApiKey ? user.apiKey : maskedKey}
                className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 font-mono focus:outline-none pr-10"
              />
              <button onClick={() => setShowApiKey((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors">
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <button onClick={handleCopyKey} className="px-3 rounded-lg bg-slate-800 border border-white/[0.08] hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200">
              {copiedApiKey ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <GlowButton variant="ghost" icon={<Shield className="w-3.5 h-3.5" />} loading={regenerating} onClick={handleRegenerateKey}>
              Regenerate Key
            </GlowButton>
            <p className="text-[10px] text-slate-700">Regenerating will invalidate the current key immediately.</p>
          </div>
        </div>
      </PremiumCard>

      {/* Email reporting config */}
      <PremiumCard glow="none">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="w-4 h-4 text-slate-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Weekly Report Configuration</span>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Report Delivery Email</label>
            <input
              type="email"
              defaultValue={user.email}
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-500/40"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Report Day</label>
            <select className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-500/40">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((d) => (
                <option key={d} value={d} className="bg-slate-900">{d}</option>
              ))}
            </select>
          </div>
        </div>
      </PremiumCard>

      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.05]">
        <GlowButton
          variant="primary"
          icon={savedSettings ? <CheckCircle2 className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
          onClick={handleSave}
        >
          {savedSettings ? 'Settings Saved!' : 'Save All Settings'}
        </GlowButton>
        {savedSettings && <span className="text-xs text-emerald-400">All preferences updated</span>}
      </div>
    </div>
  );
}
