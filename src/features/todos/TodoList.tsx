import { useQuery, useMutation,useQueryClient } from "@tanstack/react-query"
import { getTodos, addTodo, updateTodo, deleteTodo } from "../../api/todosApi"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faUpload } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { todo } from "../../type/todo"


const TodoList = () => {
  const [newTodo, setNewTodo] = useState('')
  const queryClient = useQueryClient()

  const { 
      isLoading, 
      isError, 
      error,
      data: todos
    } = useQuery({
    queryKey: ['todos'], 
    queryFn: getTodos,
    select: data => data.sort(
        (a:todo, b:todo) => {
            if(a.id && b.id){
                return b.id -a.id
            }
        }),
  })
  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
  })
  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
  })
  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
  })

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    addTodoMutation.mutate({userId: 1, title: newTodo, completed: false})
    setNewTodo('')
  }

  const newItemSection = (
    <form onSubmit={handleSubmit}>
      <label htmlFor="new-todo">Enter a new todo item</label>
      <div className="new-todo">
        <input
          type="text"
          id="new-todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit">
        <FontAwesomeIcon icon={faUpload}/>
      </button>
    </form>
  )

  let content
  if(isLoading) {
    content = <p>Loading...</p>
  }else if(isError && error instanceof Error) {
    content = <p>{error.message}</p>
  } else {
    content = todos.map((todo:todo) => {
        return (
            <article key={todo.id}>
                <div className="todo">
                    <input
                        type="checkbox"
                        checked={todo.completed}
                        id={todo.id}
                        onChange={() =>
                            updateTodoMutation.mutate({ ...todo, completed: !todo.completed })
                        }
                    />
                    <label htmlFor={todo.id}>{todo.title}</label>
                </div>
                <button className="trash" onClick={() => deleteTodoMutation.mutate( todo )}>
                    <FontAwesomeIcon icon={faTrash} />
                </button>
            </article>
        )
    })
  }
  return (
    <main>
        <h1>Todo List</h1>
        {newItemSection}
        {content}
    </main>
  )
}

export default TodoList