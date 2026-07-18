# UI Context — GlobalSave

## Theme

GlobalSave rejects generic, template-driven "AI slop" styles. The visual identity uses a premium, **South African-inspired international design language** featuring warm dark aesthetics, organic textures, Sahara-sunset gradients, and polished glassmorphism overlays. High-contrast state glows indicate transactional actions (e.g. emerald green for contributions, golden yellow for approvals, terracotta orange for vetos, and deep crimson for locked disputes).

---

## Colors

All styling properties must use custom CSS custom property tokens for complete theme consistency.

| Role | CSS Variable | Value | Description |
| :--- | :--- | :--- | :--- |
| **Page background** | `--bg-base` | `#0D0C0A` | Midnight black-gold (African savanna night) |
| **Surface card** | `--bg-surface` | `#161410` | Dark copper slate |
| **Hover surface** | `--bg-surface-hover` | `#221E18` | Warm clay highlights |
| **Primary text** | `--text-primary` | `#F5F2EB` | Warm ivory |
| **Muted text** | `--text-muted` | `#9C9384` | Muted desert dust gray |
| **Sahara Gold Accent**| `--accent-gold` | `#E5A93B` | Main branding color (sunlight/gold reserves) |
| **Terracotta Accent** | `--accent-terracotta`| `#C9522A` | Secondary action highlights (sunset/earth) |
| **Border default** | `--border-default` | `#26211A` | Raw bronze lining |
| **Veto / Locked** | `--state-error` | `#C83737` | Crimson fire alert |
| **Success / Yield** | `--state-success` | `#248A56` | Savanna emerald green |

---

## Typography

| Role | Font | Variable |
| :--- | :--- | :--- |
| **UI Header & Text** | `Space Grotesk`, `Inter`, sans-serif | `--font-sans` |
| **Web3 Terminal & Code**| `JetBrains Mono`, `Fira Code`, monospace | `--font-mono` |

---

## Border Radius

| Context | Class | Radius |
| :--- | :--- | :--- |
| **Buttons & Small Badges** | `rounded-lg` | `8px` |
| **Cooperative Cards & Vault Panels**| `rounded-2xl` | `16px` |
| **Dispute Center Modals & Overlays** | `rounded-3xl` | `24px` |

---

## Component Layout & Navigation Patterns

1. **Dual Column Split Workspace:**
   - **Left Panel (Width 30%):** Fixed interactive **Wallet Console / Web3 Emulator** containing virtual keys, faucet claim modules, transaction hashes, and gas telemetry.
   - **Right Panel (Width 70%):** Flexible main workspace hosting dynamic tabs (Cooperative Pools, Smart Contract Viewer, Audit Logs, and Transaction Ledger).
2. **Dynamic Alert Banners:** Used for showing veto alerts or active governance votes.
3. **Compound Yield Glow:** Glowing numerical interest counters that update on a 1-second interval, simulating live DeFi lending.
4. **Data Visualization:** Custom SVG line charts via Recharts utilizing warm golden stroke gradients to show cumulative contribution histories.

---

## Icons (Lucide React)

Use the following stroke-based icons:
- `Coins` / `Landmark` — Deposits, vaults, and financial assets.
- `ShieldAlert` / `ShieldCheck` — Veto status, safety escrows, and security indicators.
- `Gavel` — Active disputes and voting boards.
- `BadgePercent` — DeFi compounding yield.
- `Terminal` — Real-time blockchain log feedback.
- `Users` — Co-signer groups and member tallies.
