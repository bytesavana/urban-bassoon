# Modern School — School AI Workspace

AI-first workspace for school staff (Principal / Teacher / Bursar): inbox, work history, automations, agent customization, and a chat + canvas interface.

## Layout
```
apps/
  web/      Vite + React + Tailwind v4 SPA
  mobile/   Expo (React Native) + Expo Router
packages/
  core/           domain types, mock data, MockAgentClient, zustand store (shared by web + mobile)
  design-tokens/  colors / radii / font shared by both apps
  api-client/     placeholder for the OpenAPI-generated client (FastAPI backend, later)
  config/         shared tsconfig
services/         (later) FastAPI backend
agents/           (later) LangGraph agents
```

The UI talks to an `AgentClient` interface (`packages/core/src/types.ts`). Today it is backed by `MockAgentClient`
(keyword-routed fake AI + hardcoded data). To go live, implement the same interface over HTTP/SSE and swap it in
`packages/core/src/index.ts`.

## Commands
```bash
pnpm install
pnpm dev:web          # http://localhost:5173
pnpm dev:mobile       # Expo; press i for iOS simulator
pnpm typecheck
pnpm test             # core store tests
```
Web theme colors live in `apps/web/src/index.css` and mirror `packages/design-tokens` — keep them in sync.
