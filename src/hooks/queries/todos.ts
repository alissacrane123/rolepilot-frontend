import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/helpers";
import { getTodoGroups, getTodos, getTodosForDate } from "@/lib/api/todos";
import type { TodoFilters } from "@/lib/types/todos";

export function useTodoGroupsQuery() {
  return useQuery({
    queryKey: queryKeys.todoGroups,
    queryFn: async () => {
      const res = await getTodoGroups();
      return res.data!;
    },
  });
}

export function useTodosQuery(filters?: TodoFilters) {
  return useQuery({
    queryKey: ["todos", "list", filters ?? null] as const,
    queryFn: async () => {
      const res = await getTodos(filters);
      return res.data ?? [];
    },
  });
}

export function useTodosForDateQuery(date: string) {
  return useQuery({
    queryKey: queryKeys.todos(date),
    queryFn: async () => {
      const res = await getTodosForDate(date);
      return res.data ?? [];
    },
  });
}
