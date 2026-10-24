# Copilot instructions

## Build, lint, and tests

- `npm run dev` starts the Vite development server.
- `npm run build` runs the TypeScript project build (`tsc -b`) and creates the production bundle with Vite.
- `npm run lint` runs Oxlint.
- `npm run preview` serves the production bundle locally.
- There is currently no test script, test runner, or test file in this repository, so there is no single-test command yet. `npm run build` is the available TypeScript and production-build check.

## Architecture

Órbita is a client-side React app. `src/main.tsx` mounts the root component; `src/App.tsx` renders the Spanish mission-control dashboard and owns the active mission state with React `useState`. Mission rules and content are kept in `src/mission.ts`: it defines the typed mission state, the day-indexed events and choices, and the transitions for creating a mission, resolving a choice, and advancing a day. The UI reads this state to render resources, progress, the current event, the flight log, and the terminal result.

`src/App.css` contains dashboard and responsive layout styles; `src/index.css` contains global styles and design tokens. `index.html` sets the Spanish document language, metadata, and app title. The project is a browser-only app with no backend or persistence; mission state resets when the page reloads.

## Repository conventions

- Keep user-facing interface text in Spanish.
- Keep mission rules and event definitions in `src/mission.ts`; do not duplicate game calculations in the React view. Represent rule changes as typed state transitions and return updated state rather than mutating the existing state.
- Resource levels are bounded from 0 to 100 and displayed as percentages. Daily consumption is applied by `advanceDay`; event effects are applied by `resolveEventChoice`.
- Events are keyed by mission day in `MISSION_EVENTS`. A day with an unresolved event cannot advance; mission completion is evaluated on the last day, and a depleted resource ends the mission.
- Use the existing npm scripts and Oxlint configuration in `.oxlintrc.json`. TypeScript app options, including unused-local and unused-parameter checks, are in `tsconfig.app.json`.

See `README.md` for setup and the current player-facing mission rules.
