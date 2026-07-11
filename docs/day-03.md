# Day 3 — The Renderer (Blueprints Become Real DOM)

You have a function that describes UI as data, and a compiler that writes the calls for you. But nothing has ever appeared on screen. Today you write the missing piece: `render(node, container)` — the function that walks a blueprint tree and builds real DOM from it. This starts Phase 3 of the [roadmap](roadmap.md).

**Time:** 3–4 hours
**You need:** your merged Phase 2 work on `main`.

---

## Rules for all of today

1. `render` lives in its own file, `render.js`, and is the **only** place in phase 3 allowed to touch `document.*`.
2. Do not modify `customCreateElement` — copy it into the phase 3 folder as-is. Each phase stays frozen.
3. `innerHTML` is still banned. Forever.
4. No diffing yet. When state changes, you will destroy everything and rebuild — on purpose. The cost of that is today's lesson and Day 4's motivation.

---

## Step 1 — Set up the phase 3 page

1. Create `src/phase-3-vdom/` with:
   - `index.html` — copy phase 2's, change the title to `Phase 3 — Virtual DOM`, script pointing at `./main.jsx`
   - `createElement.js` — copied unchanged from phase 2
   - `render.js` — empty, exporting nothing yet
   - `main.jsx` — empty
2. Register `'phase-3'` in `vite.config.js` and add the link on the app's root `index.html`.

**Check:** the phase 3 page loads blank with no console errors.

---

## Step 2 — Render one element with text

In `render.js`, write `render(node, container)`. Start with the smallest case:

```js
render(customCreateElement('h1', null, 'Hello Tau Ceti'), document.querySelector('#app'))
```

**We expect:**

1. If `node` is a string or a number, create a text node (`document.createTextNode`) and append it
2. Otherwise create an element from `node.type`, render each entry of `node.props.children` **into that element** (recursion — one call per child), and append the element to `container`

**Check:** the `h1` is visible in the browser. This is the first pixel your engine has ever produced. Look at it for a second.

**Be ready to answer:** why does handling text and elements in the *same* function matter? What would break if `render` only understood elements?

---

## Step 3 — Props and events

Extend `render` to apply props:

1. For every key in `node.props` except `children`: set it on the element with `setAttribute(key, value)`
2. **Except** keys starting with `on` — those are events: `onClick` becomes `element.addEventListener('click', handler)`. Derive the event name from the key (lowercase, strip `on`), don't hard-code a list

**Test yourself:** render a button with an `id` and an `onClick` that logs. Inspect it in the Elements panel (the `id` is there) and click it (the log fires).

**Try it broken first:** before adding the `on` exception, let `onClick` go through `setAttribute` and click the button. Watch what happens — then explain what `setAttribute('onclick', fn)` actually did with your function.

---

## Step 4 — Render the whole task page

Import your Day 2 JSX task page tree into `main.jsx` and render it.

**We expect:**

1. The full page from Day 2 — status line, counter, input row, task list with Complete/Delete buttons — visible in the browser, produced entirely by your engine
2. Every button click logs to the console through the `onClick` props stored in the blueprint

**Check:** open the Elements panel and compare the DOM tree with your blueprint tree side by side. They should have the same shape.

**Be ready to answer:** trace one Complete button from JSX to click-log: what happened at compile time, what happened at render time, and what happens at click time?

---

## Step 5 — Make it live: state → tree → render

Now close the loop that React calls "rendering is a function of state":

1. Hold state in plain data: `let tasks = [...]` and `let count = 0`
2. Write a **view function** `App()` that returns the whole page tree built *from that state* — task list from `tasks.map(...)`, counts from `tasks.length`
3. Write `rerender()`: clear the container (remove its children — still no `innerHTML`), then `render(App(), container)`
4. Wire every handler to do two things only: **change the state, then call `rerender()`**. Add task adds to the array. Delete removes by index. Complete toggles a `done` flag (show it in the task text)

**We expect:** adding, completing, and deleting tasks all work, and the status line and counts are **never wrong** — the bug class from Day 1 Step 4 is now impossible, because nothing updates the DOM selectively. Every change rebuilds the whole truth from state.

**Be ready to answer:** on Day 1, one "add" click had to remember to update three separate places. How many places does it update now? What made the difference?

---

## Step 6 — Feel the cost

The nuke-and-rebuild loop fixed correctness. Now find what it broke:

1. Type something into the new-task input **without pressing Add**, then click any Complete button. Where did your text go?
2. Put a `console.count('DOM node created')` inside `render` where elements are created. Add one task and read how many nodes were rebuilt for a one-item change.

**Be ready to answer:** the state was correct, the render was correct — yet typing was lost and dozens of nodes were recreated to change one. What would an engine need to do to update *only what actually changed*? (Don't build it. That's Day 4.)

---

## Done checklist

- [ ] Phase 3 page registered, linked, loads clean
- [ ] `render` handles text, elements, attributes, and `on*` events, recursively
- [ ] The Day 2 task page renders fully through your engine, buttons logging
- [ ] State + `App()` + `rerender()` loop works: add, complete, delete stay correct everywhere
- [ ] You lost the input text on purpose and counted the rebuilt nodes
- [ ] No `innerHTML`, no `document.*` outside `render.js`
- [ ] Committed and pushed

## Questions you must be able to answer when presenting

1. Walk through `render` for one `<li>` with a button: every DOM API call it makes, in order.
2. Why are event props treated differently from attribute props?
3. Why can the Day 1 "forgot one update" bug not happen in the Step 5 version?
4. What is the exact cost of rebuilding everything, and what information would you need to avoid paying it?

---

**Next (Day 4):** `diff(oldTree, newTree)` — compare two blueprints, produce a patch list, and update only the DOM nodes that actually changed.
