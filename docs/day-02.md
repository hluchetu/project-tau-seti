# Day 2 — UI as Data (Your Own `createElement`)

Yesterday you updated the DOM by hand and felt it fall out of sync. Today you stop touching the DOM entirely: you write a function that **describes** UI as plain JavaScript objects, then make Vite compile real JSX into calls to *your* function. This is Phase 2 of the [roadmap](roadmap.md).

**Time:** 2–3 hours
**You need:** your Day 1 repo, working `npm run dev`.

---

## Rules for all of today

1. **Nothing appears on screen today.** All output goes to the browser console. The renderer that turns your blueprints into real DOM is Day 3 — do not write it early.
2. Your `customCreateElement` function must contain **no DOM code**: no `document.*`, no `element.*`. It takes values in, returns a plain object, and does nothing else.
3. Steps 2 and 3 are written **by hand** as nested function calls. JSX is only allowed from Step 4 on.
4. `innerHTML` is still banned, today and every day.

---

## Step 1 — Set up the phase 2 page

1. Create `src/phase-2-compiler/` with two files:
   - `index.html` — copy phase 1's, change the title to `Phase 2 — Compiler Target`, and point the script at `./main.jsx`
   - `main.jsx` — empty for now (the `.jsx` extension matters later; plain JS is fine in it)
2. Register the new page in `vite.config.js`:

```js
input: {
  index: resolve(import.meta.dirname, 'index.html'),
  'phase-1': resolve(import.meta.dirname, 'src/phase-1-vanilla/index.html'),
  'phase-2': resolve(import.meta.dirname, 'src/phase-2-compiler/index.html'),
},
```

3. Add a link to `/src/phase-2-compiler/` on the root `index.html`.

**Check:** `npm run dev`, open the phase 2 page. Blank page, empty console, no errors.

---

## Step 2 — Write `customCreateElement`

Create `src/phase-2-compiler/createElement.js` and export one function:

```js
customCreateElement(type, props, ...children)
```

It returns a plain object of exactly this shape:

```js
{ type, props: { ...props, children } }
```

**We expect:**

1. `customCreateElement('h1', null, 'Hello')` returns
   `{ type: 'h1', props: { children: ['Hello'] } }`
2. `props` may be `null` — the result must still be a valid object with a `children` array
3. Children can be strings, numbers, or other blueprint objects — your function stores them as-is, no conversion
4. Nesting works: a `div` containing an `h1` and a `p` produces an object whose `children` array contains two more objects

**Test yourself:** in `main.jsx`, import the function, build the nested `div` example, and log it with `console.log(JSON.stringify(tree, null, 2))`. Read the printed tree slowly. Find where the nesting of the HTML went.

**Be ready to answer:** a child is sometimes a string and sometimes an object. Why must the function accept both?

---

## Step 3 — Rebuild yesterday's page as a blueprint

In `main.jsx`, describe Day 1's cargo page as **one nested tree of `customCreateElement` calls** assigned to a single variable. Hard-code two or three cargo items — there is no state or interactivity today.

**We expect:**

1. The status line, the counter heading, the `+`/`−` buttons, the input, the **Add cargo** button, and a list with items that each have a **Remove** button — all present in one tree
2. Every button gets an `onClick` prop whose value is a real function (e.g. `() => console.log('add clicked')`). Nothing will call it today — it just sits in the object
3. `console.log(tree)` (the raw object) **and** `console.log(JSON.stringify(tree, null, 2))`

**Test yourself:** compare the two logs. The `onClick` functions are visible in the raw object but vanish in the stringified version.

**Be ready to answer:**

1. Why does `JSON.stringify` drop your `onClick` functions?
2. Put this file next to Day 1's `main.js`. Which one tells you faster what the page *looks like*? Which one tells you what it *does* when clicked?

---

## Step 4 — Let Vite write the calls for you (JSX)

Your Step 3 tree was painful to hand-write. JSX is nothing but a shorthand for exactly those calls — prove it.

1. At the very top of `main.jsx`, add the pragma comment (must be the first thing in the file):

```jsx
/** @jsx customCreateElement */
import { customCreateElement } from './createElement.js'
```

2. Below your Step 3 tree, build the **same UI again as JSX**, assigned to a second variable. It must include: nesting, at least one attribute (e.g. `id`), at least one `onClick`, and at least one `{expression}` (e.g. `Items: {items.length}`).
3. Log both trees and compare them in the console — same shape, same `type`s, same `children`.

No plugin, no install: Vite's built-in compiler (esbuild) sees the `@jsx` comment and compiles every JSX tag in this file into a call to your function.

**Check — watch the compiler work:** in the browser DevTools, open the **Sources** tab and find `main.jsx` as the browser received it. Your JSX is gone. In its place: `customCreateElement("div", ...)` calls. That transformation is the entire magic of JSX.

**Be ready to answer:** is JSX HTML inside JavaScript? Defend your answer using what the Sources tab showed you.

---

## Step 5 — Break it on purpose

1. Delete the `/** @jsx customCreateElement */` line. Save. Look at the browser console.
2. Read the error carefully. It mentions **React** — a library you have never installed.
3. Put the pragma back and confirm everything works again.

**Be ready to answer:** where did "React" come from? What does the compiler turn `<div />` into when nobody tells it otherwise — and what does that reveal about what `React.createElement` is?

---

## Done checklist

- [ ] Phase 2 page is registered in `vite.config.js`, linked from the root page, and loads clean
- [ ] `customCreateElement` returns the exact shape from Step 2, with no DOM code inside
- [ ] Day 1's page exists as one hand-written blueprint tree, logged raw and stringified
- [ ] The JSX version produces the same tree as the hand-written one
- [ ] You saw the compiled `customCreateElement(...)` calls in the Sources tab
- [ ] You saw the React error from Step 5 and restored the pragma
- [ ] Your code is committed and pushed to your repo

## Questions you must be able to answer when presenting

1. Take any small JSX snippet and desugar it into function calls on paper, without running it.
2. Where do children live in the blueprint object, and how did they get there?
3. Why does `onClick` survive in the logged object but disappear from `JSON.stringify` output?
4. Nothing appeared on screen today. In one paragraph: what is the missing piece, and what exactly must it do with your blueprint object?

---

**Next (Day 3):** you write that missing piece — `render(node, container)` — and your blueprints become real, visible DOM.
