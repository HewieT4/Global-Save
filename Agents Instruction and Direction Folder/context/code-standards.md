# Code Standards — GlobalSave

## General Principles

1. **centralized State, Decentralized Execution:** सेंट्रल React state resides in `App.tsx` and synchronizes with Web3 RPC simulation events. Component code must remain purely visual and call handlers.
2. **Defensive Validation:** Always validate inputs (amount, address format, required signatures) on the client before triggering a simulated on-chain transaction.
3. **No Placeholders:** Never use static or hardcoded placeholder items for user actions. Every button click (e.g. contribute, sign, veto, flag, vote) must trigger a real on-chain/contract state transition.

---

## Smart Contracts (Solidity)

- **Version Alignment:** Compile contracts using Solidity `v0.8.20` or higher to ensure compiler optimization benefits.
- **Check-Effects-Interactions (CEI):** Always modify internal state balances or proposal statuses *before* calling external address transfers (`recipient.transfer()`) to prevent reentrancy exploits.
- **Explicit Events:** Every state mutation must emit a corresponding event:
  - `Contributed(address, uint256, uint256)`
  - `ProposalCreated(uint256, string, uint256)`
  - `ProposalVetoed(uint256, address, uint256, string)`
  - `ProposalFlagged(uint256, address, string)`
  - `DisputeResolved(uint256, bool)`
- **Gas Audits:** Optimize variables inside mappings. Use `calldata` for read-only string parameters in external functions to reduce execution fees.

---

## TypeScript & Frontend

- **No `any` Typing:** Explicit interfaces and types must be defined in [types.ts](file:///frontend/src/types.ts) and shared across all components.
- **Ethers & Viem Integration:** Use clean type casting for contract instance ABIs. Implement robust handling for signature hashes.
- **Dynamic Updates:** Yield loops and countdown timers must run inside structured `useEffect` intervals, clearing handles on unmount to prevent memory leaks.

---

## Styling & Layout

- **Custom Variables:** Reference the color variable scale defined in [ui-context.md](file:///Agents%20Instruction%20and%20Direction%20Folder/context/ui-context.md). Do not use arbitrary inline colors.
- **Responsive Viewports:** Designs must maintain mobile and desktop viewport flexibility using modern grid layouts and flex boxes.

---

## File Organization

- `frontend/src/components/` — UI modules (GroupDetails, WalletConsole, DisputeCenter, ContractViewer).
- `frontend/src/data/` — JSON ABI files, mock data payloads, and raw contract strings.
- `backend/src/` — Main Solidity smart contracts (`GlobalSave.sol`).
- `backend/test/` — Solidity Foundry testing suite scripts.
- `backend/script/` — Solidity deployment automation files.
