# GlobalSave 🪙

**GlobalSave** is a decentralized micro-savings and cooperative shared governance platform engineered for high-performance networks like **Monad**. It enables friends, digital nomads, and co-ops to pool capital, automate yield generation, and spend funds transparently via secure multi-signature approvals, reinforced by decentralized veto and dispute protection layers.

---

## ⚡ The 3-Minute Overview

### 1. What is GlobalSave?
Traditional savings groups (like RoSCAs or traditional co-ops) suffer from high trust overhead, slow settlement, and manual reconciliation. **GlobalSave** solves this by moving savings groups onto the blockchain using **Monad's 1-second block times and sub-penny gas fees**.
*   **Pooled Savings**: Members contribute tokens (USDC, MON, ETH) to shared, interest-earning cooperative vaults.
*   **Yield Generation**: Capital is deposited into DeFi yield protocols, with interest compounding instantly on-chain.
*   **Shared Governance**: Funds cannot be spent arbitrarily. All payouts must be requested via proposals and co-signed by members according to a cryptographic multi-sig threshold.

---

### 2. Multi-Layer Security Architecture
To prevent rogue multi-sig co-signers or sudden exploits, GlobalSave implements a **three-tier security defense**:

```
[ Payout Proposed ] 
       │
       ▼
[ Multi-Sig Co-Signing ] ──► Threshold Reached
       │
       ▼ (24-Hour Safety Lock Escrow)
  ┌────┴────────────────────────┐
  ▼                             ▼
[ 24h Individual Veto ]       [ Dispute Escalation ]
  │                             │
  ▼                             ▼
Adds 24 Hours to Pause        Triggers Decentralized Vote
  │                             │
  └───────────────┬─────────────┘
                  ▼
[ Executed Payout / Rejected & Reputation Penalized ]
```

1. **Multi-Signature Consent**: A proposal must accumulate co-signatures equal to or greater than the pool's designated threshold (e.g., 3-of-5 signatures) before moving to the pending state.
2. **24-Hour Individual Veto**: Any single member who spots suspicious activity (e.g., an incorrect payout address, unauthorized amounts) can invoke `vetoPayout()`. This instantly pauses execution and freezes the payout for an additional 24 hours, giving the group ample time to coordinate.
3. **Dispute Escalation (Flag & Freeze)**: If the group is in active disagreement, any co-signer can call `flagProposal()`. This permanently freezes the funds and escalates the transaction to a community-wide governance vote. If the vote rejects the proposal, the proposer suffers a **Reputation Score penalty**.

---

### 3. Key On-Chain Capabilities
*   **Virtual Monad Wallet**: Connect virtual EVM keys or claim faucet tokens instantly to test deposits, signing, and voting.
*   **Live Yield Accrual**: Watch savings grow in real-time as the DeFi yield simulator displays micro-interest compounding every second.
*   **Cooperative Trends Visualizer**: An interactive, beautifully rendered trend chart mapping individual cumulative contributions over time using dynamic Recharts lines.
*   **PDF Audit Reports**: Instant download of cryptographic ledger audit summaries, listing co-signer leaderboards and proposal history logs in a print-ready PDF format.

---

## 📄 Smart Contract Core Functions (`GlobalSave.sol`)

The system is powered by the fully-tested `GlobalSave` Solidity smart contract:

*   `contribute(uint256 _amount)`: Deposit tokens into the pooled vault and update contribution logs.
*   `createProposal(string title, string desc, uint256 amount, address recipient)`: Initiate an expense payout request.
*   `signProposal(uint256 _proposalId)`: Co-signers approve the proposal to build multi-sig consensus.
*   `vetoPayout(uint256 _proposalId, string _reason)`: Temporarily pause/freeze transaction execution for 24 hours.
*   `flagProposal(uint256 _proposalId, string _reason)`: Permanently freeze a suspicious proposal and redirect to dispute resolution.
*   `voteDispute(uint256 _proposalId, bool _support)`: Members vote on a flagged dispute.
*   `resolveDispute(uint256 _proposalId)`: Tallies votes after the dispute deadline, lifting the lock or rejecting the transaction and lowering the proposer's reputation.
*   `executeProposal(uint256 _proposalId)`: Transfer approved, unfrozen funds directly to the recipient wallet.

---

## 🛠️ Tech Stack & Deployment
*   **Frontend**: React (Vite, TypeScript, Tailwind CSS)
*   **Animations**: Framer Motion
*   **Charts**: Recharts (Dynamic Responsive SVG charts)
*   **Report Exporting**: jsPDF
*   **Smart Contracts**: Solidity v0.8.20 (compilation verified, optimized for the Monad EVM environment)
