# 🛸 Tau Ceti — Roadmap

Tau Ceti is a progressive engineering lab: instead of building an app *with* React, it rebuilds the ideas *behind* React from the ground up, then switches to the real engine and inspects it from the inside.

The arc is **pain → blueprint → diff → hooks → real React → framework**. Each phase exists to answer a "why" that the next phase depends on.

---

## Decisions (defaults — revisit any time)

| Decision | Choice | Rationale |
|---|---|---|
| Language | Plain JavaScript (phases 1–4), TypeScript in phase 5 | Types get in the way while building a fake React; they pay off once consuming real React's APIs |
| Repo structure | Course repo with the lab app in `tau-ceti/` — a single Vite app with **multi-page entries** (one `index.html` per phase) | Docs and app travel together; one dev server, one `node_modules`; phase 5's real React can't fight the custom JSX pragma used in phases 2–4 |
| Code style | Skeleton + guided stubs | The interesting functions (`diff`, `myUseState`) are implemented by hand, not generated — otherwise the lab defeats its purpose |

---

## 📦 Phase 1 — Launch & Foundation (The Plain JS Era)

**Goal: feel the exact pain React was invented to remove.**

- **1.1** Initialize the project with Vite's vanilla template.
- **1.2** Build a counter button using raw DOM manipulation (`document.createElement`, `appendChild`, manual event wiring).
- **1.3** Introduce a *nested* state change: a list where adding an item must also update a total counter elsewhere on the page. Manually target and update each affected DOM node.

**Exit criteria:** you can articulate, in your own words, the problem statement React solves — *keeping the DOM in sync with state by hand does not scale*.

---

## 🔬 Phase 2 — A Custom Compiler Target (Micro-Babel)

**Goal: demystify JSX — it is just function calls returning plain objects.**

- **2.1** Write `customCreateElement(type, props, ...children)` mimicking `React.createElement`. It returns a plain JSON blueprint node: `{ type, props: { ...props, children } }`.
- **2.2** Hand-build a nested UI layout by calling it directly. `console.log` the raw blueprint tree and study its shape.
- **2.3** Install `@vitejs/plugin-react` and point JSX compilation at your function using the `/** @jsx customCreateElement */` pragma. Write real JSX; watch Vite compile it into calls to *your* engine.

**Exit criteria:** you can look at any JSX snippet and mentally desugar it into nested function calls.

---

## 🌲 Phase 3 — The Reconciliation Lab (Virtual DOM)

**Goal: rebuild the heart of React. This is the deepest phase — take it in four cuts.**

- **3.1 Render.** `render(virtualNode, container)` — recursively turn a blueprint tree into real DOM. Handle element nodes, text nodes, props, and event listeners (`onClick` → `addEventListener`).
- **3.2 Diff, same-type nodes.** `diff(oldNode, newNode)` producing an instruction list (`TEXT_CHANGED`, `PROP_UPDATED`, `PROP_REMOVED`) — compare, don't mutate.
- **3.3 Diff, structure.** Handle type mismatches (replace the subtree) and children compared *by index*. Apply the patch list to the live DOM; confirm only the changed nodes update (highlight patched nodes to see it).
- **3.4 Break it — discover keys.** Prepend an item to a list and watch index-based diffing rewrite every child. This failure is exactly why React has `key`. Implement a minimal keyed diff and measure the difference.

**Exit criteria:** you can explain why `key` exists and what goes wrong without it — from experience, not documentation.

---

## ⛓️ Phase 4 — Hook Mechanics

**Goal: see that hooks are an array and a pointer, nothing more.**

- **4.1** Create a module-level `hooksArray = []` and `currentHookIndex = 0`.
- **4.2** Implement `myUseState(initialValue)`: read/write `hooksArray[currentHookIndex]`, return `[value, setter]`, advance the index.
- **4.3** Build the re-render loop: every setter call resets `currentHookIndex = 0` and re-invokes the root component function, then re-renders through the Phase 3 engine.
- **4.4 Break it — discover the Rules of Hooks.** Wrap a `myUseState` call in an `if`. Watch state values shift into the wrong slots. Hooks are stored by *call order index*, not by name — now the rule is obvious instead of memorized.
- **4.5** Implement `myUseEffect(fn, deps)`: store deps in the same array, shallow-compare on re-render, run the effect only when they change. Reproduce a stale-closure bug on purpose.
- **4.6 (stretch)** Move from one global hooks array to one array *per component instance* — this is the bridge to React's per-fiber `memoizedState` in Phase 5.

**Exit criteria:** you can explain why hooks can't live in conditionals, and what a stale closure actually is mechanically.

---

## 🚀 Phase 5 — Real React & Fiber Archaeology

**Goal: switch to the official engine and recognize your own lab equipment inside it.**

- **5.1** Add a phase-5 entry using real `react` + `react-dom`, written in **TypeScript** (`.tsx`) — phases 1–4 taught the mechanics in plain JS; phase 5 adds the typed developer experience used in real-world React work. This entry must *not* use the custom JSX pragma.
- **5.2** Inspect fiber nodes. Expect guided archaeology, not a clean API — internals are minified and version-dependent. Reliable route: React DevTools first, then pause in the debugger and walk `memoizedState`, `child`, `sibling`, `return` pointers on a live fiber. Map what you find back to Phase 4's hooks array and Phase 3's tree.
- **5.3** Build re-render test-beds: components that trigger deliberate render waterfalls. Fix them with `useMemo`, `useCallback`, `React.memo`; use `useTransition` and the Profiler to watch React split long work into interruptible units.

**Exit criteria:** `memoizedState` on a fiber looks familiar — because you built it in Phase 4.

---

## 🌍 Phase 6 — The Framework Layer (Next.js)

**Goal: see what React deliberately doesn't do — routing, server rendering, data — and how a framework fills the gap.**

Next.js replaces Vite with its own compiler and server, so this phase is **its own app** in a `phase-6-nextjs/` folder at the repo root, not another page of the lab app.

- **6.1** Scaffold with `npx create-next-app@latest` (TypeScript, App Router). Compare what you got for free against what you wired by hand in phases 1–5: routing, compilation, a server.
- **6.2** File-based routing: add two static routes and one dynamic route (`app/tasks/[id]/page.tsx`). A file *is* a URL — no router code.
- **6.3 Prove SSR.** Open a page, hit **View Source**: the full HTML is there. Contrast with the phase 1–5 pages, whose source is an empty `<div id="app">`. Then disable JavaScript in DevTools — the content still renders. Explain why.
- **6.4** Server vs client components. Fetch data in a default (server) component with a plain `await` — no `useEffect`. Then rebuild Day 1's counter as a `"use client"` component. **Break it:** call `useState` in a server component and read the error; it tells you exactly where the client/server line is.
- **6.5 Break hydration on purpose.** Render `Date.now()` directly in a component and read the hydration-mismatch warning. Work out why the server's HTML and the client's first render must be identical — this only makes sense because you know a render is just a function call producing a tree (Phase 3).

**Exit criteria:** you can explain what Next.js adds *on top of* React and why SSR + hydration requires the virtual-DOM model you built in Phase 3.

---

## 🛠️ Target directory structure

```
project-tau-ceti/             # this repo
├── README.md                 # Project front door
├── docs/
│   ├── roadmap.md            # This file
│   ├── day-01.md             # Day guides
│   └── day-02.md
├── tau-ceti/                 # the lab app — single Vite app, one page per phase
│   ├── package.json
│   ├── index.html            # front door linking to each phase page
│   ├── vite.config.js        # Multi-page entry configuration (added in phase 2)
│   ├── public/
│   └── src/
│       ├── phase-1-vanilla/      # index.html + raw DOM experiments
│       ├── phase-2-compiler/     # customCreateElement + JSX pragma demo
│       ├── phase-3-vdom/         # render + diff + patch engine
│       ├── phase-4-hooks/        # myUseState / myUseEffect + re-render loop
│       └── phase-5-real-react/   # real React entry + fiber inspection notes
└── phase-6-nextjs/           # standalone Next.js app (own package.json)
```

Phases 1–5 are pages of one Vite app (`tau-ceti/src/phase-1-vanilla/index.html`, …), so earlier phases stay frozen and runnable as later ones evolve. Phase 6 is a separate app because Next.js brings its own toolchain.

---

## Progress

| Phase | Status |
|---|---|
| 1 — Plain JS foundation | 🟨 in progress — setup + counter done (1.1, 1.2); task list started, sync exercise (1.3) remaining |
| 2 — Custom compiler target | ✅ complete — merged via `learning/phase-two/complete`; used global `jsxFactory` instead of the per-file pragma (revisit before Phase 5) |
| 3 — Reconciliation lab | 🟨 in progress — 3.1 render done (`learning/phase-three/render`); diff (3.2–3.4) remaining |
| 4 — Hook mechanics | ⬜ not started |
| 5 — Real React & Fiber | ⬜ not started |
| 6 — Framework layer (Next.js) | ⬜ not started |
