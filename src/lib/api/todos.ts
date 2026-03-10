import type { CreateTodoData, Todo, TodoFilters } from "@/lib/types/todos";
import { request } from "@/lib/api/helpers";
import type { TodoGroup } from "@/lib/types/todos";

export type { TodoGroup, Todo, CreateTodoData, TodoFilters };

export const PRIORITIES = [
  {
    value: 1,
    label: "Urgent",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
  },
  {
    value: 2,
    label: "High",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
  },
  {
    value: 3,
    label: "Medium",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
  },
  {
    value: 4,
    label: "Low",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/30",
  },
] as const;

export const PRIORITY_MAP = Object.fromEntries(
  PRIORITIES.map((p) => [p.value, p]),
) as Record<number, (typeof PRIORITIES)[number]>;

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
    if (filters.completed !== undefined)
      params.set("completed", String(filters.completed));
    if (filters.application_id)
      params.set("application_id", filters.application_id);
    if (filters.group_id) params.set("group_id", filters.group_id);
    if (filters.due_date) params.set("due_date", filters.due_date);
    if (filters.due_before) params.set("due_before", filters.due_before);
    if (filters.due_after) params.set("due_after", filters.due_after);
    if (filters.search) params.set("search", filters.search);
    if (filters.include_reminders) params.set("include_reminders", "true");
  }
  const query = params.toString();
  // return request<Todo[]>(`/todos`);
  return request<Todo[]>(`/todos${query ? `?${query}` : ""}`);
}

export async function getTodosForDate(date: string) {
  return request<Todo[]>(`/todos/date/${date}`);
}

export async function updateTodo(
  todoId: string,
  data: Partial<CreateTodoData> & { completed?: boolean },
) {
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
// TODO GROUP API
// ============================================

export async function createTodoGroup(data: { name: string; color: string }) {
  return request<TodoGroup>("/todo-groups", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getTodoGroups() {
  return request<TodoGroup[]>("/todo-groups");
}

export async function updateTodoGroup(
  groupId: string,
  data: { name?: string; color?: string },
) {
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

var removeDuplicates = function (nums) {
  let lastUniqueIndex = 0;
  const dupIndexes = [];

  for (let i = 1; i < nums.length; i++) {
    const prev = nums[lastUniqueIndex];
    const curr = nums[i];
    if (prev === curr) {
      nums[i] = "_";
      dupIndexes.push(i);
    }
  }
  let i = 0;
  let currentDupIndex = dupIndexes[i];
  let j = currentDupIndex;

  // console.log(dupIndexes)
  while (j < nums.length) {
    let nextItem = nums[j + 1];
    if (nextItem !== "_") {
      console.log(nextItem);
      nums[currentDupIndex] = nextItem;
      nums[j + 1] = "_";
      i++;
      j = dupIndexes[i];
    } else {
      j++;
    }
  }

  let last = nums.length - 1;
  while (last > 0) {
    // console.log(nums, last)
    if (nums[last] === "_") {
      nums.pop();
      last = nums.length - 1;
      if (last === 0) {
        return nums;
      }
    } else {
      console.log(nums);
      last = 0;
      return nums;
    }
  }

  console.log(nums);
  return nums;
};
