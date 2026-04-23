// --- Task Data ---
let tasks = [];
var archive = [];
var listElement = document.querySelector('#taskList');
var taskButton = document.querySelector("#addTask");
var taskInput = document.querySelector("#newTask");
var createButton = document.querySelector("#createTask");
var writeTask = document.querySelector("#taskWriter");
var subBtn = document.querySelector("#submit");


// Load tasks on page load
window.onload = () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  renderBoard(tasks);
};

function loadTasks() {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  archive = JSON.parse(localStorage.getItem("archive")) || [];
}

// Save tasks
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("archive", JSON.stringify(archive));
}

// Add a task
function addTask(text) {
  const task = {
    id: crypto.randomUUID(),
    text,
    completed: false,
    archived: false,   // NEW FIELD
    createdAt: Date.now()
  };

  tasks.push(task);
  saveTasks();
}

// Mark complete
function completeTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = true;
  saveTasks();
}

// Archive (remove from board but keep in history)
/*function archiveTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  task.archived = true;
  saveTasks();
}*/

function archiveTask() {
  const checkedTasks = document.querySelectorAll(".task.checked-task");

  checkedTasks.forEach(taskEl => {
    const taskText = taskEl.childNodes[1].textContent.trim();


    archive.push(taskText);

    const index = taskList.indexOf(taskText);
    if (index !== -1) {
      taskList.splice(index, 1);
    }
  });

  saveTasks();
  renderList();
  updateCounts();
}

// Render sticky notes
/*function renderBoard(taskList) {
  const board = document.getElementById("board");
  board.innerHTML = "";

  taskList
    .filter(task => !task.archived) // HIDE archived tasks
    .forEach(task => {
      const note = document.createElement("div");
      note.className = "sticky-note";
      note.style.transform = `rotate(${(Math.random() * 10 - 5)}deg)`;

      if (task.completed) note.classList.add("completed");

      note.textContent = task.text;

      // Double-click to archive
      note.addEventListener("dblclick", () => {
        archiveTask(task.id);
        renderBoard(tasks);
      });

      board.appendChild(note);
    });
}*/

function renderBoard(taskList) {
  const board = document.getElementById("board");
  board.innerHTML = "";

  taskList
    .filter(task => !task.archived)
    .forEach(task => {
      const note = document.createElement("div");
      note.className = "sticky-note";
      note.style.transform = `rotate(${(Math.random() * 10 - 5)}deg)`;
      note.setAttribute("data-id", task.id);

      // If completed, visually mark it
      if (task.completed) {
        note.classList.add("checked-task");
      }

      // --- Create checkbox (same pattern as renderList) ---
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.classList.add("completed");
      checkbox.checked = task.completed;

      checkbox.addEventListener("change", function () {
        const isChecked = this.checked;

        // Toggle CSS class on the sticky note
        if (isChecked) {
          note.classList.add("checked-task");
        } else {
          note.classList.remove("checked-task");
        }

        // Update the task object
        task.completed = isChecked;
        saveTasks();
      });

      // --- Create text node ---
      const text = document.createElement("div");
      text.classList.add("note-text");
      text.textContent = task.text;

      // --- Double-click to archive ---
      note.addEventListener("dblclick", () => {
        archiveTask(task.id);
        renderBoard(tasks);
      });

      // --- Build the note ---
      note.appendChild(checkbox);
      note.appendChild(text);

      board.appendChild(note);
    });
}

// --- Add Task Button ---
document.getElementById("addTaskBtn").addEventListener("click", () => {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();

  if (text === "") return;

  addTask(text);
  renderBoard(tasks);
  input.value = "";
});

function clearAllTasks() {
  tasks = [];
  saveTasks();
  renderBoard(tasks);
}

//make nav-menu visible

const navButton = document.getElementById("topbar");
const navMenu = document.getElementById("nav-menu");

function showMenu() {
  navMenu.classList.add("visible");
}

function hideMenu() {
  navMenu.classList.remove("visible");
}

navButton.addEventListener("mouseenter", showMenu);
navButton.addEventListener("mouseleave", hideMenu);

navMenu.addEventListener("mouseenter", showMenu);
navMenu.addEventListener("mouseleave", hideMenu);

//task menu visible

// --- Task Menu Toggle ---
const createTaskBtn = document.getElementById("createTaskBtn");
const taskMenu = document.getElementById("task-menu");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");

function toggleTaskMenu() {
  taskMenu.classList.toggle("visible");
}

createTaskBtn.addEventListener("click", toggleTaskMenu);

addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text === "") return;

  addTask(text);
  renderBoard(tasks);
  taskInput.value = "";

  taskMenu.classList.remove("visible");
});
