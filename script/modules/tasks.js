export function generateId() {
  return Math.random().toString().substring(2, 10);
}

export function getTaskClass(done) {
  return done? 'table-success' : 'table-light';
}

export function renderTask(task) {
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

export function renderTable(tasks, container) {
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