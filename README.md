# 🛸 Project Tau Ceti

A progressive engineering lab that rebuilds the ideas behind React from first principles — then switches to the real engine and inspects it from the inside.

This is **not** an app and **not** a tutorial repo. It's a lab: every phase runs an experiment and breaks something on purpose to see why React works the way it does.

## The arc

> **pain → blueprint → diff → hooks → real React**

| Phase | Lab | The question it answers |
|---|---|---|
| 1 | Plain JS foundation | Why does React exist at all? |
| 2 | Custom compiler target | What *is* JSX, really? |
| 3 | Reconciliation lab | How does a virtual DOM know what changed? |
| 4 | Hook mechanics | Why can't hooks live inside an `if`? |
| 5 | Real React & Fiber | Does the real engine match what I built? |

The full plan, phase exit criteria, and design decisions live in [docs/roadmap.md](docs/roadmap.md). Each phase has a step-by-step lab guide:

- [Day 1 — Launch & Foundation](docs/day-01.md)
- [Day 2 — UI as Data (Your Own `createElement`)](docs/day-02.md)
- [Day 3 — The Renderer (Blueprints Become Real DOM)](docs/day-03.md)
- [Day 4 — The Diff (Update Only What Changed)](docs/day-04.md)
- [Day 5 — Keys (Give List Items an Identity)](docs/day-05.md)
- [Day 6 — Hook Slots (Build `myUseState`)](docs/day-06.md)

## How this repo works

- **One Vite app, one page per phase.** Each phase has its own `index.html` entry under `src/phase-N-*/`, so earlier phases stay frozen and runnable while later ones evolve.
- **Guided stubs, not generated answers.** The interesting functions (`diff`, `myUseState`, …) are written by hand. Scaffolding and tooling can be generated; the engine cannot.

## Running

```bash
npm install
npm run dev
```

Then open the phase you're working on, e.g. `http://localhost:5173/src/phase-1-vanilla/`. Progress is tracked in the [roadmap](docs/roadmap.md).
