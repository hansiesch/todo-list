import TodoListItem from "./TodoListItem.js";

export default class TodoList {
  constructor(cssSelector) {
    this.items = [];
    this.root = this.generateRoot(document.querySelector(cssSelector));

    this.initListeners();
  }

  addItem(str) {
    return new TodoListItem(str, 'li');
  }

  generateRoot(parentElement) {
    const el = document.createElement("ul");

    el.style.listStyle = "none";

    parentElement.appendChild(el);

    this.generateInputControls(parentElement);

    return el;
  }

  generateInputControls(parentElement) {
    const wrapper = document.createElement('form');
    wrapper.classList.add('controls');

    const inputElement = document.createElement('input');
    inputElement.type = 'text';
    inputElement.required = true;
    inputElement.name = 'new-item';
    inputElement.placeholder = 'New Todo Item';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.innerText = 'Create New Item';

    this.form = wrapper;

    wrapper.appendChild(inputElement);
    wrapper.appendChild(submitButton);

    parentElement.appendChild(wrapper);
  }

  initListeners() {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      event.stopPropagation();

      const itemEl = this.addItem(event.target.elements['new-item'].value);

      this.items.push(itemEl);

      this.root.appendChild(itemEl.html);

      this.form.reset();
    });
  }
}
