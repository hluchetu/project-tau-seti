import { customCreateElement } from './createElement.js'
import { render } from './render.js'

const app = document.querySelector('#app')

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
  return (
    <div id="phase-3-app">
      <p>Status: {completedCount} of {tasks.length} tasks completed</p>
      <h1>Phase 3 — Virtual DOM</h1>
      <div id="task-input">
        <input id="new-task-input" placeholder="New task name" />
        <button onClick={addTask}>Add task</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li>
            <span>{task.text}{task.done ? ' (done)' : ''}</span>
            <button onClick={() => toggleTask(index)}>
              {task.done ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function rerender() {
  if (!app) return
  while (app.firstChild) {
    app.removeChild(app.firstChild)
  }

  render(App(), app)
}
rerender()
