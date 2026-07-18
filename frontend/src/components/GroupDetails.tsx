import { useState, useEffect, FormEvent } from 'react';
import { 
  Plus, Users, Flame, ShieldAlert, CheckCircle, 
  ChevronRight, Landmark, BadgePercent, ArrowUpRight, 
  Clock, AlertTriangle, ShieldCheck, Heart, Plane, Compass, 
  Check, Play, Award, DollarSign, Search, Sparkles, Download, TrendingUp
} from 'lucide-react';
import { SavingsGroup, WalletState, Proposal, GroupMember } from '../types';
import { jsPDF } from 'jspdf';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface GroupDetailsProps {
  group: SavingsGroup;
  wallet: WalletState;
  onContribute: (groupId: string, amount: number) => void;
  onCreateProposal: (groupId: string, title: string, description: string, amount: number, recipient: string) => void;
  onSignProposal: (groupId: string, proposalId: string) => void;
  onFlagProposal: (groupId: string, proposalId: string, reason: string) => void;
  onVetoProposal: (groupId: string, proposalId: string, reason: string) => void;
  onExecuteProposal: (groupId: string, proposalId: string) => void;
  onToggleYield: (groupId: string, enabled: boolean) => void;
  currentUserAddress: string;
}

export default function GroupDetails({
  group,
  wallet,
  onContribute,
  onCreateProposal,
  onSignProposal,
  onFlagProposal,
  onVetoProposal,
  onExecuteProposal,
  onToggleYield,
  currentUserAddress,
}: GroupDetailsProps) {
  // Input states
  const [contribAmount, setContribAmount] = useState<string>('150');
  const [isContributing, setIsContributing] = useState(false);

  // Proposal Creation State
  const [showNewPropForm, setShowNewPropForm] = useState(false);
  const [propTitle, setPropTitle] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propAmount, setPropAmount] = useState('200');
  const [propRecipient, setPropRecipient] = useState('0x61a2...98f1');
  const [isSubmittingProp, setIsSubmittingProp] = useState(false);

  // Dispute Flagger State
  const [flaggingProposalId, setFlaggingProposalId] = useState<string | null>(null);
  const [flagReason, setFlagReason] = useState('');

  // Veto Payout State
  const [vetoingProposalId, setVetoingProposalId] = useState<string | null>(null);
  const [vetoReason, setVetoReason] = useState('');

  // Member reputation & contribution sorting state
  const [memberSortBy, setMemberSortBy] = useState<'contribution' | 'reputation'>('contribution');
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  // Live yield simulation: increment yield accrued every 3 seconds if enabled
  const [liveYield, setLiveYield] = useState(group.yieldAccrued);

  useEffect(() => {
    setLiveYield(group.yieldAccrued);
  }, [group.yieldAccrued, group.id]);

  useEffect(() => {
    if (!group.yieldEnabled) return;
    const interval = setInterval(() => {
      // simulate dynamic tiny yield accrued based on savings amount
      const baseApy = group.yieldProtocol === 'Compound v3' ? 0.075 : 0.068;
      const yieldPerSecond = (group.totalSaved * baseApy) / (365 * 24 * 3600);
      setLiveYield(prev => prev + yieldPerSecond * 3);
    }, 3000);
    return () => clearInterval(interval);
  }, [group.yieldEnabled, group.totalSaved, group.yieldProtocol]);

  const handleContributeSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(contribAmount);
    if (isNaN(amount) || amount <= 0) return;
    
    // Check wallet balance
    const symbol = group.symbol;
    const balance = symbol === 'USDC' ? wallet.balances.USDC : wallet.balances.USDT;
    if (amount > balance) {
      alert(`Insufficient ${symbol} in your wallet!`);
      return;
    }

    setIsContributing(true);
    setTimeout(() => {
      onContribute(group.id, amount);
      setIsContributing(false);
      setContribAmount('');
    }, 1200);
  };

  const handleCreateProposalSubmit = (e: FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(propAmount);
    if (isNaN(amount) || amount <= 0 || !propTitle || !propRecipient) return;

    if (amount > group.totalSaved) {
      alert('Cannot request payout greater than the pooled group savings!');
      return;
    }

    setIsSubmittingProp(true);
    setTimeout(() => {
      onCreateProposal(group.id, propTitle, propDesc, amount, propRecipient);
      setIsSubmittingProp(false);
      setShowNewPropForm(false);
      setPropTitle('');
      setPropDesc('');
      setPropAmount('200');
    }, 1200);
  };

  const handleFlagSubmit = (e: FormEvent, proposalId: string) => {
    e.preventDefault();
    if (!flagReason.trim()) return;
    onFlagProposal(group.id, proposalId, flagReason);
    setFlaggingProposalId(null);
    setFlagReason('');
  };

  const handleVetoSubmit = (e: FormEvent, proposalId: string) => {
    e.preventDefault();
    if (!vetoReason.trim()) return;
    onVetoProposal(group.id, proposalId, vetoReason);
    setVetoingProposalId(null);
    setVetoReason('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Nomads': return <Plane className="h-4 w-4 text-sky-400" />;
      case 'Friends': return <Compass className="h-4 w-4 text-amber-400" />;
      case 'Family': return <Heart className="h-4 w-4 text-rose-400" />;
      default: return <Landmark className="h-4 w-4 text-purple-400" />;
    }
  };

  const progressPercent = Math.min(100, Math.round((group.totalSaved / group.targetAmount) * 100));

  const handleDownloadReport = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Colors & Styles
    const primaryColor = [61, 129, 227]; // Blue (#3D81E3)
    
    // Page Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('GlobalSave', 14, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text('Decentralized micro-savings & shared governance platform running on Monad.', 14, 25);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 29);

    // Divider line
    doc.setDrawColor(50, 50, 50);
    doc.setLineWidth(0.3);
    doc.line(14, 33, 196, 33);

    // Section 1: Savings Pool Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42); // dark slate for readable PDF printing
    doc.text('I. Savings Pool Overview', 14, 42);

    // Box for Pool Summary
    doc.setFillColor(248, 250, 252); // slate 50
    doc.rect(14, 46, 182, 38, 'F');
    doc.setDrawColor(226, 232, 240); // slate 200
    doc.rect(14, 46, 182, 38, 'D');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(group.name, 18, 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105); // slate 600
    const splitDesc = doc.splitTextToSize(group.description, 174);
    doc.text(splitDesc, 18, 57);

    // Stats Grid inside Box
    const statsY = 69;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Total Saved:', 18, statsY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${group.totalSaved.toLocaleString()} ${group.symbol}`, 45, statsY);

    doc.setFont('helvetica', 'bold');
    doc.text('Goal Target:', 110, statsY);
    doc.setFont('helvetica', 'normal');
    doc.text(`${group.targetAmount.toLocaleString()} ${group.symbol} (${progressPercent}% Achieved)`, 135, statsY);

    doc.setFont('helvetica', 'bold');
    doc.text('Multi-Sig:', 18, statsY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${group.requiredSignatures} of ${group.members.length} Signatures`, 45, statsY + 5);

    doc.setFont('helvetica', 'bold');
    doc.text('Yield Earned:', 110, statsY + 5);
    doc.setFont('helvetica', 'normal');
    doc.text(`${liveYield.toFixed(5)} ${group.symbol} (${group.yieldProtocol})`, 135, statsY + 5);

    // Section 2: Members Table
    let currentY = 93;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('II. Co-signer Contribution Leaderboard', 14, currentY);

    currentY += 5;
    // Table Header
    doc.setFillColor(241, 245, 249); // slate 100
    doc.rect(14, currentY, 182, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY, 196, currentY);
    doc.line(14, currentY + 7, 196, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Member Name', 17, currentY + 5);
    doc.text('Onchain Wallet Address', 65, currentY + 5);
    doc.text('Total Contributed', 135, currentY + 5);
    doc.text('Reputation Score', 170, currentY + 5);

    currentY += 7;
    doc.setFont('helvetica', 'normal');
    group.members.forEach((member, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, currentY, 182, 8, 'F');
      }
      doc.setDrawColor(241, 245, 249);
      doc.line(14, currentY + 8, 196, currentY + 8);

      doc.setTextColor(15, 23, 42);
      doc.text(`${index + 1}. ${member.name}`, 17, currentY + 5.5);
      
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(member.address, 65, currentY + 5.5);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text(`${member.totalContributed.toLocaleString()} ${group.symbol}`, 135, currentY + 5.5);
      doc.text(`${member.reputationScore} / 100`, 170, currentY + 5.5);

      currentY += 8;
    });

    // Section 3: Proposals Table
    currentY += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('III. Shared Expense Proposal Ledger', 14, currentY);

    currentY += 5;
    // Table Header
    doc.setFillColor(241, 245, 249);
    doc.rect(14, currentY, 182, 7, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY, 196, currentY);
    doc.line(14, currentY + 7, 196, currentY + 7);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Proposal Description', 17, currentY + 5);
    doc.text('Recipient Wallet', 85, currentY + 5);
    doc.text('Payout Amount', 145, currentY + 5);
    doc.text('Current Status', 170, currentY + 5);

    currentY += 7;
    doc.setFont('helvetica', 'normal');

    if (group.proposals.length === 0) {
      doc.setTextColor(148, 163, 184);
      doc.text('No shared expenses proposed yet for this group.', 17, currentY + 5.5);
    } else {
      group.proposals.forEach((prop, index) => {
        if (currentY > 260) {
          doc.addPage();
          currentY = 20;

          // Re-draw header row
          doc.setFillColor(241, 245, 249);
          doc.rect(14, currentY, 182, 7, 'F');
          doc.setFont('helvetica', 'bold');
          doc.text('Proposal Description', 17, currentY + 5);
          doc.text('Recipient Wallet', 85, currentY + 5);
          doc.text('Payout Amount', 145, currentY + 5);
          doc.text('Current Status', 170, currentY + 5);
          currentY += 7;
          doc.setFont('helvetica', 'normal');
        }

        if (index % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, currentY, 182, 10, 'F');
        }
        doc.setDrawColor(241, 245, 249);
        doc.line(14, currentY + 10, 196, currentY + 10);

        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'bold');
        doc.text(prop.title, 17, currentY + 4);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Signatures: ${prop.currentSignatures.length}/${prop.requiredSignatures}`, 17, currentY + 7.5);

        doc.setFont('courier', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(prop.recipient, 85, currentY + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(15, 23, 42);
        doc.text(`${prop.amount.toLocaleString()} ${prop.symbol}`, 145, currentY + 5.5);

        let statusStr = prop.status.replace('_', ' ');
        statusStr = statusStr.charAt(0).toUpperCase() + statusStr.slice(1);
        doc.text(statusStr, 170, currentY + 5.5);

        currentY += 10;
      });
    }

    // Bottom Footer
    currentY += 12;
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(14, currentY, 196, currentY);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    const disclaimer = 'Disclaimer: GlobalSave is a decentralized co-op micro-savings protocol running simulated virtual ledger entries on the Monad testnet chain. All yields, transactions, and addresses represented in this report are cryptographically simulated.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 182);
    doc.text(splitDisclaimer, 14, currentY + 5);

    // Save
    doc.save(`GlobalSave_Report_${group.name.replace(/\s+/g, '_')}.pdf`);
  };

  // Generate historical trend data dynamically for Recharts
  const chartData = (() => {
    const intervals = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Current'];
    return intervals.map((label, idx) => {
      const dataPoint: any = { name: label };
      group.members.forEach((m, mIdx) => {
        let factor = 0;
        if (idx === 0) factor = 0.1 + (mIdx * 0.03);
        else if (idx === 1) factor = 0.25 + (mIdx * 0.05);
        else if (idx === 2) factor = 0.45 - (mIdx * 0.02);
        else if (idx === 3) factor = 0.68 + (mIdx * 0.04);
        else if (idx === 4) factor = 0.88 - (mIdx * 0.01);
        else factor = 1.0;
        
        factor = Math.max(0, Math.min(1, factor));
        dataPoint[m.name] = Math.round(m.totalContributed * factor);
      });
      return dataPoint;
    });
  })();

  const LINE_COLORS = [
    '#3D81E3', // Blue (Brand 500)
    '#38BDF8', // Sky 400
    '#F43F5E', // Rose 500
    '#34D399', // Emerald 400
    '#A855F7', // Purple 500
    '#F97316', // Orange 500
  ];

  return (
    <div className="space-y-6">
      {/* Group Detail Card */}
      <div id={`group-${group.id}`} className="glass-card rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-600/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 bg-dark-700 rounded-full text-[10px] font-mono text-gold-500 border border-white/5 font-semibold flex items-center gap-1">
                {getCategoryIcon(group.category)}
                {group.category}
              </span>
              <span className="px-2.5 py-1 bg-gold-600/10 rounded-full text-[10px] font-mono text-gold-500 font-semibold border border-gold-600/10">
                Multi-Sig: {group.requiredSignatures} of {group.members.length} Sigs
              </span>
              <button
                id="btn-download-report"
                onClick={handleDownloadReport}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] font-sans font-semibold rounded-full border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer text-slate-300"
              >
                <Download className="h-3 w-3 text-gold-500" />
                Download Report
              </button>
            </div>
            <h1 className="text-xl md:text-2xl font-bold font-display text-white tracking-tight">{group.name}</h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">{group.description}</p>
          </div>

          {/* Quick Stats Panel */}
          <div className="glass-card p-4 rounded-xl min-w-[200px] flex flex-col justify-between">
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider block">POOL TOTAL SAVED</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-mono font-bold text-white">
                {group.totalSaved.toLocaleString()}
              </span>
              <span className="text-xs font-mono text-slate-500">{group.symbol}</span>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                <span>Goal: {group.targetAmount.toLocaleString()} {group.symbol}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-dark-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gold-600 h-full rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Tabs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {/* Left Column: Interactive Yield & Deposit */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Yield Hub */}
            <div id="yield-card" className="glass-card rounded-xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BadgePercent className="h-4.5 w-4.5 text-emerald-400 animate-pulse" />
                  <span className="text-xs font-sans font-semibold text-slate-200">DeFi Yield Wrapper</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Yield</span>
                  <button
                    id="btn-toggle-yield"
                    onClick={() => onToggleYield(group.id, !group.yieldEnabled)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      group.yieldEnabled ? 'bg-gold-600' : 'bg-dark-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        group.yieldEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {group.yieldEnabled ? (
                <div className="mt-4 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[10px] font-mono text-slate-400">Yield Accrued Live</span>
                    <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-0.5">
                      <Flame className="h-3.5 w-3.5 animate-bounce" /> 
                      {group.yieldProtocol === 'Compound v3' ? '7.5% APY' : '6.8% APY'}
                    </span>
                  </div>
                  <div className="bg-dark-950/80 p-3 rounded-lg border border-white/5 flex items-baseline justify-center gap-1">
                    <span className="text-xl font-mono font-bold text-emerald-400">
                      {liveYield.toFixed(5)}
                    </span>
                    <span className="text-xs font-mono text-emerald-600">{group.symbol}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-sans text-center">
                    Pooled capital is lent directly on Monad's {group.yieldProtocol} market for compound yield.
                  </p>
                </div>
              ) : (
                <div className="mt-4 py-4 text-center border border-dashed border-white/5 rounded-lg">
                  <span className="text-slate-500 text-xs block">Yield generation is inactive</span>
                  <button
                    id="btn-activate-yield"
                    onClick={() => onToggleYield(group.id, true)}
                    className="mt-2 text-[10px] font-sans font-semibold text-gold-500 hover:text-gold-400"
                  >
                    Activate {group.yieldProtocol === 'Compound v3' ? '7.5%' : '6.8%'} APY Compound Market
                  </button>
                </div>
              )}
            </div>

            {/* Deposit / Contribution Panel */}
            <div id="deposit-card" className="glass-card rounded-xl p-4">
              <h3 className="text-xs font-sans font-semibold text-slate-200 mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gold-500" />
                Make Contribution
              </h3>
              <form onSubmit={handleContributeSubmit} className="space-y-3">
                <div>
                  <div className="relative">
                    <input
                      id="input-contrib-amount"
                      type="number"
                      required
                      min="1"
                      placeholder="Amount to pool"
                      value={contribAmount}
                      onChange={(e) => setContribAmount(e.target.value)}
                      className="w-full bg-dark-900 border border-white/5 rounded-xl text-xs font-mono text-white pl-3 pr-16 py-2.5 focus:outline-none focus:border-gold-600"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-mono font-semibold text-slate-500">
                      {group.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5 px-1">
                    <span>Wallet balance:</span>
                    <span>
                      {group.symbol === 'USDC' 
                        ? `${wallet.balances.USDC.toLocaleString()} USDC` 
                        : `${wallet.balances.USDT.toLocaleString()} USDT`}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-submit-contribution"
                  type="submit"
                  disabled={isContributing}
                  className="w-full py-2.5 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 active:translate-y-px text-black font-sans text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {isContributing ? (
                    <>
                      <Clock className="h-4 w-4 animate-spin" />
                      Signing on Monad...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4" />
                      Deposit into Pool
                    </>
                  )}
                </button>
              </form>
            </div>
            
          </div>

          {/* Right Column: Members and Shared Payout Proposals */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Member Reputation & Contribution Leaderboard */}
            <div id="member-reputation-card" className="glass-card rounded-xl p-5 space-y-4">
              
              {/* Leaderboard Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xs font-display font-semibold text-white tracking-tight flex items-center gap-2 uppercase tracking-widest">
                    <Award className="h-4.5 w-4.5 text-gold-500" />
                    Member Reputation & Contribution Leaderboard
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">Consensus Trust & Cooperative Funding Ranks</p>
                </div>
                <div className="flex items-center gap-1.5 bg-dark-950 px-2.5 py-1 rounded-lg border border-white/5 text-[10px] font-mono text-slate-400 shrink-0">
                  <span className="h-1.5 w-1.5 bg-gold-600 rounded-full animate-pulse" />
                  {group.members.length} Addresses audited
                </div>
              </div>

              {/* Controls Toolbar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-white/5">
                {/* Search box */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search name or address..."
                    value={memberSearchQuery}
                    onChange={(e) => setMemberSearchQuery(e.target.value)}
                    className="w-full bg-dark-950 border border-white/5 rounded-xl text-[11px] text-white pl-8 pr-3 py-2 focus:outline-none focus:border-gold-600/50"
                  />
                  {memberSearchQuery && (
                    <button 
                      onClick={() => setMemberSearchQuery('')}
                      className="absolute right-3 top-2 px-1 text-slate-500 hover:text-slate-300 text-[10px] font-mono cursor-pointer"
                    >
                      clear
                    </button>
                  )}
                </div>

                {/* Sort Toggle */}
                <div className="flex gap-1 bg-dark-950 p-1 rounded-xl border border-white/5 h-[34px]">
                  <button
                    onClick={() => setMemberSortBy('contribution')}
                    className={`flex-1 py-1 text-[10px] font-sans font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      memberSortBy === 'contribution' 
                        ? 'bg-gold-600 text-black shadow-md font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    By Contribution
                  </button>
                  <button
                    onClick={() => setMemberSortBy('reputation')}
                    className={`flex-1 py-1 text-[10px] font-sans font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      memberSortBy === 'reputation' 
                        ? 'bg-gold-600 text-black shadow-md font-bold' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    By Reputation
                  </button>
                </div>
              </div>

              {/* Leaderboard List */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/5 pr-1">
                {(() => {
                  const maxContributed = Math.max(...group.members.map(m => m.totalContributed), 1);
                  const filteredAndSortedMembers = [...group.members]
                    .filter(m => {
                      const query = memberSearchQuery.toLowerCase();
                      return m.name.toLowerCase().includes(query) || m.address.toLowerCase().includes(query);
                    })
                    .sort((a, b) => {
                      if (memberSortBy === 'reputation') {
                        if (b.reputationScore !== a.reputationScore) {
                          return b.reputationScore - a.reputationScore;
                        }
                        return b.totalContributed - a.totalContributed;
                      } else {
                        if (b.totalContributed !== a.totalContributed) {
                          return b.totalContributed - a.totalContributed;
                        }
                        return b.reputationScore - a.reputationScore;
                      }
                    });

                  if (filteredAndSortedMembers.length === 0) {
                    return (
                      <div className="text-center py-8 border border-dashed border-white/5 rounded-xl">
                        <p className="text-slate-500 text-xs">No cooperative members match your filter.</p>
                      </div>
                    );
                  }

                  return filteredAndSortedMembers.map((member, index) => {
                    const isSelf = member.address.toLowerCase() === currentUserAddress.toLowerCase() || member.isCurrentUser || (member.address === '0xUSER_VIRTUAL_WALLET' && currentUserAddress === '0xUSER_VIRTUAL_WALLET');
                    const contributionPercent = Math.min(100, Math.round((member.totalContributed / maxContributed) * 100));
                    
                    // Rank badge logic
                    let rankBadge = '';
                    let rankStyle = 'text-slate-400 bg-dark-950 border-white/5';
                    if (index === 0) {
                      rankBadge = '🥇';
                      rankStyle = 'text-black bg-gold-600 border-gold-600/30 font-bold';
                    } else if (index === 1) {
                      rankBadge = '🥈';
                      rankStyle = 'text-slate-200 bg-slate-700 border-slate-600/30 font-bold';
                    } else if (index === 2) {
                      rankBadge = '🥉';
                      rankStyle = 'text-amber-600 bg-amber-950/20 border-amber-900/30 font-bold';
                    } else {
                      rankBadge = `#${index + 1}`;
                    }

                    // Reputation label
                    let repLabel = 'Cooperative';
                    let repColor = 'text-slate-400 bg-dark-700 border-white/5';
                    if (member.reputationScore >= 95) {
                      repLabel = 'Pristine Co-signer';
                      repColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
                    } else if (member.reputationScore >= 90) {
                      repLabel = 'High Trust';
                      repColor = 'text-gold-500 bg-gold-600/10 border-gold-600/20';
                    } else if (member.reputationScore < 80) {
                      repLabel = 'Audit Warning';
                      repColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20 animate-pulse';
                    }

                    return (
                      <div 
                        key={member.address} 
                        className={`p-3.5 rounded-xl border transition-all duration-200 ${
                          isSelf 
                            ? 'bg-gold-600/5 border-gold-600/30 shadow-md' 
                            : 'bg-dark-800/80 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          
                          {/* Member Rank, Avatar & Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Rank Badge */}
                            <div className={`w-6 h-6 rounded-lg border text-[10px] flex items-center justify-center shrink-0 ${rankStyle}`}>
                              {rankBadge}
                            </div>
                            
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <img src={member.avatarUrl} alt={member.name} className="h-9 w-9 rounded-full border border-white/10 object-cover" />
                              {index === 0 && (
                                <span className="absolute -top-1 -right-1 p-0.5 bg-gold-600 rounded-full text-black text-[6px]">
                                  <Sparkles className="h-2 w-2" />
                                </span>
                              )}
                            </div>

                            {/* Name & Address */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-sans font-bold text-white truncate block">
                                  {member.name}
                                </span>
                                {isSelf && (
                                  <span className="px-1.5 py-0.2 bg-gold-600/20 text-gold-500 border border-gold-600/20 rounded text-[8px] font-sans font-semibold">
                                    You
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
                                {member.address}
                              </span>
                            </div>
                          </div>

                          {/* Member Stats & Badges */}
                          <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 sm:gap-1 shrink-0 text-right">
                            
                            {/* Contribution Stat */}
                            <div>
                              <span className="text-xs font-mono font-bold text-white block">
                                {member.totalContributed.toLocaleString()} <span className="text-[10px] text-slate-500 font-semibold">{group.symbol}</span>
                              </span>
                              
                              {/* Contribution bar */}
                              <div className="flex items-center gap-1.5 mt-1 sm:justify-end">
                                <div className="w-16 bg-dark-950 h-1 rounded-full overflow-hidden hidden sm:block">
                                  <div className="bg-gold-600 h-full rounded-full" style={{ width: `${contributionPercent}%` }} />
                                </div>
                                <span className="text-[9px] font-mono text-slate-500 block">{contributionPercent}% max</span>
                              </div>
                            </div>

                            {/* Reputation pill badge */}
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-mono font-semibold ${repColor}`}>
                                {repLabel} (Rep: {member.reputationScore})
                              </span>
                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Cooperative Contribution Trends Chart */}
            <div id="contribution-chart-card" className="glass-card rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-xs font-display font-semibold text-white tracking-tight flex items-center gap-2 uppercase tracking-widest">
                  <TrendingUp className="h-4.5 w-4.5 text-gold-500" />
                  Cooperative Contribution Trends
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Individual Cumulative Savings over Time</p>
              </div>

              <div className="h-[240px] w-full glass-card p-4 rounded-xl font-mono text-[9px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#64748b" 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      tickLine={false} 
                      axisLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 9 }}
                      unit={` ${group.symbol}`}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-dark-900 border border-white/10 p-2.5 rounded-xl shadow-2xl font-mono text-[10px] text-slate-300 space-y-1">
                              <p className="text-white font-bold border-b border-white/5 pb-1 mb-1">{label}</p>
                              {payload.map((pld: any) => (
                                <div key={pld.name} className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pld.color }} />
                                    <span className="text-slate-400 truncate max-w-[100px]">{pld.name}:</span>
                                  </div>
                                  <span className="font-bold text-white">{pld.value.toLocaleString()} {group.symbol}</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle"
                      iconSize={6}
                      wrapperStyle={{ paddingBottom: '10px' }}
                      formatter={(value) => <span className="text-[9px] text-slate-400 font-sans">{value}</span>}
                    />
                    {group.members.map((member, idx) => (
                      <Line
                        key={member.address}
                        type="monotone"
                        dataKey={member.name}
                        stroke={LINE_COLORS[idx % LINE_COLORS.length]}
                        strokeWidth={2.5}
                        activeDot={{ r: 4 }}
                        dot={{ r: 2 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Shared Expense Proposals */}
            <div id="proposals-card" className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Landmark className="h-4.5 w-4.5 text-slate-300" />
                  <span className="text-xs font-sans font-semibold text-slate-200">Shared Expense Requests</span>
                </div>
                {!showNewPropForm && (
                  <button
                    id="btn-show-proposal-form"
                    onClick={() => setShowNewPropForm(true)}
                    className="px-2.5 py-1 bg-gold-600/10 hover:bg-gold-600/20 text-gold-500 border border-gold-600/20 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="h-3 w-3" /> New Proposal
                  </button>
                )}
              </div>

              {/* Proposal Form */}
              {showNewPropForm && (
                <div className="glass-card p-4 rounded-xl mb-4">
                  <h4 className="text-xs font-sans font-semibold text-white mb-3">Request Shared Expense Payout</h4>
                  <form onSubmit={handleCreateProposalSubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1">PROPOSAL TITLE</label>
                        <input
                          id="input-prop-title"
                          type="text"
                          required
                          placeholder="e.g. Host Villa Downpayment"
                          value={propTitle}
                          onChange={(e) => setPropTitle(e.target.value)}
                          className="w-full bg-dark-950 border border-white/5 rounded-lg text-xs font-sans text-white px-3 py-1.5 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1">RECIPIENT ADDRESS</label>
                        <input
                          id="input-prop-recipient"
                          type="text"
                          required
                          placeholder="0x..."
                          value={propRecipient}
                          onChange={(e) => setPropRecipient(e.target.value)}
                          className="w-full bg-dark-950 border border-white/5 rounded-lg text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1">PAYOUT AMOUNT</label>
                        <div className="relative">
                          <input
                            id="input-prop-amount"
                            type="number"
                            required
                            min="1"
                            value={propAmount}
                            onChange={(e) => setPropAmount(e.target.value)}
                            className="w-full bg-dark-950 border border-white/5 rounded-lg text-xs font-mono text-white pl-3 pr-12 py-1.5 focus:outline-none focus:border-gold-600"
                          />
                          <span className="absolute right-3 top-1.5 text-xs font-mono text-slate-500">{group.symbol}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono text-slate-400 block mb-1">DESCRIPTION</label>
                        <input
                          id="input-prop-desc"
                          type="text"
                          placeholder="Brief explanation for co-signers"
                          value={propDesc}
                          onChange={(e) => setPropDesc(e.target.value)}
                          className="w-full bg-dark-950 border border-white/5 rounded-lg text-xs font-sans text-white px-3 py-1.5 focus:outline-none focus:border-gold-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        id="btn-cancel-proposal"
                        type="button"
                        onClick={() => setShowNewPropForm(false)}
                        className="px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-slate-400 rounded-lg text-xs font-sans font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        id="btn-submit-proposal"
                        type="submit"
                        disabled={isSubmittingProp}
                        className="px-3 py-1.5 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-black rounded-lg text-xs font-sans font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        {isSubmittingProp ? (
                          <>
                            <Clock className="h-3.5 w-3.5 animate-spin" />
                            Broadcasting...
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            Submit Proposal
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Proposal List */}
              <div className="space-y-4">
                {group.proposals.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-white/5 rounded-xl">
                    <span className="text-slate-500 text-xs font-sans">No shared expenses proposed yet.</span>
                  </div>
                ) : (
                  group.proposals.map((prop) => {
                    const hasSigned = prop.currentSignatures.includes(currentUserAddress);
                    
                    return (
                      <div key={prop.id} className="glass-card rounded-xl p-4 space-y-3 transition-all duration-300 hover:border-white/10">
                        <div className="flex items-start justify-between gap-3 flex-wrap sm:flex-nowrap">
                          <div className="space-y-1">
                            <h5 className="text-xs font-sans font-semibold text-white">{prop.title}</h5>
                            <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{prop.description}</p>
                            <span className="text-[9px] font-mono text-slate-500 block">Recipient: {prop.recipient}</span>
                          </div>

                          <div className="text-right">
                            <div className="flex items-baseline gap-0.5 justify-end">
                              <span className="text-base font-mono font-bold text-white">{prop.amount.toLocaleString()}</span>
                              <span className="text-[10px] font-mono text-slate-500">{prop.symbol}</span>
                            </div>
                            
                            {prop.status === 'executed' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-mono rounded-full mt-1.5">
                                <CheckCircle className="h-3 w-3" /> Executed
                              </span>
                            )}
                            {prop.status === 'pending_signatures' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] font-mono rounded-full mt-1.5">
                                <Clock className="h-3 w-3" /> Multi-Sig Signing ({prop.currentSignatures.length}/{prop.requiredSignatures})
                              </span>
                            )}
                            {prop.status === 'approved' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gold-600/10 border border-gold-600/20 text-gold-500 text-[9px] font-mono rounded-full mt-1.5 animate-pulse">
                                <ShieldCheck className="h-3 w-3" /> Approved & Locked (24h Safe Window)
                              </span>
                            )}
                            {prop.status === 'vetoed_paused' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[9px] font-mono rounded-full mt-1.5 animate-pulse">
                                <AlertTriangle className="h-3 w-3" /> Vetoed & Paused (24h Delay)
                              </span>
                            )}
                            {prop.status === 'flagged_locked' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-mono rounded-full mt-1.5">
                                <ShieldAlert className="h-3 w-3" /> Frozen in Governance Dispute
                              </span>
                            )}
                            {prop.status === 'rejected' && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 border border-slate-700 text-slate-400 text-[9px] font-mono rounded-full mt-1.5">
                                <AlertTriangle className="h-3 w-3" /> Rejected by Dispute Vote
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status bar and actions */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-3 flex-wrap gap-2 text-xs">
                          
                          {/* Signatures tracker bar */}
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-slate-500">Signers:</span>
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {prop.currentSignatures.map((addr, idx) => {
                                const mObj = group.members.find(m => m.address === addr);
                                const name = mObj ? mObj.name : 'Unknown';
                                const avatar = mObj ? mObj.avatarUrl : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150';
                                return (
                                  <img 
                                    key={idx} 
                                    src={avatar} 
                                    alt={name} 
                                    title={`${name} signed`} 
                                    className="inline-block h-5 w-5 rounded-full ring-2 ring-slate-900 object-cover" 
                                  />
                                );
                              })}
                            </div>
                          </div>

                          {/* Action Buttons based on status */}
                          <div className="flex items-center gap-2">
                            
                            {/* Pending Signatures Actions */}
                            {prop.status === 'pending_signatures' && (
                              <button
                                id={`btn-sign-${prop.id}`}
                                onClick={() => onSignProposal(group.id, prop.id)}
                                disabled={hasSigned}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${
                                  hasSigned 
                                    ? 'bg-dark-700 text-slate-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-black shadow-md active:translate-y-px'
                                }`}
                              >
                                {hasSigned ? <Check className="h-3 w-3 text-emerald-400" /> : <Plus className="h-3 w-3" />}
                                {hasSigned ? 'You Signed' : 'Sign Multi-Sig'}
                              </button>
                            )}

                            {/* Approved 24h window actions */}
                            {prop.status === 'approved' && (
                              <>
                                <button
                                  id={`btn-veto-${prop.id}`}
                                  onClick={() => setVetoingProposalId(prop.id)}
                                  className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <AlertTriangle className="h-3 w-3" /> Veto Payout (24h)
                                </button>

                                <button
                                  id={`btn-flag-${prop.id}`}
                                  onClick={() => setFlaggingProposalId(prop.id)}
                                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <AlertTriangle className="h-3 w-3" /> Flag & Freeze (24h)
                                </button>
                                
                                <button
                                  id={`btn-execute-${prop.id}`}
                                  onClick={() => onExecuteProposal(group.id, prop.id)}
                                  className="px-2.5 py-1.5 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-black rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all shadow-md active:translate-y-px cursor-pointer"
                                >
                                  <Play className="h-3 w-3 fill-current" /> Execute Payout
                                </button>
                              </>
                            )}

                            {/* Vetoed & Paused actions */}
                            {prop.status === 'vetoed_paused' && (
                              <>
                                <button
                                  id={`btn-veto-extend-${prop.id}`}
                                  onClick={() => setVetoingProposalId(prop.id)}
                                  className="px-2.5 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <AlertTriangle className="h-3 w-3" /> Extend Veto (+24h)
                                </button>

                                <button
                                  id={`btn-flag-${prop.id}`}
                                  onClick={() => setFlaggingProposalId(prop.id)}
                                  className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  <AlertTriangle className="h-3 w-3" /> Flag & Freeze (Dispute)
                                </button>

                                <button
                                  id={`btn-execute-disabled-${prop.id}`}
                                  disabled
                                  className="px-2.5 py-1.5 bg-dark-700 text-slate-500 border border-white/5 rounded-lg text-[10px] font-semibold flex items-center gap-1.5 cursor-not-allowed"
                                  title="Locked by active 24h Veto"
                                >
                                  <Play className="h-3 w-3 fill-current" /> Execute (Veto Locked)
                                </button>
                              </>
                            )}

                            {/* Flagged locked details */}
                            {prop.status === 'flagged_locked' && (
                              <span className="text-[10px] font-sans font-medium text-rose-400 flex items-center gap-1">
                                <AlertTriangle className="h-3.5 w-3.5" />
                                Locked. Go to Dispute Center below.
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Veto reason and expiration details if vetoed */}
                        {prop.status === 'vetoed_paused' && prop.vetoExpiry && (
                          <div className="bg-purple-950/20 border border-purple-500/10 rounded-xl p-3 text-[11px] space-y-1">
                            <span className="font-semibold text-purple-400 block uppercase text-[9px] tracking-wider font-mono">Suspicious Payout Flagged & Vetoed</span>
                            <p className="text-slate-300 font-sans">
                              Vetoed by: <span className="font-mono text-[10px] text-purple-300">{(prop.vetoers || []).join(', ')}</span>
                            </p>
                            <p className="text-slate-300 font-sans">
                              Reason: <span className="italic text-slate-200">"{prop.vetoReason || 'No reason provided'}"</span>
                            </p>
                            <div className="flex justify-between items-center pt-1 border-t border-white/5 mt-1 font-mono text-[10px]">
                              <span className="text-slate-500">PAUSE EXPIRATION:</span>
                              <span className="text-purple-400 font-semibold">{new Date(prop.vetoExpiry).toLocaleString()}</span>
                            </div>
                          </div>
                        )}

                        {/* Flagging reason Input Box if selected */}
                        {flaggingProposalId === prop.id && (
                          <form onSubmit={(e) => handleFlagSubmit(e, prop.id)} className="bg-dark-950/80 border border-white/5 p-3 rounded-lg mt-2 space-y-2">
                            <label className="text-[9px] font-mono text-rose-400 font-semibold block uppercase tracking-wider">Provide dispute reason for community governance</label>
                            <input
                              id="input-flag-reason"
                              type="text"
                              required
                              placeholder="e.g. This is a personal expenditure, not approved by the travel itinerary..."
                              value={flagReason}
                              onChange={(e) => setFlagReason(e.target.value)}
                              className="w-full bg-dark-900 border border-white/5 rounded-lg text-xs font-sans text-white px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                id="btn-cancel-flag"
                                type="button"
                                onClick={() => setFlaggingProposalId(null)}
                                className="px-2 py-1 bg-dark-700 text-slate-400 hover:text-white text-[10px] rounded"
                              >
                                Cancel
                              </button>
                              <button
                                id="btn-submit-flag"
                                type="submit"
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white text-[10px] rounded"
                              >
                                Freeze Funds
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Vetoing reason Input Box if selected */}
                        {vetoingProposalId === prop.id && (
                          <form onSubmit={(e) => handleVetoSubmit(e, prop.id)} className="bg-dark-950/80 border border-white/5 p-3 rounded-lg mt-2 space-y-2">
                            <label className="text-[9px] font-mono text-purple-400 font-semibold block uppercase tracking-wider">Provide veto reason to initiate 24h freeze</label>
                            <input
                              id="input-veto-reason"
                              type="text"
                              required
                              placeholder="e.g. Recipient address looks wrong, or amount is higher than discussed..."
                              value={vetoReason}
                              onChange={(e) => setVetoReason(e.target.value)}
                              className="w-full bg-dark-900 border border-white/5 rounded-lg text-xs font-sans text-white px-2.5 py-1.5 focus:outline-none focus:border-purple-500"
                            />
                            <div className="flex justify-end gap-1.5">
                              <button
                                id="btn-cancel-veto"
                                type="button"
                                onClick={() => setVetoingProposalId(null)}
                                className="px-2 py-1 bg-dark-700 text-slate-400 hover:text-white text-[10px] rounded"
                              >
                                Cancel
                              </button>
                              <button
                                id="btn-submit-veto"
                                type="submit"
                                className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white text-[10px] rounded"
                              >
                                Trigger 24h Veto
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
