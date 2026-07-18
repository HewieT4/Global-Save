## Application Building Context for GlobalSave

GlobalSave is a decentralized micro-savings and collaborative governance application split into two main sections:
- `/frontend` contains the React, Vite, TypeScript, and Tailwind CSS user interface.
- `/backend` contains the Solidity smart contracts, configurations, and test suites managed via Foundry.

Read the following files in order before implementing or making any architectural decision:

0. `business_flow.md` (in workspace root) — the comprehensive product vision, user workflows, and production roadmap.
1. `context/project-overview.md` — product definition, goals, features, and scope.
2. `context/architecture.md` — system structure, folder/module boundaries, storage model, and invariants.
3. `context/ui-context.md` — visual theme, colors, typography, layout, and component conventions.
4. `context/code-standards.md` — coding rules, styling rules, wallet security, and solidity standards.
5. `context/ai-workflow-rules.md` — agent development workflow, scoping rules, and verification criteria.
6. `context/progress-tracker.md` — current phase, completed work, open questions, and next steps.

Update `context/progress-tracker.md` after each meaningful implementation change.
If implementation changes the architecture, scope, or standards documented in the context files, update the relevant file before continuing.
