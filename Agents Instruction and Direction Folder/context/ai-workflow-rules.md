# AI Workflow Rules — GlobalSave

## Development Approach

1. **Spec-Driven Architecture:** All modifications must implement features precisely aligned with [business_flow.md](file:///business_flow.md) and the context files. Do not invent unauthorized features.
2. **Incremental Validation:** Implement one file modification or component adjustment at a time. Run localized build checks immediately.
3. **No Code Loss:** Preserve existing contract viewer code or mock states. Keep local storage persistence layer fully intact.

---

## Scoping & Splitting Rules

- **Independent Layers:** Never combine frontend UI refactoring and smart contract adjustments in the same workspace edit.
- **Verification Milestones:** Verify backend contracts compile cleanly using `forge compile` before updating Ethers/Viem integration interfaces in the frontend.
- Split tasks if they involve:
  - Modifying the core `GlobalSave.sol` state layout.
  - Redesigning visual layouts inside `GroupDetails.tsx` or `WalletConsole.tsx`.
  - Export updates in the jsPDF generation scripts.

---

## Handling Ambiguity

- If a state transition or logic flow is unspecified in the documentation, reference the mock state variables inside [mockData.ts](file:///frontend/src/data/mockData.ts).
- If requirements are unclear, log an entry in the "Open Questions" section of [progress-tracker.md](file:///Agents%20Instruction%20and%20Direction%20Folder/context/progress-tracker.md) and resolve it before proceeding.

---

## Protected Workspace Targets

- **Foundry Library Files:** Do not alter directories or files inside `backend/lib/*` (e.g. forge-std) manually.
- **Centralized Types:** Do not bypass defined Web3 TypeScript interfaces inside `frontend/src/types.ts`.

---

## Pre-Delivery Checklist

1. **Backend Checks:** Smart contracts compile successfully in Foundry without warnings.
2. **Frontend Checks:** Run `tsc --noEmit` inside `/frontend` to verify TypeScript typing has no regressions.
3. **Synchronization:** Verify that any adjustments made to Solidity contract parameters are mirrored in the mock contract representation code in `frontend/src/data/contractCode.ts`.
4. **Progress Logging:** Log the current execution state in `context/progress-tracker.md`.
