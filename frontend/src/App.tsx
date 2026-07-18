import { useState, useEffect } from 'react';
import { 
  Coins, Gavel, Landmark, ShieldAlert, BadgePercent, 
  Sparkles, Layers, Cpu, Award, Heart, HelpCircle, 
  Terminal, ShieldCheck, Activity, Users, ArrowUpRight
} from 'lucide-react';
import { WalletState, SavingsGroup, Transaction, Proposal, GroupMember } from './types';
import { INITIAL_GROUPS, INITIAL_TRANSACTIONS } from './data/mockData';

// Subcomponents
import WalletConsole from './components/WalletConsole';
import GroupDetails from './components/GroupDetails';
import DisputeCenter from './components/DisputeCenter';
import ContractViewer from './components/ContractViewer';
import TransactionHistory from './components/TransactionHistory';
import LandingPage from './components/LandingPage';

const DEFAULT_USER_ADDRESS = '0xUSER_VIRTUAL_WALLET';

const DEFAULT_WALLET: WalletState = {
  address: '0xUSER_VIRTUAL_WALLET',
  privateKey: '0x9ae7f3c1d9405c10faee58de5c01bcde8b329432f7c00e12f0a129ef9fa23e42',
  seedPhrase: 'glory priority digital drift hybrid parallel instant scalable execute transaction gas consensus',
  balances: {
    MONAD: 15.4,
    USDC: 850.0,
    USDT: 500.0
  }
};

export default function App() {
  const [showDashboard, setShowDashboard] = useState<boolean>(() => {
    const saved = localStorage.getItem('glob_save_show_dashboard');
    return saved === 'true';
  });

  const [currentUserAddress, setCurrentUserAddress] = useState<string>(() => {
    const saved = localStorage.getItem('glob_save_current_user_address');
    return saved || DEFAULT_USER_ADDRESS;
  });

  useEffect(() => {
    localStorage.setItem('glob_save_show_dashboard', String(showDashboard));
  }, [showDashboard]);

  // State variables with localStorage persistence
  const [wallet, setWallet] = useState<WalletState>(() => {
    const saved = localStorage.getItem('glob_save_wallet');
    return saved ? JSON.parse(saved) : DEFAULT_WALLET;
  });

  useEffect(() => {
    localStorage.setItem('glob_save_current_user_address', currentUserAddress);
  }, [currentUserAddress]);

  const [groups, setGroups] = useState<SavingsGroup[]>(() => {
    const saved = localStorage.getItem('glob_save_groups');
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('glob_save_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'group-nomadnest');
  const [activeTab, setActiveTab] = useState<'pools' | 'contract' | 'history'>('pools');

  const handleSignOut = () => {
    setCurrentUserAddress("");
  };

  const handleSignIn = (address: string) => {
    setCurrentUserAddress(address);
    
    // Simulate dynamic wallet state based on address
    let balances = { MONAD: 10.0, USDC: 500.0, USDT: 500.0 };
    let privateKey = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    let seedPhrase = 'virtual secret keys generated dynamically for multi user login on monad testnet';
    
    if (address === '0xUSER_VIRTUAL_WALLET') {
      balances = { MONAD: 15.4, USDC: 850.0, USDT: 500.0 };
      privateKey = '0x9ae7f3c1d9405c10faee58de5c01bcde8b329432f7c00e12f0a129ef9fa23e42';
      seedPhrase = 'glory priority digital drift hybrid parallel instant scalable execute transaction gas consensus';
    } else if (address === '0x3ea7...8b1e') {
      balances = { MONAD: 85.5, USDC: 3200.0, USDT: 1400.0 };
    } else if (address === '0x9d2a...1a3f') {
      balances = { MONAD: 44.0, USDC: 1800.0, USDT: 900.0 };
    } else if (address === '0x7c4f...d892') {
      balances = { MONAD: 12.8, USDC: 600.0, USDT: 350.0 };
    } else if (address === '0x1b8c...9e3a') {
      balances = { MONAD: 110.2, USDC: 4100.0, USDT: 2200.0 };
    }

    setWallet({
      address,
      privateKey,
      seedPhrase,
      balances
    });
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('glob_save_wallet', JSON.stringify(wallet));
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem('glob_save_groups', JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    localStorage.setItem('glob_save_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Compute stats
  const totalSavedAcrossPools = groups.reduce((acc, g) => acc + g.totalSaved, 0);
  
  const userTotalContributions = groups.reduce((acc, g) => {
    const me = g.members.find(m => m.address === currentUserAddress);
    return acc + (me ? me.totalContributed : 0);
  }, 0);

  const activeDisputesCount = groups.reduce((acc, g) => {
    const disputes = g.proposals.filter(p => p.status === 'flagged_locked').length;
    return acc + disputes;
  }, 0);

  const totalYieldCompounded = groups.reduce((acc, g) => acc + g.yieldAccrued, 0);

  // Active selected group
  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  // Helper to add dynamic logs/transactions
  const createOnChainTx = (type: any, amount: number, symbol: any, description: string) => {
    const randomHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      hash: randomHash,
      type,
      status: 'confirmed',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      sender: currentUserAddress,
      amount,
      symbol,
      description,
      blockNumber: Math.floor(14206012 + transactions.length * 20),
      gasUsed: type === 'faucet' ? 21000 : type === 'contribute' ? 64000 : 85000
    };
    setTransactions(prev => [...prev, newTx]);
  };

  // Callback 1: Faucet Claim
  const handleFaucetClaim = (symbol: 'MONAD' | 'USDC' | 'USDT', amount: number) => {
    setWallet(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [symbol]: prev.balances[symbol] + amount
      }
    }));
    createOnChainTx('faucet', amount, symbol, `Faucet claim of ${amount} ${symbol}`);
  };

  // Callback 2: Deposit / Contribution
  const handleContribute = (groupId: string, amount: number) => {
    // 1. Deduct from wallet
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    setWallet(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [group.symbol]: prev.balances[group.symbol] - amount
      }
    }));

    // 2. Add to pool savings
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      
      const updatedMembers = g.members.map(m => {
        if (m.address === currentUserAddress) {
          return { ...m, totalContributed: m.totalContributed + amount };
        }
        return m;
      });

      return {
        ...g,
        totalSaved: g.totalSaved + amount,
        members: updatedMembers
      };
    }));

    createOnChainTx('contribute', amount, group.symbol, `Deposited ${amount} ${group.symbol} to ${group.name}`);
  };

  // Callback 3: Create Shared Expense Proposal
  const handleCreateProposal = (groupId: string, title: string, description: string, amount: number, recipient: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const newProposal: Proposal = {
      id: `prop-${Date.now()}`,
      groupId,
      title,
      description,
      amount,
      symbol: group.symbol,
      recipient,
      creator: currentUserAddress,
      requiredSignatures: group.requiredSignatures,
      currentSignatures: [currentUserAddress], // Creator signs automatically
      status: 'pending_signatures',
      createdAt: new Date().toISOString()
    };

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        proposals: [...g.proposals, newProposal]
      };
    }));

    createOnChainTx('proposal_create', amount, group.symbol, `Proposed payout: ${title} for ${amount} ${group.symbol}`);
  };

  // Callback 4: Sign Multi-Sig proposal
  const handleSignProposal = (groupId: string, proposalId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      
      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;
        if (p.currentSignatures.includes(currentUserAddress)) return p;

        const nextSignatures = [...p.currentSignatures, currentUserAddress];
        let nextStatus = p.status;
        let disputeDeadline = p.disputeDeadline;

        // If threshold reached, transition to Approved with 24-hour safety lock period
        if (nextSignatures.length >= p.requiredSignatures) {
          nextStatus = 'approved';
          disputeDeadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        }

        return {
          ...p,
          currentSignatures: nextSignatures,
          status: nextStatus,
          disputeDeadline
        };
      });

      return { ...g, proposals: updatedProposals };
    }));

    const group = groups.find(g => g.id === groupId);
    const prop = group?.proposals.find(p => p.id === proposalId);
    if (group && prop) {
      createOnChainTx('proposal_approve', 0, group.symbol, `Signed Multi-Sig proposal: ${prop.title}`);
    }
  };

  // Callback 5: Flag & Lock Proposal (Dispute)
  const handleFlagProposal = (groupId: string, proposalId: string, reason: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;

      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;
        return {
          ...p,
          status: 'flagged_locked',
          flagger: currentUserAddress,
          flagReason: reason,
          votesApprove: [],
          votesReject: [currentUserAddress] // Plagger votes reject automatically
        };
      });

      return { ...g, proposals: updatedProposals };
    }));

    const group = groups.find(g => g.id === groupId);
    const prop = group?.proposals.find(p => p.id === proposalId);
    if (group && prop) {
      createOnChainTx('flag_lock', 0, group.symbol, `Flagged & locked payout: ${prop.title}`);
    }
  };

  // Callback 5.5: Veto Payout (Temporarily pause suspicious transactions for 24 hours)
  const handleVetoProposal = (groupId: string, proposalId: string, reason: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;

      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;

        const nextVetoers = p.vetoers ? [...p.vetoers] : [];
        if (!nextVetoers.includes(currentUserAddress)) {
          nextVetoers.push(currentUserAddress);
        }

        // Establish veto expiry (24h from now, or extend existing by 24h)
        const baseTime = p.vetoExpiry && new Date(p.vetoExpiry).getTime() > Date.now()
          ? new Date(p.vetoExpiry).getTime()
          : Date.now();
        const nextVetoExpiry = new Date(baseTime + 24 * 60 * 60 * 1000).toISOString();

        // Push the dispute deadline out as well
        let nextDisputeDeadline = p.disputeDeadline;
        if (!nextDisputeDeadline || new Date(nextDisputeDeadline).getTime() < new Date(nextVetoExpiry).getTime()) {
          nextDisputeDeadline = nextVetoExpiry;
        }

        return {
          ...p,
          status: 'vetoed_paused' as const,
          vetoExpiry: nextVetoExpiry,
          vetoers: nextVetoers,
          vetoReason: reason,
          disputeDeadline: nextDisputeDeadline
        };
      });

      return { ...g, proposals: updatedProposals };
    }));

    const group = groups.find(g => g.id === groupId);
    const prop = group?.proposals.find(p => p.id === proposalId);
    if (group && prop) {
      createOnChainTx('flag_lock', 0, group.symbol, `Vetoed payout (24h pause): ${prop.title}. Reason: ${reason}`);
    }
  };

  // Callback 6: Vote in active Dispute Governance
  const handleVoteDispute = (groupId: string, proposalId: string, support: boolean) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;

      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;

        const currentApprove = p.votesApprove || [];
        const currentReject = p.votesReject || [];

        if (currentApprove.includes(currentUserAddress) || currentReject.includes(currentUserAddress)) {
          return p; // Already voted
        }

        const nextApprove = support ? [...currentApprove, currentUserAddress] : currentApprove;
        const nextReject = !support ? [...currentReject, currentUserAddress] : currentReject;

        return {
          ...p,
          votesApprove: nextApprove,
          votesReject: nextReject
        };
      });

      return { ...g, proposals: updatedProposals };
    }));

    const group = groups.find(g => g.id === groupId);
    const prop = group?.proposals.find(p => p.id === proposalId);
    if (group && prop) {
      createOnChainTx('dispute_vote', 0, group.symbol, `Voted ${support ? 'APPROVE' : 'DENY'} on dispute: ${prop.title}`);
    }
  };

  // Callback 7: Resolve Dispute Governance
  const handleResolveDispute = (groupId: string, proposalId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;

      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;

        const approveCount = p.votesApprove?.length || 0;
        const rejectCount = p.votesReject?.length || 0;

        // If approved by co-op votes, release back to Approved state (cleared of flags)
        // If rejected, slash proposal and reduce creator's reputation score
        const resolvedApproved = approveCount >= rejectCount;
        
        return {
          ...p,
          status: resolvedApproved ? 'approved' : 'rejected',
          disputeDeadline: undefined
        };
      });

      // Update creator reputation score if rejected
      const propObj = g.proposals.find(p => p.id === proposalId);
      const isRejected = (propObj?.votesApprove?.length || 0) < (propObj?.votesReject?.length || 0);
      
      const updatedMembers = g.members.map(m => {
        if (isRejected && m.address === propObj?.creator) {
          return { ...m, reputationScore: Math.max(0, m.reputationScore - 12) };
        }
        return m;
      });

      return {
        ...g,
        proposals: updatedProposals,
        members: updatedMembers
      };
    }));

    const group = groups.find(g => g.id === groupId);
    const prop = group?.proposals.find(p => p.id === proposalId);
    if (group && prop) {
      createOnChainTx('dispute_vote', 0, group.symbol, `Dispute resolved on-chain: ${prop.title}`);
    }
  };

  // Callback 8: Execute Approved Proposal (Withdraws funds to recipient)
  const handleExecuteProposal = (groupId: string, proposalId: string) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;

      const propObj = g.proposals.find(p => p.id === proposalId);
      if (!propObj) return g;

      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;
        return {
          ...p,
          status: 'executed'
        };
      });

      return {
        ...g,
        totalSaved: Math.max(0, g.totalSaved - propObj.amount),
        proposals: updatedProposals
      };
    }));

    const group = groups.find(g => g.id === groupId);
    const prop = group?.proposals.find(p => p.id === proposalId);
    if (group && prop) {
      createOnChainTx('contribute', prop.amount, group.symbol, `Executed Payout to ${prop.recipient}: ${prop.amount} ${group.symbol}`);
    }
  };

  // Callback 9: Toggle Yield APY
  const handleToggleYield = (groupId: string, enabled: boolean) => {
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        yieldEnabled: enabled
      };
    }));

    const group = groups.find(g => g.id === groupId);
    if (group) {
      createOnChainTx('yield_toggle', 0, group.symbol, `Toggled DeFi Yield Wrapper to ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }
  };

  if (!showDashboard) {
    return <LandingPage onLaunchApp={() => setShowDashboard(true)} />;
  }

  if (!currentUserAddress) {
    return (
      <div className="min-h-screen bg-dark-950 text-slate-300 flex flex-col font-sans select-none antialiased selection:bg-gold-600 selection:text-black">
        {/* Top Header */}
        <header className="bg-dark-900 border-b border-white/5 py-4 px-6 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-gold-600 to-gold-700 rounded-xl shadow-lg text-black flex items-center justify-center border border-gold-600/30">
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-white font-display">GlobalSave</h1>
                  <span className="px-2 py-0.5 bg-gold-600/10 border border-gold-600/20 rounded text-[9px] font-mono text-gold-500 font-medium">
                    Monad Devnet
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans">Decentralized Micro-Savings & Shared Expense Pools</p>
              </div>
            </div>
          </div>
        </header>

        {/* Login Main Area */}
        <main className="flex-1 max-w-xl w-full mx-auto p-6 flex flex-col justify-center my-auto">
          <div className="bg-dark-900 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Ambient glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold-600/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold-600/5 rounded-full blur-3xl" />

            <div className="text-center space-y-2">
              <h2 className="text-lg font-display font-bold text-white tracking-tight uppercase tracking-widest flex items-center justify-center gap-2">
                Connect Co-op Wallet Identity
              </h2>
              <p className="text-[11px] text-slate-400">
                Choose a signatory profile or connect a custom virtual account to establish your co-op credentials on the Monad ledger.
              </p>
            </div>

            {/* Simulated Members Grid */}
            <div className="space-y-2.5">
              <span className="text-[9px] text-slate-500 font-mono font-semibold block uppercase tracking-wider">
                Audited Pool Signatories (Pre-configured)
              </span>
              
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    address: '0xUSER_VIRTUAL_WALLET',
                    name: 'You (Virtual Monad Account)',
                    role: 'Default Co-op Member',
                    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
                    reputation: 100,
                    badge: 'You'
                  },
                  {
                    address: '0x3ea7...8b1e',
                    name: 'Elena Rostova',
                    role: 'Organizer / Core Signatory',
                    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
                    reputation: 98,
                    badge: 'Organizer'
                  },
                  {
                    address: '0x9d2a...1a3f',
                    name: 'Kenji Sato',
                    role: 'Active Signatory',
                    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    reputation: 95,
                    badge: 'High Trust'
                  },
                  {
                    address: '0x7c4f...d892',
                    name: 'Carlos Mendez',
                    role: 'Active Signatory',
                    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
                    reputation: 92,
                    badge: 'High Trust'
                  },
                  {
                    address: '0x1b8c...9e3a',
                    name: 'Sarah Jenkins',
                    role: 'Active Signatory',
                    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
                    reputation: 89,
                    badge: 'Cooperative'
                  }
                ].map((member) => (
                  <button
                    key={member.address}
                    onClick={() => handleSignIn(member.address)}
                    className="w-full text-left p-3 bg-dark-800 hover:bg-dark-750 border border-white/5 hover:border-gold-600/30 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={member.avatarUrl} alt={member.name} className="h-9 w-9 rounded-full border border-white/10 object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-sans font-bold text-white group-hover:text-gold-500 transition-colors">
                            {member.name}
                          </span>
                          <span className="px-1.5 py-0.2 bg-dark-950 text-[8px] font-mono text-slate-500 rounded border border-white/5">
                            {member.badge}
                          </span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500 truncate block mt-0.5">
                          {member.address}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[9px] font-mono text-gold-500 block font-semibold">Rep: {member.reputation}</span>
                      <span className="text-[8px] font-sans text-slate-400 block mt-0.5 group-hover:text-white transition-colors font-semibold">
                        Enter Workspace &rarr;
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Private Key Input */}
            <div className="pt-4 border-t border-white/5 space-y-2">
              <span className="text-[9px] text-slate-500 font-mono font-semibold block uppercase tracking-wider">
                Or Connect Custom Virtual EVM Key
              </span>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const input = form.elements.namedItem('customAddress') as HTMLInputElement;
                  if (input && input.value.trim()) {
                    handleSignIn(input.value.trim());
                  }
                }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-[10px] font-mono text-slate-500">ADDR:</span>
                  <input
                    name="customAddress"
                    type="text"
                    required
                    placeholder="0x..."
                    className="w-full bg-dark-950 border border-white/5 rounded-xl text-xs font-mono text-white pl-14 pr-3 py-2.5 focus:outline-none focus:border-gold-600/50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gold-600 hover:bg-gold-500 text-black rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer shadow-md active:translate-y-px"
                >
                  Connect
                </button>
              </form>
            </div>

          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-300 flex flex-col font-sans select-none antialiased selection:bg-gold-600 selection:text-black">
      
      {/* Top Header */}
      <header className="bg-dark-900 border-b border-white/5 py-4 px-6 sticky top-0 z-30 shadow-md backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div 
            onClick={() => setShowDashboard(false)} 
            className="flex items-center gap-3 cursor-pointer group"
            title="Go to website landing page"
          >
            <div className="p-2.5 bg-gradient-to-br from-gold-600 to-gold-700 rounded-xl shadow-lg shadow-gold-600/10 text-black flex items-center justify-center border border-gold-600/30 group-hover:scale-105 transition-transform">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white font-display group-hover:text-gold-500 transition-colors">GlobalSave</h1>
                <span className="px-2 py-0.5 bg-gold-600/10 border border-gold-600/20 rounded text-[9px] font-mono text-gold-500 font-medium">
                  Monad Devnet
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans">Decentralized Micro-Savings & Shared Expense Pools</p>
            </div>
          </div>

          {/* Connected Wallet Account Info & Sign Out */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-dark-950/80 px-4 py-2 rounded-xl border border-white/5">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 block font-mono">AUTHORIZED CO-OP ID</span>
                <span className="text-xs text-white font-mono font-bold block">
                  {currentUserAddress.slice(0, 10)}...{currentUserAddress.slice(-4)}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gold-600/10 border border-gold-600/20 flex items-center justify-center text-gold-500 text-xs font-mono font-bold">
                {currentUserAddress === '0xUSER_VIRTUAL_WALLET' ? 'You' : 'CO'}
              </div>
            </div>

            <button
              onClick={() => setShowDashboard(false)}
              className="px-3.5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-sans font-semibold transition-all shadow-md cursor-pointer active:translate-y-px"
            >
              Back to Website
            </button>

            <button
              id="btn-sign-out"
              onClick={handleSignOut}
              className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-xl text-xs font-sans font-semibold transition-all shadow-md cursor-pointer active:translate-y-px"
            >
              Sign Out
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Row 1: High-Level Analytics Indicators */}
        <section id="onchain-stats-dashboard" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-dark-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">Total Pool Savings</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-mono font-bold text-white">${totalSavedAcrossPools.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 font-mono">USDC / T</span>
              </div>
            </div>
            <div className="p-3 bg-gold-600/10 text-gold-500 rounded-xl border border-gold-600/10">
              <Landmark className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-dark-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">Your Contributions</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-mono font-bold text-gold-500">${userTotalContributions.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 font-mono">USDC / T</span>
              </div>
            </div>
            <div className="p-3 bg-gold-600/10 text-gold-500 rounded-xl border border-gold-600/10">
              <Coins className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-dark-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">DeFi Accrued APY</span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-mono font-bold text-emerald-400">+${totalYieldCompounded.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-600 font-mono">ACCRUED</span>
              </div>
            </div>
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/10">
              <BadgePercent className="h-5 w-5 animate-pulse" />
            </div>
          </div>

          <div className="bg-dark-800 border border-white/5 p-4 rounded-2xl flex items-center justify-between relative overflow-hidden shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider block">Security Alerts</span>
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-mono font-bold ${activeDisputesCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                  {activeDisputesCount} Active Locks
                </span>
              </div>
            </div>
            <div className={`p-3 rounded-xl border ${activeDisputesCount > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-dark-700 text-slate-500 border-white/5'}`}>
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>

        </section>

        {/* Row 3: Cooperative Workspace - Wallet + Group details */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Wallet Console (5 cols) & Savings Pools Selection */}
          <div className="lg:col-span-5 space-y-6">
            <WalletConsole 
              wallet={wallet} 
              onFaucetClaim={handleFaucetClaim} 
              transactions={transactions} 
            />

            {/* Select Savings Pool card list */}
            <div className="bg-dark-800 border border-white/5 rounded-2xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2 font-display">
                  <Layers className="h-4 w-4 text-gold-500" />
                  Select Active Savings Pool
                </h2>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">{groups.length} Pools</span>
              </div>

              <div id="savings-groups-list" className="flex flex-col gap-3">
                {groups.map((g) => {
                  const progress = Math.min(100, Math.round((g.totalSaved / g.targetAmount) * 100));
                  const isActive = g.id === selectedGroupId;

                  return (
                    <button 
                      key={g.id}
                      onClick={() => setSelectedGroupId(g.id)}
                      className={`w-full text-left p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col gap-2 ${
                        isActive 
                          ? 'bg-dark-900 border-gold-600/60 shadow-gold-600/5 shadow-md scale-[1.01]' 
                          : 'bg-dark-900/40 border-white/5 hover:border-white/10 hover:bg-dark-850/50'
                      }`}
                    >
                      {/* Ambient Glow on Active Card */}
                      {isActive && (
                        <div className="absolute right-0 top-0 w-24 h-24 bg-gold-600/5 rounded-full blur-2xl pointer-events-none" />
                      )}

                      <div className="flex items-center justify-between gap-2 w-full">
                        <span className="px-2 py-0.5 bg-dark-950 rounded-md text-[9px] font-mono font-semibold text-slate-300 border border-white/5">
                          {g.category}
                        </span>
                        <span className="text-[10px] font-mono text-gold-500 font-medium">
                          Multi-Sig {g.requiredSignatures}/{g.members.length} Sigs
                        </span>
                      </div>

                      <div className="w-full">
                        <h3 className="text-sm font-display font-semibold text-white block truncate">{g.name}</h3>
                        <p className="text-[11px] text-slate-400 font-sans line-clamp-1 mt-0.5">{g.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1 mt-1 w-full">
                        <span className="text-base font-mono font-bold text-white">{g.totalSaved.toLocaleString()}</span>
                        <span className="text-[9px] font-mono text-slate-500">{g.symbol}</span>
                        <span className="text-[9px] font-mono text-slate-500 block ml-auto">Goal: {g.targetAmount.toLocaleString()}</span>
                      </div>

                      {/* Progress tracker bar */}
                      <div className="space-y-1 w-full">
                        <div className="w-full bg-dark-950 h-1 rounded-full overflow-hidden">
                          <div className="bg-gold-600 h-full rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-slate-500">
                          <span>{progress}% complete</span>
                          {g.yieldEnabled && (
                            <span className="text-emerald-400 flex items-center gap-0.5 font-sans">
                              <Activity className="h-2.5 w-2.5 animate-pulse" /> DeFi Active
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Group Ledger & Multi-Sig (7 cols) */}
          <div className="lg:col-span-7">
            <GroupDetails
              group={activeGroup}
              wallet={wallet}
              onContribute={handleContribute}
              onCreateProposal={handleCreateProposal}
              onSignProposal={handleSignProposal}
              onFlagProposal={handleFlagProposal}
              onVetoProposal={handleVetoProposal}
              onExecuteProposal={handleExecuteProposal}
              onToggleYield={handleToggleYield}
              currentUserAddress={currentUserAddress}
            />
          </div>

        </section>

        {/* Row 4: Onchain Dispute Center (Governance) */}
        <section id="governance-dispute-section">
          <DisputeCenter
            groups={groups}
            wallet={wallet}
            onVoteDispute={handleVoteDispute}
            onResolveDispute={handleResolveDispute}
            currentUserAddress={currentUserAddress}
          />
        </section>

        {/* Row 5: Solidity Contract Console & Explorer Tabs */}
        <section className="space-y-4">
          
          <div className="flex border-b border-white/5 bg-dark-900/40 p-1 rounded-xl max-w-sm">
            <button
              id="tab-contract"
              onClick={() => setActiveTab('pools')}
              className={`flex-1 py-1.5 text-[10px] font-sans font-semibold rounded-lg transition-all ${
                activeTab === 'pools' ? 'bg-gold-600 text-black shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Solidity Contract Console
            </button>
            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-1.5 text-[10px] font-sans font-semibold rounded-lg transition-all ${
                activeTab === 'history' ? 'bg-gold-600 text-black shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Auditable Ledger history
            </button>
          </div>

          <div>
            {activeTab === 'pools' ? (
              <ContractViewer />
            ) : (
              <TransactionHistory transactions={transactions} />
            )}
          </div>

        </section>

      </main>

      {/* Deep Footer */}
      <footer className="bg-dark-950 border-t border-white/5 py-6 px-6 mt-12 text-center text-slate-500 font-mono text-[10px] space-y-2">
        <p>© 2026 GlobalSave Protocol. High-Performance Parallelized Ledger Settlement on Monad Testnet.</p>
        <div className="flex justify-center items-center gap-4 text-slate-600">
          <span>Finality: 0.9s</span>
          <span>•</span>
          <span>Block Rate: 1.0s</span>
          <span>•</span>
          <span>Max Capacity: 10,000 TPS</span>
        </div>
      </footer>

    </div>
  );
}
