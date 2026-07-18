import { useState } from 'react';
import { Landmark, ArrowUpRight, Coins, RefreshCw, Layers, CheckCircle2, Search, ExternalLink, X, Terminal, Cpu, Download } from 'lucide-react';
import { Transaction } from '../types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const getTxTypeStyle = (type: string) => {
    switch (type) {
      case 'faucet':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'contribute':
        return 'text-gold-500 bg-gold-600/10 border-gold-600/20';
      case 'proposal_create':
        return 'text-gold-500 bg-gold-600/10 border-gold-600/20';
      case 'flag_lock':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'dispute_vote':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'yield_toggle':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getTxIcon = (type: string) => {
    switch (type) {
      case 'faucet':
        return <Coins className="h-4 w-4" />;
      case 'contribute':
        return <ArrowUpRight className="h-4 w-4" />;
      case 'proposal_create':
        return <Landmark className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const filteredTxs = transactions.filter(tx => {
    if (filterType === 'all') return true;
    return tx.type === filterType;
  });

  const downloadCSV = () => {
    const escapeCSV = (str: string | number) => {
      const escaped = str.toString().replace(/"/g, '""');
      return `"${escaped}"`;
    };

    const headers = ['ID', 'Hash', 'Type', 'Status', 'Timestamp', 'Sender', 'Amount', 'Symbol', 'Description', 'Block Number', 'Gas Used'];
    const rows = transactions.map(tx => [
      escapeCSV(tx.id),
      escapeCSV(tx.hash),
      escapeCSV(tx.type),
      escapeCSV(tx.status),
      escapeCSV(tx.timestamp),
      escapeCSV(tx.sender),
      tx.amount,
      escapeCSV(tx.symbol),
      escapeCSV(tx.description),
      tx.blockNumber,
      tx.gasUsed
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `monad_ledger_activity_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transaction-history-card" className="bg-dark-800 border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      
      {/* Header */}
      <div className="p-5 border-b border-white/5 bg-dark-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-white tracking-tight">On-Chain Transaction History</h2>
          <p className="text-xs text-slate-400 font-mono">Immutable Ledger Records</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Download CSV Button */}
          <button
            id="btn-download-csv"
            onClick={downloadCSV}
            className="px-3 py-1.5 bg-dark-900 hover:bg-dark-700 text-gold-500 hover:text-gold-400 border border-white/5 hover:border-white/10 rounded-xl text-[10px] font-mono font-semibold flex items-center gap-1.5 transition-all shadow-md active:translate-y-px cursor-pointer"
            title="Download activity logs as CSV"
          >
            <Download className="h-3.5 w-3.5" />
            Download CSV
          </button>

          {/* Filter Tab selection */}
          <div className="flex gap-1 bg-dark-900 p-1 rounded-xl border border-white/5">
          <button
            id="filter-all"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-[10px] font-sans font-medium rounded-lg transition-all ${
              filterType === 'all' ? 'bg-gold-600 text-black shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Ledger
          </button>
          <button
            id="filter-faucet"
            onClick={() => setFilterType('faucet')}
            className={`px-3 py-1 text-[10px] font-sans font-medium rounded-lg transition-all ${
              filterType === 'faucet' ? 'bg-gold-600 text-black shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Faucets
          </button>
          <button
            id="filter-contribute"
            onClick={() => setFilterType('contribute')}
            className={`px-3 py-1 text-[10px] font-sans font-medium rounded-lg transition-all ${
              filterType === 'contribute' ? 'bg-gold-600 text-black shadow-md font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Deposits
          </button>
        </div>
      </div>
    </div>

      {/* Transaction List */}
      <div className="p-5 overflow-y-auto h-[320px] scrollbar-thin scrollbar-thumb-white/5">
        <div className="space-y-3">
          {filteredTxs.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/5 rounded-xl">
              <span className="text-slate-500 text-xs font-sans">No matching transactions found on-chain.</span>
            </div>
          ) : (
            filteredTxs.slice().reverse().map((tx) => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedTx(tx)}
                className="bg-dark-950/40 border border-white/5 hover:border-white/10 hover:bg-dark-950/80 p-3.5 rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg border shrink-0 ${getTxTypeStyle(tx.type)}`}>
                    {getTxIcon(tx.type)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-sans font-semibold text-white block group-hover:text-gold-500 transition-colors">
                      {tx.description}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 block">
                      Block #{tx.blockNumber} • Hash: {tx.hash.slice(0, 14)}...
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-baseline gap-0.5 justify-end">
                    <span className="text-sm font-mono font-bold text-white">
                      {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : '0'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{tx.symbol}</span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block mt-0.5">{tx.timestamp}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MonadScan Explorer Modal Overlay */}
      {selectedTx && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-dark-950 border border-white/5 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-4 bg-dark-900 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-4.5 w-4.5 text-gold-500" />
                <span className="text-xs font-mono font-semibold text-white">MonadScan Explorer Block #{selectedTx.blockNumber}</span>
              </div>
              <button
                id="btn-close-modal"
                onClick={() => setSelectedTx(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 font-mono text-xs">
              
              {/* Receipt Badging */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400">Transaction Status</span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> SUCCESS
                </span>
              </div>

              {/* Hash detail */}
              <div className="space-y-1">
                <span className="text-slate-500 text-[10px] block">TRANSACTION HASH</span>
                <span className="text-white select-all break-all block">{selectedTx.hash}</span>
              </div>

              {/* Flow grid */}
              <div className="grid grid-cols-2 gap-4 bg-dark-900/40 p-3.5 rounded-xl border border-white/5">
                <div>
                  <span className="text-slate-500 text-[10px] block">METHOD TYPE</span>
                  <span className="text-gold-500 font-semibold block capitalize mt-0.5">{selectedTx.type.replace('_', ' ')}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">PAYLOAD VALUE</span>
                  <span className="text-white font-semibold block mt-0.5">{selectedTx.amount} {selectedTx.symbol}</span>
                </div>
              </div>

              {/* Trace details */}
              <div className="space-y-2 border-t border-white/5 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">From / Origin</span>
                  <span className="text-slate-300 break-all">{selectedTx.sender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Gas Gas Used</span>
                  <span className="text-slate-300">{selectedTx.gasUsed.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">EVM Consensus Speed</span>
                  <span className="text-emerald-400 font-bold">Sub-Second Finality (0.91s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Consensus Engine</span>
                  <span className="text-gold-500">Monad parallelized EVM</span>
                </div>
              </div>

              {/* Developer Logs Console */}
              <div className="bg-black border border-white/5 p-3 rounded-lg space-y-1.5 text-[9px] text-gold-500">
                <div className="flex gap-1 text-slate-500 select-none">&gt; [VM] storage_loaded: key=STATE_ROOT_HASH</div>
                <div className="flex gap-1 text-emerald-400 select-none">&gt; [VM] state_mutated: balance updated {selectedTx.amount} {selectedTx.symbol}</div>
                <div className="flex gap-1 text-slate-500 select-none">&gt; [VM] tx_receipt_hash: committed successfully</div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-dark-900 border-t border-white/5 flex justify-end">
              <button
                id="btn-close-modal-bottom"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-black rounded-xl font-sans text-xs font-semibold transition-colors shadow-md animate-pulse"
              >
                Close Explorer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
