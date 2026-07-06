# 🛸 Project Tau Ceti

A progressive engineering lab that rebuilds the ideas behind React from first principles — then switches to the real engine and inspects it from the inside.

This is **not** an app and **not** a tutorial repo. It's a lab: every phase makes a prediction, runs an experiment, breaks something on purpose, and records what actually happened.

## The arc

> **pain → blueprint → diff → hooks → real React**

| Phase | Lab | The question it answers |
|---|---|---|
| 1 | Plain JS foundation | Why does React exist at all? |
| 2 | Custom compiler target | What *is* JSX, really? |
| 3 | Reconciliation lab | How does a virtual DOM know what changed? |
| 4 | Hook mechanics | Why can't hooks live inside an `if`? |
| 5 | Real React & Fiber | Does the real engine match what I built? |

The full plan, phase exit criteria, and design decisions live in [docs/roadmap.md](docs/roadmap.md).

## How this repo works

- **One Vite app, one page per phase.** Each phase has its own `index.html` entry under `src/phase-N-*/`, so earlier phases stay frozen and runnable while later ones evolve.
- **Guided stubs, not generated answers.** The interesting functions (`diff`, `myUseState`, …) are written by hand. Scaffolding and tooling can be generated; the engine cannot.
- **Every phase keeps a `NOTES.md` lab journal** — what I predicted, what actually happened, and what broke.

## Running

```bash
npm install
npm run dev
```

Then open the phase you're working on, e.g. `http://localhost:5173/src/phase-1-vanilla/`.

## Lab journal index

| Phase | Notes | Status |
|---|---|---|
| 1 — Plain JS foundation | `src/phase-1-vanilla/NOTES.md` | ⬜ not started |
| 2 — Custom compiler target | `src/phase-2-compiler/NOTES.md` | ⬜ not started |
| 3 — Reconciliation lab | `src/phase-3-vdom/NOTES.md` | ⬜ not started |
| 4 — Hook mechanics | `src/phase-4-hooks/NOTES.md` | ⬜ not started |
| 5 — Real React & Fiber | `src/phase-5-real-react/NOTES.md` | ⬜ not started |
