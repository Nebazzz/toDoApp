import { generateId, renderTable } from './tasks.js';
import { renderForm } from './form.js';
import { saveToLocalStorage, loadFromLocalStorage } from './storage.js';
import { controlEvents } from './events.js';

const userName = prompt("Пожалуйста, введите ваше имя:");

if (!userName) {
  alert("Имя пользователя обязательно!");
} else {
  const container = document.querySelector(".app-container");

  container.className = 'app-container vh-100 w-100 d-flex align-items-center justify-content-center flex-column';

  const mainTitle = document.createElement("h3");
  mainTitle.textContent = 'Todo App';
  container.appendChild(mainTitle);

  renderForm(container);

  let tasks = [];

  if (localStorage.getItem(userName)) {
    const data = JSON.parse(localStorage.getItem(userName));
    tasks = data.tasks;
    loadFromLocalStorage(container, userName);
  }

  const form = document.querySelector('#form');
  const taskInput = document.querySelector('.form-control');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();

    if (!taskText) return; // Пропускаем пустые задачи

    const newTask = {
      id: generateId(),
      text: taskText,
      done: false,
    };

    tasks.push(newTask);

    saveToLocalStorage(tasks, userName);

    taskInput.value = '';
    taskInput.focus();

    renderTable(tasks, container);
  });

  controlEvents(container, tasks, taskInput, form, userName);
}