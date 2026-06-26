import { useState } from 'react';
import { Search, CheckCircle2, XCircle, ExternalLink, Users, Mail, Globe, Zap, AlertCircle, Download } from 'lucide-react';
import { useAuditStore, type Lead } from '../../store/auditState';
import PremiumCard from '../ui/PremiumCard';
import GlowButton from '../ui/GlowButton';

const MOCK_SCRAPED: Lead[] = [
  { id: 'sc1', companyName: 'Rainmaker Agency', ownerName: 'Tyler Brooks', domain: 'rainmakeragency.com', email: 't.brooks@rainmakeragency.com', linkedInUrl: 'linkedin.com/in/tylerbrooks', verified: true },
  { id: 'sc2', companyName: 'Momentum Sales Co.', ownerName: 'Aisha Kamara', domain: 'momentumsales.co', email: 'a.kamara@momentumsales.co', linkedInUrl: 'linkedin.com/in/aishakamara', verified: true },
  { id: 'sc3', companyName: 'Summit B2B Partners', ownerName: 'Ryan Gallagher', domain: 'summitb2b.io', email: 'r.gallagher@summitb2b.io', linkedInUrl: 'linkedin.com/in/ryangallagher', verified: false },
  { id: 'sc4', companyName: 'Cascade Revenue', ownerName: 'Mei Lin', domain: 'cascaderevenue.com', email: 'm.lin@cascaderevenue.com', linkedInUrl: 'linkedin.com/in/meilin', verified: true },
  { id: 'sc5', companyName: 'Frontier Growth Labs', ownerName: 'Samuel Okafor', domain: 'frontiergrowthlabs.com', email: 's.okafor@frontiergrowthlabs.com', linkedInUrl: 'linkedin.com/in/samuelokafor', verified: true },
  { id: 'sc6', companyName: 'Vertex Pipeline Inc.', ownerName: 'Chloe Dupont', domain: 'vertexpipeline.io', email: 'c.dupont@vertexpipeline.io', linkedInUrl: 'linkedin.com/in/chloe-dupont', verified: false },
  { id: 'sc7', companyName: 'Ironclad Outreach', ownerName: 'Marcus Webb', domain: 'ironcladoutreach.com', email: 'm.webb@ironcladoutreach.com', linkedInUrl: 'linkedin.com/in/marcuswebb', verified: true },
  { id: 'sc8', companyName: 'Horizon SDR', ownerName: 'Fatima Hassan', domain: 'horizonsdr.io', email: 'f.hassan@horizonsdr.io', linkedInUrl: 'linkedin.com/in/fatimahassan', verified: true },
  { id: 'sc9', companyName: 'Zenith Demand Gen', ownerName: 'Ethan Cole', domain: 'zenithdemand.com', email: 'e.cole@zenithdemand.com', linkedInUrl: 'linkedin.com/in/ethancole', verified: true },
  { id: 'sc10', companyName: 'Paragon Lead Co.', ownerName: 'Nina Patel', domain: 'paragonleads.co', email: 'n.patel@paragonleads.co', linkedInUrl: 'linkedin.com/in/ninapatel', verified: false },
];

export default function LeadScraperHub() {
  const { leadScraper, setLeadQuery, setLeads, setLeadScraperPhase, toggleLeadSelection, selectAllLeads, clearLeadSelection, pushLeadsToContext } = useAuditStore();

  const [localNiche, setLocalNiche] = useState(leadScraper.niche);
  const [localLocation, setLocalLocation] = useState(leadScraper.location);
  const [pushedToContext, setPushedToContext] = useState(false);

  const leads = leadScraper.leads.length > 0 ? leadScraper.leads : MOCK_SCRAPED;
  const selectedIds = leadScraper.selectedIds;
  const phase = leadScraper.phase;

  const verifiedCount = leads.filter((l) => l.verified).length;
  const linkedInCount = leads.filter((l) => l.linkedInUrl).length;
  const allSelected = selectedIds.length === leads.length && leads.length > 0;

  async function handleScrape() {
    setLeadQuery(localNiche, localLocation);
    setLeadScraperPhase('scraping');
    clearLeadSelection();
    await new Promise((res) => setTimeout(res, 1800));
    setLeads(MOCK_SCRAPED);
    setLeadScraperPhase('complete');
  }

  function handlePushToContext() {
    pushLeadsToContext();
    setPushedToContext(true);
    setTimeout(() => setPushedToContext(false), 3000);
  }

  function handleToggleAll() {
    if (allSelected) clearLeadSelection();
    else selectAllLeads();
  }

  function exportToCsv() {
    const header = 'Company,Owner,Domain,Email,LinkedIn,Verified';
    const rows = leads.map((l) => `"${l.companyName}","${l.ownerName}","${l.domain}","${l.email}","${l.linkedInUrl}","${l.verified}"`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${localNiche.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Lead Extraction & Scraper Hub</h2>
        <p className="text-sm text-slate-500 mt-1">Target a niche and location to extract verified B2B leads ready for sequence injection.</p>
      </div>

      {/* Search panel */}
      <PremiumCard glow="indigo">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Data Triage Parameters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Target Niche</label>
            <input
              type="text"
              value={localNiche}
              onChange={(e) => setLocalNiche(e.target.value)}
              placeholder="e.g., Real Estate Agencies, SaaS Founders"
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-1.5 font-medium">Target Location</label>
            <input
              type="text"
              value={localLocation}
              onChange={(e) => setLocalLocation(e.target.value)}
              placeholder="e.g., United States, New York, UK"
              className="w-full bg-slate-800/60 border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
          </div>
          <div className="flex items-end">
            <GlowButton
              variant="primary"
              icon={<Search className="w-4 h-4" />}
              loading={phase === 'scraping'}
              onClick={handleScrape}
              className="w-full justify-center"
            >
              {phase === 'scraping' ? 'Extracting Leads...' : 'Run Lead Extraction'}
            </GlowButton>
          </div>
        </div>
      </PremiumCard>

      {/* Stats bar */}
      {phase === 'complete' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: 'Total Extracted', value: leads.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { icon: CheckCircle2, label: 'Verified Emails', value: verifiedCount, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
            { icon: ExternalLink, label: 'LinkedIn Profiles', value: linkedInCount, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
            { icon: AlertCircle, label: 'Unverified', value: leads.length - verifiedCount, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
          ].map(({ icon: Icon, label, value, color, bg }) => (
            <PremiumCard key={label} glow="none">
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center mb-3 ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className={`text-2xl font-black tabular-nums ${color}`}>{value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mt-1">{label}</p>
            </PremiumCard>
          ))}
        </div>
      )}

      {/* Lead table */}
      {(phase === 'complete' || leads.length > 0) && (
        <PremiumCard glow="none" noPad>
          <div className="px-5 py-3 border-b border-white/[0.05] flex items-center gap-3 flex-wrap">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Lead Triage Map</span>
            <span className="text-xs text-slate-600">— {leads.length} results for "{localNiche}" in {localLocation}</span>
            <div className="ml-auto flex items-center gap-2">
              {selectedIds.length > 0 && (
                <>
                  <span className="text-xs text-emerald-400 font-mono">{selectedIds.length} selected</span>
                  <GlowButton
                    variant="primary"
                    icon={pushedToContext ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                    onClick={handlePushToContext}
                  >
                    {pushedToContext ? 'Pushed to Context!' : 'Push to Context Engine'}
                  </GlowButton>
                </>
              )}
              <GlowButton variant="ghost" icon={<Download className="w-3.5 h-3.5" />} onClick={exportToCsv}>
                Export CSV
              </GlowButton>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={handleToggleAll}
                      className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer"
                    />
                  </th>
                  {['Company', 'Owner', 'Domain', 'B2B Email', 'LinkedIn', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: Lead) => (
                  <tr
                    key={lead.id}
                    className={`border-b border-white/[0.03] transition-colors ${selectedIds.includes(lead.id) ? 'bg-emerald-500/5' : 'hover:bg-slate-800/30'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lead.id)}
                        onChange={() => toggleLeadSelection(lead.id)}
                        className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">{lead.companyName}</td>
                    <td className="px-4 py-3 text-slate-400">{lead.ownerName}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Globe className="w-3 h-3 text-slate-600" />
                        {lead.domain}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-600" />
                        <span className="text-slate-300 font-mono text-xs">{lead.email}</span>
                        {lead.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {lead.linkedInUrl ? (
                        <a href={`https://${lead.linkedInUrl}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs transition-colors">
                          <ExternalLink className="w-3 h-3" /> View Profile
                        </a>
                      ) : (
                        <span className="text-slate-700 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {lead.verified ? (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold w-fit">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold w-fit">
                          <XCircle className="w-2.5 h-2.5" /> Unverified
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PremiumCard>
      )}
    </div>
  );
}
