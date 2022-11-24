import axios from "axios";
import { todo } from "../type/todo";

const todosApi = axios.create({
    baseURL: "http://localhost:3500"
})

export const getTodos = async () => {
    const response = await todosApi.get("/todos")
    return response.data
}

export const addTodo = async (todo:todo) => {
    return await todosApi.post("/todos", todo)
}

export const updateTodo = async (todo:todo) => {
    return await todosApi.patch(`/todos/${todo.id}`, todo)
}

export const deleteTodo = async (todo: todo) => {
    return await todosApi.delete(`/todos/${todo.id}`, todo.id)
}

export default todosApi