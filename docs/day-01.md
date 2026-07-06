# Day 1 — Launch & Foundation (The Plain JS Era)

> **Phase 1 of the [roadmap](roadmap.md).** Today you scaffold the lab, build UI with nothing but raw DOM APIs, and — most importantly — *feel* the exact pain React was invented to remove.

**Time budget:** 2–3 hours
**You will need:** Node.js ≥ 18, a terminal, a browser with DevTools.

---

## What today answers

**Why does React exist at all?**

You will build a small app twice over with manual DOM manipulation. By the end, keeping the screen in sync with your data by hand should feel error-prone and unscalable — and you should be able to say *precisely why*, in your own words.

---

## Step 1 — Scaffold the lab (~15 min)

Create the Vite project **in the repo root** (the repo already has `README.md` and `docs/`, so scaffold into the current directory):

```bash
npm create vite@latest . -- --template vanilla
npm install
```

Vite's vanilla template ships demo files you don't need. Delete `counter.js`, `javascript.svg`, `main.js`, `style.css`, and `public/vite.svg`.

Now set up the **one-page-per-phase** structure. Replace the root `index.html` with a plain hub page that just links to each phase:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>🛸 Tau Ceti</title>
  </head>
  <body>
    <h1>🛸 Tau Ceti — Lab Index</h1>
    <ul>
      <li><a href="/src/phase-1-vanilla/">Phase 1 — Plain JS foundation</a></li>
    </ul>
  </body>
</html>
```

Create the phase 1 workspace:

```bash
mkdir -p src/phase-1-vanilla
touch src/phase-1-vanilla/index.html src/phase-1-vanilla/main.js
```

`src/phase-1-vanilla/index.html` starts as an *empty stage* — everything visible must be created from JavaScript today:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Phase 1 — Vanilla DOM</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

Finally, add a minimal `vite.config.js` so `npm run build` knows about both pages (dev mode works without this, but set the pattern now — every new phase adds one line here):

```js
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        'phase-1': resolve(__dirname, 'src/phase-1-vanilla/index.html'),
      },
    },
  },
})
```

**Checkpoint:** `npm run dev`, open `http://localhost:5173/` — you see the hub page, and the phase 1 link opens a blank page with no errors in the console.

---

## Step 2 — A counter, the hard way (~30 min)

In `src/phase-1-vanilla/main.js`, build a counter **using only these APIs** — no `innerHTML`, that's cheating the exercise:

- `document.createElement(tag)`
- `element.textContent = ...`
- `element.appendChild(child)`
- `element.addEventListener('click', handler)`

**Requirements:**

1. A `<h2>` that reads `Count: 0`
2. A `+` button and a `−` button
3. Clicking updates the number on screen

**Before you write any code**, ask yourself: where will the current count *live*? In a JavaScript variable, or in the DOM itself?

Then build it. You'll hit the question immediately: when the button is clicked, how do you know the current value? You have two options — keep a `let count = 0` variable in JS (and remember to update the DOM every time it changes), or read it back out of the DOM (`parseInt(heading.textContent...)`). **Try it both ways.** The second one works, and it should horrify you slightly: your *data* is stored in a UI string.

**Checkpoint:** counter works with both buttons, and you can explain which approach you kept and why.

---

## Step 3 — The pain experiment (~45 min)

Now the real experiment. Below the counter, build a **cargo manifest** (it's a spaceship-themed lab, lean in):

**Requirements:**

1. A text input and an "Add cargo" button
2. A `<ul>` listing each added item, each with its own "remove" button
3. A **status bar at the top of the page** — created in Step 2's code, physically far from the list code — showing: `Items: N · Status: <EMPTY | LOADED>`
4. Adding an item must update: the list, the item count, and the status word
5. Removing an item must update all three as well

Rules stay the same: `createElement` / `appendChild` / `textContent` / `addEventListener` only.

**Predict first:** how many distinct DOM nodes will you have to manually touch for a single "add item" click?

As you build, you will be forced into one of these patterns — notice which:

- **Surgical updates:** after every state change, hand-write code that finds and updates each affected node. Fast, but every new UI element that depends on the data means *revisiting every event handler that changes it*.
- **Nuke and rebuild:** write one `renderList()` function that empties the `<ul>` and rebuilds it from an array. Simpler to reason about — but you're now destroying and recreating untouched DOM nodes on every keystroke of change. (Type something into the input, add an item, notice anything about focus or the input's state if you rebuild too much? Poke at this.)

**Checkpoint:** add and remove work, and count + status never desync from the list. Try to break it: add three items fast, remove the middle one, check the count.

---

## Step 4 — Break it on purpose (~15 min)

Do this deliberately:

1. Add a second place in the UI that shows the item count (e.g. in the page footer: `Manifest: N entries`).
2. Wire it up in the "add" handler… and *"forget"* to wire it in the "remove" handler.
3. Click around. Watch the two counts diverge silently. No error. No warning. Just a UI lying to the user.

This is the bug class React eliminates: **state duplicated into the DOM in multiple places, with humans responsible for remembering every sync point.** It doesn't crash — it just rots.

---

## Exit criteria — check before calling Day 1 done

- [ ] `npm run dev` serves the hub page and the phase 1 page
- [ ] Counter works, built with `createElement`/`appendChild` only
- [ ] Cargo manifest: add + remove keep list, count, and status in sync
- [ ] The Step 4 desync bug was reproduced
- [ ] You can state, in one paragraph and your own words, the problem React solves
- [ ] Everything committed and pushed

Update the phase 1 row in the `docs/roadmap.md` progress table to 🟨 **in progress**.

---

## What's next

**Day 2 → Phase 2:** you'll write `customCreateElement(type, props, ...children)` — a function that returns UI as *plain data* instead of touching the DOM — and then trick Vite into compiling real JSX into calls to it. The frustration you felt today is the requirements spec for that function.
