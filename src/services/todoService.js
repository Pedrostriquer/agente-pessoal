import { apiRequest } from './api';

export const getTodoList = async () => {
  // GET /todo
  return apiRequest('/todo', { method: 'GET' });
};

export const createTodo = async (task, deadline = null) => {
  // POST /todo - Body: { task, deadline }
  return apiRequest('/todo', {
    method: 'POST',
    body: JSON.stringify({ task, deadline })
  });
};

export const toggleTodoStatus = async (id, isDone) => {
  // PATCH /todo/:id - Body: { done: boolean }
  return apiRequest(`/todo/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ done: isDone })
  });
};

export const removeTodo = async (id) => {
  // DELETE /todo/:id
  return apiRequest(`/todo/${id}`, { method: 'DELETE' });
};