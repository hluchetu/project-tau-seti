# Day 1 — Build UI the Hard Way (Vanilla DOM)

Today you build a small app **without React** — only plain JavaScript and the browser's DOM APIs. This is Phase 1 of the [roadmap](roadmap.md).

**Time:** 2–3 hours
**You need:** Node.js 18+, a terminal, a browser.

---

## Rules for all of today

You may only use these four APIs to put things on screen:

1. `document.createElement(tag)`
2. `element.textContent = ...`
3. `element.appendChild(child)`
4. `element.addEventListener('click', handler)`

**`innerHTML` is not allowed.** If your code contains `innerHTML`, the work is not accepted.

---

## Step 1 — Set up the project

Run these commands in an empty folder:

```bash
npm create vite@latest tau-ceti -- --template vanilla
cd tau-ceti
npm install
```

Then:

1. Delete the demo files: `counter.js`, `javascript.svg`, `style.css`, `main.js`, `public/vite.svg`.
2. Create a folder `src/phase-1-vanilla/` with two files: `index.html` and `main.js`.
3. Put this in `src/phase-1-vanilla/index.html`:

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

4. Replace the root `index.html` with a simple page that links to `/src/phase-1-vanilla/`.

**Check:** run `npm run dev`, open the link it prints, click through to the phase 1 page. You should see an empty page with no errors in the browser console (F12).

---

## Step 2 — A counter

In `src/phase-1-vanilla/main.js`, build this. All elements must be created from JavaScript — the HTML stays as it is.

**We expect:**

1. A heading that shows `Count: 0`
2. A `+` button — clicking it increases the number on screen by 1
3. A `−` button — clicking it decreases the number on screen by 1

**Be ready to answer:** where does the current count live in your code — in a JavaScript variable, or do you read it out of the heading's text? Why did you choose that?

---

## Step 3 — A cargo list

Below the counter, build a list manager.

**We expect:**

1. A text input and an **Add cargo** button
2. Each added item appears in a list, with its own **Remove** button
3. At the **top of the page**, a status line that always shows:
   `Items: <number> · Status: <EMPTY or LOADED>`
   - `EMPTY` when the list has no items, `LOADED` otherwise
4. Adding an item updates the list, the number, and the status word
5. Removing an item also updates all three
6. The count and status must **never** be wrong, no matter how fast you add and remove

**Test yourself:** add three items, remove the middle one. Is the number right? Is the status right?

**Be ready to answer:** for one click of "Add cargo", how many separate elements did your code have to update?

---

## Step 4 — Create a bug on purpose

1. Add a second copy of the item count at the **bottom** of the page: `Manifest: <number> entries`.
2. Update it in the **add** handler, but "forget" to update it in the **remove** handler.
3. Add two items, remove one. Look at the two numbers.

**Be ready to answer:** the page is now showing wrong information, but there is no error anywhere. Why is this kind of bug dangerous?

---

## Done checklist

- [ ] `npm run dev` works and shows your page
- [ ] Counter works with both buttons
- [ ] Cargo list: add and remove keep the list, the number, and the status in sync
- [ ] The Step 4 bug was created and you saw the two numbers disagree
- [ ] No `innerHTML` anywhere in your code
- [ ] Your code is committed and pushed to your repo

## Questions you must be able to answer when presenting

1. Where does your data (count, list of items) live, and why there?
2. How many elements does one "add" click touch in your code?
3. What happens when you forget one update — and why doesn't the browser warn you?
4. In one paragraph, your own words: what problem would a tool need to solve so you never write this kind of code again?

---

**Next (Day 2):** you'll write a function that describes UI as plain data instead of touching the DOM — the first piece of your own mini-React.
