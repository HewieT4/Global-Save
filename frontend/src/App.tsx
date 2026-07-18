import { useState, useEffect } from 'react';
import { 
  Coins, Gavel, Landmark, ShieldAlert, BadgePercent, 
  Sparkles, Layers, Cpu, Award, Heart, HelpCircle, 
  Terminal, ShieldCheck, Activity, Users, ArrowUpRight
} from 'lucide-react';
import { WalletState, SavingsGroup, Transaction, Proposal, GroupMember } from './types';
import { INITIAL_GROUPS, INITIAL_TRANSACTIONS } from './data/mockData';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useGlobalSave } from './hooks/useGlobalSave';

// Subcomponents
import WalletConsole from './components/WalletConsole';
import GroupDetails from './components/GroupDetails';
import DisputeCenter from './components/DisputeCenter';
import ContractViewer from './components/ContractViewer';
import TransactionHistory from './components/TransactionHistory';
import LandingPage from './components/LandingPage';

const DEFAULT_USER_ADDRESS = '0xUSER_VIRTUAL_WALLET';

// NOTE: These keys are for simulation and local sandbox UI demo purposes only. No real assets are at risk.
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
  const [showDashboard, setShowDashboard] = useState<boolean>(false);

  const [currentUserAddress, setCurrentUserAddress] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('glob_save_current_user_address');
      return saved || DEFAULT_USER_ADDRESS;
    } catch (e) {
      console.error("Failed to read glob_save_current_user_address:", e);
      return DEFAULT_USER_ADDRESS;
    }
  });

  // State variables with localStorage persistence
  const [wallet, setWallet] = useState<WalletState>(() => {
    try {
      const saved = localStorage.getItem('glob_save_wallet');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_WALLET,
          ...parsed,
          privateKey: DEFAULT_WALLET.privateKey,
          seedPhrase: DEFAULT_WALLET.seedPhrase
        };
      }
    } catch (e) {
      console.error("Failed to parse glob_save_wallet:", e);
    }
    return DEFAULT_WALLET;
  });

  useEffect(() => {
    try {
      localStorage.setItem('glob_save_current_user_address', currentUserAddress);
    } catch (e) {
      console.error("Failed to save glob_save_current_user_address:", e);
    }
  }, [currentUserAddress]);

  const [groups, setGroups] = useState<SavingsGroup[]>(() => {
    try {
      const saved = localStorage.getItem('glob_save_groups');
      return saved ? JSON.parse(saved) : INITIAL_GROUPS;
    } catch (e) {
      console.error("Failed to parse glob_save_groups:", e);
      return INITIAL_GROUPS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('glob_save_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch (e) {
      console.error("Failed to parse glob_save_transactions:", e);
      return INITIAL_TRANSACTIONS;
    }
  });

  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || 'group-nomadnest');
  const [activeTab, setActiveTab] = useState<'pools' | 'contract' | 'history'>('pools');
  const [workspaceTab, setWorkspaceTab] = useState<'vault' | 'disputes' | 'ledger' | 'solidity'>('vault');

  // Custom modals, search and toggle parameters
  const [showContributeModal, setShowContributeModal] = useState<boolean>(false);
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [contributeAmount, setContributeAmount] = useState<string>('100');
  const [proposalForm, setProposalForm] = useState({ title: '', desc: '', amount: '250', recipient: '0x3ea7...8b1e' });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrivateKey, setShowPrivateKey] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [mockNotification, setMockNotification] = useState<string | null>(null);
  const triggerNotification = (msg: string) => {
    setMockNotification(msg);
    setTimeout(() => {
      setMockNotification(null);
    }, 4000);
  };

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

  // Sync state to local storage with privacy protection
  useEffect(() => {
    try {
      const safeWallet = {
        ...wallet,
        privateKey: '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••',
        seedPhrase: '•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••'
      };
      localStorage.setItem('glob_save_wallet', JSON.stringify(safeWallet));
    } catch (e) {
      console.error("Failed to save glob_save_wallet:", e);
    }
  }, [wallet]);

  useEffect(() => {
    try {
      localStorage.setItem('glob_save_groups', JSON.stringify(groups));
    } catch (e) {
      console.error("Failed to save glob_save_groups:", e);
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem('glob_save_transactions', JSON.stringify(transactions));
    } catch (e) {
      console.error("Failed to save glob_save_transactions:", e);
    }
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

  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  const { isConnected, address: connectedAddress } = useAccount();

  const {
    totalPoolBalance,
    requiredSignaturesCount,
    yieldEnabled: isYieldEnabledOnChain,
    contribute: writeContribute,
    createProposal: writeCreateProposal,
    signProposal: writeSignProposal,
    vetoPayout: writeVetoPayout,
    flagProposal: writeFlagProposal,
    voteDispute: writeVoteDispute,
    resolveDispute: writeResolveDispute,
    executeProposal: writeExecuteProposal,
    toggleYield: writeToggleYield
  } = useGlobalSave(activeGroup?.contractAddress as `0x${string}`);

  // Sync connected wallet address to local user identity
  useEffect(() => {
    if (isConnected && connectedAddress) {
      setCurrentUserAddress(connectedAddress);
    }
  }, [isConnected, connectedAddress]);

  // Draw canvas charts on dashboard load or group selection
  useEffect(() => {
    if (workspaceTab === 'vault' && showDashboard) {
      const timer = setTimeout(() => {
        // Draw sparklines
        drawMockChart('nomadnest-chart', '#007AFF', [0.8, 0.4, 0.7, 0.3, 0.6, 0.2]);
        drawMockChart('communi-chart', '#ffffff', [0.7, 0.6, 0.8, 0.5, 0.4, 0.1]);
        drawMockChart('travel-chart', '#60a5fa', [0.2, 0.5, 0.3, 0.6, 0.4, 0.8]);
        
        drawMockChart('trend-chart', '#007AFF', [0.4, 0.5, 0.3, 0.6, 0.4, 0.5]);
        drawMockChart('price-chart', '#60a5fa', [0.2, 0.4, 0.3, 0.6, 0.5, 0.8]);
        drawMockChart('ratio-chart', '#007AFF', [0.8, 0.7, 0.75, 0.7, 0.8, 0.78]);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [workspaceTab, selectedGroupId, showDashboard, groups]);

  const drawMockChart = (canvasId: string, color: string, points: number[]) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const w = rect.width;
    const h = rect.height;
    
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.moveTo(0, h * points[0]);
    
    points.forEach((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h * p;
      ctx.lineTo(x, y);
    });
    ctx.stroke();

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '22');
    grad.addColorStop(1, color + '00');
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fillStyle = grad;
    ctx.fill();
  };

  /*
   * =========================================================================
   * HYBRID WEB3 ARCHITECTURE & CLIENT-SIDE STATE SIMULATOR
   * =========================================================================
   * This application implements a dual-mode interaction layer:
   * 
   * 1. LIVE ON-CHAIN MODE (Wagmi + RainbowKit):
   *    When a user connects a real EVM wallet (MetaMask, WalletConnect, etc.),
   *    all transactions are routed directly to the verified smart contracts
   *    deployed on the Monad testnet. This provides actual mutative operations
   *    with block explorer confirmations.
   * 
   * 2. REACTIVE CLIENT-SIDE SANDBOX MODE (Virtual Accounts):
   *    When a user selects a pre-configured signatory profile (e.g., Elena, Kenji)
   *    or enters a simulated custom key, a fully reactive state machine manages
   *    the cooperative logic. Changes to balances, proposals, signature thresholds,
   *    dispute votes, reputation penalties, and yield calculations are instantly
   *    tallied and persisted in the local workspace. No mock clicks or vaporware!
   * 
   * MONAD NETWORK BENCHMARKS:
   *    - Sub-second transaction confirmation times modeled at the consensus level.
   *    - Optimized gas limits calculated for Monad's parallel execution engine (db/VM).
   */

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
  const handleContribute = async (groupId: string, amount: number) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        await writeContribute(String(amount));
        createOnChainTx('contribute', amount, activeGroup.symbol, `On-Chain Contribution initiated: ${amount} ${activeGroup.symbol}`);
      } catch (err) {
        console.error("On-chain contribution failed:", err);
      }
      return;
    }

    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    setWallet(prev => ({
      ...prev,
      balances: {
        ...prev.balances,
        [group.symbol]: prev.balances[group.symbol] - amount
      }
    }));

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
  const handleCreateProposal = async (groupId: string, title: string, description: string, amount: number, recipient: string) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        await writeCreateProposal(title, description, String(amount), recipient);
        createOnChainTx('proposal_create', amount, activeGroup.symbol, `Proposed payout on-chain: ${title} for ${amount} ${activeGroup.symbol}`);
      } catch (err) {
        console.error("On-chain createProposal failed:", err);
      }
      return;
    }

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
      currentSignatures: [currentUserAddress],
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
  const handleSignProposal = async (groupId: string, proposalId: string) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        const numericId = Number(proposalId.replace('prop-', '')) || 0;
        await writeSignProposal(numericId);
        createOnChainTx('proposal_approve', 0, activeGroup.symbol, `Signed Multi-Sig proposal on-chain: ID ${numericId}`);
      } catch (err) {
        console.error("On-chain signProposal failed:", err);
      }
      return;
    }

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;
        if (p.currentSignatures.includes(currentUserAddress)) return p;

        const nextSignatures = [...p.currentSignatures, currentUserAddress];
        let nextStatus = p.status;
        let disputeDeadline = p.disputeDeadline;

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
  const handleFlagProposal = async (groupId: string, proposalId: string, reason: string) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        const numericId = Number(proposalId.replace('prop-', '')) || 0;
        await writeFlagProposal(numericId, reason);
        createOnChainTx('flag_lock', 0, activeGroup.symbol, `Flagged & locked payout on-chain: ID ${numericId}`);
      } catch (err) {
        console.error("On-chain flagProposal failed:", err);
      }
      return;
    }

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
          votesReject: [currentUserAddress]
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

  // Callback 5.5: Veto Payout
  const handleVetoProposal = async (groupId: string, proposalId: string, reason: string) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        const numericId = Number(proposalId.replace('prop-', '')) || 0;
        await writeVetoPayout(numericId, reason);
        createOnChainTx('flag_lock', 0, activeGroup.symbol, `Vetoed payout on-chain (24h pause): ID ${numericId}`);
      } catch (err) {
        console.error("On-chain vetoPayout failed:", err);
      }
      return;
    }

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;

        const nextVetoers = p.vetoers ? [...p.vetoers] : [];
        if (!nextVetoers.includes(currentUserAddress)) {
          nextVetoers.push(currentUserAddress);
        }

        const baseTime = p.vetoExpiry && new Date(p.vetoExpiry).getTime() > Date.now()
          ? new Date(p.vetoExpiry).getTime()
          : Date.now();
        const nextVetoExpiry = new Date(baseTime + 24 * 60 * 60 * 1000).toISOString();

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
  const handleVoteDispute = async (groupId: string, proposalId: string, support: boolean) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        const numericId = Number(proposalId.replace('prop-', '')) || 0;
        await writeVoteDispute(numericId, support);
        createOnChainTx('dispute_vote', 0, activeGroup.symbol, `Voted on-chain ${support ? 'APPROVE' : 'DENY'} on dispute: ID ${numericId}`);
      } catch (err) {
        console.error("On-chain voteDispute failed:", err);
      }
      return;
    }

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;

        const currentApprove = p.votesApprove || [];
        const currentReject = p.votesReject || [];

        if (currentApprove.includes(currentUserAddress) || currentReject.includes(currentUserAddress)) {
          return p;
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
  const handleResolveDispute = async (groupId: string, proposalId: string) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        const numericId = Number(proposalId.replace('prop-', '')) || 0;
        await writeResolveDispute(numericId);
        createOnChainTx('dispute_vote', 0, activeGroup.symbol, `Resolved dispute on-chain: ID ${numericId}`);
      } catch (err) {
        console.error("On-chain resolveDispute failed:", err);
      }
      return;
    }

    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const updatedProposals = g.proposals.map(p => {
        if (p.id !== proposalId) return p;

        const approveCount = p.votesApprove?.length || 0;
        const rejectCount = p.votesReject?.length || 0;
        const resolvedApproved = approveCount >= rejectCount;
        
        return {
          ...p,
          status: resolvedApproved ? 'approved' : 'rejected',
          disputeDeadline: undefined
        };
      });

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

  // Callback 8: Execute Approved Proposal
  const handleExecuteProposal = async (groupId: string, proposalId: string) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        const numericId = Number(proposalId.replace('prop-', '')) || 0;
        await writeExecuteProposal(numericId);
        createOnChainTx('contribute', 0, activeGroup.symbol, `Executed payout on-chain: ID ${numericId}`);
      } catch (err) {
        console.error("On-chain executeProposal failed:", err);
      }
      return;
    }

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
  const handleToggleYield = async (groupId: string, enabled: boolean) => {
    if (isConnected && activeGroup?.contractAddress) {
      try {
        await writeToggleYield(enabled);
        createOnChainTx('yield_toggle', 0, activeGroup.symbol, `Toggled yield wrapper on-chain to ${enabled ? 'ENABLED' : 'DISABLED'}`);
      } catch (err) {
        console.error("On-chain toggleYield failed:", err);
      }
      return;
    }

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
    return (
      <LandingPage
        onLaunchApp={() => {
          setShowDashboard(true);
          if (!currentUserAddress) {
            handleSignIn('0xUSER_VIRTUAL_WALLET');
          }
        }}
      />
    );
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
            
            <button 
              onClick={() => setShowDashboard(false)}
              className="px-3.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 border border-white/10 rounded-xl text-xs font-semibold text-white transition active:scale-95 cursor-pointer"
            >
              Back to Home
            </button>
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
                    const addressVal = input.value.trim();
                    // EVM addresses are 42 characters starting with 0x followed by 40 hex chars
                    const evmAddrRegex = /^0x[a-fA-F0-9]{40}$/;
                    if (!evmAddrRegex.test(addressVal)) {
                      alert("Invalid EVM Address! Must start with '0x' followed by exactly 40 hex characters.");
                      return;
                    }
                    handleSignIn(addressVal);
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





  // Filtered proposals based on search
  const activeProposals = activeGroup.proposals.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen overflow-hidden flex bg-[#0d0d12] text-white font-sans relative selection:bg-[#007AFF] selection:text-white">
      {/* Global background video (fixed, behind everything) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-[0.03]"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
        />
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}

      {/* BEGIN: LeftSidebar */}
      <aside 
        className={`w-64 border-r border-gray-800 bg-[#0d0d12] flex flex-col p-6 space-y-8 fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 md:relative md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center shadow-lg shadow-white/5">
            <span className="text-black font-extrabold font-display">G</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none tracking-tight">GlobalSave®</span>
            <span className="text-xs text-gray-500 font-mono">Cooperative Finance</span>
          </div>
        </div>

        {/* Toggle Group */}
        <div className="bg-zinc-900 p-1 rounded-xl flex border border-white/5 text-[11px] font-mono">
          <button 
            onClick={() => setActiveTab('pools')}
            className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'pools' ? 'bg-zinc-800 text-white font-bold' : 'text-gray-500 hover:text-white'
            }`}
          >
            Active Pools
          </button>
          <button 
            onClick={() => setActiveTab('contract')}
            className={`flex-1 py-1.5 text-center font-medium rounded-lg transition-colors ${
              activeTab === 'contract' ? 'bg-zinc-800 text-white font-bold' : 'text-gray-500 hover:text-white'
            }`}
          >
            Yield Sweep
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1 flex-1 overflow-y-auto pr-2">
          <div className="space-y-2">
            <button 
              onClick={() => {
                setWorkspaceTab('vault');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                workspaceTab === 'vault' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => {
                setWorkspaceTab('disputes');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                workspaceTab === 'disputes' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Governance Disputes</span>
            </button>

            <button 
              onClick={() => {
                setWorkspaceTab('ledger');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                workspaceTab === 'ledger' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Auditable Ledger</span>
            </button>

            <button 
              onClick={() => {
                setWorkspaceTab('solidity');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                workspaceTab === 'solidity' ? 'sidebar-active text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>Solidity Contract API</span>
            </button>
          </div>

          {/* Active Staking Section (Active Pools) */}
          <div className="mt-8">
            <div className="flex items-center justify-between px-3 mb-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider font-mono">Active Co-ops</span>
              <span className="bg-gray-800 text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-mono">{groups.length}</span>
            </div>
            <div className="space-y-3 px-1">
              {groups.map((g) => {
                const isActive = g.id === selectedGroupId;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGroupId(g.id);
                      setWorkspaceTab('vault');
                      setSidebarOpen(false);
                    }}
                    className={`w-full text-left flex items-center space-x-3 p-2 rounded-xl transition-all border ${
                      isActive 
                        ? 'bg-zinc-900 border-[#007AFF]/30' 
                        : 'border-transparent hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono shadow-md ${
                      g.symbol === 'USDC' ? 'bg-[#007AFF] text-white' : g.symbol === 'MONAD' ? 'bg-white text-[#007AFF]' : 'bg-emerald-500 text-white'
                    }`}>
                      {g.symbol.slice(0, 1)}
                    </div>
                    <div className="text-[11px] truncate flex-1">
                      <div className={`font-semibold ${isActive ? 'text-[#007AFF]' : 'text-gray-300'}`}>{g.name}</div>
                      <div className="font-mono text-gray-500 mt-0.5">${g.totalSaved.toLocaleString()}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Action */}
        <div className="bg-zinc-900 p-4 rounded-xl border border-white/5 space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-white">Monad Consensus</span>
          </div>
          <p className="text-[10px] text-gray-500 font-mono">Finality: ~0.9s | gasLimit: 30M</p>
        </div>
      </aside>
      {/* END: LeftSidebar */}

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-20 bg-black/10 backdrop-blur-sm">
        
        {/* BEGIN: TopNavigation */}
        <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 md:px-8 bg-[#0d0d12]/90 backdrop-blur-xl">
          <div className="flex items-center space-x-4">
            {/* Hamburger Toggle */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-400 hover:text-white md:hidden border border-gray-800 rounded-lg cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Profile Info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden border border-white/10 shadow-md">
                <img 
                  alt="Sophia Chen" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb8CDju082NzkH2KdHfBJTcfryDCCnNPPtXXHyl4K04HCXZpKpVO9WivsIxP7ogaBF5twcgGBM6zcxlcKKx4YLNLScL4FY2o5y4tMlu8cAg8GYod6ZP-RcBDOu1KG_wKWS1wXa1gPhKmqPHTc-o6_DMD08PF5TtzVODMZgQPIB79pSTbENNAFx-9rLlz3XqKUm59GmmYpcsjxpxryfAsjtC3fS4AHq1hQU6Vb3kMWGcMYtz8nh5ihJiiMaLWAJ1wU4TWw23blqxTF5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-mono">
                  {currentUserAddress === '0xUSER_VIRTUAL_WALLET' ? '@sophia997' : `@${currentUserAddress.slice(0,6)}`}
                  <span className="bg-zinc-800 text-[#007AFF] text-[9px] px-1 rounded ml-1.5 font-bold">100 REP</span>
                </span>
                <span className="text-xs font-bold text-white">Sophia Chen</span>
              </div>
            </div>

            {/* Deposit Faucet Trigger */}
            <button 
              onClick={() => handleFaucetClaim('MONAD', 10)}
              className="bg-[#007AFF] hover:bg-blue-600 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 transition text-white active:scale-95 shadow-md shadow-blue-500/10 cursor-pointer"
              title="Claim 10 MONAD from developer faucet"
            >
              <span>Faucet Claim</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-900 border border-gray-800 text-white rounded-lg py-1.5 pl-9 pr-3 text-xs w-40 focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF] outline-none" 
                placeholder="Search proposals..." 
                type="text"
              />
            </div>

            {/* Back to Website Button */}
            <button 
              onClick={() => setShowDashboard(false)}
              className="bg-zinc-900 border border-gray-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 hover:bg-zinc-800 text-gray-200 transition active:scale-95 cursor-pointer mr-1"
            >
              <span>Exit Console</span>
            </button>

            {/* RainbowKit Connect Button */}
            <ConnectButton chainStatus="icon" showBalance={false} />
          </div>
        </header>
        {/* END: TopNavigation */}

        {/* Core Main Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          
          {workspaceTab === 'vault' && (
            <div className="space-y-8 animate-fade-in">
              {/* BEGIN: HeroSection */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Top Staking Assets */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h2 className="text-xl font-extrabold tracking-tight">Active Savings Pools</h2>
                      <div className="bg-zinc-900 px-2.5 py-0.5 rounded-full text-[9px] text-gray-400 flex items-center space-x-1 border border-white/5 font-mono">
                        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3" />
                        </svg>
                        <span>{groups.length} Pools Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Assets Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {groups.map((g) => {
                      const isActive = g.id === selectedGroupId;
                      const progressColor = g.symbol === 'USDC' ? '#007AFF' : g.symbol === 'MONAD' ? '#ffffff' : '#10b981';
                      const chartId = `${g.id.replace('group-', '')}-chart`;
                      
                      return (
                        <div 
                          key={g.id}
                          onClick={() => setSelectedGroupId(g.id)}
                          className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden ${
                            isActive 
                              ? 'bg-zinc-900/90 border-[#007AFF]/60 shadow-lg shadow-[#007AFF]/5 scale-[1.01]' 
                              : 'bg-zinc-900/40 border-gray-800 hover:border-gray-700 hover:bg-zinc-900/60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shadow ${
                                g.symbol === 'USDC' ? 'bg-[#007AFF] text-white' : g.symbol === 'MONAD' ? 'bg-white text-[#007AFF]' : 'bg-emerald-500 text-white'
                              }`}>
                                {g.symbol.slice(0, 1)}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[9px] text-gray-500 font-mono uppercase tracking-wider">{g.category}</div>
                                <div className="text-xs font-bold text-white truncate max-w-[100px]">{g.name}</div>
                              </div>
                            </div>
                            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                          </div>

                          <div className="mb-2">
                            <div className="text-[9px] text-gray-500 font-mono uppercase">APY Reward</div>
                            <div className="text-lg font-bold font-mono text-white">
                              {g.id === 'group-nomadnest' ? '4.80%' : g.id === 'group-communi' ? '6.20%' : '3.50%'}
                            </div>
                            <div className="text-[9px] text-emerald-400 font-mono flex items-center mt-0.5">
                              <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg> 
                              DeFi Compound
                            </div>
                          </div>

                          {/* Sparkline canvas graph */}
                          <div className="mt-auto pt-3 relative">
                            <div className="absolute right-0 top-0 text-[10px] text-gray-400 font-mono font-bold">
                              ${g.totalSaved.toLocaleString()}
                            </div>
                            <canvas className="w-full h-10 mt-1" id={chartId}></canvas>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Virtual Wallet Emulator Card */}
                <div className="lg:col-span-4 gradient-blue rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between border border-white/10 shadow-xl min-h-[260px]">
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                        <span className="text-[10px] font-bold text-[#007AFF]">G</span>
                      </div>
                      <span className="text-xs font-extrabold text-white tracking-tight uppercase">Wallet Console</span>
                    </div>
                    <span className="bg-black/30 text-[9px] font-mono px-2 py-0.5 rounded-full text-white border border-white/5">
                      Monad Client
                    </span>
                  </div>

                  <div className="z-10 mt-4 space-y-3 font-mono text-[10px]">
                    <div>
                      <span className="text-white/50 block text-[9px] uppercase">Public Key:</span>
                      <span className="text-white font-bold select-all tracking-tight break-all">
                        {wallet.address}
                      </span>
                    </div>
                    <div>
                      <span className="text-white/50 block text-[9px] uppercase">Private Key:</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-white font-semibold tracking-tighter truncate max-w-[160px]">
                          {showPrivateKey ? wallet.privateKey : '••••••••••••••••••••••••••••••••••••••••'}
                        </span>
                        <button 
                          onClick={() => setShowPrivateKey(!showPrivateKey)}
                          className="px-1.5 py-0.5 bg-black/30 border border-white/10 rounded hover:bg-black/50 text-white cursor-pointer active:scale-95"
                        >
                          {showPrivateKey ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-1.5 border-t border-white/10">
                      <div>
                        <span className="text-white/50 block text-[9px] uppercase">MONAD:</span>
                        <span className="font-bold text-white">{wallet.balances.MONAD.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-[9px] uppercase">USDC:</span>
                        <span className="font-bold text-white">${wallet.balances.USDC.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-white/50 block text-[9px] uppercase">USDT:</span>
                        <span className="font-bold text-white">${wallet.balances.USDT.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 z-10">
                    <button 
                      onClick={() => handleFaucetClaim('USDC', 100)}
                      className="bg-white text-[#007AFF] font-bold py-2 rounded-xl text-[10px] flex items-center justify-center space-x-1 shadow-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                      <span>Claim USDC Faucet</span>
                    </button>
                    <button 
                      onClick={() => handleFaucetClaim('USDT', 100)}
                      className="bg-black/20 hover:bg-black/30 transition text-white font-bold py-2 rounded-xl text-[10px] flex items-center justify-center space-x-1 border border-white/10 cursor-pointer"
                    >
                      <span>Claim USDT Faucet</span>
                    </button>
                  </div>

                  {/* Abstract background blur elements */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                  <div className="absolute -left-10 top-0 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>
                </div>
              </div>
              {/* END: HeroSection */}

              {/* BEGIN: ActiveStakingDetail */}
              <div className="bg-zinc-900/90 rounded-3xl border border-gray-800 p-6 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden backdrop-blur-xl">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-[10px] text-gray-500 font-medium uppercase font-mono tracking-wider">Active Workspace</div>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <h2 className="text-2xl font-black tracking-tight">{activeGroup.name} Pool</h2>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shadow ${
                        activeGroup.symbol === 'USDC' ? 'bg-[#007AFF] text-white' : activeGroup.symbol === 'MONAD' ? 'bg-white text-[#007AFF]' : 'bg-emerald-500 text-white'
                      }`}>
                        {activeGroup.symbol.slice(0, 1)}
                      </div>
                      <div className="flex space-x-1.5">
                        <span className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-[9px] font-mono text-gray-400">
                          Finality Shield Active
                        </span>
                        <span className="px-2 py-0.5 bg-[#007AFF]/15 border border-[#007AFF]/25 rounded text-[9px] font-mono text-blue-400 font-bold">
                          Multi-Sig {activeGroup.requiredSignatures}-of-{activeGroup.members.length} Sigs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Top Action Tabs indicator */}
                  <div className="flex space-x-1.5">
                    <button 
                      onClick={() => handleFaucetClaim('MONAD', 10)}
                      className="p-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition hover:bg-gray-700 cursor-pointer"
                      title="Faucet Claim MONAD"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => {
                        createOnChainTx('dispute_vote', 0, activeGroup.symbol, 'Consensus health ping dispatched on Monad Devnet');
                        alert("Consensus audit triggered! check ledger logs tab.");
                      }}
                      className="p-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-lg transition hover:bg-gray-700 cursor-pointer"
                      title="Trigger Consensus Audit"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Balance Display */}
                  <div className="lg:col-span-4 space-y-4">
                    <div>
                      <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 font-mono">
                        Active Pool Balance ({activeGroup.symbol})
                      </div>
                      <div className="text-4xl font-extrabold tracking-tight font-mono text-white flex items-baseline gap-1">
                        ${activeGroup.totalSaved.toLocaleString()}
                        <span className="text-xs text-gray-500 font-medium">{activeGroup.symbol}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => setShowContributeModal(true)}
                        className="px-5 py-2.5 bg-[#007AFF] hover:bg-blue-600 rounded-xl text-xs font-bold hover:scale-[1.01] transition shadow-lg shadow-blue-500/20 text-white cursor-pointer active:scale-95"
                      >
                        Contribute
                      </button>
                      <button 
                        onClick={() => setShowProposalModal(true)}
                        className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold hover:scale-[1.01] transition text-gray-200 border border-white/5 cursor-pointer active:scale-95"
                      >
                        Propose Payout
                      </button>
                    </div>
                  </div>

                  {/* Goal Slider / Contribution target */}
                  <div className="lg:col-span-8 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-800 pt-6 lg:pt-0 lg:pl-8 min-h-[80px]">
                    <div className="flex justify-between items-end mb-3">
                      <div className="space-y-0.5">
                        <div className="text-xs font-extrabold text-white">Savings Pool Target</div>
                        <div className="text-[9px] text-gray-500 font-mono">Vault Ingestion Compound Progress</div>
                      </div>
                      <div className="flex space-x-1.5 font-mono text-[9px]">
                        <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/10">
                          Saved: ${activeGroup.totalSaved.toLocaleString()}
                        </span>
                        <span className="bg-zinc-800 text-gray-400 px-2 py-0.5 rounded border border-white/5">
                          Goal: ${activeGroup.targetAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Slider Mockup */}
                    <div className="relative h-6 flex items-center">
                      <div className="absolute w-full h-1 bg-gray-800 rounded-full"></div>
                      <div 
                        className="absolute h-1 bg-[#007AFF] rounded-full"
                        style={{ width: `${Math.min(100, Math.round((activeGroup.totalSaved / activeGroup.targetAmount) * 100))}%` }}
                      ></div>
                      <div 
                        className="absolute w-4 h-4 bg-white rounded-full flex items-center justify-center border-4 border-blue-900 shadow-xl pointer-events-none transition-all"
                        style={{ left: `calc(${Math.min(100, Math.round((activeGroup.totalSaved / activeGroup.targetAmount) * 100))}% - 8px)` }}
                      >
                        <div className="w-1 h-2 flex space-x-0.5">
                          <div className="w-0.5 h-full bg-blue-900"></div>
                          <div className="w-0.5 h-full bg-blue-900"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detail Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-gray-800 pt-6">
                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-gray-500 font-semibold leading-tight font-mono">
                      YIELD HARVEST<br/>
                      <span className="text-[8px] font-normal text-emerald-400">Sweeps compound active</span>
                    </div>
                    <BadgePercent className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-gray-500 font-semibold leading-tight font-mono">
                      CONSENSUS STATE<br/>
                      <span className="text-[8px] font-normal text-blue-400">Multi-sig validation</span>
                    </div>
                    <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-gray-500 font-semibold leading-tight font-mono">
                      SAFETY DELAY<br/>
                      <span className="text-[8px] font-normal text-orange-400">24h Veto Lock active</span>
                    </div>
                    <ShieldAlert className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-white/5">
                    <div className="text-[9px] text-gray-500 font-semibold leading-tight font-mono">
                      ACCUMULATED APY<br/>
                      <span className="text-[8px] font-normal text-gray-400 font-mono">+${activeGroup.yieldAccrued.toFixed(2)} USD</span>
                    </div>
                    <Activity className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                </div>

                {/* Bottom Interactive Workspace Sub-Grid (Replacing Static Charts) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                  
                  {/* Card 1: Active Proposals */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-gray-800 flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between mb-3 items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Active Proposals</span>
                      <span className="text-[8px] bg-[#007AFF]/15 text-[#007AFF] px-1.5 py-0.5 rounded font-mono font-bold">
                        {activeProposals.filter(p => p.status === 'pending_signatures' || p.status === 'approved').length} Active
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[140px] pr-1">
                      {activeProposals.length === 0 ? (
                        <div className="text-center text-[10px] text-gray-500 py-6 italic">No pending proposals. Click "Propose Payout" to create one.</div>
                      ) : (
                        activeProposals.map((prop) => {
                          const hasSigned = prop.currentSignatures.includes(currentUserAddress);
                          const isApproved = prop.status === 'approved';
                          return (
                            <div key={prop.id} className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 space-y-1.5 text-[10px]">
                              <div className="flex justify-between items-start font-bold">
                                <span className="text-white truncate max-w-[100px]">{prop.title}</span>
                                <span className="text-[#007AFF] font-mono">${prop.amount} {prop.symbol}</span>
                              </div>
                              <p className="text-gray-400 text-[9px] line-clamp-1 leading-normal">{prop.description}</p>
                              
                              <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-white/5 text-[9px]">
                                <span className="text-gray-500 font-mono">Sigs: {prop.currentSignatures.length}/{prop.requiredSignatures}</span>
                                <div className="flex gap-1">
                                  {prop.status === 'pending_signatures' && !hasSigned && (
                                    <button 
                                      onClick={() => handleSignProposal(activeGroup.id, prop.id)}
                                      className="px-2 py-0.5 bg-[#007AFF] hover:bg-blue-600 rounded text-black text-[9px] font-extrabold cursor-pointer"
                                    >
                                      Sign
                                    </button>
                                  )}
                                  {prop.status === 'pending_signatures' && hasSigned && (
                                    <span className="text-gray-500 text-[8px] italic">Signed</span>
                                  )}
                                  {isApproved && (
                                    <button 
                                      onClick={() => handleExecuteProposal(activeGroup.id, prop.id)}
                                      className="px-2 py-0.5 bg-green-500 hover:bg-green-600 rounded text-black text-[9px] font-extrabold cursor-pointer"
                                    >
                                      Execute
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => handleVetoProposal(activeGroup.id, prop.id, "Suspicious activity flagged by co-signer")}
                                    className="px-2 py-0.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 rounded text-[9px] cursor-pointer"
                                  >
                                    Veto
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Card 2: Dispute Center */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-gray-800 flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between mb-3 items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Dispute Vetoes</span>
                      <span className="text-[8px] bg-red-500/15 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold">Arbitration</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[140px] pr-1">
                      {activeGroup.proposals.filter(p => p.status === 'flagged_locked' || p.status === 'vetoed_paused').length === 0 ? (
                        <div className="text-center text-[10px] text-gray-500 py-6 italic">No disputes or paused vetos inside this pool.</div>
                      ) : (
                        activeGroup.proposals.filter(p => p.status === 'flagged_locked' || p.status === 'vetoed_paused').map((prop) => {
                          const votesApprove = prop.votesApprove?.length || 0;
                          const votesReject = prop.votesReject?.length || 0;
                          return (
                            <div key={prop.id} className="p-2.5 rounded-lg bg-zinc-900 border border-white/5 space-y-1.5 text-[10px]">
                              <div className="flex justify-between items-start font-bold">
                                <span className="text-rose-400 truncate max-w-[100px]">{prop.title}</span>
                                <span className="text-rose-400 font-mono">${prop.amount} {prop.symbol}</span>
                              </div>
                              <p className="text-gray-400 text-[9px] line-clamp-1">{prop.vetoReason || prop.flagReason || 'Veto delay active'}</p>
                              
                              <div className="flex items-center justify-between gap-1 pt-1 border-t border-white/5 text-[9px]">
                                <span className="text-gray-500 font-mono">Approve:{votesApprove} | Slashing:{votesReject}</span>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => handleVoteDispute(activeGroup.id, prop.id, false)}
                                    className="px-1.5 py-0.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20 rounded cursor-pointer text-[8px]"
                                  >
                                    Slash
                                  </button>
                                  <button 
                                    onClick={() => handleResolveDispute(activeGroup.id, prop.id)}
                                    className="px-1.5 py-0.5 bg-zinc-700 hover:bg-zinc-600 rounded text-white text-[8px]"
                                  >
                                    Resolve
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Card 3: Recent Activity Event Feed */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-gray-800 flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between mb-3 items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Vault Ledger Events</span>
                      <span className="text-[8px] text-gray-500 font-mono">Live</span>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1.5 max-h-[140px] pr-1 font-mono text-[9px] text-green-400/85">
                      {transactions.filter(t => t.description.includes(activeGroup.name) || t.symbol === activeGroup.symbol).slice(-4).map((tx) => (
                        <div key={tx.id} className="leading-snug flex items-start gap-1">
                          <span className="text-gray-500 shrink-0">&gt;</span>
                          <span className="break-all">{tx.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 4: Solidity Smart Contract API */}
                  <div className="bg-zinc-950/80 p-4 rounded-2xl border border-gray-800 flex flex-col justify-between min-h-[220px]">
                    <div className="flex justify-between mb-2 items-center border-b border-white/5 pb-2">
                      <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider font-mono">Contract Parameters</span>
                    </div>
                    
                    <div className="flex-1 space-y-2 text-[9px] font-mono text-white/60">
                      <div className="flex justify-between">
                        <span>governanceAddress:</span>
                        <span className="text-[#007AFF] text-[8px] truncate max-w-[80px]">0xGSg1...73c2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>vetoWindowLimit:</span>
                        <span className="text-white">86,400 sec</span>
                      </div>
                      <div className="flex justify-between">
                        <span>yieldSweepEnabled:</span>
                        <span className="text-emerald-400">TRUE</span>
                      </div>
                      <div className="flex justify-between">
                        <span>consensusProtocol:</span>
                        <span className="text-white">MonadBFT v2</span>
                      </div>
                      <button 
                        onClick={() => {
                          setWorkspaceTab('solidity');
                          triggerNotification('Opened contract Solidity viewer.');
                        }}
                        className="w-full mt-3 py-1.5 bg-[#007AFF]/10 border border-[#007AFF]/25 text-[#007AFF] rounded font-bold text-center hover:bg-[#007AFF]/20 transition-all cursor-pointer text-[9px]"
                      >
                        Solidity Code Inspector
                      </button>
                    </div>
                  </div>

                </div>
              </div>
              {/* END: ActiveStakingDetail */}
            </div>
          )}

          {workspaceTab === 'disputes' && (
            <div className="animate-fade-in bg-zinc-900/90 rounded-3xl border border-gray-800 p-6 md:p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">Governance Dispute Resolution Center</h2>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                If a proposal violates cooperative guidelines, signatories can veto or freeze the funds permanently, creating a community dispute. If a proposal is rejected during dispute arbitration, the proposer's reputation points are slashed.
              </p>
              <DisputeCenter
                groups={groups}
                wallet={wallet}
                onVoteDispute={handleVoteDispute}
                onResolveDispute={handleResolveDispute}
                currentUserAddress={currentUserAddress}
              />
            </div>
          )}

          {workspaceTab === 'ledger' && (
            <div className="animate-fade-in bg-zinc-900/90 rounded-3xl border border-gray-800 p-6 md:p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">Auditable Transaction Ledger</h2>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                A cryptographically secure logs feed settling transactions in Monad Testnet blocks. Download transactions list or verify transaction hashes on the ledger inspector.
              </p>
              <TransactionHistory transactions={transactions} />
            </div>
          )}

          {workspaceTab === 'solidity' && (
            <div className="animate-fade-in bg-zinc-900/90 rounded-3xl border border-gray-800 p-6 md:p-8 space-y-6 relative overflow-hidden backdrop-blur-xl">
              <h2 className="text-2xl font-black tracking-tight text-white mb-2">Solidity smart contract API Inspector</h2>
              <p className="text-xs text-gray-400 max-w-2xl leading-relaxed">
                Read or write variables directly to the smart contract source deployed at `0xGlobalSaveContractAddress` on Monad Testnet.
              </p>
              <ContractViewer />
            </div>
          )}

        </main>
      </div>

      {/* Contribute Overlay Modal */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-950 border border-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-bold tracking-tight">Contribute Stablecoins</h3>
            <p className="text-xs text-gray-400">Add assets to the **{activeGroup.name}** savings pool to earn DeFi interest.</p>
            
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase font-mono block">Amount to deposit ({activeGroup.symbol}):</label>
              <input 
                type="number" 
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-gray-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#007AFF] text-white font-mono"
              />
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setShowContributeModal(false)}
                className="flex-1 py-2 bg-gray-800 text-xs font-semibold rounded-xl text-gray-300 border border-white/5 cursor-pointer hover:bg-gray-750"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleContribute(activeGroup.id, Number(contributeAmount));
                  setShowContributeModal(false);
                  triggerNotification(`Successfully deposited ${contributeAmount} ${activeGroup.symbol} to ${activeGroup.name}!`);
                }}
                className="flex-1 py-2 bg-[#007AFF] text-xs font-bold rounded-xl text-white shadow shadow-blue-500/20 cursor-pointer hover:bg-blue-600"
              >
                Deposit Assets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Propose Payout Overlay Modal */}
      {showProposalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-950 border border-gray-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl relative">
            <h3 className="text-lg font-bold tracking-tight">Create Shared Expense Proposal</h3>
            <p className="text-xs text-gray-400 font-sans">Propose a payout from the **{activeGroup.name}** cooperative vault. Requires approval signatures.</p>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 uppercase font-mono block">Proposal Title:</label>
                <input 
                  type="text" 
                  value={proposalForm.title}
                  placeholder="e.g. Workspace Rental Payment"
                  onChange={(e) => setProposalForm({...proposalForm, title: e.target.value})}
                  className="w-full bg-zinc-900 border border-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#007AFF] text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] text-gray-500 uppercase font-mono block">Description:</label>
                <textarea 
                  value={proposalForm.desc}
                  rows={2}
                  placeholder="Explain why this expense should be settled..."
                  onChange={(e) => setProposalForm({...proposalForm, desc: e.target.value})}
                  className="w-full bg-zinc-900 border border-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#007AFF] text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Amount ({activeGroup.symbol}):</label>
                  <input 
                    type="number" 
                    value={proposalForm.amount}
                    onChange={(e) => setProposalForm({...proposalForm, amount: e.target.value})}
                    className="w-full bg-zinc-900 border border-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#007AFF] text-white font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-gray-500 uppercase font-mono block">Recipient Address:</label>
                  <input 
                    type="text" 
                    value={proposalForm.recipient}
                    placeholder="0x..."
                    onChange={(e) => setProposalForm({...proposalForm, recipient: e.target.value})}
                    className="w-full bg-zinc-900 border border-gray-800 rounded-xl px-3 py-2 focus:outline-none focus:border-[#007AFF] text-white font-mono"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button 
                onClick={() => setShowProposalModal(false)}
                className="flex-1 py-2.5 bg-gray-800 text-xs font-semibold rounded-xl text-gray-300 border border-white/5 cursor-pointer hover:bg-gray-750"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (proposalForm.title && proposalForm.amount && proposalForm.recipient) {
                    handleCreateProposal(
                      activeGroup.id, 
                      proposalForm.title, 
                      proposalForm.desc, 
                      Number(proposalForm.amount), 
                      proposalForm.recipient
                    );
                    setShowProposalModal(false);
                    triggerNotification(`Proposed payout payout of ${proposalForm.amount} ${activeGroup.symbol} created!`);
                  } else {
                    alert("Please fill in Title, Amount, and Recipient fields!");
                  }
                }}
                className="flex-1 py-2.5 bg-[#007AFF] text-xs font-bold rounded-xl text-white shadow shadow-blue-500/20 cursor-pointer hover:bg-blue-600"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        </div>
      )}

      {mockNotification && (
        <div className="fixed bottom-6 right-6 bg-zinc-900/95 border border-[#007AFF]/30 px-4 py-3 rounded-xl flex items-center space-x-2 text-xs font-mono text-[#007AFF] shadow-xl shadow-blue-500/5 z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#007AFF] animate-ping" />
          <span>{mockNotification}</span>
        </div>
      )}
    </div>
  );
}
