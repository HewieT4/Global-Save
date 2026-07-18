export interface WalletState {
  address: string;
  privateKey: string;
  seedPhrase: string;
  balances: {
    MONAD: number;
    USDC: number;
    USDT: number;
  };
}

export type TransactionType =
  | 'faucet'
  | 'create_group'
  | 'contribute'
  | 'proposal_create'
  | 'proposal_approve'
  | 'flag_lock'
  | 'dispute_vote'
  | 'yield_toggle';

export interface Transaction {
  id: string;
  hash: string;
  type: TransactionType;
  status: 'pending' | 'confirmed';
  timestamp: string;
  sender: string;
  amount: number;
  symbol: 'MONAD' | 'USDC' | 'USDT';
  description: string;
  blockNumber: number;
  gasUsed: number;
}

export interface GroupMember {
  address: string;
  name: string;
  avatarUrl: string;
  reputationScore: number;
  joinedAt: string;
  totalContributed: number;
  isCurrentUser?: boolean;
}

export type ProposalStatus =
  | 'pending_signatures'
  | 'approved'
  | 'flagged_locked'
  | 'executed'
  | 'rejected'
  | 'vetoed_paused';

export interface Proposal {
  id: string;
  groupId: string;
  title: string;
  description: string;
  amount: number;
  symbol: 'USDC' | 'USDT';
  recipient: string;
  creator: string;
  requiredSignatures: number;
  currentSignatures: string[]; // List of addresses who signed
  status: ProposalStatus;
  createdAt: string;
  disputeDeadline?: string; // 24 hours after lock
  votesApprove?: string[]; // list of addresses
  votesReject?: string[]; // list of addresses
  flagReason?: string;
  flagger?: string;
  vetoExpiry?: string;
  vetoers?: string[];
  vetoReason?: string;
  propType?: number; // 0 = Payout, 1 = AddMember, 2 = RemoveMember, 3 = ToggleYield
}

export interface SavingsGroup {
  id: string;
  name: string;
  description: string;
  category: 'Nomads' | 'Friends' | 'Family' | 'DeFi Savings';
  targetAmount: number;
  symbol: 'USDC' | 'USDT';
  members: GroupMember[];
  proposals: Proposal[];
  yieldEnabled: boolean;
  yieldProtocol: 'Aave Monad V1' | 'Compound v3' | 'Monad Earn';
  yieldAccrued: number;
  totalSaved: number;
  createdAt: string;
  deadline: string;
  requiredSignatures: number;
  contractAddress?: string;
}
