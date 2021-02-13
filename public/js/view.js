document.addEventListener('DOMContentLoaded', (e) => {
  console.log('DOM loaded!');
  // your code here...
  const todoListSpan = document.querySelector('.todo-container')
  const form = document.getElementById('todo-form')
  const newTodoInput = document.querySelector('input.new-item')

  const getTodos = () => {
    fetch('/api/todos')
    .then(response => response.json())
    .then(todos => renderTodoList(todos))
  }

  const renderTodoList = todos => {
    const todosHTML = todos.map( todo => {
      return `<li class="list-group-item todo-item">
     <span>${todo.text}</span>
     <input type="text" class="edit" style="display: none;">
     <button data-id= "${todo.id}" class="delete btn btn-danger">x</button>
     <button data-id= "${todo.id}" class="complete btn btn-primary">✓</button>
       </li>`
       
      }).join()

      todoListSpan.innerHTML = todosHTML
  }

  const deleteTodo = id => {
    fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
    .then(getTodos)
    .catch(err => console.error(err))
  }

  form.addEventListener('submit', e => {
    e.preventDefault()
    const text = newTodoInput.value

    fetch('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json'
      }

    })
      .then(getTodos)
      .catch(err => console.error(err))
  })

  todoListSpan.addEventListener('click', e => {
    const target = e.target
    const id = target.getAttribute('.data-id')
    if (e.target.mathces('.delete')){
      deleteTodo(id)
    }
  })

  getTodos()
});