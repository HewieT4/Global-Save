import { useState, useEffect, useRef } from 'react';
import { Wallet, Coins, Activity, Cpu, Layers, Copy, Check, Eye, EyeOff, Terminal, Sparkles, QrCode, X } from 'lucide-react';
import { WalletState, Transaction } from '../types';

interface WalletConsoleProps {
  wallet: WalletState;
  onFaucetClaim: (symbol: 'MONAD' | 'USDC' | 'USDT', amount: number) => void;
  transactions: Transaction[];
}

export default function WalletConsole({ wallet, onFaucetClaim, transactions }: WalletConsoleProps) {
  const [activeTab, setActiveTab] = useState<'wallet' | 'faucet' | 'node'>('wallet');
  const [showSecrets, setShowSecrets] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Auto-hide secrets after 30 seconds for security
  useEffect(() => {
    if (showSecrets) {
      const timer = setTimeout(() => {
        setShowSecrets(false);
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [showSecrets]);
  
  // Faucet state
  const [faucetToken, setFaucetToken] = useState<'MONAD' | 'USDC' | 'USDT'>('MONAD');
  const [faucetAmount, setFaucetAmount] = useState(10);
  const [faucetStatus, setFaucetStatus] = useState<'idle' | 'signing' | 'processing' | 'success'>('idle');
  const [faucetTxHash, setFaucetTxHash] = useState('');

  // Node stats
  const [blockNumber, setBlockNumber] = useState(14206012);
  const [tps, setTps] = useState(9840);
  const [totalTx, setTotalTx] = useState(145029318);
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[SYSTEM] Monad Consensus Engine initialized.',
    '[SYSTEM] Parallel execution pipelining enabled.',
    '[NODE-01] Connected to Monad Devnet. Latency: 4ms.',
    '[NODE-01] Port 3000 mapped successfully for client RPC.'
  ]);

  // Handle auto-incrementing blocks and logs
  useEffect(() => {
    const blockInterval = setInterval(() => {
      setBlockNumber(prev => prev + 1);
      setTotalTx(prev => prev + Math.floor(Math.random() * 80) + 10);
      setTps(Math.floor(9500 + Math.random() * 800));

      const logActions = [
        `[CONSENSUS] Proposed block #${blockNumber + 1} with 9,840 txs.`,
        `[VM] parallel_execute: verified signatures for block #${blockNumber + 1}`,
        `[VM] state_db: committed storage trie updates in 0.8ms`,
        `[MEMPOOL] Collected 124 new pending transactions from RPC.`,
        `[NODE-01] Peer 0x4a...e31 synced to height #${blockNumber + 1}`
      ];
      
      setTerminalLogs(prev => {
        const next = [...prev, logActions[Math.floor(Math.random() * logActions.length)]];
        if (next.length > 40) next.shift(); // Keep logs manageable
        return next;
      });
    }, 1200);

    return () => clearInterval(blockInterval);
  }, [blockNumber]);

  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTop = terminalContainerRef.current.scrollHeight;
    }
  }, [terminalLogs, faucetStatus]);

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFaucetRequest = () => {
    if (faucetStatus !== 'idle') return;
    
    setFaucetStatus('signing');
    setTerminalLogs(prev => [...prev, `[RPC] eth_sendRawTransaction: requesting ${faucetAmount} ${faucetToken} faucet mint`]);

    setTimeout(() => {
      setFaucetStatus('processing');
      setTerminalLogs(prev => [...prev, `[TXPOOL] Transaction received. Gas estimated: 21,000. Priority fee: 0.1 gwei`]);
      
      setTimeout(() => {
        onFaucetClaim(faucetToken, faucetAmount);
        const randomHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
        setFaucetTxHash(randomHash);
        setFaucetStatus('success');
        setTerminalLogs(prev => [...prev, `[VM] Block confirmed! tx=${randomHash.slice(0, 10)}... status=SUCCESS finality=0.92s`]);
        
        setTimeout(() => {
          setFaucetStatus('idle');
        }, 3000);
      }, 950);
    }, 600);
  };

  return (
    <div id="wallet-console-card" className="glass-card rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Header */}
      <div className="p-5 border-b border-white/5 flex items-center justify-between bg-dark-900">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-600/10 text-gold-500 rounded-lg border border-gold-600/20">
            <Wallet className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white tracking-tight">Monad Virtual Account</h2>
            <p className="text-xs text-slate-400 font-mono">Devnet Wallet & Ledger Simulator</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-mono text-emerald-400 font-medium">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          CONNECTED (10,000 TPS)
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-dark-900/50">
        <button
          id="btn-wallet-tab"
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-3 text-xs font-medium font-sans border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'wallet'
              ? 'border-gold-600 text-gold-500 bg-dark-800/30'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-dark-700/20'
          }`}
        >
          <Wallet className="h-3.5 w-3.5" />
          Wallet Keys
        </button>
        <button
          id="btn-faucet-tab"
          onClick={() => setActiveTab('faucet')}
          className={`flex-1 py-3 text-xs font-medium font-sans border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'faucet'
              ? 'border-gold-600 text-gold-500 bg-dark-800/30'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-dark-700/20'
          }`}
        >
          <Coins className="h-3.5 w-3.5" />
          Testnet Faucet
        </button>
        <button
          id="btn-node-tab"
          onClick={() => setActiveTab('node')}
          className={`flex-1 py-3 text-xs font-medium font-sans border-b-2 transition-all flex items-center justify-center gap-2 ${
            activeTab === 'node'
              ? 'border-gold-600 text-gold-500 bg-dark-800/30'
              : 'border-transparent text-slate-400 hover:text-white hover:bg-dark-700/20'
          }`}
        >
          <Cpu className="h-3.5 w-3.5" />
          Consensus Logs
        </button>
      </div>

      {/* Content */}
      <div className="p-5 h-[340px] overflow-y-auto">
        {activeTab === 'wallet' && (
          <div className="space-y-4">
            {/* Balances Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-dark-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">MONAD (Gas)</span>
                <span className="text-xl font-mono font-bold text-white mt-1">
                  {wallet.balances.MONAD.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-slate-500 mt-1">~ $1.00 each</span>
              </div>
              <div className="p-3 bg-dark-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">USDC</span>
                <span className="text-xl font-mono font-bold text-gold-500 mt-1">
                  {wallet.balances.USDC.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-slate-500 mt-1">Pegged $1.00</span>
              </div>
              <div className="p-3 bg-dark-950/60 rounded-xl border border-white/5 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">USDT</span>
                <span className="text-xl font-mono font-bold text-emerald-400 mt-1">
                  {wallet.balances.USDT.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[9px] text-slate-500 mt-1">Pegged $1.00</span>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider">Public Address</label>
                <button
                  id="btn-show-qrcode"
                  onClick={() => setShowQrCode(true)}
                  className="flex items-center gap-1 text-[10px] font-sans font-medium text-gold-500 hover:text-gold-400 transition-colors cursor-pointer"
                >
                  <QrCode className="h-3.5 w-3.5" /> Show QR Code
                </button>
              </div>
              <div className="flex items-center gap-2 bg-dark-950/80 px-3 py-2.5 rounded-xl border border-white/5">
                <span className="font-mono text-xs text-white overflow-hidden text-ellipsis select-all w-full">{wallet.address}</span>
                <button
                  id="btn-copy-address"
                  onClick={() => copyToClipboard(wallet.address, setCopiedAddress)}
                  className="p-1 hover:bg-dark-700 text-slate-400 hover:text-white rounded transition-colors shrink-0"
                  title="Copy public address"
                >
                  {copiedAddress ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Keys */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <label className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-wider shrink-0">Private Credentials</label>
                  <span className="px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-mono rounded font-semibold uppercase tracking-wider truncate">
                    Demo Sandbox
                  </span>
                </div>
                <button
                  id="btn-toggle-secrets"
                  onClick={() => setShowSecrets(!showSecrets)}
                  className="flex items-center gap-1 text-[10px] font-sans font-medium text-gold-500 hover:text-gold-400 shrink-0"
                >
                  {showSecrets ? (
                    <>
                      <EyeOff className="h-3 w-3" /> Hide Keys
                    </>
                  ) : (
                    <>
                      <Eye className="h-3 w-3" /> Reveal Keys
                    </>
                  )}
                </button>
              </div>

              <div className="bg-dark-950/80 p-3 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <div className="min-w-0">
                    <span className="text-[9px] text-slate-500 font-mono block">SEED PHRASE</span>
                    <span className="font-mono text-xs text-slate-300 block overflow-hidden text-ellipsis select-all">
                      {showSecrets ? wallet.seedPhrase : '•••• •••• •••• •••• •••• •••• •••• •••• •••• •••• •••• ••••'}
                    </span>
                  </div>
                  {showSecrets && (
                    <button
                      id="btn-copy-seed"
                      onClick={() => copyToClipboard(wallet.seedPhrase, setCopiedKey)}
                      className="p-1 hover:bg-dark-700 text-slate-400 hover:text-white rounded transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-mono block">PRIVATE KEY</span>
                  <span className="font-mono text-[11px] text-slate-400 block overflow-hidden text-ellipsis select-all">
                    {showSecrets ? wallet.privateKey : '0x••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faucet' && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Need gas or stablecoins to participate in micro-savings? Request free testnet currencies to be minted on the Monad ledger instantly.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-dark-950/40 p-3 rounded-xl border border-white/5">
              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">ASSET TO MINT</label>
                <select
                  id="select-faucet-token"
                  value={faucetToken}
                  onChange={(e) => {
                    const val = e.target.value as 'MONAD' | 'USDC' | 'USDT';
                    setFaucetToken(val);
                    setFaucetAmount(val === 'MONAD' ? 10 : 250);
                  }}
                  className="w-full bg-dark-900 border border-white/5 rounded-lg text-xs font-mono text-white px-2 py-1.5 focus:outline-none focus:border-gold-600"
                >
                  <option value="MONAD">MONAD (Gas)</option>
                  <option value="USDC">USDC (Stable)</option>
                  <option value="USDT">USDT (Stable)</option>
                </select>
              </div>

              <div>
                <label className="text-[9px] font-mono text-slate-400 block mb-1">MINT QUANTITY</label>
                <div className="flex items-center justify-between h-9 bg-dark-900 border border-white/5 px-3 rounded-lg text-xs font-mono text-white">
                  <span>{faucetAmount}</span>
                  <span className="text-[10px] text-slate-500">{faucetToken}</span>
                </div>
              </div>
            </div>

            {faucetStatus === 'idle' && (
              <button
                id="btn-claim-faucet"
                onClick={handleFaucetRequest}
                className="w-full py-3 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 active:translate-y-px text-black font-sans text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Claim {faucetAmount} {faucetToken}
              </button>
            )}

            {faucetStatus !== 'idle' && (
              <div className="bg-dark-950/80 p-3 rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2.5">
                  <Activity className="h-4 w-4 text-gold-500 animate-spin" />
                  <span className="text-xs font-sans font-medium text-white">
                    {faucetStatus === 'signing' && 'Awaiting cryptographic signature...'}
                    {faucetStatus === 'processing' && 'Processing parallelized EVM execution...'}
                    {faucetStatus === 'success' && 'Minted successfully on Monad!'}
                  </span>
                </div>

                <div className="w-full bg-dark-900 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gold-600 transition-all duration-1000 ${
                      faucetStatus === 'signing' ? 'w-1/3' : 
                      faucetStatus === 'processing' ? 'w-2/3' : 'w-full bg-emerald-500'
                    }`}
                  />
                </div>

                {faucetStatus === 'success' && faucetTxHash && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-mono block">TRANSACTION HASH</span>
                    <span className="font-mono text-[10px] text-emerald-400 break-all select-all block">{faucetTxHash}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'node' && (
          <div className="flex flex-col h-full">
            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-2 mb-3 bg-dark-950/60 p-2.5 rounded-xl border border-white/5">
              <div className="text-center py-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">CURRENT BLOCK</span>
                <span className="font-mono text-sm font-bold text-gold-500 block mt-0.5">#{blockNumber}</span>
              </div>
              <div className="text-center py-1 border-l border-white/5">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-semibold block">CONSENSUS APY / TPS</span>
                <span className="font-mono text-sm font-bold text-emerald-400 block mt-0.5">{tps.toLocaleString()} TPS</span>
              </div>
            </div>

            {/* Terminal */}
            <div 
              ref={terminalContainerRef}
              className="flex-1 bg-black rounded-xl p-3 border border-white/5 overflow-y-auto font-mono text-[10px] text-slate-300 leading-normal space-y-1 max-h-[160px] scrollbar-thin scrollbar-thumb-slate-800"
            >
              {terminalLogs.map((log, idx) => {
                let color = 'text-slate-400';
                if (log.includes('[SYSTEM]')) color = 'text-gold-500';
                else if (log.includes('[CONSENSUS]')) color = 'text-amber-500';
                else if (log.includes('[VM]')) color = 'text-purple-400';
                else if (log.includes('SUCCESS') || log.includes('confirmed')) color = 'text-emerald-400';
                else if (log.includes('[RPC]')) color = 'text-yellow-400';

                return (
                  <div key={idx} className={`${color} flex gap-1.5`}>
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* QR Code Modal Overlay */}
      {showQrCode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-sm">
          <div className="bg-dark-950 border border-white/5 rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-4 bg-dark-900 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="h-4.5 w-4.5 text-gold-500" />
                <span className="text-xs font-mono font-semibold text-white">Wallet QR Code</span>
              </div>
              <button
                id="btn-close-qr-modal"
                onClick={() => setShowQrCode(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-dark-800 rounded-lg transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-white p-3 rounded-2xl border-4 border-gold-600/25 shadow-inner">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(wallet.address)}`} 
                  alt="Wallet Address QR Code" 
                  className="w-40 h-40 object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1.5 w-full">
                <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider">YOUR PUBLIC ADDRESS</span>
                <div className="bg-dark-900/60 border border-white/5 p-2.5 rounded-xl flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-slate-300 select-all truncate block text-left w-full">
                    {wallet.address}
                  </span>
                  <button
                    id="btn-copy-address-qr"
                    onClick={() => {
                      copyToClipboard(wallet.address, setCopiedAddress);
                    }}
                    className="p-1 hover:bg-dark-700 text-slate-400 hover:text-white rounded transition-colors shrink-0"
                    title="Copy public address"
                  >
                    {copiedAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs font-sans">
                Scan this QR code with any EVM-compatible mobile wallet to copy your address or send testnet funds.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-dark-900 border-t border-white/5 flex justify-end">
              <button
                id="btn-close-qr-modal-bottom"
                onClick={() => setShowQrCode(false)}
                className="px-4 py-2 bg-gradient-to-br from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-black rounded-xl font-sans text-xs font-semibold transition-colors shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
