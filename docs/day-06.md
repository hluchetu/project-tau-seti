# Day 6 — Hook Slots (Build `myUseState`)

Day 5 gave list items stable identity with `key`. Today Phase 4 begins: hooks are just state slots in an array plus a pointer that resets before every render.

**Time:** 2–3 hours
**You need:** Day 5's keyed diff working.

---

## Rules for all of today

1. Keep the hook engine tiny. `myUseState` lives in `src/phase-4-hooks/hooks.js`.
2. Reset `currentHookIndex` before every root render.
3. A setter changes one slot, then asks the root to render again.
4. Break the Rules of Hooks on purpose by putting a hook behind a conditional. The confusion is the lesson.

---

## Step 1 — Set up the phase 4 page

Create `src/phase-4-hooks/` with:

- `index.html` — copy phase 3's, change the title to `Phase 4 — Hook Mechanics`, and point the script at `./main.jsx`
- `createElement.js` — copy phase 3's version
- `render.js` — copy phase 3's version
- `diff.js` — copy phase 3's version
- `hooks.js` — empty for now
- `main.jsx` — empty for now

Register `'phase-4'` in `vite.config.js` and add a link to `/src/phase-4-hooks/` on the root `index.html`.

**Check:** `npm run dev`, open the phase 4 page. Blank page, no console errors.

---

## Step 2 — Create the hook storage

In `hooks.js`, create two module-level variables:

```js
let hooksArray = []
let currentHookIndex = 0
```

Add and export a small function named `prepareToRender()` that resets `currentHookIndex` to `0`.

**Be ready to answer:** why does the index need to reset before each render, but the array must survive between renders?

---

## Step 3 — Implement `myUseState`

Still in `hooks.js`, export:

```js
myUseState(initialValue)
```

It should:

1. Remember the current slot index in a local variable
2. If that slot is empty, store `initialValue`
3. Create a setter that updates that same slot
4. Advance `currentHookIndex`
5. Return `[value, setter]`

For now, the setter can update the slot and `console.log(hooksArray)`. Re-rendering comes next.

**Check:** call `myUseState('hello')` twice in a row and log the returned values. They should occupy two different slots.

**Be ready to answer:** what does the setter close over?

---

## Step 4 — Wire the re-render loop

In `hooks.js`, add a way for the app to register the root render function:

```js
let rerenderRoot = () => {}
```

Export a function that stores the real rerender callback. Then update the setter from Step 3 so it calls `rerenderRoot()` after changing its slot.

In `main.jsx`, build a tiny app using the Phase 3 render/diff loop:

1. Keep `let previousTree = null`
2. Before calling the root component, call `prepareToRender()`
3. On first paint, call `render(newTree, app)`
4. On later paints, call `patch(app.firstChild, previousTree, newTree)`
5. Store `previousTree = newTree`

**Check:** render a counter with `const [count, setCount] = myUseState(0)`. Clicking a button should update the number without manually touching the DOM.

**Be ready to answer:** how does `setCount` know which array slot to update after `myUseState` has already returned?

---

## Step 5 — Add multiple hooks

Add a second `myUseState` call after the counter:

```js
const [label, setLabel] = myUseState('stable second hook')
```

Render it with its own button.

**Check:** click the counter and label buttons in different orders. Each piece of state should keep its own value, because each hook call returns to the same slot on every render.

---

## Step 6 — Show the hook array

Add a temporary helper in `hooks.js`:

```js
getHookSnapshot()
```

It should return enough information to display each hook slot and value on screen. Use it in `main.jsx` to render a small ordered list of hook slots.

This is a lab instrument, not a React feature. You are opening the engine case so the pointer is visible.

**Be ready to answer:** which user-facing state value lives in each slot?

---

## Step 7 — Break it with a conditional

Add a boolean state value named something like `showBrokenHook`. When it is true, call one extra `myUseState` before another normal hook:

```js
if (showBrokenHook) {
  const [secret, setSecret] = myUseState('conditional slot')
}
```

Then add one more normal `myUseState` after the `if`.

Click the toggle. The later state should shift into a different slot, or the conditional state should appear to borrow a value that belonged to another hook.

This is why hooks cannot be called inside `if`, loops, or early returns: the state has no names. It is recovered by call order.

**Be ready to answer:** which slot changed meaning when the conditional hook appeared?

---

## Done checklist

- [ ] Phase 4 page is registered, linked, and loads clean
- [ ] `myUseState` stores state in an array slot
- [ ] setters update the slot and trigger a rerender
- [ ] `currentHookIndex` resets before each root render
- [ ] the page displays the hook slots for inspection
- [ ] you toggled the conditional hook and can explain why call order matters
- [ ] no `innerHTML`
- [ ] committed and pushed on a Day 6 branch

## Questions you must be able to answer when presenting

1. Why are hooks tied to call order instead of variable names?
2. What does the setter close over?
3. Why does a conditional hook shift later state?
4. How does this array-and-pointer model map back to React's Rules of Hooks?

---

**Next (Day 7):** add `myUseEffect(fn, deps)`, shallow-compare dependency arrays, and create a stale-closure bug on purpose.
