import { useState } from 'react';
import { Terminal, Copy, Check, Code, Shield, Cpu, Zap, Info } from 'lucide-react';
import { GLOBAL_SAVE_CONTRACT } from '../data/contractCode';

export default function ContractViewer() {
  const [copied, setCopied] = useState(false);
  const [activeExplain, setActiveExplain] = useState<'overall' | 'multisig' | 'dispute' | 'yield'>('overall');

  const copyCode = () => {
    navigator.clipboard.writeText(GLOBAL_SAVE_CONTRACT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExplanation = () => {
    switch (activeExplain) {
      case 'multisig':
        return {
          title: "Multi-Signature Vault Logic",
          text: "When a payout proposal is created, it is stored in pending signatures state. Designated members must invoke `signProposal()`. Once `signatureCount >= requiredSignatures`, the state advances to `Approved`. This guarantees that no individual can transfer pooled assets single-handedly.",
          gasEstimate: "~ 48,000 gas",
          monadAdvantage: "Monad's parallel VM executes signatures concurrently, reducing execution latency to sub-second finality while avoiding gas fee spikes."
        };
      case 'dispute':
        return {
          title: "Dispute Flag & 24h Veto Safekeeping",
          text: "Even if a proposal achieves the required signatures, it enters an escrow lock. Any member can call `flagProposal()` to escalate to community voting, or invoke `vetoPayout()` to immediately enforce an individual 24-hour pause on suspicious transactions. This provides multiple defense layers against multi-sig rogue behavior.",
          gasEstimate: "~ 36,000 gas",
          monadAdvantage: "1-second block times allow members to freeze fraudulent payouts instantly without waiting for congested blocks, protecting cooperative savings immediately."
        };
      case 'yield':
        return {
          title: "Transparent DeFi Yield wrapper",
          text: "The smart contract integrates with lending markets on Monad via a wrapper. When capital is contributed, a portion is deposited to Aave or Compound to generate yield. When payouts are executed, funds are automatically pulled from the vault wrapper.",
          gasEstimate: "~ 110,000 gas",
          monadAdvantage: "Lending wraps require multi-step state mutations. Monad's parallel database (MonadDb) resolves these nested storage lookups in microseconds."
        };
      default:
        return {
          title: "Monad Architecture Overview",
          text: "The GlobalSave Smart Contract is written in native Solidity and fully EVM compatible. It automates contribution tracking, multi-signature approvals, and 24h dispute locks entirely on-chain without any reliance on centralized servers.",
          gasEstimate: "~ 0.0001 MONAD per tx",
          monadAdvantage: "Provides 10,000 TPS, parallelized contract runs, and ultra-cheap transaction costs, bringing web2-grade performance to web3 finance."
        };
    }
  };

  const explanation = getExplanation();

  return (
    <div id="contract-viewer-card" className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
      
      {/* Code Viewer Panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-white/5">
        <div className="p-4 bg-dark-950 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <Code className="h-4.5 w-4.5 text-gold-500" />
            <span className="text-xs font-mono font-semibold text-white">GlobalSave.sol (Solidity Smart Contract)</span>
          </div>
          <button
            id="btn-copy-contract"
            onClick={copyCode}
            className="px-2.5 py-1 bg-dark-900 hover:bg-dark-700 border border-white/5 rounded-lg text-[10px] font-mono text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        {/* Code Content Box */}
        <div className="flex-1 bg-dark-950/80 p-4 font-mono text-[10px] text-slate-300 leading-normal overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-white/5">
          <pre className="whitespace-pre-wrap select-all">
            {GLOBAL_SAVE_CONTRACT}
          </pre>
        </div>
      </div>

      {/* Contract Explanation Panel (5 cols) */}
      <div className="lg:col-span-5 p-5 flex flex-col justify-between space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Terminal className="h-4.5 w-4.5 text-gold-500" />
            <h3 className="font-sans font-semibold text-white text-sm tracking-tight">EVM Smart Contract Trace</h3>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Select a contract sub-system below to explore how its state transitions operate on the high-performance Monad blockchain:
          </p>

          {/* Subsystem Select Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-explain-overall"
              onClick={() => setActiveExplain('overall')}
              className={`px-2.5 py-2 rounded-xl text-[10px] font-sans font-semibold text-left border transition-all ${
                activeExplain === 'overall'
                  ? 'bg-gold-600/10 border-gold-600/30 text-gold-500'
                  : 'bg-dark-950/40 border-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10'
              }`}
            >
              <span className="block text-white">Overview</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">GlobalSave.sol</span>
            </button>
            <button
              id="btn-explain-multisig"
              onClick={() => setActiveExplain('multisig')}
              className={`px-2.5 py-2 rounded-xl text-[10px] font-sans font-semibold text-left border transition-all ${
                activeExplain === 'multisig'
                  ? 'bg-gold-600/10 border-gold-600/30 text-gold-500'
                  : 'bg-dark-950/40 border-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10'
              }`}
            >
              <span className="block text-white">Multi-Sig Vault</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">signProposal()</span>
            </button>
            <button
              id="btn-explain-dispute"
              onClick={() => setActiveExplain('dispute')}
              className={`px-2.5 py-2 rounded-xl text-[10px] font-sans font-semibold text-left border transition-all ${
                activeExplain === 'dispute'
                  ? 'bg-gold-600/10 border-gold-600/30 text-gold-500'
                  : 'bg-dark-950/40 border-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10'
              }`}
            >
              <span className="block text-white">Safety dispute</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">flagProposal()</span>
            </button>
            <button
              id="btn-explain-yield"
              onClick={() => setActiveExplain('yield')}
              className={`px-2.5 py-2 rounded-xl text-[10px] font-sans font-semibold text-left border transition-all ${
                activeExplain === 'yield'
                  ? 'bg-gold-600/10 border-gold-600/30 text-gold-500'
                  : 'bg-dark-950/40 border-white/5 text-slate-400 hover:text-slate-300 hover:border-white/10'
              }`}
            >
              <span className="block text-white">DeFi Wrapper</span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">toggleYield()</span>
            </button>
          </div>

          {/* Explanation Panel */}
          <div className="bg-dark-950/80 rounded-xl p-4 border border-white/5 space-y-3">
            <h4 className="text-xs font-sans font-semibold text-white">{explanation.title}</h4>
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{explanation.text}</p>
            
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
              <div className="bg-dark-900 p-2 rounded border border-white/5">
                <span className="text-slate-500 block">GAS CONSUMED</span>
                <span className="font-bold text-white mt-0.5 block">{explanation.gasEstimate}</span>
              </div>
              <div className="bg-dark-900 p-2 rounded border border-white/5">
                <span className="text-slate-500 block">MONAD SPEED</span>
                <span className="font-bold text-emerald-400 mt-0.5 block">Sub-Second block</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footnote Advantage */}
        <div className="bg-gold-600/5 border border-gold-600/10 rounded-xl p-3 flex items-start gap-2.5">
          <Zap className="h-4 w-4 text-gold-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-sans font-semibold text-gold-500 block">The Monad Advantage</span>
            <p className="text-[10px] text-slate-400 font-sans leading-normal mt-0.5">
              {explanation.monadAdvantage}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
