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

      const completeClass = todo.complete ? 'line-through' : ''

      return `<li class="list-group-item todo-item">
     <span class="${completeClass}">${todo.text}</span>
     <input  data-id= "${todo.id}" type="text" class="edit" style="display: none;">
     <button data-id= "${todo.id}" class="delete btn btn-danger">x</button>
     <button data-id= "${todo.id}" data-complete="${todo.complete}"class="complete btn btn-primary">✓</button>
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

   const updateTodo = newTodo => {
    fetch(`/api/todos/${newTodo.id}`, {
      method: 'PUT'
    })
    .then(getTodos)
    .catch(err => console.error(err))
  }

  todoListSpan.addEventListener('click', e => {
    const target = e.target
    const id = target.getAttribute('.data-id')
    if (e.target.mathces('.delete')){
      deleteTodo(id)
    }else if (target.matches('.complete')){
    const complete = JSON.parse(target.getAttribute('data-complete'))
      const newTodo = {
        id,
        complete: !complete
      }

      updateTodo(newTodo)
    } else if (target.matches('span')){
      const input = target.nextElementSibling
      input.value = target.innertext
      input.style.display = 'block'
      target.style.display = 'none'
    }
  })


  todoListSpan.addEventListener('keyup', e => {
   if ( e.keycoded === 13){
     const newTodo = {
       id: e.target.getAttribute('data-id'),
      text: e.target.value
     }
     updateTodo(newTodo)
   }
  })

  todoListSpan.addEventListener('blur', e => {
    if (e.target.matches('input')){
      const span = e.target.previousElementSibling
      e.target.value = span.innertext
      span.style.display = 'block'
      e.target.style.display = 'none'
    }
  }, true)

  getTodos()
});