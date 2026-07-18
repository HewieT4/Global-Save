# Architecture Context — GlobalSave

## Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend Framework** | React (Vite + TypeScript) | Handles user dashboard rendering, reactive state management, and asset calculations. |
| **Styles & Animations** | Tailwind CSS + Framer Motion | Provides SA-inspired theme components and smooth micro-animations. |
| **Web3 Integration** | Ethers.js / Viem | Standard JSON-RPC communication, event listeners, and contract interaction layers. |
| **DeFi Yield Layer** | Simulation & lending contracts | Compounding yield model (connected on-chain to protocols like Aave). |
| **Blockchain & Smart Contracts** | Solidity (v0.8.20) + Monad EVM | Secure, immutable registry for group micro-savings, governance, and dispute systems. |
| **Development Engine** | Foundry | Core smart contract compilation, gas benchmarking, script deployments, and Forge testing. |

---

## System Boundaries

- `frontend/src/` — Owns all client-side logic, wallet emulation dashboards, SVG analytics charts, and client-side PDF document generations.
- `frontend/src/components/` — Modular visual components (WalletConsole, DisputeCenter, GroupDetails, ContractViewer, etc.).
- `backend/src/` — Contains the core Solidity smart contracts managing vault balances, signatures, dispute locks, and payouts.
- `backend/test/` — Contains Forge unit testing scripts verifying the security and durability of the smart contracts.
- `backend/script/` — Houses deploy scripts and environment configurations for Monad Testnet/Mainnet.

---

## Storage Model

- **On-Chain Storage (Monad L1):**
  - **Member Mapping:** Track member wallet address, contribution history, and reputation scores.
  - **Proposals State:** Structs recording payout ID, status, signatures, veto expiry, and voting records.
  - **Vault State:** Group parameters, total balances, active proposal counts, and yield enablement status.
- **Client Storage (Local Storage):**
  - **Virtual Keypairs:** Local mock wallets (seed phrase, private key, balances) used to simulate multi-party signing and voting on the dashboard.

---

## Auth and Access Model

- **Membership Validation:** All modifying operations on the vault (deposits, proposals, signing, vetoing, dispute voting) require the caller to be a registered wallet address in the `members` mapping.
- **Multi-Sig Validation:** A proposal's signature threshold must be reached (e.g. 2-of-3 or 3-of-5 registered addresses signing) before changing status to `Approved`.
- **Veto Rights:** Any single pool member holds the authority to invoke `vetoPayout()`, immediately pausing the execution timeline for 24 hours.

---

## Invariants

1. **Escrow Lock Period:** No approved payout can be discharged via `executeProposal()` until the 24-hour safety countdown has successfully elapsed.
2. **Double Signing Prevention:** A member wallet can sign a proposal at most once. Double signatures on the same proposal ID must revert.
3. **Double Veto Protection:** A member cannot veto the same proposal twice. Subsequent veto calls by the same address must revert.
4. **Reputation Score Bound:** Member reputation starts at 100 and cannot drop below 0. Proposers lose 10 reputation points if their proposal is disputed and rejected by community vote.
