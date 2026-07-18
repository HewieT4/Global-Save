import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Gavel, Landmark, Search, 
  ChevronRight, Reply, Forward, Archive, Trash2, 
  MoreHorizontal, Paperclip, Check, Play, HelpCircle, 
  Coins, Terminal, Users, ArrowUpRight, ArrowLeft,
  BookOpen, FileText, Briefcase, ExternalLink, Calendar,
  MapPin, ShieldAlert, Award, AlertCircle, RefreshCw
} from 'lucide-react';

// Primitives

export const AppleLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg 
    viewBox="0 0 384 512" 
    fill="currentColor" 
    className={className}
  >
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

export const LogoMark: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg 
    viewBox="0 0 256 256" 
    fill="currentColor" 
    className={className}
  >
    <path d="M 0 128 C 70.692 128 128 185.308 128 256 L 64 256 C 64 220.654 35.346 192 0 192 Z M 256 192 C 220.654 192 192 220.654 192 256 L 128 256 C 128 185.308 185.308 128 256 128 Z M 128 0 C 128 70.692 70.692 128 0 128 L 0 64 C 35.346 64 64 35.346 64 0 Z M 192 0 C 192 35.346 220.654 64 256 64 L 256 128 C 185.308 128 128 70.692 128 0 Z" />
  </svg>
);

interface AppleButtonProps {
  label: string;
  onClick?: () => void;
  full?: boolean;
}

export const AppleButton: React.FC<AppleButtonProps> = ({ label, onClick, full = false }) => (
  <button 
    onClick={onClick}
    className="group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98] cursor-pointer"
    style={{ width: full ? '100%' : 'auto' }}
  >
    <LogoMark className="w-4 h-4 text-black" />
    <span>{label}</span>
    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
  </button>
);

interface SectionEyebrowProps {
  label: string;
  tag?: string;
}

export const SectionEyebrow: React.FC<SectionEyebrowProps> = ({ label, tag }) => (
  <div className="inline-flex items-center gap-3.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02]">
    <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
    <span className="text-white text-xs font-semibold uppercase tracking-wider">{label}</span>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-medium text-white/50 bg-white/[0.03]">
        {tag}
      </span>
    )}
  </div>
);

const gradientStyle: React.CSSProperties = {
  backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #3D81E3 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'url(#c3-noise)'
};

interface LandingPageProps {
  onLaunchApp: () => void;
}

type ActiveTabType = 'home' | 'solutions' | 'pricing' | 'blog' | 'docs' | 'careers';

interface MockProposal {
  id: string;
  sender: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  status: 'Pending Sign' | 'Approved' | 'Vetoed' | 'Flagged' | 'Executed';
  creator: string;
  amount: string;
  recipient: string;
  fullDesc: string;
  signatures: number;
  requiredSignatures: number;
  aiSummary: string;
  attachment: string;
  logs: string[];
}

const INITIAL_MOCK_PROPOSALS: MockProposal[] = [
  { 
    id: 'prop-1', 
    sender: 'Coop-Travel', 
    title: 'GPU Server Rental', 
    desc: 'Proposed by Marcus. 2/3 signatures received. Pending execution.', 
    time: '9:41 AM', 
    unread: true, 
    status: 'Pending Sign',
    creator: 'Marcus (AI Engineer)',
    amount: '450 USDC',
    recipient: '0xGPU_RENTAL_SERVICES_7c8A',
    fullDesc: 'Here is the proposal details for the GPU Server Rental for our AI agent project. This will fund 3 high-performance GPU nodes for 30 days. The pricing matches our contract agreement and will be paid in USDC. Please sign the proposal so we can proceed with deployment.',
    signatures: 2,
    requiredSignatures: 3,
    aiSummary: 'Valid expense request. Verified billing invoice attached. Recipient address matches registered service provider. Ample vault liquidity available. Low risk factor.',
    attachment: 'invoice-gpu-rental.pdf',
    logs: ['[09:40] Proposal created by Marcus', '[09:41] Signed by Sophia Chen']
  },
  { 
    id: 'prop-2', 
    sender: 'NomadNest', 
    title: 'Office Space Deposit', 
    desc: 'Vetoed by Sophia. Reason: address mismatch on landlord KYC.', 
    time: '8:12 AM', 
    unread: true, 
    status: 'Vetoed',
    creator: 'David Lim (Treasurer)',
    amount: '1,500 USDC',
    recipient: '0xLANDLORD_ESCROW_ADDRESS_921b',
    fullDesc: 'Deposit for our joint workspace hub in Cape Town. Sophia flagged that the landlord\'s payout address did not match the KYC contract details. Veto lock has been invoked to allow the group to reconcile verification documents.',
    signatures: 2,
    requiredSignatures: 2,
    aiSummary: 'WARNING: Recipient address mismatch detected. The payout address is different from the registered landlord registry contract. Suggest flag or rejection.',
    attachment: 'workspace-lease-draft.pdf',
    logs: ['[08:00] Proposal created by David Lim', '[08:05] Signed by Andrew', '[08:12] VETO invoked by Sophia Chen. Reason: Address mismatch']
  },
  { 
    id: 'prop-3', 
    sender: 'CommuniFund', 
    title: 'Marketing Grant', 
    desc: 'Escalated to dispute voting center. Proposal flagged as high-risk.', 
    time: 'Yesterday', 
    unread: false,
    status: 'Flagged',
    creator: '0xGUEST_CONTRIBUTOR_a9d2',
    amount: '5,000 MONAD',
    recipient: '0xSHADY_PROMOTER_ADDRESS_1a3f',
    fullDesc: 'Funding for an unverified marketing campaign. The proposal was flagged because the creator has a low reputation score and the recipient address is blacklisted in community lists.',
    signatures: 1,
    requiredSignatures: 3,
    aiSummary: 'CAUTION: Highly suspicious activity. Proposer has low reputation. Recipient address matches known phishing list. Vote REJECT recommended.',
    attachment: 'shady-marketing-proposal.pdf',
    logs: ['[Yesterday] Proposal created by 0xGUEST', '[Yesterday] FLAGGED & LOCKED by Treasurer. Escalated to community dispute voting. Voting deadline: 24h.']
  },
  { 
    id: 'prop-4', 
    sender: 'Coop-Travel', 
    title: 'Rent Payout Executed', 
    desc: 'Transaction confirmed on Monad block #14289052. Total $4,200.', 
    time: 'Yesterday', 
    unread: false,
    status: 'Executed',
    creator: 'Sophia Chen (Treasurer)',
    amount: '4,200 USDT',
    recipient: '0xPROPERTIES_MANAGEMENT_d892',
    fullDesc: 'Monthly rental fee for our co-living villa in Bali. Signature threshold 3-of-3 satisfied, veto lock period passed without disputes, and funds successfully discharged.',
    signatures: 3,
    requiredSignatures: 3,
    aiSummary: 'Verified transaction. Executed on Monad Testnet block #14289052. Gas paid: 85,000 gwei.',
    attachment: 'bali-lease-receipt.pdf',
    logs: ['[2 Days Ago] Proposal created', '[2 Days Ago] Signed by Sophia, Andrew, and Marcus', '[Yesterday] 24h Lock expired. Executed on-chain by Sophia.']
  }
];

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [yearly, setYearly] = useState(false);
  const [currentTime, setCurrentTime] = useState('Wed May 6 1:09 PM');

  // Interactive Mockup States
  const [mockProposals, setMockProposals] = useState<MockProposal[]>(INITIAL_MOCK_PROPOSALS);
  const [mockSelectedId, setMockSelectedId] = useState<string>('prop-1');
  const [mockSidebarFilter, setMockSidebarFilter] = useState<'all' | 'veto' | 'dispute' | 'completed' | 'reputation'>('all');
  const [mockNotification, setMockNotification] = useState<string | null>(null);

  // Interactive Documentation States
  const [activeDocSection, setActiveDocSection] = useState<string>('intro');

  useEffect(() => {
    const updateTime = () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const d = new Date();
      const day = days[d.getDay()];
      const month = months[d.getMonth()];
      const date = d.getDate();
      let hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(`${day} ${month} ${date} ${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tab: ActiveTabType, e: React.MouseEvent) => {
    e.preventDefault();
    if (tab === 'pricing') {
      setActiveTab('home');
      setTimeout(() => {
        const pricingSec = document.getElementById('pricing-section');
        if (pricingSec) {
          pricingSec.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Mockup Interactive Actions
  const triggerNotification = (msg: string) => {
    setMockNotification(msg);
    setTimeout(() => {
      setMockNotification(null);
    }, 4000);
  };

  const handleMockSign = (proposalId: string) => {
    setMockProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      if (p.status !== 'Pending Sign') {
        triggerNotification(`Cannot sign proposal: Already ${p.status}`);
        return p;
      }
      const nextSigs = p.signatures + 1;
      let nextStatus = p.status;
      if (nextSigs >= p.requiredSignatures) {
        nextStatus = 'Approved';
        triggerNotification('Signature threshold met! Proposal Approved. 24h Veto window started.');
      } else {
        triggerNotification(`Signed proposal successfully (${nextSigs}/${p.requiredSignatures})`);
      }
      return {
        ...p,
        signatures: nextSigs,
        status: nextStatus,
        logs: [...p.logs, `[Now] Signed by You (0xUSER_VIRTUAL_WALLET)`]
      };
    }));
  };

  const handleMockVeto = (proposalId: string) => {
    setMockProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      if (p.status !== 'Pending Sign' && p.status !== 'Approved') {
        triggerNotification(`Cannot veto proposal in status: ${p.status}`);
        return p;
      }
      triggerNotification('Veto lock active! Execution paused for 24 hours.');
      return {
        ...p,
        status: 'Vetoed',
        signatures: 0,
        logs: [...p.logs, `[Now] VETOED by You. Reason: Suspicious activity flag.`]
      };
    }));
  };

  const handleMockFlag = (proposalId: string) => {
    setMockProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      if (p.status !== 'Approved' && p.status !== 'Vetoed') {
        triggerNotification(`Cannot flag proposal: Must be Approved or Vetoed`);
        return p;
      }
      triggerNotification('Proposal Flagged & Locked! Escalated to Dispute Center.');
      return {
        ...p,
        status: 'Flagged',
        logs: [...p.logs, `[Now] FLAGGED by You. Voting period initiated.`]
      };
    }));
  };

  const handleMockExecute = (proposalId: string) => {
    setMockProposals(prev => prev.map(p => {
      if (p.id !== proposalId) return p;
      if (p.status !== 'Approved') {
        triggerNotification(`Cannot execute: Signature threshold not fully met.`);
        return p;
      }
      triggerNotification('Transaction Discharged! Funds transferred successfully.');
      return {
        ...p,
        status: 'Executed',
        logs: [...p.logs, `[Now] EXECUTED on-chain by You. Block confirmed.`]
      };
    }));
  };

  // Filtered mock proposals list
  const filteredMockProposals = mockProposals.filter(p => {
    if (mockSidebarFilter === 'all') return true;
    if (mockSidebarFilter === 'veto') return p.status === 'Vetoed';
    if (mockSidebarFilter === 'dispute') return p.status === 'Flagged';
    if (mockSidebarFilter === 'completed') return p.status === 'Executed';
    return true;
  });

  const selectedMockProposal = mockProposals.find(p => p.id === mockSelectedId) || mockProposals[0];

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
      {/* Global background video (fixed, behind everything) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-45"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
        />
      </div>

      {/* Global vertical guides */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* Global SVG noise filters */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Section 1 — Navbar */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-50 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md"
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
          <LogoMark className="w-8 h-8 text-white" />
        </div>

        <div className="hidden md:flex gap-8">
          {[
            { id: 'solutions', label: 'Solutions' },
            { id: 'pricing', label: 'Pricing' },
            { id: 'blog', label: 'Blog' },
            { id: 'docs', label: 'Documentation' },
            { id: 'careers', label: 'Careers' }
          ].map((tab, i) => (
            <motion.a 
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: activeTab === tab.id ? 1 : 0.7, 
                y: 0 
              }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              whileHover={{ opacity: 1 }}
              onClick={(e) => handleTabClick(tab.id as ActiveTabType, e)}
              href={`#${tab.id}`}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.id ? 'text-brand font-bold border-b border-brand/40 pb-0.5' : 'text-white'
              }`}
            >
              {tab.label}
            </motion.a>
          ))}
        </div>

        <div className="hidden md:block">
          <AppleButton label="Launch GlobalSave" onClick={onLaunchApp} />
        </div>

        <button 
          onClick={onLaunchApp}
          className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Play className="w-4 h-4 fill-current text-white" />
        </button>
      </motion.nav>

      {/* Sub-page Render Controller */}
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Section 2 — Hero */}
            <section className="relative z-20 max-w-4xl mx-auto px-6 pt-16 md:pt-28 pb-20 text-center flex flex-col items-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-4xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
              >
                Cooperative savings.<br />
                <span 
                  className="animate-shiny select-none"
                  style={gradientStyle}
                >
                  Decentralized
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-8 text-white max-w-lg text-base md:text-lg leading-[1.6]"
              >
                GlobalSave is the premier collaborative finance platform for the current era. It leverages powerful smart contracts on Monad to organize, secure, and grow your shared savings into total clarity.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-10 flex flex-col sm:flex-row items-center gap-4"
              >
                <AppleButton label="Launch GlobalSave" onClick={onLaunchApp} />
                <button 
                  onClick={(e) => handleTabClick('solutions', e)}
                  className="rounded-full border border-white/10 bg-white/[0.03] text-white hover:bg-white/5 text-sm font-semibold px-6 py-3.5 transition-all cursor-pointer"
                >
                  Learn Solutions
                </button>
              </motion.div>
            </section>

            {/* Section 3 — macOS menu bar strip */}
            <div className="relative z-30 w-full h-10 bg-black/40 backdrop-blur-md border-t border-b border-white/10">
              <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between text-xs text-white/70">
                <div className="flex items-center gap-4">
                  <AppleLogo className="w-3.5 h-3.5 text-white" />
                  <span className="font-bold text-white">GlobalSave</span>
                  {['Pools', 'Governance', 'Yield', 'Security', 'Audit', 'Help'].map((item, index) => (
                    <span 
                      key={item} 
                      onClick={onLaunchApp}
                      className={`cursor-pointer hover:text-white ${
                        index > 2 ? 'hidden sm:inline' : ''
                      } ${
                        index > 4 ? 'hidden md:inline' : ''
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Search className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-[11px] font-mono">{currentTime}</span>
                </div>
              </div>
            </div>

            {/* Section 4 — Inbox mockup (Cooperative Vault Mockup - Fully Interactive In-Place) */}
            <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-24">
              {mockNotification && (
                <div className="fixed top-24 right-8 z-[100] bg-brand text-white border border-white/20 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-semibold animate-fade-in">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                  <span>{mockNotification}</span>
                </div>
              )}

              <div 
                className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-2xl"
              >
                {/* macOS Title Bar */}
                <div className="h-10 border-b border-white/10 flex items-center px-4 justify-between bg-black/20">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="text-xs text-white/50 font-mono flex items-center gap-2">
                    <span>GlobalSave Simulator Console</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                  </div>
                  <div className="w-12" />
                </div>

                {/* Body */}
                <div className="grid grid-cols-12 h-[560px] text-sm">
                  {/* Sidebar */}
                  <div className="col-span-3 border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between">
                    <div>
                      <button 
                        onClick={() => {
                          triggerNotification('Simulating creation of a new Monad cooperative vault...');
                        }}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-bold px-3 py-2.5 shadow hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Create Vault</span>
                      </button>

                      <div className="mt-6 space-y-1">
                        {[
                          { id: 'all', label: 'Active Vaults', icon: Landmark, count: mockProposals.length },
                          { id: 'veto', label: 'Veto Center', icon: ShieldAlert, count: mockProposals.filter(p => p.status === 'Vetoed').length },
                          { id: 'dispute', label: 'Dispute Center', icon: Gavel, count: mockProposals.filter(p => p.status === 'Flagged').length },
                          { id: 'completed', label: 'Completed Savings', icon: Coins, count: mockProposals.filter(p => p.status === 'Executed').length },
                          { id: 'reputation', label: 'Reputation Logs', icon: Users }
                        ].map((item) => (
                          <div 
                            key={item.id}
                            onClick={() => setMockSidebarFilter(item.id as any)}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              mockSidebarFilter === item.id ? 'bg-white/10 text-white font-medium border-l-2 border-brand' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className="w-4 h-4" />
                              <span className="text-xs">{item.label}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 text-white/80">
                                {item.count}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest px-3 mb-2">My Co-ops</div>
                      <div className="space-y-1.5 px-3 text-xs">
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                          <span>NomadNest (USDC)</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                          <span>CommuniFund (MONAD)</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="w-2.5 h-2.5 rounded-full bg-brand" />
                          <span>Coop-Travel (USDT)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message / Proposal List */}
                  <div className="col-span-4 border-r border-white/10 bg-black/10 flex flex-col">
                    <div className="p-3 border-b border-white/10 flex items-center justify-between bg-black/20">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                        {mockSidebarFilter === 'reputation' ? 'Co-op Signatories' : 'Proposals'}
                      </span>
                      <RefreshCw 
                        className="w-3.5 h-3.5 text-white/40 hover:text-white cursor-pointer"
                        onClick={() => {
                          setMockProposals(INITIAL_MOCK_PROPOSALS);
                          setMockSelectedId('prop-1');
                          setMockSidebarFilter('all');
                          triggerNotification('Mock simulator variables reset to defaults.');
                        }}
                        title="Reset simulation data"
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                      {mockSidebarFilter === 'reputation' ? (
                        // Reputation logs view
                        <div className="divide-y divide-white/5">
                          {[
                            { name: 'Sophia Chen', address: '0x3ea7...8b1e', rep: 100, role: 'Treasurer' },
                            { name: 'Marcus (AI Engineer)', address: '0x9d2a...1a3f', rep: 100, role: 'Validator' },
                            { name: 'David Lim', address: '0x7c4f...d892', rep: 88, role: 'Co-signer' },
                            { name: 'Shady Proposer', address: '0x1b8c...9e3a', rep: 10, role: 'Guest' }
                          ].map((member, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between hover:bg-white/[0.01]">
                              <div>
                                <div className="text-xs font-bold text-white">{member.name}</div>
                                <div className="text-[10px] text-white/40 font-mono mt-0.5">{member.address}</div>
                              </div>
                              <div className="text-right">
                                <span className={`text-xs font-bold font-mono ${member.rep > 50 ? 'text-green-400' : 'text-red-400'}`}>
                                  {member.rep} REP
                                </span>
                                <div className="text-[10px] text-white/30 mt-0.5">{member.role}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Standard proposals list
                        filteredMockProposals.map((msg) => (
                          <div 
                            key={msg.id}
                            onClick={() => setMockSelectedId(msg.id)}
                            className={`p-3.5 cursor-pointer transition-colors relative ${
                              msg.id === mockSelectedId ? 'bg-white/5 text-white border-r-2 border-brand' : 'hover:bg-white/[0.02] text-white/70'
                            }`}
                          >
                            {msg.unread && (
                              <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-brand" />
                            )}
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-bold text-white">{msg.sender}</span>
                              <span className="text-[10px] text-white/40">{msg.time}</span>
                            </div>
                            <div className="text-xs font-semibold text-white/95 mb-0.5 truncate">{msg.title}</div>
                            <div className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">{msg.desc}</div>
                            
                            <div className="mt-2 flex gap-1">
                              {msg.status === 'Pending Sign' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand/20 text-brand font-medium">Pending Sign</span>}
                              {msg.status === 'Approved' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">Approved</span>}
                              {msg.status === 'Vetoed' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-medium">Vetoed</span>}
                              {msg.status === 'Flagged' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">Flagged</span>}
                              {msg.status === 'Executed' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">Executed</span>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Reader / Details Panel */}
                  <div className="col-span-5 flex flex-col bg-[#111317]/50">
                    {mockSidebarFilter === 'reputation' ? (
                      <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4">
                        <Users className="w-12 h-12 text-brand animate-pulse" />
                        <h4 className="text-sm font-bold text-white font-display">On-Chain Reputation System</h4>
                        <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                          Reputation is earned via successful vault cycles and positive governance votes. Proposers of flagged bills that fail dispute votes suffer direct slashing penalties.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* Toolbar */}
                        <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-black/10">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleMockSign(selectedMockProposal.id)}
                              className="px-2 py-1 rounded bg-brand text-black text-[10px] font-bold hover:bg-brand/90 transition-colors cursor-pointer"
                              title="Sign this Multi-Sig Proposal"
                            >
                              Sign Payout
                            </button>
                            <button 
                              onClick={() => handleMockVeto(selectedMockProposal.id)}
                              className="px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 text-[10px] font-bold hover:bg-orange-500/20 transition-colors cursor-pointer"
                              title="Veto transaction (24h Lock)"
                            >
                              Veto Payout
                            </button>
                            <button 
                              onClick={() => handleMockFlag(selectedMockProposal.id)}
                              className="w-7 h-7 rounded-md hover:bg-white/5 border border-white/10 flex items-center justify-center text-red-400/80 hover:text-red-400 cursor-pointer" 
                              title="Flag proposal & start dispute vote"
                            >
                              <Gavel className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleMockExecute(selectedMockProposal.id)}
                              className="w-7 h-7 rounded-md hover:bg-white/5 border border-white/10 flex items-center justify-center text-green-400/80 hover:text-green-400 cursor-pointer" 
                              title="Execute payout (if Approved)"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-white/30">ID: {selectedMockProposal.id}</span>
                        </div>

                        {/* Reader Body */}
                        <div className="flex-1 overflow-y-auto p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-base font-bold text-white font-display">{selectedMockProposal.title}</h2>
                              <div className="mt-1 flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-[10px] font-bold text-brand shadow">M</div>
                                <span className="text-xs font-semibold text-white/80">{selectedMockProposal.creator}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/60 bg-white/5 font-mono">{selectedMockProposal.amount}</span>
                              <span className="text-[9px] block text-white/30 font-mono mt-1">Sigs: {selectedMockProposal.signatures}/{selectedMockProposal.requiredSignatures}</span>
                            </div>
                          </div>

                          {/* AI Summary Card */}
                          <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                            <div className="flex items-center gap-1.5 text-xs text-brand font-semibold">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>AI Risk Assessment</span>
                            </div>
                            <p className="text-xs text-white/70 leading-relaxed font-sans">
                              {selectedMockProposal.aiSummary}
                            </p>
                          </div>

                          {/* Core description */}
                          <div className="space-y-3 text-xs text-white/70 leading-relaxed font-sans">
                            <p className="font-semibold text-white">Proposal Description:</p>
                            <p>{selectedMockProposal.fullDesc}</p>
                            <p className="text-white/40">Recipient: <span className="font-mono text-[10px] text-brand">{selectedMockProposal.recipient}</span></p>
                          </div>

                          {/* Telemetry log trace */}
                          <div className="p-3 bg-black/30 border border-white/5 rounded-xl space-y-1">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest font-mono">Contract Telemetry Logs</span>
                            <div className="space-y-1 font-mono text-[9px] text-green-400/85">
                              {selectedMockProposal.logs.map((log, lIdx) => (
                                <div key={lIdx} className="flex items-center gap-1">
                                  <Terminal className="w-2.5 h-2.5 shrink-0" />
                                  <span>{log}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 — FeatureTriage */}
            <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
              <div className="space-y-6">
                <SectionEyebrow label="Treasury Security" tag="On-chain Shields" />
                
                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-[1.05] font-display">
                  Secure your treasury<br />
                  in a single click.
                </h2>
                
                <p className="text-white/60 text-base leading-relaxed max-w-md">
                  GlobalSave automatically reads every proposal, checks validator status, and routes the noise away. Focus on your group's goals — our 24h veto lock and dispute voting centers safeguard your funds.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {['24h Veto Lock', 'Dispute Resolution', 'Multi-Sig Approval', 'On-Chain Reputation'].map((chip) => (
                    <span 
                      key={chip}
                      className="text-xs text-white/70 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.03] transition-colors hover:border-white/30"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right column: liquid-glass card */}
              <div className="liquid-glass rounded-2xl p-6 space-y-4 shadow-xl border border-white/5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs text-white/50 font-mono">Security Monitor</span>
                  <span className="text-xs font-bold text-white">42 transactions secured today</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { title: 'Veto Lock Active (2)', color: 'border-l-2 border-orange-500', items: ['Sophia Chen — Office deposit', 'David Lim — marketing contract'] },
                    { title: 'Pending Approval (4)', color: 'border-l-2 border-brand', items: ['Marcus — GPU server rental', 'Weekly payroll dispatch'] },
                    { title: 'Executed (18)', color: 'border-l-2 border-green-500', items: ['Rent payment complete', 'Wormhole bridge fee'] }
                  ].map((subCard, i) => (
                    <div key={i} className={`liquid-glass rounded-xl p-3.5 ${subCard.color} bg-white/[0.01]`}>
                      <div className="text-xs font-bold text-white mb-1.5">{subCard.title}</div>
                      <div className="space-y-1">
                        {subCard.items.map((item, j) => (
                          <div key={j} className="text-[11px] text-white/50 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-white/30" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 6 — LogoCloud */}
            <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-20 border-t border-white/5 text-center">
              <h3 className="text-xs uppercase tracking-widest text-white/40 font-mono">
                Engineered for the high-performance blockchain ecosystem
              </h3>
              
              <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
                {['Monad', 'Foundry', 'Viem', 'Ethers', 'jsPDF', 'Recharts', 'Tailwind', 'Vercel'].map((name, i) => (
                  <div 
                    key={name}
                    onClick={onLaunchApp}
                    className="text-sm font-bold tracking-tight text-white/50 hover:text-white cursor-pointer transition-all"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 7 — Testimonials */}
            <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10">
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    quote: "GlobalSave gave our remote developer co-op absolute peace of mind. We pool our income, earn yield automatically, and spend transparently with multi-sig safety.",
                    name: "Parker Wilf",
                    role: "Founder",
                    company: "NOMAD CO-OP"
                  },
                  {
                    quote: "The 24h veto lock saved us from a wrong address transfer. I can't imagine running shared funds without it.",
                    name: "Sophia Chen",
                    role: "Treasurer",
                    company: "WEB3 UNION"
                  },
                  {
                    quote: "Finally, a savings vault that is actually instant and cheap, thanks to Monad's 1-second block times.",
                    name: "Andrew von Rosenbach",
                    role: "Co-founder",
                    company: "SAHARA CREATIVE"
                  }
                ].map((test, i) => (
                  <figure 
                    key={i}
                    className="liquid-glass rounded-2xl p-6 flex flex-col justify-between border border-white/5 shadow-lg"
                  >
                    <blockquote className="text-sm text-white/80 leading-relaxed italic">
                      "{test.quote}"
                    </blockquote>
                    <figcaption className="mt-6 pt-4 border-t border-white/10 flex flex-col">
                      <span className="text-sm font-semibold text-white">{test.name}</span>
                      <span className="text-[11px] text-white/50">{test.role}</span>
                      <span className="text-[11px] text-white font-semibold tracking-wide uppercase mt-1">
                        {test.company}
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>

            {/* Section 8 — Pricing */}
            <section id="pricing-section" className="c3-pricing-section relative z-20 border-t border-white/10">
              <svg className="absolute w-0 h-0 pointer-events-none">
                <defs>
                  <filter id="c3-noise-pricing">
                    <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" />
                    <feComponentTransfer><feFuncA type="linear" slope="0.075" /></feComponentTransfer>
                    <feComposite in2="SourceGraphic" operator="in" result="noise" />
                    <feBlend in="SourceGraphic" in2="noise" mode="overlay" />
                  </filter>
                </defs>
              </svg>

              {/* Watermark Backdrop */}
              <div className="c3-watermark-container">
                <div className="c3-watermark-main select-none pointer-events-none">
                  <span className="c3-watermark-line-1">Global savings.</span>
                  <span className="c3-watermark-line-2 font-display text-brand">Decentralized</span>
                </div>
              </div>

              {/* Pricing Toggle */}
              <div className="c3-toggle-wrap">
                <span className="text-xs text-white/60 font-semibold tracking-wider font-mono">Yearly (Save 20%)</span>
                <button 
                  onClick={() => setYearly(!yearly)}
                  className={`c3-toggle ${yearly ? 'active' : ''}`}
                >
                  <div className="c3-toggle-knob" />
                </button>
              </div>

              {/* Pricing Grid */}
              <div className="c3-grid">
                {[
                  {
                    tier: "Free",
                    price: "Free",
                    desc: "For small groups taking their first steps with collaborative micro-savings.",
                    features: [
                      "Up to 3 savings pools in the cloud",
                      "Standard multi-sig (up to 3 signers)",
                      "Basic yield vault integrations",
                      "On-chain reputation tracking",
                      "Access via desktop and mobile app"
                    ]
                  },
                  {
                    tier: "Standard",
                    price: yearly ? "$99.99/y" : "$9.99/m",
                    desc: "For growing collectives and digital nomad teams who need more flexibility.",
                    features: [
                      "Up to 50 active savings pools",
                      "Custom signature thresholds (up to 10)",
                      "Full DeFi yield aggregator routing",
                      "Real-time veto and dispute alerts",
                      "Cryptographic PDF audit report downloads"
                    ]
                  },
                  {
                    tier: "Pro",
                    price: yearly ? "$199.99/y" : "$19.99/m",
                    desc: "For global investment syndicates and professional cooperative organizations.",
                    features: [
                      "Unlimited savings pools on Monad",
                      "Unlimited co-signer members",
                      "Advanced dispute voting rules",
                      "Custom member reputation weights",
                      "Multi-chain asset routing support",
                      "Priority developer integration support"
                    ],
                    pro: true
                  }
                ].map((plan, index) => (
                  <div 
                    key={index}
                    className={`c3-card ${plan.pro ? 'c3-card-pro' : ''}`}
                  >
                    <div className="c3-tier-small">{plan.tier}</div>
                    <div className="c3-tier-large">{plan.price}</div>
                    <div className="c3-desc">{plan.desc}</div>
                    
                    <ul className="c3-list">
                      {plan.features.map((feature, i) => (
                        <li key={i}>
                          <div className="c3-check">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button 
                      onClick={onLaunchApp}
                      className="c3-btn animate-pulse hover:animate-none border border-brand bg-[#0c0c0c] text-white hover:bg-brand hover:text-black font-semibold shadow-lg shadow-brand/10"
                    >
                      Choose Plan
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 9 — FinalCTA */}
            <section className="relative z-20 max-w-6xl mx-auto px-6 py-20 md:py-32">
              <div className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/5 shadow-2xl bg-black/40">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-30" 
                  style={{
                    background: 'radial-gradient(600px circle at 50% 0%, rgba(255, 255, 255, 0.15), transparent 70%)'
                  }}
                />

                <h2 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05] font-display">
                  Close the spreadsheets.<br />
                  Open your treasury.
                </h2>

                <p className="mt-6 text-white/60 max-w-md mx-auto text-sm leading-relaxed">
                  Join thousands of builders, co-ops, and nomad collectives who treat shared savings like a protocol — not an administrative nightmare.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <AppleButton label="Launch GlobalSave" onClick={onLaunchApp} />
                  <button 
                    onClick={onLaunchApp}
                    className="rounded-full border border-white/15 text-white text-sm font-semibold px-6 py-3.5 hover:bg-white/5 transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-1 bg-white/5"
                  >
                    <span>Talk to sales</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Detailed Solutions Page */}
        {activeTab === 'solutions' && (
          <motion.div
            key="solutions"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 max-w-5xl mx-auto px-6 py-12 md:py-20"
          >
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white mb-8 cursor-pointer transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="space-y-6">
              <SectionEyebrow label="Use Cases" tag="Target Solutions" />
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-display">
                Engineered for every collective.
              </h1>
              <p className="text-white/60 max-w-xl text-base leading-relaxed">
                GlobalSave bridges the gap between traditional cooperative finance structures and trustless Web3 execution, custom-tailored for three main target sectors.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: "Digital Nomads & Squads",
                  subtitle: "Friction-Free Co-living",
                  icon: MapPin,
                  bullets: [
                    "Pool monthly rents in stablecoins without wire transfer delays",
                    "Approve grocery and shared workspace payouts via multi-sig",
                    "Avoid high currency conversion fees at local traditional banks",
                    "Audit ledger trails instantly using generated PDF reports"
                  ]
                },
                {
                  title: "Cooperative Unions",
                  subtitle: "Stokvels & RoSCAs Reimagined",
                  icon: Landmark,
                  bullets: [
                    "Bring credit unions and rotating savings associations on-chain",
                    "Keep logs immutable, preventing bookkeeping disputes or fraud",
                    "Deposit idle pool savings into compound lending protocols automatically",
                    "Define automated payout timers and payouts distributions"
                  ]
                },
                {
                  title: "DAO Treasuries",
                  subtitle: "Decentralized Joint Venture Funds",
                  icon: ShieldCheck,
                  bullets: [
                    "Enforce strict $N$-of-$M$ cryptographic signature thresholds",
                    "Mitigate rogue signer actions using a 24-hour individual veto lock",
                    "Escalate suspicious payouts to community-wide dispute votes",
                    "Establish member reputation scores that slash upon failed disputes"
                  ]
                }
              ].map((solution, i) => (
                <div key={i} className="liquid-glass rounded-2xl p-6 border border-white/5 shadow-xl bg-black/30 flex flex-col justify-between min-h-[400px]">
                  <div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit mb-6 text-brand">
                      <solution.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-display mb-1">{solution.title}</h3>
                    <div className="text-xs text-brand font-mono mb-4">{solution.subtitle}</div>
                    <ul className="space-y-2.5 text-xs text-white/60 leading-relaxed font-sans">
                      {solution.bullets.map((b, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={onLaunchApp}
                    className="mt-8 text-xs font-semibold text-white/80 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Deploy this solution</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Blog Page */}
        {activeTab === 'blog' && (
          <motion.div
            key="blog"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 max-w-4xl mx-auto px-6 py-12 md:py-20"
          >
            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-xs text-white/60 hover:text-white mb-8 cursor-pointer transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>

            <div className="space-y-6 mb-12">
              <SectionEyebrow label="Journal" tag="Articles & Tech Logs" />
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-display">
                Cooperative Insights.
              </h1>
              <p className="text-white/60 max-w-xl text-base">
                Explore the technical mechanisms, design philosophy, and ecosystem breakthroughs shaping the future of shared finance on high-performance L1 networks.
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  title: "Introducing GlobalSave: Scaling Cooperative Finance on Monad",
                  date: "July 15, 2026",
                  author: "Matthews Thekiso",
                  readTime: "5 min read",
                  excerpt: "Traditional rotating savings groups (like Stokvels) suffer from massive physical overhead and lack of yield. By utilizing Monad's 1-second block times and sub-penny gas costs, we make pooling resources instant, cheap, and secure for millions.",
                  tag: "Monad L1"
                },
                {
                  title: "Preventing Rogue Signatories: The 24-Hour Veto Lock",
                  date: "June 28, 2026",
                  author: "Sophia Chen",
                  readTime: "8 min read",
                  excerpt: "Multi-signature wallets prevent single points of failure, but they are vulnerable to colluding signers or compromised keys. GlobalSave implements a unique three-tier defense model including a 24-hour veto lock and community dispute centers.",
                  tag: "Smart Contract Security"
                },
                {
                  title: "Stablecoin Yield Aggregators: Beating Inflation on the Savanna",
                  date: "May 14, 2026",
                  author: "David Lim",
                  readTime: "6 min read",
                  excerpt: "Pooled funds should never sit idle. Learn how GlobalSave's automated yield wrappers sweep deposited USDC/USDT directly to high-liquidity lending pools on Monad to compile interest every single second.",
                  tag: "DeFi Aggregation"
                }
              ].map((post, i) => (
                <div key={i} className="liquid-glass rounded-2xl p-6 border border-white/5 shadow-xl bg-black/30 hover:border-white/10 transition-all cursor-pointer" onClick={onLaunchApp}>
                  <div className="flex items-center gap-3 text-xs text-white/40 font-mono mb-3">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.author}</span>
                    <span>•</span>
                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60 font-sans">{post.tag}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white font-display mb-2 hover:text-brand transition-colors">{post.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs font-semibold text-brand">
                    <span>Read Full Article</span>
                    <span className="text-white/30 font-mono">{post.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Documentation Page (Fully Interactive, Selecting Sidebar Items Changes Contents In-Place) */}
        {activeTab === 'docs' && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 max-w-5xl mx-auto px-6 py-12 md:py-20 grid md:grid-cols-12 gap-8"
          >
            {/* Left sidebar nav (3 cols) */}
            <div className="md:col-span-3 space-y-4">
              <button 
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-2 text-xs text-white/60 hover:text-white mb-4 cursor-pointer transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full w-full justify-center"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Home</span>
              </button>

              <div className="liquid-glass rounded-xl p-4 border border-white/5 bg-black/20 text-xs space-y-3">
                <div className="font-bold text-white/40 uppercase tracking-widest font-mono text-[10px]">Getting Started</div>
                <div className="space-y-1.5 font-sans">
                  {[
                    { id: 'intro', label: 'Introduction' },
                    { id: 'quickstart', label: 'Quickstart Guide' },
                    { id: 'monad', label: 'Monad Integration' }
                  ].map(sec => (
                    <div 
                      key={sec.id}
                      onClick={() => setActiveDocSection(sec.id)}
                      className={`cursor-pointer transition-colors ${
                        activeDocSection === sec.id ? 'text-brand font-bold pl-1 border-l border-brand/50' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {sec.label}
                    </div>
                  ))}
                </div>
                
                <div className="font-bold text-white/40 uppercase tracking-widest font-mono text-[10px] pt-2">Contract API</div>
                <div className="space-y-1.5 font-sans">
                  {[
                    { id: 'vaults', label: 'Vault Operations' },
                    { id: 'multisig', label: 'Multi-Sig Rules' },
                    { id: 'disputes', label: 'Disputes & Vetoes' }
                  ].map(sec => (
                    <div 
                      key={sec.id}
                      onClick={() => setActiveDocSection(sec.id)}
                      className={`cursor-pointer transition-colors ${
                        activeDocSection === sec.id ? 'text-brand font-bold pl-1 border-l border-brand/50' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {sec.label}
                    </div>
                  ))}
                </div>

                <div className="font-bold text-white/40 uppercase tracking-widest font-mono text-[10px] pt-2">Agent API</div>
                <div className="space-y-1.5 font-sans">
                  {[
                    { id: 'rpc', label: 'JSON-RPC Endpoints' },
                    { id: 'telemetry', label: 'Telemetry Logs' }
                  ].map(sec => (
                    <div 
                      key={sec.id}
                      onClick={() => setActiveDocSection(sec.id)}
                      className={`cursor-pointer transition-colors ${
                        activeDocSection === sec.id ? 'text-brand font-bold pl-1 border-l border-brand/50' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {sec.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right details content (9 cols) */}
            <div className="md:col-span-9 space-y-6">
              <SectionEyebrow label="Documentation Viewer" tag={`Section: ${activeDocSection.toUpperCase()}`} />
              
              <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-[#0e1014]/80 shadow-xl space-y-4">
                {activeDocSection === 'intro' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Introduction to GlobalSave</h2>
                    <p>
                      GlobalSave is a decentralized micro-savings and shared expense co-signing registry protocol custom-engineered for Monad. It replaces manual reconciliation spreadsheets with automated smart contracts that enforce multi-party checks and deposit protection.
                    </p>
                    <p>
                      By wrapping deposited cooperative assets and routing them directly to high-liquidity lending pools (e.g. Aave forks), GlobalSave keeps idle assets productive, mitigating currency depreciation risks.
                    </p>
                    <div className="p-4 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-3">
                      <Landmark className="w-8 h-8 text-brand shrink-0" />
                      <div className="space-y-0.5">
                        <span className="font-semibold text-white block">Key Benefit</span>
                        <span className="text-white/50 text-[11px]">Sub-penny fees allow micro-contributions down to $0.10.</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeDocSection === 'quickstart' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Developer Quickstart</h2>
                    <p>Follow these steps to compile, deploy, and verify the GlobalSave protocol locally:</p>
                    
                    <div className="space-y-2">
                      <div className="font-semibold text-white">1. Install Foundry dependencies:</div>
                      <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-[#A4F4FD]">
                        cd backend{"\n"}
                        forge install
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="font-semibold text-white">2. Run Forge Solidity unit tests:</div>
                      <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-[#A4F4FD]">
                        forge test -vv
                      </pre>
                    </div>

                    <div className="space-y-2">
                      <div className="font-semibold text-white">3. Restore and run the React dashboard:</div>
                      <pre className="p-3 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-[#A4F4FD]">
                        cd ../frontend{"\n"}
                        npm install{"\n"}
                        npm run dev
                      </pre>
                    </div>
                  </div>
                )}

                {activeDocSection === 'monad' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Monad Blockchain Integration</h2>
                    <p>
                      GlobalSave exploits Monad's parallel EVM execution capabilities. Because savings groups involve high-frequency micro-contributions across thousands of independent vaults, traditional L1/L2 fees would eat up user capital.
                    </p>
                    <p>
                      On Monad, multiple members can contribute to different vaults simultaneously. The state storage mapping `members[wallet]` isolates slots to maximize parallelization throughput.
                    </p>
                    <div className="p-3 bg-brand/10 border border-brand/20 rounded-xl flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-brand" />
                      <span className="font-mono text-[10px] text-brand">Monad Parallel Pipeline finalizes transaction state in 1 second.</span>
                    </div>
                  </div>
                )}

                {activeDocSection === 'vaults' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Vault Operations API</h2>
                    <p>These functions handle member savings contributions and balance query methods:</p>
                    
                    <div className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-2 font-mono text-[10px]">
                      <div>
                        <span className="text-[#A4F4FD]">function contribute(uint256 _amount) external payable onlyMember</span>
                        <p className="text-white/40 font-sans text-xs mt-1">Deposits stablecoins or MON directly into the cooperative treasury. Sweeps to yield vault if yieldEnabled is toggled.</p>
                      </div>
                      <div className="pt-2">
                        <span className="text-[#A4F4FD]">function totalPoolBalance() public view returns (uint256)</span>
                        <p className="text-white/40 font-sans text-xs mt-1">Queries the current active balance (excluding locked or vetoed payouts).</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDocSection === 'multisig' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Multi-Sig Co-Signing Rules</h2>
                    <p>
                      All cooperative payout expenditures must be initiated as proposals. Proposers define the recipient and the budget. The contract enforces signing constraints:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white/60">
                      <li>Signatures can only be added by registered members of the pool.</li>
                      <li>Members cannot sign the same proposal multiple times.</li>
                      <li>Once the signature threshold is satisfied, proposal status changes to Approved, starting the 24-hour individual veto countdown.</li>
                    </ul>
                  </div>
                )}

                {activeDocSection === 'disputes' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Vetoes and Dispute Resolution</h2>
                    <p>
                      To prevent compromised keys or collusion, GlobalSave enforces two security checkpoints:
                    </p>
                    <div className="space-y-3">
                      <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl space-y-1">
                        <span className="font-bold text-orange-400 block">vetoPayout(uint256 _proposalId, string _reason)</span>
                        <p className="text-[11px] text-white/50">Any member can pause proposal execution for 24 hours. Adds 24h to the expiration countdown for thorough reviews.</p>
                      </div>
                      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1">
                        <span className="font-bold text-red-400 block">flagProposal(uint256 _proposalId, string _reason)</span>
                        <p className="text-[11px] text-white/50">Freezes the funds permanently and redirects the payout to a community dispute vote. If rejected, the creator's reputation is slashed.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeDocSection === 'rpc' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">JSON-RPC Endpoints Spec</h2>
                    <p>Autonomous developer agents can interact with the contract using the following RPC formats:</p>
                    
                    <pre className="p-4 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-[#A4F4FD] overflow-x-auto leading-normal">
{`{
  "jsonrpc": "2.0",
  "method": "eth_call",
  "params": [{
    "to": "0xGlobalSaveContractAddress",
    "data": "0x5e8c1ab40000000000000000000000000000000000000000000000000000000000000001"
  }, "latest"],
  "id": 1
}`}
                    </pre>
                  </div>
                )}

                {activeDocSection === 'telemetry' && (
                  <div className="space-y-4 animate-fade-in text-xs text-white/70 leading-relaxed">
                    <h2 className="text-xl font-bold text-white font-display">Telemetry & Log Parsing</h2>
                    <p>
                      Monitor on-chain telemetry logs by listening for events emitted by the smart contract. Subgraphs and indexing networks parse these blocks to display live transaction feeds:
                    </p>
                    <pre className="p-3 bg-black/30 border border-white/5 rounded-xl font-mono text-[9px] text-green-400">
                      event Contributed(address indexed member, uint256 amount);{"\n"}
                      event ProposalVetoed(uint256 indexed proposalId, address indexed vetoer);{"\n"}
                      event DisputeResolved(uint256 indexed proposalId, bool approved);
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Humorous Careers Page (404 Jobs Not Found) */}
        {activeTab === 'careers' && (
          <motion.div
            key="careers"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4 }}
            className="relative z-20 max-w-2xl mx-auto px-6 py-20 text-center flex flex-col items-center space-y-6"
          >
            <div className="p-4 bg-rose-500/10 rounded-full border border-rose-500/20 text-rose-400">
              <ShieldAlert className="w-12 h-12" />
            </div>

            <h1 className="text-6xl font-extrabold font-mono tracking-tight text-white">404</h1>
            <h2 className="text-2xl font-bold text-white font-display">Jobs Not Found</h2>
            
            <div className="liquid-glass rounded-2xl p-6 border border-white/5 bg-black/30 space-y-4 text-xs text-white/60 leading-relaxed font-sans max-w-md">
              <p>
                We wanted to hire you, but our decentralized smart contract **vetoed** the hiring proposal.
              </p>
              <p>
                All developer positions are currently occupied by **AI coding agents** working in parallel on the Monad devnet. They write 10,000 lines of Solidity per second, consume 0 coffee, and require 0 salary distributions.
              </p>
              <p className="text-[10px] text-white/40 italic">
                Tip: To create a job opening, please log in to the dashboard, propose a "Hire Senior Developer" budget, and gather a 3-of-3 signature threshold from the co-signers.
              </p>
            </div>

            <button 
              onClick={() => setActiveTab('home')}
              className="flex items-center gap-2 text-xs text-white/80 hover:text-white cursor-pointer transition-colors bg-white/5 border border-white/10 px-6 py-2.5 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 py-10 text-center text-xs text-white/30">
        <p>© 2026 GlobalSave Co. All rights reserved. Deployed on Monad Testnet.</p>
      </footer>
    </div>
  );
}
