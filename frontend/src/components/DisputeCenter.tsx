import { useState, useEffect } from 'react';
import { Gavel, Scale, Timer, Check, X, ShieldAlert, Users, ChevronRight, HelpCircle, AlertCircle, Play } from 'lucide-react';
import { SavingsGroup, Proposal, WalletState, GroupMember } from '../types';

interface DisputeCenterProps {
  groups: SavingsGroup[];
  wallet: WalletState;
  onVoteDispute: (groupId: string, proposalId: string, support: boolean) => void;
  onResolveDispute: (groupId: string, proposalId: string) => void;
  currentUserAddress: string;
}

export default function DisputeCenter({
  groups,
  wallet,
  onVoteDispute,
  onResolveDispute,
  currentUserAddress,
}: DisputeCenterProps) {
  // Collect all flagged/locked or rejected/disputed proposals across all groups
  const disputedProposals: { group: SavingsGroup; proposal: Proposal }[] = [];
  
  groups.forEach(group => {
    group.proposals.forEach(proposal => {
      if (proposal.status === 'flagged_locked' || proposal.status === 'rejected') {
        disputedProposals.push({ group, proposal });
      }
    });
  });

  const [simulatedVotesProgress, setSimulatedVotesProgress] = useState<Record<string, boolean>>({});

  const handleSimulateConsensus = (groupId: string, proposalId: string) => {
    // Simulate other co-op members voting automatically to speed up testing
    onVoteDispute(groupId, proposalId, false); // Cast some opposing votes
    setSimulatedVotesProgress(prev => ({ ...prev, [proposalId]: true }));
    alert('Simulated other co-op members submitting their cryptographic votes on the Monad ledger!');
  };

  return (
    <div id="dispute-center-card" className="bg-dark-800 border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative Warning Background */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg border border-rose-500/20">
            <Gavel className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white tracking-tight">On-Chain Dispute & Governance</h2>
            <p className="text-xs text-slate-400 font-mono">24h SafeLock Safety Mechanism</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-[10px] font-mono text-rose-400 font-medium">
          SHIELD SECURITY: ACTIVE
        </span>
      </div>

      <div className="mt-5 space-y-6">
        <div className="bg-dark-950/60 p-4 rounded-xl border border-white/5 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-gold-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            <strong className="text-white">Why are these funds locked?</strong> Traditional shared accounts have no protection against rogue organizers. GlobalSave implements an immutable 24-hour safety window on approved proposals. Any member can flag a suspicious payout, instantly freezing the relevant funds in the contract escrow and starting a community vote.
          </p>
        </div>

        {disputedProposals.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/5 rounded-xl">
            <Scale className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-xs font-sans font-semibold text-slate-400">All pools are calm and secure</h3>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1 font-sans">
              No active disputes exist across your savings groups. Any future flagged transactions will appear here for governance voting.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {disputedProposals.map(({ group, proposal }) => {
              const totalVoters = group.members.length;
              const approveVotesCount = proposal.votesApprove?.length || 0;
              const rejectVotesCount = proposal.votesReject?.length || 0;
              const totalCast = approveVotesCount + rejectVotesCount;
              const hasVoted = (proposal.votesApprove?.includes(currentUserAddress) || proposal.votesReject?.includes(currentUserAddress));
              const isActive = proposal.status === 'flagged_locked';

              return (
                <div key={proposal.id} id={`dispute-${proposal.id}`} className={`border rounded-xl p-5 transition-all duration-300 ${
                  isActive ? 'border-rose-500/30 bg-dark-950/30' : 'border-white/5 bg-dark-950/10 opacity-75'
                }`}>
                  
                  {/* Row 1: Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap mb-3.5">
                    <span className="text-[10px] font-mono text-gold-500 bg-dark-900 border border-white/5 px-2 py-0.5 rounded-md">
                      Group: {group.name}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-medium ${
                      isActive 
                        ? 'bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-pulse'
                        : 'bg-dark-700 border border-white/5 text-slate-400'
                    }`}>
                      {isActive ? 'ACTIVE DISPUTE: LOCKED ESCROW' : 'DISPUTE CONCLUDED'}
                    </span>
                  </div>

                  {/* Row 2: Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-4 border-b border-white/5">
                    <div className="md:col-span-8 space-y-2">
                      <div>
                        <h4 className="text-xs font-sans font-semibold text-white">Flagged Proposal: {proposal.title}</h4>
                        <p className="text-[11px] text-slate-400 font-sans leading-relaxed mt-0.5">{proposal.description}</p>
                      </div>

                      <div className="bg-rose-950/15 border border-rose-500/10 rounded-lg p-3">
                        <span className="text-[9px] font-mono text-rose-400 font-bold block mb-1">DISPUTE REASON BY FLAGGER ({proposal.flagger?.slice(0, 8)}...)</span>
                        <p className="text-xs font-sans italic text-slate-300">"{proposal.flagReason}"</p>
                      </div>
                    </div>

                    <div className="md:col-span-4 bg-dark-900/40 border border-white/5 rounded-xl p-3 flex flex-col justify-between text-right">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-500 block">LOCKED ESCROW</span>
                        <div className="flex items-baseline gap-0.5 justify-end">
                          <span className="text-lg font-mono font-bold text-white">{proposal.amount.toLocaleString()}</span>
                          <span className="text-xs font-mono text-slate-500">{proposal.symbol}</span>
                        </div>
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-1 justify-end text-rose-400 font-mono text-[10px] mt-2">
                          <Timer className="h-3.5 w-3.5 animate-spin" />
                          <span>~ 18 hours remaining</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Voting Metrics */}
                  <div className="py-4 space-y-4">
                    <div className="flex items-center justify-between text-xs font-sans font-semibold text-slate-300">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-slate-500" />
                        Governance Voting Participation
                      </span>
                      <span className="font-mono text-[10px]">{totalCast} of {totalVoters} Voted</span>
                    </div>

                    {/* Progress bars of voting */}
                    <div className="space-y-2.5">
                      {/* Yes / Approve Payout */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Approve & Release Funds</span>
                          <span>{approveVotesCount} Votes ({totalCast > 0 ? Math.round(approveVotesCount / totalCast * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${totalCast > 0 ? (approveVotesCount / totalCast * 100) : 0}%` }} 
                          />
                        </div>
                      </div>

                      {/* No / Deny and Refund */}
                      <div>
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                          <span>Deny & Refund Co-op Pool</span>
                          <span>{rejectVotesCount} Votes ({totalCast > 0 ? Math.round(rejectVotesCount / totalCast * 100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${totalCast > 0 ? (rejectVotesCount / totalCast * 100) : 0}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Call to Actions */}
                  {isActive ? (
                    <div className="flex items-center justify-between bg-dark-900/50 p-3 rounded-xl border border-white/5 flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        {hasVoted ? (
                          <span className="text-[10px] text-emerald-400 font-sans font-semibold flex items-center gap-1">
                            <Check className="h-4.5 w-4.5" /> Your cryptographic vote was committed!
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              id={`btn-vote-approve-${proposal.id}`}
                              onClick={() => onVoteDispute(group.id, proposal.id, true)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all shadow-md active:translate-y-px"
                            >
                              <Check className="h-3.5 w-3.5" /> Vote Release Payout
                            </button>
                            <button
                              id={`btn-vote-reject-${proposal.id}`}
                              onClick={() => onVoteDispute(group.id, proposal.id, false)}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all shadow-md active:translate-y-px"
                            >
                              <X className="h-3.5 w-3.5" /> Vote Deny & Refund
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-simulate-vote-${proposal.id}`}
                          onClick={() => handleSimulateConsensus(group.id, proposal.id)}
                          className="px-2.5 py-1.5 bg-gold-600/10 hover:bg-gold-600/20 text-gold-500 border border-gold-600/20 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all active:translate-y-px"
                          title="Fills pool voting slots to test trigger consensus"
                        >
                          Simulate Member Votes
                        </button>
                        <button
                          id={`btn-resolve-dispute-${proposal.id}`}
                          onClick={() => onResolveDispute(group.id, proposal.id)}
                          className="px-2.5 py-1.5 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-black rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all shadow-md active:translate-y-px"
                        >
                          <Gavel className="h-3.5 w-3.5" /> Resolve & Conclude
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-dark-900/30 p-3 rounded-xl border border-white/5 text-center">
                      <span className="text-[10px] font-mono text-slate-500">
                        Dispute finalized on-chain at block #{Math.floor(14205819 + Math.random() * 2000)}. Status: {proposal.status === 'approved' ? 'RELEASED' : 'DENIED & REFUNDED'}.
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
