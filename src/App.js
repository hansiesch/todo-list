import TodoList from "./TodoList.js";
import TodoListItemStatus from "./TodoListItemStatus.js";

const list = new TodoList(".todo-list");
console.log(list);

document.querySelector('.hide-cancelled').onclick = event => {
  list.items.forEach(item => {
    if (item.status === TodoListItemStatus.CANCELLED) {
      item.isVisible = !item.isVisible;
    }
  });
};
