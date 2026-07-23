import { customCreateElement } from '../phase-3-vdom/createElement.js'
import { patch } from './diff.js'
import { render } from './render.js'

const app = document.querySelector('#app')
let previousTree = null // Keep the old tree so we can compare it with the new one.

let tasks = [
  // Each task needs its own ID so it can still be found after the list changes.
  { id: crypto.randomUUID(), text: 'Write blueprint', done: false },
  { id: crypto.randomUUID(), text: 'Rebuild page as tree', done: false },
  { id: crypto.randomUUID(), text: 'Add compiler target', done: false },
]

function addTask() {
  const input = document.querySelector('#new-task-input')
  const value = input?.value.trim()
  if (!value) return

  // Add it at the top to test whether keys keep the other tasks in place.
  tasks.unshift({ id: crypto.randomUUID(), text: value, done: false })
  input.value = ''
  rerender()
}

function toggleTask(id) {
  // Use the ID, not the task position, because positions can change.
  tasks = tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task))
  rerender()
}


function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id)
  rerender()
}

function App() {
  const completedCount = tasks.filter((task) => task.done).length

  return (
    <div id="phase-5-app">
      <p>Status: {completedCount} of {tasks.length} tasks completed</p>
      <h1>Phase 5 — Keys</h1>
      <div id="task-input">
        <input id="new-task-input" placeholder="New task name" />
        <button onClick={addTask}>Prepend task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.text}{task.done ? ' (done)' : ''}</span>
            <button onClick={() => toggleTask(task.id)}>
              {task.done ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function rerender() {
  if (!app) return

  const newTree = App()
  if (previousTree == null) render(newTree, app)
  else patch(app.firstChild, previousTree, newTree)
  previousTree = newTree
}

rerender()
