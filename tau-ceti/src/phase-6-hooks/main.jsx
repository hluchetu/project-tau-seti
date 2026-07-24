import { customCreateElement } from '../phase-3-vdom/createElement.js'
import { patch } from './diff.js'
import {
  getHookSnapshot,
  myUseState,
  prepareToRender,
  registerRootRerender,
} from './hooks.js'
import { render } from './render.js'

const app = document.querySelector('#app')
// Keep the old tree so the diff can compare it with the new one.
let previousTree = null

function App() {
  const [count, setCount] = myUseState(0)
  const [label, setLabel] = myUseState('stable second hook')
  const [showBrokenHook, setShowBrokenHook] = myUseState(false)

  let conditionalMessage = 'The conditional hook is off; the later hook uses slot 3.'
  if (showBrokenHook) {
    // This is intentionally wrong: the hook only runs sometimes.
    const [secret] = myUseState('conditional slot')
    conditionalMessage = `Conditional hook is on and reads: ${secret}`
  }

  const [afterConditional, setAfterConditional] = myUseState('after normal hook')
  const hookSlots = getHookSnapshot()

  return (
    <main>
      <h1>Phase 6 — Hook Mechanics</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount((value) => value + 1)}>Increment count</button>

      <p>Label: {label}</p>
      <button onClick={() => setLabel('second hook updated')}>Update label</button>

      <p>After conditional: {afterConditional}</p>
      <button onClick={() => setAfterConditional('after hook updated')}>Update later hook</button>

      <p>{conditionalMessage}</p>
      <button onClick={() => setShowBrokenHook((value) => !value)}>
        {showBrokenHook ? 'Hide broken hook' : 'Show broken hook'}
      </button>

      <h2>Hook slot inspector</h2>
      <p>Hook state is recovered by call order, not variable name.</p>
      <ol>
        {hookSlots.map(({ slot, value }) => (
          <li>Slot {slot}: {value}</li>
        ))}
      </ol>
    </main>
  )
}

// This function runs again whenever a state setter changes a slot.
function rerender() {
  if (!app) return

  // Hooks must start from the first slot on every render.
  prepareToRender()
  const newTree = App()

  if (previousTree == null) render(newTree, app)
  else patch(app.firstChild, previousTree, newTree)

  previousTree = newTree
}

// Give the hook setters a way to rerender the application.
registerRootRerender(rerender)
rerender()
