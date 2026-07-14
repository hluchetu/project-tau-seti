# Day 4 — The Diff (Update Only What Changed)

Day 3 ended with two measurements: typed text vanishing on every re-render, and twenty-plus DOM nodes rebuilt to flip one boolean. Today you fix that by building the heart of React: `diff` — compare the old blueprint with the new one, and touch only the DOM where they disagree. This is roadmap items 3.2 and 3.3.

**Time:** 3–4 hours
**You need:** your merged Phase 3.1 render work.

---

## Rules for all of today

1. All new code goes in `diff.js`. `render.js` and `createElement.js` stay as they are — `render` is still used for the *first* paint and for newly created nodes.
2. `diff` **compares, never mutates**. It looks at two blueprint nodes and reports differences. Touching the DOM is `patch`'s job, and `patch` touches only what a report tells it to.
3. Blueprints are never modified. Old tree, new tree — both read-only.
4. `innerHTML`: still banned.

---

## Step 1 — Remember the old tree

`rerender()` currently throws away everything it knows. Change the loop in `main.jsx`:

1. Keep a module-level `let previousTree = null`
2. In `rerender()`: build `const newTree = App()`. If `previousTree` is `null`, do the Day 3 thing (`render` into the container — first paint). Otherwise, hand both trees to your new engine: `patch(container.firstChild, previousTree, newTree)`. Either way, end with `previousTree = newTree`

**Check:** nothing works yet — `patch` doesn't exist. Write a stub `patch()` that just logs its arguments, click a button, and look at the two trees sitting side by side in the console. Everything today happens between those two objects.

---

## Step 2 — Diff one node, same type

In `diff.js`, write `patch(domNode, oldNode, newNode)` for the easy cases first. `domNode` is the *live* DOM element that `oldNode` describes — they were born together on the last render, so they line up.

Handle, in order:

1. **Both are text** (strings/numbers): if they differ, `domNode.textContent = newNode`. If equal, do nothing — this "do nothing" branch is the entire performance win
2. **Props changed:** for each key in the new props (skip `children`), if the value differs from the old one, apply it (same attribute-vs-`on*` split as `render` — remove the old listener before adding the new one)
3. **Props removed:** for each key in the old props missing from the new ones, `removeAttribute` / remove the listener

**Check:** with only text-diffing wired up, click **Complete** — the `(done)` text updates *without* the input losing its text. Type in the input, click Complete again. The text survives. That's the day's payoff, felt early.

---

## Step 3 — Different types: replace

If `oldNode` and `newNode` have different types (text vs element, or `'span'` vs `'button'`), there is nothing to compare — the old DOM node is the wrong species. Build the new node with `render` into a temporary container and use `domNode.replaceWith(...)`, or remove-and-insert. No cleverness: mismatched type = replace the whole subtree.

**Be ready to answer:** why is trying to "convert" a `span` into a `button` a bad idea, even though the DOM technically allows moving children around?

---

## Step 4 — Children, by index

The recursive case. When both nodes are elements of the same type:

1. Pair up children **by position**: old child 0 with new child 0, old child 1 with new child 1 — and pair each with the matching `domNode.childNodes[i]`
2. Recurse: `patch(domChild, oldChild, newChild)` for each pair
3. More new children than old? `render` the extras into `domNode`. More old than new? Remove the leftover DOM nodes from the end

**Check:** add a task — only one new `<li>` gets created (put a temporary `console.count` in `render` to prove it). Delete the *last* task — one node removed, everything else untouched.

---

## Step 5 — Watch it work

Two ways to *see* the minimal updates:

1. In DevTools' Elements panel, changed nodes flash briefly. Click Complete and watch: one text node flashes, nothing else
2. Keep the `console.count("node created")` in `render` for a moment: flipping a task now creates **zero** nodes; adding a task creates only that task's handful

Compare with Day 3's numbers. Same app, same correctness — a fraction of the work.

---

## Step 6 — Break it: the prepend problem

Now find the crack in "pair by index":

1. Temporarily change `addTask` to put new tasks at the **front**: `tasks.unshift(...)` instead of `push`
2. Add a task and watch the flashes / node counts: every single `<li>` reports changes, even though all the old tasks are identical — they merely *moved down one slot*

Reason it out: old child 0 (`Write blueprint`) is now compared against new child 0 (your new task). By index, *everything* looks changed. The diff has no way to know the items just shifted — unless each item carried a stable identity across renders.

That identity is exactly what React's `key` prop is. You have now personally hit the wall that `key` exists to fix. **Don't fix it today** — keyed diffing is the opening act of Day 5. Put `push` back.

---

## Done checklist

- [ ] `rerender` keeps `previousTree` and calls `patch` after the first paint
- [ ] Text diff works: Complete/Undo updates without rebuilding — input text survives
- [ ] Prop changes and removals are patched
- [ ] Type mismatch replaces the subtree
- [ ] Children diffed by index; add/remove at the end patches minimally
- [ ] You saw the prepend problem and can explain it
- [ ] No mutations inside `diff` logic, no `innerHTML`, blueprints never modified
- [ ] Committed and pushed on a `learning/phase-three/diff` branch

## Questions you must be able to answer when presenting

1. Why does `patch` need three arguments — what does each one contribute?
2. Where exactly does the performance win come from? Point to the branch in your code that does nothing.
3. Why did the input stop losing its text, mechanically?
4. Explain the prepend problem to someone who has never seen React, and what information would fix it.

---

**Next (Day 5):** give list items a stable identity — `key` — and rebuild the child diff around it. Then the hooks begin.
