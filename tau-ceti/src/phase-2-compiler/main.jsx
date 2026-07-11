
import { customCreateElement } from './createElement.js'


const rawTree = customCreateElement(
  'div',
  { id: 'phase-2-app' },
  customCreateElement('p', null, 'Status: 2 of 3 tasks completed'),
  customCreateElement('h1', null, 'Phase 2 — Compiler Target'),
  customCreateElement(
    'div',
    { id: 'counter' },
    customCreateElement(
      'button',
      { onClick: () => console.log('decrement clicked') },
      '−'
    ),
    customCreateElement('span', null, '3'),
    customCreateElement(
      'button',
      { onClick: () => console.log('increment clicked') },
      '+'
    )
  ),
  customCreateElement(
    'div',
    { id: 'task-input' },
    customCreateElement('input', { placeholder: 'New task name' }),
    customCreateElement(
      'button',
      { onClick: () => console.log('add task clicked') },
      'Add task'
    )
  ),
  customCreateElement(
    'ul',
    null,
    customCreateElement(
      'li',
      null,
      customCreateElement('span', null, 'Task 1: Write blueprint'),
      customCreateElement(
        'button',
        { onClick: () => console.log('complete task 1') },
        'Complete'
      ),
      customCreateElement(
        'button',
        { onClick: () => console.log('delete task 1') },
        'Delete'
      )
    ),
    customCreateElement(
      'li',
      null,
      customCreateElement('span', null, 'Task 2: Rebuild page as tree'),
      customCreateElement(
        'button',
        { onClick: () => console.log('complete task 2') },
        'Complete'
      ),
      customCreateElement(
        'button',
        { onClick: () => console.log('delete task 2') },
        'Delete'
      )
    ),
    customCreateElement(
      'li',
      null,
      customCreateElement('span', null, 'Task 3: Add compiler target'),
      customCreateElement(
        'button',
        { onClick: () => console.log('complete task 3') },
        'Complete'
      ),
      customCreateElement(
        'button',
        { onClick: () => console.log('delete task 3') },
        'Delete'
      )
    )
  )
)

console.log('rawTree:', rawTree)


console.log('rawTree stringified:', JSON.stringify(rawTree, null, 2))





//  Rewrite the same UI using JSX shorthand instead of manual calls.
const taskCount = 3
const jsxTree = (
  <div id="phase-2-app">
    <p>Status: {taskCount} of 3 tasks completed</p>
    <h1>Phase 2 — Compiler Target</h1>
    <div id="counter">
      <button onClick={() => console.log('decrement clicked')}>−</button>
      <span>{taskCount}</span>
      <button onClick={() => console.log('increment clicked')}>+</button>
    </div>
    <div id="task-input">
      <input placeholder="New task name" />
      <button onClick={() => console.log('add task clicked')}>Add task</button>
    </div>
    <ul>
      <li>
        <span>Task 1: Write blueprint</span>
        <button onClick={() => console.log('complete task 1')}>Complete</button>
        <button onClick={() => console.log('delete task 1')}>Delete</button>
      </li>
      <li>
        <span>Task 2: Rebuild page as tree</span>
        <button onClick={() => console.log('complete task 2')}>Complete</button>
        <button onClick={() => console.log('delete task 2')}>Delete</button>
      </li>
      <li>
        <span>Task 3: Add compiler target</span>
        <button onClick={() => console.log('complete task 3')}>Complete</button>
        <button onClick={() => console.log('delete task 3')}>Delete</button>
      </li>
    </ul>
  </div>
)

console.log('jsxTree:', jsxTree)
console.log('jsxTree stringified:', JSON.stringify(jsxTree, null, 2))
