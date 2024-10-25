export function renderForm(container) {
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