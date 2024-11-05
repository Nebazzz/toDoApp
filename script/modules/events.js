import { getTaskClass, renderTable } from './tasks.js';
import { saveToLocalStorage } from './storage.js';

export function controlEvents(container, tasks, taskInput, form, userName) {
  container.addEventListener('click', (e) => {
    const action = e.target.dataset.action;

    if (action === 'delete' || action === 'done') {
      const parentNode = e.target.closest('tr');
      const id = parentNode.id;

      if (action === 'delete') {
        // Уточняем у пользователя, хочет ли он удалить задачу
        const confirmDelete = confirm("Вы действительно хотите удалить эту задачу?");
        if (!confirmDelete) return;
    
        const id = parentNode.id;
        const index = tasks.findIndex((task) => task.id === id);
        tasks.splice(index, 1); // Удаляем задачу из массива tasks
    
        saveToLocalStorage(tasks, userName);
    
        parentNode.remove();
        // Если задач больше нет, удаляем всю таблицу
        if (parentNode.parentNode && parentNode.parentNode.children.length === 0) {
          parentNode.parentNode.parentNode.remove();
        }
    
        tasks.forEach((task, index) => { task.index = index + 1; }); // Обновляем индекс задачи
    
        renderTable(tasks, container); // Отрисовываем таблицу заново
      }

      if (action === 'done') {
        const task = tasks.find((task) => task.id === id);
        task.done =!task.done;

        saveToLocalStorage(tasks, userName);

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