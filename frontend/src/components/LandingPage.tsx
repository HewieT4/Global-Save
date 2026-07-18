import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ShieldCheck, Gavel, Landmark, Search, 
  ChevronRight, Reply, Forward, Archive, Trash2, 
  MoreHorizontal, Paperclip, Check, Play, HelpCircle, 
  Coins, Terminal, Users, ArrowUpRight, ArrowLeft,
  BookOpen, FileText, Briefcase, ExternalLink, Calendar,
  MapPin, ShieldAlert, Award
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
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3.5 transition-all hover:bg-white/90 active:scale-[0.98] ${full ? 'w-full' : ''} cursor-pointer`}
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
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
    <span className="text-white text-xs font-semibold uppercase tracking-wider">{label}</span>
    {tag && (
      <span className="px-2 py-0.5 rounded-full border border-white/10 text-[10px] font-medium text-white/50 bg-white/[0.03]">
        {tag}
      </span>
    )}
  </div>
);

const gradientStyle: React.CSSProperties = {
  backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
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

export default function LandingPage({ onLaunchApp }: LandingPageProps) {
  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [yearly, setYearly] = useState(false);
  const [currentTime, setCurrentTime] = useState('Wed May 6 1:09 PM');

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
                activeTab === tab.id ? 'text-[#E5A93B] font-bold border-b border-[#E5A93B]/40 pb-0.5' : 'text-white'
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

            {/* Section 4 — Inbox mockup (Cooperative Vault Mockup) */}
            <section className="relative z-20 max-w-6xl mx-auto px-6 py-16 md:py-24">
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
                  <div className="text-xs text-white/50 font-mono">GlobalSave — NomadNest Vault</div>
                  <div className="w-12" />
                </div>

                {/* Body */}
                <div className="grid grid-cols-12 h-[560px] text-sm">
                  {/* Sidebar */}
                  <div className="col-span-3 border-r border-white/10 bg-black/30 p-4 flex flex-col justify-between">
                    <div>
                      <button 
                        onClick={onLaunchApp}
                        className="w-full flex items-center justify-center gap-2 rounded-lg bg-white text-black text-xs font-bold px-3 py-2.5 shadow hover:bg-white/90 active:scale-[0.98] transition-all cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-black" />
                        <span>Create Vault</span>
                      </button>

                      <div className="mt-6 space-y-1">
                        {[
                          { label: 'Active Vaults', icon: Landmark, count: 4, active: true },
                          { label: 'Veto Center', icon: ShieldCheck, count: 1 },
                          { label: 'Dispute Center', icon: Gavel, count: 2 },
                          { label: 'Completed Savings', icon: Coins },
                          { label: 'Reputation Logs', icon: Users },
                        ].map((item) => (
                          <div 
                            key={item.label}
                            onClick={onLaunchApp}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                              item.active ? 'bg-white/10 text-white font-medium' : 'text-white/60 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <item.icon className="w-4 h-4" />
                              <span className="text-xs">{item.label}</span>
                            </div>
                            {item.count && (
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
                          <span className="w-2.5 h-2.5 rounded-full bg-[#00d2ff]" />
                          <span>NomadNest (USDC)</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#A4F4FD]" />
                          <span>CommuniFund (MONAD)</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                          <span>Coop-Travel (USDT)</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                          <span>Global-Save (MON)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message / Proposal List */}
                  <div className="col-span-4 border-r border-white/10 bg-black/10 flex flex-col">
                    <div className="p-3 border-b border-white/10 flex items-center gap-2 bg-black/20">
                      <Search className="w-3.5 h-3.5 text-white/30" />
                      <input 
                        type="text" 
                        placeholder="Search proposals..." 
                        disabled
                        className="bg-transparent border-none text-xs text-white/90 placeholder-white/30 focus:outline-none w-full"
                      />
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                      {[
                        { sender: 'Coop-Travel', title: 'GPU Server Rental', desc: 'Proposed by Marcus. 2/3 signatures received. Pending execution.', time: '9:41 AM', unread: true, active: true },
                        { sender: 'NomadNest', title: 'Office Space Deposit', desc: 'Vetoed by Sophia. Reason: address mismatch on landlord KYC.', time: '8:12 AM', unread: true, vetoed: true },
                        { sender: 'CommuniFund', title: 'Marketing Grant', desc: 'Escalated to dispute voting center. Proposal flagged as high-risk.', time: 'Yesterday', flagged: true },
                        { sender: 'Coop-Travel', title: 'Rent Payout Executed', desc: 'Transaction confirmed on Monad block #14289052. Total $4,200.', time: 'Yesterday', executed: true },
                        { sender: 'NomadNest', title: 'Member Onboarding', desc: '0x7c4f... joined the cooperative vault. Reputation assigned 100.', time: 'Mon', verified: true }
                      ].map((msg, i) => (
                        <div 
                          key={i}
                          onClick={onLaunchApp}
                          className={`p-3.5 cursor-pointer transition-colors relative ${
                            msg.active ? 'bg-white/5 text-white' : 'hover:bg-white/[0.02] text-white/70'
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
                            {msg.active && <span className="text-[9px] px-1.5 py-0.5 rounded bg-brand/20 text-brand font-medium">Pending Sign</span>}
                            {msg.vetoed && <span className="text-[9px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-medium">Vetoed</span>}
                            {msg.flagged && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-medium">Flagged</span>}
                            {msg.executed && <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-medium">Executed</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reader / Details Panel */}
                  <div className="col-span-5 flex flex-col bg-[#111317]/50">
                    <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-black/10">
                      <div className="flex items-center gap-2">
                        <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white cursor-pointer" onClick={onLaunchApp}>
                          <Reply className="w-4 h-4" />
                        </button>
                        <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white cursor-pointer" onClick={onLaunchApp}>
                          <Forward className="w-4 h-4" />
                        </button>
                        <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60 hover:text-white cursor-pointer" onClick={onLaunchApp}>
                          <Archive className="w-4 h-4" />
                        </button>
                        <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-red-400/80 hover:text-red-400 cursor-pointer" onClick={onLaunchApp}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="w-7 h-7 rounded-md hover:bg-white/5 flex items-center justify-center text-white/60 cursor-pointer" onClick={onLaunchApp}>
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-base font-bold text-white font-display">GPU Server Rental</h2>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#00d2ff] to-[#0B2551] flex items-center justify-center text-[10px] font-bold text-white shadow">M</div>
                            <span className="text-xs font-semibold text-white/80">Marcus</span>
                            <span className="text-xs text-white/40">to Coop-Travel · 9:41 AM</span>
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/60 bg-white/5">USDC Pool</span>
                      </div>

                      <div className="p-3.5 rounded-xl border border-white/5 bg-white/[0.02] space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#A4F4FD] font-semibold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Risk Assessment</span>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed font-sans">
                          Valid expense request. Verified billing invoice attached. Recipient address matches registered service provider. Ample vault liquidity available. Low risk factor.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs text-white/70 leading-relaxed font-sans">
                        <p>Hi team,</p>
                        <p>
                          Here is the proposal details for the GPU Server Rental for our AI agent project. This will fund 3 high-performance GPU nodes for 30 days.
                        </p>
                        <p>
                          The pricing matches our contract agreement and will be paid in USDC. Please sign the proposal so we can proceed with deployment.
                        </p>
                        <p className="text-white/40">— Marcus (AI Engineer)</p>
                      </div>

                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-white/10 bg-black/20 hover:bg-black/30 transition-colors cursor-pointer" onClick={onLaunchApp}>
                        <div className="flex items-center gap-2 text-xs text-white/80">
                          <Paperclip className="w-4 h-4 text-white/40" />
                          <span>invoice-gpu-rental.pdf</span>
                        </div>
                        <span className="text-[10px] text-white/40">142 KB</span>
                      </div>
                    </div>
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
                  <span className="c3-watermark-line-2">Decentralized</span>
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
                      className="c3-btn"
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
                    background: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)'
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
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 w-fit mb-6 text-[#E5A93B]">
                      <solution.icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white font-display mb-1">{solution.title}</h3>
                    <div className="text-xs text-[#E5A93B] font-mono mb-4">{solution.subtitle}</div>
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
                  
                  <h3 className="text-xl font-bold text-white font-display mb-2 hover:text-[#E5A93B] transition-colors">{post.title}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-sans mb-4">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between text-xs font-semibold text-[#E5A93B]">
                    <span>Read Full Article</span>
                    <span className="text-white/30 font-mono">{post.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Detailed Documentation Page */}
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
                <div className="font-bold text-white/50 uppercase tracking-widest font-mono text-[10px]">Getting Started</div>
                <div className="space-y-1.5 font-sans">
                  <div className="text-[#E5A93B] font-semibold cursor-pointer">Introduction</div>
                  <div className="text-white/60 hover:text-white cursor-pointer">Quickstart Guide</div>
                  <div className="text-white/60 hover:text-white cursor-pointer">Monad Integration</div>
                </div>
                <div className="font-bold text-white/50 uppercase tracking-widest font-mono text-[10px] pt-2">Contract API</div>
                <div className="space-y-1.5 font-sans">
                  <div className="text-white/60 hover:text-white cursor-pointer">Vault Operations</div>
                  <div className="text-white/60 hover:text-white cursor-pointer">Multi-Sig Rules</div>
                  <div className="text-white/60 hover:text-white cursor-pointer">Disputes & Vetoes</div>
                </div>
                <div className="font-bold text-white/50 uppercase tracking-widest font-mono text-[10px] pt-2">Agent API</div>
                <div className="space-y-1.5 font-sans">
                  <div className="text-white/60 hover:text-white cursor-pointer">JSON-RPC Endpoints</div>
                  <div className="text-white/60 hover:text-white cursor-pointer">Telemetry Logs</div>
                </div>
              </div>
            </div>

            {/* Right details content (9 cols) */}
            <div className="md:col-span-9 space-y-6">
              <SectionEyebrow label="Developer Reference" tag="V0.8.20 Contract" />
              <h1 className="text-4xl font-semibold tracking-tight font-display">
                API & Developer Documentation
              </h1>
              
              <div className="space-y-4 text-xs text-white/70 leading-relaxed font-sans">
                <p>
                  GlobalSave is entirely driven by on-chain Solidity logic. Developer agents and Web3 frontends interface with the contract via standard JSON-RPC endpoints. Below is the API reference for the core `GlobalSave.sol` functions.
                </p>
                
                <h3 className="text-sm font-bold text-white font-display pt-4">1. Write Functions (State Modifying)</h3>
                
                <div className="space-y-3">
                  {[
                    { func: "contribute(uint256 _amount)", desc: "Allows members to deposit stablecoins or native MON into the vault pool. Emits Contributed." },
                    { func: "createProposal(string title, string desc, uint256 amount, address recipient)", desc: "Initiates a new multi-sig shared expense proposal. Creator automatically co-signs. Emits ProposalCreated." },
                    { func: "signProposal(uint256 _proposalId)", desc: "Co-signers approve the proposal to build consensus. When threshold is met, status becomes Approved and a 24h countdown starts. Emits ProposalSigned." },
                    { func: "vetoPayout(uint256 _proposalId, string _reason)", desc: "Allows any member to temporarily lock a transaction for 24 hours. Adds 24h to countdown. Emits ProposalVetoed." },
                    { func: "flagProposal(uint256 _proposalId, string _reason)", desc: "Permanently freezes the proposal and escalates the transaction to a community-wide voting dispute. Emits ProposalFlagged." }
                  ].map((api, index) => (
                    <div key={index} className="p-3.5 rounded-xl border border-white/5 bg-white/[0.01] space-y-1">
                      <div className="font-mono text-white text-[11px] font-semibold flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#E5A93B]" />
                        <span>{api.func}</span>
                      </div>
                      <p className="text-white/50">{api.desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-sm font-bold text-white font-display pt-4">2. Read Functions & JSON-RPC Telemetry</h3>
                <p>
                  AI judging agents query contract status using standard Solidity getters:
                </p>
                <div className="p-3.5 rounded-xl border border-white/5 bg-black/20 font-mono text-[10px] text-[#A4F4FD] space-y-1">
                  <div>// Query total details of a savings group</div>
                  <div>function getPoolDetails(uint256 poolId) public view returns (string name, uint256 balance, uint8 signersThreshold, uint256 proposals);</div>
                  <div className="pt-2">// Check if an address has signed a proposal</div>
                  <div>proposalSignatures(uint256 proposalId, address memberAddress) returns (bool signed);</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Detailed Careers Page */}
        {activeTab === 'careers' && (
          <motion.div
            key="careers"
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

            <div className="space-y-6 mb-12 text-center flex flex-col items-center">
              <SectionEyebrow label="Careers" tag="Remote Positions" />
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight font-display">
                Build the future of co-ops.
              </h1>
              <p className="text-white/60 max-w-md text-sm leading-relaxed">
                Join our remote-first engineering and design collectives developing the next generation of cooperative treasury frameworks for global users.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  role: "Lead Solidity Security Auditor",
                  team: "Security Guild",
                  location: "Remote (Global)",
                  desc: "Responsible for reviewing gas-optimized proxy contracts, verifying multi-sig escrow parameters, and validating DeFi yield integrations on Monad EVM."
                },
                {
                  role: "Senior Frontend Engineer - Web3 & Motion",
                  team: "UI/UX Experience Group",
                  location: "Remote (Global)",
                  desc: "Own the design language, build custom SVG line charts, and engineer high-performance wallet consoles using React, Tailwind CSS, and Framer Motion."
                },
                {
                  role: "Developer Relations Specialist",
                  team: "Ecosystem Growth",
                  location: "Remote (Monad Ecosystem)",
                  desc: "Bridge the gap between our protocol and Monad builders. Educate communities about account abstraction, gas sponsorship, and on-chain voting models."
                }
              ].map((job, i) => (
                <div key={i} className="liquid-glass rounded-2xl p-6 border border-white/5 bg-black/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-white font-display">{job.role}</h3>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/50 font-mono uppercase tracking-wider">{job.team}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-[#E5A93B] font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </div>
                    
                    <p className="text-xs text-white/50 leading-relaxed font-sans max-w-xl">{job.desc}</p>
                  </div>
                  
                  <button 
                    onClick={onLaunchApp}
                    className="group px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                  >
                    <span>Apply Now</span>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                  </button>
                </div>
              ))}
            </div>
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
