// Функция генерации уникального идентификатора
const generateId = () => Math.random().toString().substring(2, 10);

// Функция отрисовки таблицы задач
function renderTable(tasks, container) {
  const tableWrapper = container.querySelector('.table-wrapper');
  let tbodyHTML = '';

  tasks.forEach((task, index) => {
    task.index = index + 1;
    tbodyHTML += renderTask(task);
  });

  const tableHTML = `
    <div class="table-wrapper">
      <table class="table table-hover table-bordered">
        <thead>
          <tr>
            <th>№</th>
            <th>Задача</th>
            <th>Статус</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          ${tbodyHTML}
        </tbody>
      </table>
    </div>`;

  if (tableWrapper) {
    tableWrapper.innerHTML = tableHTML;
  } else {
    container.insertAdjacentHTML('beforeend', tableHTML);
  }
}

// Функция рендера строки с задачей
function renderTask(task) {
  const cssClass = getTaskClass(task.done);

  return `
    <tr class="${cssClass}" id="${task.id}">
      <td>${task.index}</td>
      <td class="task ${task.done? 'text-decoration-line-through' : ''}">
        ${task.text}
      </td>
      <td>${task.done? 'Выполнена' : 'В процессе'}</td>
      <td>
        <button class="btn btn-danger" type="button" data-action="delete">
          Удалить
        </button>
        <button class="btn btn-success" type="button" data-action="done" ${task.done? 'disabled' : ''}>
          Завершить
        </button>
      </td>
    </tr>`;
}

// Функция управления задачами (удаление и завершение)
function controlTaskActions(e, tasks, container) {
  const action = e.target.dataset.action;

  if (action === 'delete' || action === 'done') {
    const parentNode = e.target.closest('tr');
    const id = parentNode.id; // Переводим строку в число

    if (action === 'delete') {
      // Уточняем у пользователя, хочет ли он удалить задачу
      const confirmDelete = confirm("Вы действительно хотите удалить эту задачу?");
      if (!confirmDelete) return;

      tasks = tasks.filter((task) => task.id!== id);
      saveToLocalStorage(tasks);

      parentNode.remove();
      // Если задач больше нет, удаляем всю таблицу
      if (parentNode.parentNode.children.length === 0) {
        parentNode.parentNode.parentNode.remove();
      }
    }

    if (action === 'done') {
      const task = tasks.find((task) => task.id === id);
      task.done =!task.done;

      saveToLocalStorage(tasks);

      parentNode.className = getTaskClass(task.done);
      const taskElement = parentNode.querySelector('.task');
      taskElement.classList.toggle('text-decoration-line-through');
      const statusElement = parentNode.querySelector('td:nth-child(3)');
      statusElement.textContent = task.done? 'Выполнена' : 'В процессе';

      e.target.disabled = task.done; // Деактивация кнопки "Завершить"
    }

    renderTable(tasks, container);
  }
}

// Функция отрисовки формы для добавления задач
function renderForm(container) {
  const formHTML = `
    <form id="form" class="form d-flex align-items-center mb-3">
      <label class="form-group me-3 mb-0">
        <input type="text" class="form-control" placeholder="ввести задачу">
      </label>
      <button class="btn btn-primary me-3" type="submit" disabled>Сохранить</button>
      <button class="btn btn-warning" type="reset" disabled>Очистить</button>
    </form>`;

  container.insertAdjacentHTML('beforeend', formHTML);
}

// Функция добавления задачи
function addTask(e, tasks, container) {
  e.preventDefault();

  const taskInput = document.querySelector('.form-control');
  const taskText = taskInput.value.trim();

  if (!taskText) return; // Пропускаем пустые задачи

  const newTask = {
    id: generateId(),
    text: taskText,
    done: false,
  };

  tasks.push(newTask);

  saveToLocalStorage(tasks);

  taskInput.value = '';
  taskInput.focus();

  renderTable(tasks, container);
}

// Функция сохранения задач в localStorage
function saveToLocalStorage(tasks) {
  const data = {
    tasks,
  };
  localStorage.setItem(userName, JSON.stringify(data));
}

// Функция загрузки задач из localStorage
function loadFromLocalStorage(container) {
  const data = JSON.parse(localStorage.getItem(userName));
  const tasks = data.tasks;

  renderTable(tasks, container);
}

// Функция для обновления класса строки
function getTaskClass(done) {
  return done? 'table-success' : 'table-light';
}

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
    loadFromLocalStorage(container);
  }

  const form = document.querySelector('#form');
  const taskInput = document.querySelector('.form-control');

  form.addEventListener('submit', (e) => addTask(e, tasks, container));

  container.addEventListener('click', (e) => controlTaskActions(e, tasks, container));

  taskInput.addEventListener('input', function() {
    const taskText = taskInput.value.trim();

    if (taskText) {
      document.querySelector('.btn-primary').disabled = false;
      document.querySelector('.btn-warning').disabled = false;
    } else {
      document.querySelector('.btn-warning').disabled = true;
    }
  });

  form.addEventListener('reset', function() {
    document.querySelector('.btn-primary').disabled = true;
    document.querySelector('.btn-warning').disabled = true;
  });
}