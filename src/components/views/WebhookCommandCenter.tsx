import { useState } from 'react';
import { Webhook, Plus, Trash2, Play, CheckCircle2, XCircle, Clock, ToggleLeft, ToggleRight, Copy } from 'lucide-react';
import { useAuditStore, type WebhookEntry, type WebhookPlatform, type WebhookTrigger } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

const PLATFORM_COLORS: Record<WebhookPlatform, string> = {
  n8n: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  instantly: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  zapier: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  make: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  custom: 'text-slate-400 bg-slate-700/30 border-slate-600/20',
};

const PLATFORM_LABELS: Record<WebhookPlatform, string> = { n8n: 'n8n', instantly: 'Instantly', zapier: 'Zapier', make: 'Make', custom: 'Custom' };

const TRIGGER_LABELS: Record<WebhookTrigger, string> = {
  on_reply: 'On Reply',
  on_open: 'On Email Open',
  on_click: 'On Link Click',
  on_meeting_booked: 'Meeting Booked',
  on_sequence_end: 'Sequence End',
};

const STATUS_CONFIG = {
  success: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Success' },
  failed: { icon: <XCircle className="w-3.5 h-3.5" />, classes: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Failed' },
  pending: { icon: <Clock className="w-3.5 h-3.5" />, classes: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Pending' },
  untested: { icon: <Clock className="w-3.5 h-3.5" />, classes: 'text-slate-400 bg-slate-700/30 border-slate-600/20', label: 'Untested' },
};

const EMPTY_WEBHOOK: Omit<WebhookEntry, 'id'> = {
  name: '',
  url: '',
  platform: 'n8n',
  trigger: 'on_reply',
  status: 'untested',
  lastTestedAt: null,
  customPayload: '{\n  "event": "{{trigger}}",\n  "prospect_email": "{{email}}",\n  "company": "{{company}}",\n  "timestamp": "{{timestamp}}"\n}',
  isActive: true,
};

function WebhookListItem({ webhook, selected, onSelect }: { webhook: WebhookEntry; selected: boolean; onSelect: () => void }) {
  const { updateWebhook } = useAuditStore();
  const statusCfg = STATUS_CONFIG[webhook.status];
  const platformCls = PLATFORM_COLORS[webhook.platform];

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left px-4 py-3 rounded-xl border transition-all duration-150 ${selected ? 'bg-slate-800/60 border-indigo-500/30 ring-1 ring-indigo-500/20' : 'bg-slate-900/40 border-white/[0.06] hover:border-white/10'}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-200 truncate flex-1">{webhook.name || 'Unnamed Webhook'}</span>
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${statusCfg.classes}`}>
          {statusCfg.icon}{statusCfg.label}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${platformCls}`}>{PLATFORM_LABELS[webhook.platform]}</span>
        <span className="text-[10px] text-slate-600">{TRIGGER_LABELS[webhook.trigger]}</span>
      </div>
      <p className="text-[10px] font-mono text-slate-600 truncate mt-1">{webhook.url || 'No URL configured'}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-700">{webhook.lastTestedAt ? `Tested ${new Date(webhook.lastTestedAt).toLocaleDateString()}` : 'Never tested'}</span>
        <button
          onClick={(e) => { e.stopPropagation(); updateWebhook(webhook.id, { isActive: !webhook.isActive }); }}
          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
        >
          {webhook.isActive ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-600" />}
          {webhook.isActive ? 'Active' : 'Inactive'}
        </button>
      </div>
    </button>
  );
}

function WebhookDetailPanel({ webhook, onDelete }: { webhook: WebhookEntry; onDelete: () => void }) {
  const { updateWebhook, setWebhookStatus } = useAuditStore();
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleTest() {
    if (!webhook.url.trim()) return;
    setTesting(true);
    setTestResponse(null);
    await new Promise((res) => setTimeout(res, 1400));
    const success = webhook.url.startsWith('http');
    setWebhookStatus(webhook.id, success ? 'success' : 'failed');
    setTestResponse(success
      ? `HTTP 200 OK\n\nResponse received at ${new Date().toISOString()}\n\n{\n  "status": "received",\n  "webhook_id": "${webhook.id}",\n  "trigger": "${webhook.trigger}"\n}`
      : `HTTP 422 Unprocessable Entity\n\nThe endpoint rejected the payload. Verify the URL and ensure the receiver is configured for this trigger type.`
    );
    setTesting(false);
  }

  function handleCopyUrl() {
    navigator.clipboard.writeText(webhook.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">Configure Webhook</h3>
        <GlowButton variant="danger" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={onDelete}>Delete</GlowButton>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Webhook Name</label>
          <input
            value={webhook.name}
            onChange={(e) => updateWebhook(webhook.id, { name: e.target.value })}
            placeholder="e.g., n8n — Meeting Trigger"
            className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Endpoint URL</label>
          <div className="flex gap-2">
            <input
              value={webhook.url}
              onChange={(e) => updateWebhook(webhook.id, { url: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="flex-1 bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 font-mono"
            />
            <button onClick={handleCopyUrl} className="px-3 py-2 rounded-lg bg-slate-800 border border-white/[0.08] hover:bg-slate-700 transition-colors text-slate-400 hover:text-slate-200">
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Platform</label>
            <select
              value={webhook.platform}
              onChange={(e) => updateWebhook(webhook.id, { platform: e.target.value as WebhookPlatform })}
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            >
              {(Object.keys(PLATFORM_LABELS) as WebhookPlatform[]).map((p) => (
                <option key={p} value={p} className="bg-slate-900">{PLATFORM_LABELS[p]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Trigger Event</label>
            <select
              value={webhook.trigger}
              onChange={(e) => updateWebhook(webhook.id, { trigger: e.target.value as WebhookTrigger })}
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            >
              {(Object.keys(TRIGGER_LABELS) as WebhookTrigger[]).map((t) => (
                <option key={t} value={t} className="bg-slate-900">{TRIGGER_LABELS[t]}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">JSON Payload Template</label>
          <textarea
            value={webhook.customPayload}
            onChange={(e) => updateWebhook(webhook.id, { customPayload: e.target.value })}
            rows={7}
            className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-emerald-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 font-mono resize-none"
          />
        </div>
      </div>

      <GlowButton
        variant="primary"
        icon={<Play className="w-4 h-4" />}
        loading={testing}
        onClick={handleTest}
        className="w-full justify-center"
      >
        {testing ? 'Testing Endpoint...' : 'Test Webhook'}
      </GlowButton>

      {testResponse && (
        <div className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap ${testResponse.includes('200') ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300' : 'bg-red-500/5 border-red-500/20 text-red-300'}`}>
          {testResponse}
        </div>
      )}
    </div>
  );
}

export default function WebhookCommandCenter() {
  const { webhooks, addWebhook, removeWebhook } = useAuditStore();
  const [selectedId, setSelectedId] = useState<string | null>(webhooks[0]?.id ?? null);

  const selectedWebhook = webhooks.find((w) => w.id === selectedId) ?? null;

  function handleAddWebhook() {
    const newEntry: WebhookEntry = { ...EMPTY_WEBHOOK, id: `wh_${Date.now()}`, name: 'New Webhook' };
    addWebhook(newEntry);
    setSelectedId(newEntry.id);
  }

  function handleDelete() {
    if (!selectedId) return;
    removeWebhook(selectedId);
    const remaining = webhooks.filter((w) => w.id !== selectedId);
    setSelectedId(remaining[0]?.id ?? null);
  }

  const activeCount = webhooks.filter((w) => w.isActive).length;
  const failedCount = webhooks.filter((w) => w.status === 'failed').length;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Bi-Directional Webhook Hub</h2>
          <p className="text-sm text-slate-500 mt-1">Configure outbound automation hooks to n8n, Instantly, Zapier, Make, and custom endpoints.</p>
        </div>
        <GlowButton variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={handleAddWebhook}>Add Webhook</GlowButton>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Webhooks', value: webhooks.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Active', value: activeCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Failed', value: failedCount, color: failedCount > 0 ? 'text-red-400' : 'text-slate-600', bg: failedCount > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-800/30 border-white/[0.05]' },
        ].map(({ label, value, color, bg }) => (
          <PremiumCard key={label} glow="none">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
              <Webhook className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-3xl font-black tabular-nums ${color}`}>{value}</p>
            <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{label}</p>
          </PremiumCard>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Webhook list */}
        <div className="xl:col-span-2 space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Webhook className="w-4 h-4 text-slate-500" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Configured Endpoints</span>
          </div>
          {webhooks.map((wh) => (
            <WebhookListItem key={wh.id} webhook={wh} selected={selectedId === wh.id} onSelect={() => setSelectedId(wh.id)} />
          ))}
          {webhooks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <Webhook className="w-8 h-8 text-slate-700" />
              <p className="text-slate-600 text-xs">No webhooks configured</p>
            </div>
          )}
        </div>

        {/* Detail panel */}
        <PremiumCard glow="none" className="xl:col-span-3">
          {selectedWebhook ? (
            <WebhookDetailPanel webhook={selectedWebhook} onDelete={handleDelete} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 gap-3 text-center">
              <Webhook className="w-10 h-10 text-slate-700" />
              <p className="text-slate-500 text-sm">Select a webhook to configure</p>
              <GlowButton variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={handleAddWebhook}>Add First Webhook</GlowButton>
            </div>
          )}
        </PremiumCard>
      </div>
    </div>
  );
}
