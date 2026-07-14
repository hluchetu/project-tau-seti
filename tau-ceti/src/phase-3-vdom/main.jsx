import { customCreateElement } from "./createElement.js";
import { render } from "./render.js";

let tasks = [
  { name: "Write blueprint", done: true },
  { name: "Rebuild page as tree", done: true },
  { name: "Add compiler target", done: false },
];

function addTask() {
  const input = document.querySelector("#new-task");
  const name = input.value.trim();
  if (!name) return;
  tasks.push({ name, done: false });
  rerender();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  rerender();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  rerender();
}

function App() {
  const doneCount = tasks.filter((task) => task.done).length;
  return (
    <div id="phase-3-app">
      <p>
        Status: {doneCount} of {tasks.length} tasks completed
      </p>
      <h1>Phase 3 — Virtual DOM</h1>
      <div id="task-input">
        <input id="new-task" placeholder="New task name" />
        <button onClick={addTask}>Add task</button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li>
            <span>
              Task {index + 1}: {task.name}
              {task.done ? " (done)" : ""}
            </span>
            <button onClick={() => toggleTask(index)}>
              {task.done ? "Undo" : "Complete"}
            </button>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const container = document.querySelector("#app");

function rerender() {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  render(App(), container);
}

rerender();
