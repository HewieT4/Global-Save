# Project Overview — GlobalSave

## Overview

**GlobalSave** is a decentralized application (dApp) built on the Monad blockchain designed to facilitate secure, transparent, and low-cost collaborative finance for global groups (e.g., rotating savings associations, digital nomad squads, co-ops, and international families). It addresses the friction of high cross-border transaction fees, lack of transparency in group vaults, and erosion of savings value due to low-yield traditional accounts.

## Goals

1. **Transaction Cost Minimization:** Enable friction-free micro-contributions and payouts globally by leveraging Monad's sub-penny gas costs.
2. **Cooperative Trust & Security:** Guarantee that group funds cannot be misappropriated by single members, using multi-signature approvals, 24h individual veto locks, and decentralized dispute voting.
3. **Savings Preservation & Growth:** Protect pooled capital against inflation by integrating DeFi yield protocols to earn real-time compounding interest.
4. **Administrative Efficiency:** Automate contribution logs, payout logic, dispute timelines, and audit trails directly via on-chain smart contracts.

## Core User Flow

1. **Wallet Integration:** A user connects their EVM wallet (or logs in with a virtual test key).
2. **Pool Discovery / Creation:** Users create a new savings vault with target rules (stablecoin type, signatures threshold $N$-of-$M$, yield enabled) or join an existing pool.
3. **Cooperative Contribution:** Members deposit stablecoins (USDC/USDT) or native tokens (MON) into the vault, which are immediately swept into the DeFi yield wrapper.
4. **Expense Proposal:** A member initiates a payout request for a shared expense, defining the purpose, amount, and recipient.
5. **Multi-Sig Co-Signing:** Other designated co-signers approve the proposal.
6. **24-Hour Safety Escrow:** When the threshold is met, the proposal is marked `Approved` and a 24-hour dispute countdown begins.
7. **Resolution / Execution:**
   - *Path A (Standard):* If the countdown completes with no dispute, any member can call `executeProposal()` to discharge funds.
   - *Path B (Veto):* A member pauses execution by calling `vetoPayout()`, adding 24 hours to the review window.
   - *Path C (Dispute):* A member flags the proposal, locking the funds and escalating it to a community vote. If the vote fails, the proposal is rejected and the creator's reputation score is penalized.

## Features

### Vault & Governance
- **Multi-Signature Consent Engine:** Custom threshold governance ($N$-of-$M$ signatures) prevents single points of failure.
- **24-Hour Safety Lock (Veto):** Any member can pause a transaction to prevent fraudulent execute actions.
- **Flag & Freeze Dispute Center:** Escalates suspicious proposals to a democratic vote, complete with reputation penalties for bad actors.
- **On-Chain Member Reputation:** Tracks member trust ratings (starting at 100) that decrement upon failed disputes or increase with positive participation.

### UI & Analytics
- **Live Yield Accrual Interface:** Displays compound interest accumulating in real-time.
- **Cooperative Trends Visualizer:** An interactive SVG chart mapping individual cumulative contributions over time using Recharts.
- **PDF Cryptographic Audit Reports:** Generate print-ready audit files listing co-signer contributions, payouts, and histories via jsPDF.

## Scope

### In Scope
- React-Vite dashboard codebase structured under `/frontend`.
- Solidity Foundry environment for compilation and deployment structured under `/backend`.
- Virtual Monad Wallet simulator allowing users to switch addresses to test multi-sig signatures locally.
- Real-time yield simulation reflecting smart contract automated lending.
- Multi-signature proposal workflow, veto timers, and voting panels.

### Out of Scope
- Full mainnet deployment of smart contracts.
- Native mobile apps (Android/iOS).
- Real fiat-to-crypto payment gateways (e.g. Stripe, MoonPay).
- Real-time indexing networks (e.g. Subgraph/The Graph) for testnet.

## Success Criteria

1. A member can connect their wallet and deposit assets to a vault.
2. A payout proposal can collect co-signatures, pass the 24h dispute window, and transfer funds to the recipient.
3. Any member can successfully veto a pending payout or escalate it to the Dispute Center for a voting resolution.
4. The frontend compiles cleanly without errors and satisfies the premium visual aesthetic guidelines.
