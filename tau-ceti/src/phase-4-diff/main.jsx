import { customCreateElement } from './createElement.js'
import { render } from './render.js'
import { patch } from './diff.js'

const app = document.querySelector('#app')
let previousTree = null

let tasks = [
  { text: 'Write blueprint', done: false },
  { text: 'Rebuild page as tree', done: false },
  { text: 'Add compiler target', done: false },
]

function addTask() {
  const input = document.querySelector('#new-task-input')
  const value = input?.value.trim()
  if (!value) return

  tasks.push({ text: value, done: false })
  input.value = ''
  rerender()
}

function toggleTask(index) {
  tasks = tasks.map((task, taskIndex) =>
    taskIndex === index ? { ...task, done: !task.done } : task
  )
  rerender()
}

function deleteTask(index) {
  tasks = tasks.filter((_, taskIndex) => taskIndex !== index)
  rerender()
}

function App() {
  const completedCount = tasks.filter((task) => task.done).length

  return customCreateElement(
    'div',
    { id: 'phase-4-app' },
    customCreateElement('p', null, `Status: ${completedCount} of ${tasks.length} tasks completed`),
    customCreateElement('h1', null, 'Phase 4 — Diff'),
    customCreateElement(
      'div',
      { id: 'task-input' },
      customCreateElement('input', {
        id: 'new-task-input',
        placeholder: 'New task name',
      }),
      customCreateElement('button', { onClick: addTask }, 'Add task')
    ),
    customCreateElement(
      'ul',
      null,
      ...tasks.map((task, index) =>
        customCreateElement(
          'li',
          null,
          customCreateElement('span', null, `${task.text}${task.done ? ' (done)' : ''}`),
          customCreateElement('button', { onClick: () => toggleTask(index) }, task.done ? 'Undo' : 'Complete'),
          customCreateElement('button', { onClick: () => deleteTask(index) }, 'Delete')
        )
      )
    )
  )
}

function rerender() {
  if (!app) return

  const newTree = App()
  console.log("previousTree", previousTree)

  if (previousTree == null) {
    render(newTree, app)
  } else {
    patch(app.firstChild, previousTree, newTree)
  }

  previousTree = newTree
}

rerender()
