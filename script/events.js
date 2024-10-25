import { getTaskClass, renderTable } from './tasks.js';
import { saveToLocalStorage } from './storage.js';

export function controlEvents(container, tasks, taskInput, form) {
  container.addEventListener('click', (e) => {
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
  });

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