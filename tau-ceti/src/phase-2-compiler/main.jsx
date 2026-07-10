// Day 2 — Phase 2: UI as data.
import { customCreateElement } from './createElement.js'

// Step 2 — three test calls. Predict each output before reading the console.

// 1. Single text child
console.log(
  'h1:',
  customCreateElement('h1', null, 'Hello'),
)

// 2. Props and children side by side; onClick is a real function stored in data
console.log(
  'button:',
  customCreateElement('button', { id: 'add', onClick: () => console.log('add clicked') }, 'Add task'),
)

// 3. Nesting — the inner call runs first, its object lands in the outer children array
console.log(
  'nested:',
  customCreateElement('div', null, customCreateElement('p', null, 'hi')),
)

// Step 3 — your turn: describe the whole Day 1 task page as ONE nested tree
// assigned to a single variable, then:
//   console.log(tree)
//   console.log(JSON.stringify(tree, null, 2))
