// ============================================
// TODO GROUP TYPES
// ============================================

export interface TodoGroup {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// TODO TYPES
// ============================================

export interface Todo {
  id: string;
  user_id: string;
  application_id?: string;
  group_id?: string;
  title: string;
  description?: string;
  completed: boolean;
  completed_at?: string;
  priority: number;
  due_date?: string;
  due_time?: string;
  reminder_at?: string;
  should_carry_over: boolean;
  is_recurring: boolean;
  recurrence_rule?: RecurrenceRule;
  notify: boolean;
  notify_minutes_before?: number;
  created_at: string;
  updated_at: string;
  // Joined fields
  group_name?: string;
  group_color?: string;
  company_name?: string;
  role_title?: string;
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "custom";
  days?: string[];        // ["monday", "wednesday"]
  day_of_month?: number;
  dates?: string[];       // ["2026-03-10"]
  time?: string;          // "09:00"
}

export interface CreateTodoData {
  application_id?: string;
  group_id?: string;
  title: string;
  description?: string;
  priority?: number;
  due_date?: string;
  due_time?: string;
  reminder_at?: string;
  should_carry_over?: boolean;
  is_recurring?: boolean;
  recurrence_rule?: RecurrenceRule;
  notify?: boolean;
  notify_minutes_before?: number;
}

export interface TodoFilters {
  completed?: boolean;
  application_id?: string;
  group_id?: string;
  due_date?: string;
  due_before?: string;
  due_after?: string;
  search?: string;
  include_reminders?: boolean;
}

// ============================================
// TODO GROUP API
// ============================================

export async function createTodoGroup(name: string, color?: string) {
  return request<TodoGroup>("/todo-groups", {
    method: "POST",
    body: JSON.stringify({ name, color }),
  });
}

export async function getTodoGroups() {
  return request<TodoGroup[]>("/todo-groups");
}

export async function updateTodoGroup(groupId: string, data: { name?: string; color?: string }) {
  return request<TodoGroup>(`/todo-groups/${groupId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteTodoGroup(groupId: string) {
  return request<void>(`/todo-groups/${groupId}`, {
    method: "DELETE",
  });
}

// ============================================
// TODO API
// ============================================

export async function createTodo(data: CreateTodoData) {
  return request<Todo>("/todos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTodos(filters?: TodoFilters) {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.completed !== undefined) params.set("completed", String(filters.completed));
    if (filters.application_id) params.set("application_id", filters.application_id);
    if (filters.group_id) params.set("group_id", filters.group_id);
    if (filters.due_date) params.set("due_date", filters.due_date);
    if (filters.due_before) params.set("due_before", filters.due_before);
    if (filters.due_after) params.set("due_after", filters.due_after);
    if (filters.search) params.set("search", filters.search);
    if (filters.include_reminders) params.set("include_reminders", "true");
  }
  const query = params.toString();
  return request<Todo[]>(`/todos${query ? `?${query}` : ""}`);
}

export async function getTodosForDate(date: string) {
  return request<Todo[]>(`/todos/date/${date}`);
}

export async function updateTodo(todoId: string, data: Partial<CreateTodoData> & { completed?: boolean }) {
  return request<Todo>(`/todos/${todoId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function toggleTodo(todoId: string) {
  return request<Todo>(`/todos/${todoId}/toggle`, {
    method: "PATCH",
  });
}

export async function deleteTodo(todoId: string) {
  return request<void>(`/todos/${todoId}`, {
    method: "DELETE",
  });
}

// ============================================
// HELPERS
// ============================================

export const PRIORITIES = [
  { value: 1, label: "Urgent", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  { value: 2, label: "High", color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { value: 3, label: "Medium", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  { value: 4, label: "Low", color: "text-zinc-400", bg: "bg-zinc-500/10", border: "border-zinc-500/30" },
] as const;

export const PRIORITY_MAP = Object.fromEntries(
  PRIORITIES.map((p) => [p.value, p])
) as Record<number, (typeof PRIORITIES)[number]>;