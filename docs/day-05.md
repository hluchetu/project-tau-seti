# Day 5 — Keys (Give List Items an Identity)

Day 4 ended with a broken diff: prepend a task, and every list item reports as changed, even though the old items just slid down one slot. Today you fix that by giving each item a stable identity that survives reordering — React's `key`. This finishes Phase 3 (roadmap item 3.4).

**Time:** 2–3 hours
**You need:** Day 4's `patch`/`diff` working — this day rebuilds the children step, nothing else.

---

## Rules for all of today

1. Keys are **only** used to match old children to new children across renders. They are never rendered, never used as React-style props for anything else, never used as an array index by convention (index-as-key is exactly the bug you're fixing — don't reach for it).
2. The rest of `patch` (text, props, replace-on-type-mismatch) doesn't change today. Only the children-diffing step gets rebuilt.
3. Still no `innerHTML`.

---

## Step 1 — Feel the bug again, precisely

Before fixing anything, pin down exactly what breaks. With `tasks.unshift(...)` in `addTask` (from Day 4's Step 6):

1. Add a task. Open the Elements panel and note **which** DOM nodes flash.
2. Answer concretely: the first old task's *text* didn't change, so why did its node get touched at all?

**Be ready to answer:** what information does the diff have about each child, and what information is it missing?

---

## Step 2 — Give every task a stable id

An index (`0`, `1`, `2`) is *positional* — it describes a slot, not a task, so it's useless once things move. You need an identity that travels with the task itself.

1. When a task is created (in `addTask`), stamp it with a unique id: `{ id: crypto.randomUUID(), text: value, done: false }`. (`crypto.randomUUID()` is a built-in browser API — no library needed.)
2. Update your seed `tasks` array to include ids too.
3. In the JSX, add a `key` prop to each `<li>`: `<li key={task.id}>`.

**Check:** `key` will currently do nothing — `customCreateElement` already stores it as an ordinary prop, and `render` will happily `setAttribute('key', ...)` it onto the DOM (harmless, but not what you want long-term — note it, fix it in Step 4).

---

## Step 3 — Rebuild the children diff around keys

In `diff.js`, replace the by-index child loop with a **keyed match**:

1. Build a lookup from the **old** children: a `Map` from `child.props.key` to `{ oldChild, domNode }`, using the corresponding entry in `domNode.childNodes`.
2. Walk the **new** children in order. For each:
   - if its key exists in the old map → this is the *same* logical item that may have moved. `patch` it against its matched old child (text/prop diffing still applies — a task's `done` flag can still change!), then move its DOM node into the correct position (`insertBefore` if it's not already there).
   - if its key is new → `render` it fresh and insert it at the right position.
3. Any **old** child whose key never got claimed by a new child → removed. Take its DOM node out.

**Check:** re-run the Step 1 experiment. Prepend a task; only the **new** node is created, the old ones just get *moved* (or don't move at all, if `insertBefore` is smart about no-ops) — no text-flash on the untouched ones.

---

## Step 4 — Stop leaking `key` onto the DOM

Now close the loop: `key` should never reach `setAttribute`. In `render.js`, treat `key` the same way you already treat `children` — skip it in the props loop. It's metadata for the diffing algorithm, not a real DOM attribute.

**Check:** inspect a rendered `<li>` in the Elements panel. No `key="..."` attribute should appear.

---

## Step 5 — Measure it properly

Repeat Day 4's Step 5 experiment, now with keys in place:

1. `console.count("node created")` in `render`, cleared, then prepend a task. Only the one new node should be counted.
2. In the Elements panel, watch the flash: the moved-but-unchanged items should not highlight; only the genuinely new node should.

Compare the three states you've now seen for the same "prepend a task" action: Day 3 (nuke everything), Day 4 without keys (everything flagged as changed), Day 5 with keys (only the true change). That progression *is* the point of the whole reconciliation lab.

---

## Step 6 — Break it on purpose: duplicate keys

1. Temporarily give two tasks the same `key`.
2. Toggle one of them. Watch which task's UI actually updates.

**Be ready to answer:** why does React (and your engine) require keys to be unique among siblings? What silently goes wrong when they aren't — and why is it worse than a loud error?

---

## Done checklist

- [ ] Every task carries a stable `id`, independent of its position in the array
- [ ] `<li>` has a `key` prop derived from that id
- [ ] Child diffing matches by key, not by index: unchanged items are neither recreated nor flagged, moved items are repositioned, only truly new/removed items touch the DOM
- [ ] `key` never appears as a real DOM attribute
- [ ] You measured node creation and DOM flashes before and after, and can state the difference in one sentence
- [ ] You broke it with duplicate keys and can explain the failure
- [ ] Committed and pushed on a `learning/phase-three/keys` branch

## Questions you must be able to answer when presenting

1. Why is an array index a bad key? Under what narrow condition would it actually be safe?
2. Walk through what your keyed-diff algorithm does, in order, for one prepend.
3. What exactly does `key` cost you (what did you have to add to every item) to get this benefit?
4. State the exit criterion for the whole reconciliation lab in your own words: why does `key` exist, and what goes wrong without it?

---

**Next (Day 6):** Phase 4 begins — hooks are nothing but an array and a pointer. You'll build `myUseState` and discover why hooks can't live inside an `if`.
