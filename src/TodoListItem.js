import TodoListItemStatus from "./TodoListItemStatus.js";
import { isBoolean, isValueOf, uuidv4 } from "./Utils.js";

export default class TodoListItem {
  #item = '';
  #status = TodoListItemStatus.PENDING;
  #isVisible = true;
  #id = null;
  #rootElement = null;
  #controls = {
    editBtn: null,
    cancelBtn: null,
    doneBtn: null,
  };
  baseElTag = 'li';

  #tempDisplay;

  constructor(item, baseTag) {
    this.#id = uuidv4();
    this.#item = item;
    this.baseElTag = baseTag;
  }

  /**
   * Return the HTML Nodes needed to add this TodoListItem to the DOM.
   */
  get html() {
    if (this.#rootElement) {
      return this.#rootElement;
    }

    const baseEl = document.createElement(this.baseElTag);

    baseEl.dataset.todoStatus = this.#status;
    baseEl.dataset.todoId = this.#id;
    baseEl.innerText = this.#item;

    baseEl.appendChild(this.buildControlElements());

    this.#rootElement = baseEl;

    return baseEl;
  }

  /**
   * Return a JSON representation of this TodoListItem.
   */
  // get json() {
  //   return JSON.stringify({
  //     item: this.item,
  //     status: this.status,
  //   })
  // }

  get id() {
    return this.#id;
  }

  /**
   * Set visibility of this TodoListItem. This will hide all Nodes in the DOM that
   * are associated with this TodoListItem using CSS Display property set to 'none'.
   */
  set isVisible(val) {
    if (!isBoolean(val)) {
      throw new Error(`${val} is not a valid Boolean value.`);
    }

    if (val) {
      this.#rootElement.style.display = this.#tempDisplay;
    } else {
      this.#tempDisplay = this.#rootElement.style.display;
      this.#rootElement.style.display = 'none';
    }

    this.#isVisible = val;
  }

  /**
   * Boolean value indicating whether or not this TodoListItem is currently visible
   * in the DOM.
   */
  get isVisible() {
    return this.#isVisible;
  }

  /**
   * Set status for the current TodoListItem.
   */
  set status(val) {
    if (!isValueOf(TodoListItemStatus, val)) {
      throw new Error(`${val} is not a valid TodoListItemStatus`);
    }

    if (this.#rootElement) {
      this.#rootElement.dataset.todoStatus = val;
    }

    this.#status = val;
  }

  /**
   * Get the status of this TodoListItem.
   */
  get status() {
    return this.#status;
  }

  /**
   * Build up the controls section for this TodoListItem.
   * Will return HTMLElements with the following structure, with listeners
   * attached for functionality:
   * <div class="controls">
   *   <button class="button-status">Mark as Pending</button>
   *   <button class="button-cancel">Cancel</button>
   *   <button class="button-edit" style="display: initial">Edit</button>
   * </div>
   *
   * @returns HtmlNodes for the controls associated with this TodoListItem.
   */
  buildControlElements() {
    const wrapperEl = document.createElement('div');
    wrapperEl.classList.add('controls');

    const doneBtnEl = document.createElement('button');
    doneBtnEl.innerText = 'Mark as Done';
    doneBtnEl.classList.add('button-status');
    doneBtnEl.onclick = event => {
      const target = event.target;

      if (this.status === TodoListItemStatus.DONE) {
        this.status = TodoListItemStatus.PENDING;
        target.innerText = 'Mark as Done';
        return;
      }

      this.status = TodoListItemStatus.DONE;
      target.innerText = 'Mark as Pending';
    };

    const cancelBtnEl = document.createElement('button');
    cancelBtnEl.innerText = 'Cancel';
    cancelBtnEl.classList.add('button-cancel');
    cancelBtnEl.onclick = event => {
      this.status = TodoListItemStatus.CANCELLED;

      doneBtnEl.innerText = 'Mark as Pending';
    };

    const editBtnEl = document.createElement('button');
    editBtnEl.innerText = 'Edit';
    editBtnEl.classList.add('button-edit');
    editBtnEl.onclick = event => {
      this.#rootElement.appendChild(this.buildEditForm());
      editBtnEl.style.display = 'none';
    };

    wrapperEl.appendChild(doneBtnEl);
    wrapperEl.appendChild(cancelBtnEl);
    wrapperEl.appendChild(editBtnEl);

    this.#controls.editBtn = editBtnEl;
    this.#controls.cancelBtn = cancelBtnEl;
    this.#controls.doneBtn = doneBtnEl;

    return wrapperEl;
  }

  /**
   * Called when the 'Cancel' button is clicked. Updates the TodoListItem status
   * to 'CANCELLED'.
   */
  onCancelHandler() {
    if (this.#rootElement) {
      this.#rootElement.parentNode.removeChild(this.#rootElement);
    }

    this.status = TodoListItemStatus.DESTROYED;
  }

  /**
   * Build up the HTMLElements to add the Edit form for this TodoListItem to the DOM.
   * Form has a listener for onsubmit to update the TodoListItem.
   * Built up structure:
   * <form class="todo-edit-form">
   *   <input type="text" required="" name="item">
   *   <button type="submit">Save</button>
   * </form>
   *
   * @returns HTMLElements for the edit form.
   */
  buildEditForm() {
    const formEl = document.createElement('form');
    formEl.classList.add('todo-edit-form');
    formEl.onsubmit = this.onEditFormSubmit.bind(this);

    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.required = true;
    inputEl.name = 'item';
    inputEl.value = this.#item;

    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.innerText = 'Save';

    formEl.appendChild(inputEl);
    formEl.appendChild(saveBtn);

    return formEl;
  }

  /**
   * Handle the edit form submit, update the TodoListItem's #item property, delete
   * the edit form and display the Edit button again.
   *
   * @param {SubmitEvent} event SubmitEvent that's triggered by the Edit Form submit.
   */
  onEditFormSubmit(event) {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const itemInput = Array.from(form.elements).find(element => element.name === 'item');

    this.#item = itemInput.value;

    // First child will be a text node.
    this.#rootElement.firstChild.textContent = this.#item;

    this.#controls.editBtn.style.display = 'initial';
    this.#rootElement.removeChild(form);
  }
}