const generateId = () => Math.random().toString().substring(2, 10);

const userName = prompt("Пожалуйста, введите ваше имя:");

if (!userName) {
  alert("Имя пользователя обязательно!");
} else {
  const container = document.querySelector(".app-container");

  const createTodoApp = () => {
    container.className = 'app-container vh-100 w-100 d-flex align-items-center justify-content-center flex-column';

    const mainTitle = document.createElement("h3");
    mainTitle.textContent = 'Todo App';
    container.appendChild(mainTitle);

    const formElement = document.createElement("form");
    formElement.id = 'form';
    formElement.className = 'form d-flex align-items-center mb-3';
    container.appendChild(formElement);

    const formLabelElement = document.createElement("label");
    formLabelElement.className = 'form-group me-3 mb-0';
    formElement.appendChild(formLabelElement);

    const inputFormElement = document.createElement("input");
    inputFormElement.className = 'form-control';
    inputFormElement.type = 'text';
    inputFormElement.placeholder = 'ввести задачу';
    formLabelElement.appendChild(inputFormElement);

    const submitButtonFormElement = document.createElement('button');
    submitButtonFormElement.className = 'btn btn-primary me-3';
    submitButtonFormElement.type = 'submit';
    submitButtonFormElement.disabled = true;
    submitButtonFormElement.textContent = 'Сохранить';
    formElement.appendChild(submitButtonFormElement);

    const resetButtonFormElement = document.createElement('button');
    resetButtonFormElement.className = 'btn btn-warning';
    resetButtonFormElement.type = 'reset';
    resetButtonFormElement.disabled = true;
    resetButtonFormElement.textContent = 'Очистить';
    formElement.appendChild(resetButtonFormElement);

    return { inputFormElement, submitButtonFormElement, resetButtonFormElement };
  };

  const { inputFormElement, submitButtonFormElement, resetButtonFormElement } = createTodoApp();

  const form = document.querySelector('#form');

  const taskInput = document.querySelector('.form-control');

  let tasks = [];

  if (localStorage.getItem(userName)) {
    const data = JSON.parse(localStorage.getItem(userName));
    tasks = data.tasks;
    loadFromLocalStorage(data);
  }

  form.addEventListener('submit', addTask);

  container.addEventListener('click', controlTaskActions);

  inputFormElement.addEventListener('input', function() {
    const taskText = inputFormElement.value.trim();

    if (taskText) {
      submitButtonFormElement.disabled = false;
      resetButtonFormElement.disabled = false;
    } else {
      resetButtonFormElement.disabled = true;
    }
  });

  form.addEventListener('reset', function() {
    submitButtonFormElement.disabled = true;
    resetButtonFormElement.disabled = true;
  });

  // Функция добавления задачи и отрисовки таблицы
  function addTask(e) {
    e.preventDefault();
  
    const taskText = taskInput.value.trim();
    if (!taskText) return; // Пропускаем пустые задачи
  
    const newTask = {
      id: generateId(),
      text: taskText,
      done: false,
    };
  
    tasks.push(newTask);
  
    saveToLocalStorage();
  
    renderTable(tasks);

    taskInput.value = '';
    taskInput.focus();
  }

  // Функция для обновления класса строки
  function getTaskClass(done) {
    return done ? 'table-success' : 'table-light';
  }

  // Функция управления задачами (удаление и завершение)
  function controlTaskActions(e) {
    const action = e.target.dataset.action;

    if (action === 'delete' || action === 'done') {
      const parentNode = e.target.closest('tr');
      const tableWrapper = container.querySelector('.table-wrapper');
      const tbody = tableWrapper.querySelector('tbody');
      const id = parentNode.id; // Переводим строку в число

      if (action === 'delete') {
      // Уточняем у пользователя, хочет ли он удалить задачу
      const confirmDelete = confirm("Вы действительно хотите удалить эту задачу?");
      if (!confirmDelete) return;
        // Удаляем задачу через фильтрацию массива tasks
        tasks = tasks.filter((task) => task.id !== id);

        // Сохраняем массив задач в localStorage
        saveToLocalStorage(true);

        // Удаляем строку задачи из разметки
        parentNode.remove();
        // Если задач больше нет, удаляем всю таблицу
        if (tbody.children.length === 0) {
          tableWrapper.remove();
        }
      }

      if (action === 'done') {
        const task = tasks.find((task) => task.id === id);
        task.done = !task.done;

        // Сохраняем массив задач в localStorage
        saveToLocalStorage(true);

        // Обновляем класс строки
        parentNode.className = getTaskClass(task.done);
        const taskElement = parentNode.querySelector('.task');
        taskElement.classList.toggle('text-decoration-line-through');
        const statusElement = parentNode.querySelector('td:nth-child(3)');
        statusElement.textContent = task.done ? 'Выполнена' : 'В процессе';

        e.target.disabled = task.done; // Деактивация кнопки "Завершить"
      }
    }
  }

  // Функция сохранения задач в localStorage
  function saveToLocalStorage() {
    const data = {
      tasks,
    };
    localStorage.setItem(userName, JSON.stringify(data));
  }

  // Функция загрузки задач из localStorage
  function loadFromLocalStorage() {
    renderTable(tasks);
  }

  // Функция рендера строки с задачей
  function renderTask(task) {
    const cssClass = getTaskClass(task.done);
  
    return `
      <tr class="${cssClass}" id="${task.id}">
        <td>${task.index}</td>
        <td class="task ${task.done ? 'text-decoration-line-through' : ''}">
          ${task.text}
        </td>
        <td>${task.done ? 'Выполнена' : 'В процессе'}</td>
        <td>
          <button class="btn btn-danger" type="button" data-action="delete">
            Удалить
          </button>
          <button class="btn btn-success" type="button" data-action="done" ${task.done ? 'disabled' : ''}>
            Завершить
          </button>
        </td>
      </tr>`;
  }

  // Функция рендера всей таблицы
  function renderTable(tasks) {
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
}