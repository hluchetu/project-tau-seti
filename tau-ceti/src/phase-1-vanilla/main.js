const app = document.querySelector("#app");


let count = 0;


const counter = document.createElement("h2");
counter.textContent = 'Count: 0';
app.appendChild(counter);

// 1. create button element that increments the count when clicked
//2. Add event listen that increments the count and updates the counter text content
// 3. Append the button to the app div


const incrementBtn = document.createElement("button");
incrementBtn.textContent = "Increment";
incrementBtn.addEventListener("click", () => {
  count++; 
  counter.textContent = `Count: ${count}`;
});
app.appendChild(incrementBtn);

//4. Add a button element that decrements the count when clicked

const decrementBtn = document.createElement("button");
decrementBtn.textContent = "Decrement";
decrementBtn.addEventListener("click", () => {
  count--;
  counter.textContent = `Count: ${count}`;
});
app.appendChild(decrementBtn);



//5. Create a list that displays task items and a form that allows users to add new tasks to the list


const inputRow = document.createElement("div");
app.appendChild(inputRow);


const input = document.createElement("input");
inputRow.appendChild(input);


const addBtn = document.createElement("button");
addBtn.textContent = "Add task";
inputRow.appendChild(addBtn);





addBtn.addEventListener("click", () => {
  const value = input.value;
  console.log(value);
  if (!value) return;
  addTask(value);
  input.value = "";
});







function addTask(text) {

 

   const ul = document.createElement("ul");
   //append the unordered list to the app div
   app.appendChild(ul); 

   const li = document.createElement("li");
   
  




  const label = document.createElement("span");
  label.textContent = text;
  li.appendChild(label);

 
  const completeBtn = document.createElement("button");
  completeBtn.textContent = "Complete";

  completeBtn.addEventListener("click", () => {
    const isDone = li.getAttribute("data-completed") === "true";
    li.setAttribute("data-completed", isDone ? "false" : "true");
    label.textContent = isDone ? text : text + " (done)";
    completeBtn.textContent = isDone ? "Complete" : "Undo";
  });
  li.appendChild(completeBtn);


  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    list.removeChild(li);
  });
  li.appendChild(deleteBtn);
     //i want to append this list into unordered list
   ul.appendChild(li)
}









//6. Add a button that deletes the task item when clicked
//7. Add a button that marks the task item as completed when clicked
//8. Add a button that clears all completed task items from the list when clicked




