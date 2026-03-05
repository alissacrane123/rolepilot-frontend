export async function createTodo(data: CreateTodoData) {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}