import { renderTable } from './tasks.js';

export function saveToLocalStorage(tasks, userName) {
  const data = {
    tasks,
  };
  localStorage.setItem(userName, JSON.stringify(data));
}

export function loadFromLocalStorage(container, userName) {
  const data = JSON.parse(localStorage.getItem(userName));
  const tasks = data.tasks;

  renderTable(tasks, container);
}