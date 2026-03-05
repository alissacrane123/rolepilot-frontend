import { createTodo, createTodoGroup, deleteTodo, toggleTodo, updateTodoGroup, updateTodo, type CreateTodoData } from "@/lib/api/todos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/api/helpers";

function useInvalidateTodos() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["todos"] });
    queryClient.invalidateQueries({ queryKey: queryKeys.todoGroups });
  };
}

// TODOS

export function useCreateTodoMutation() {
  const invalidate = useInvalidateTodos();
  return useMutation({
    mutationFn: async (data: CreateTodoData) => createTodo(data),
    onSuccess: invalidate,
  });
}

export function useUpdateTodoMutation() {
  const invalidate = useInvalidateTodos();
  return useMutation({
    mutationFn: async ({ todoId, data }: { todoId: string; data: Partial<CreateTodoData> & { completed?: boolean } }) =>
      updateTodo(todoId, data),
    onSuccess: invalidate,
  });
}

export function useToggleTodoMutation() {
  const invalidate = useInvalidateTodos();
  return useMutation({
    mutationFn: async (todoId: string) => toggleTodo(todoId),
    onSuccess: invalidate,
  });
}

export function useDeleteTodoMutation() {
  const invalidate = useInvalidateTodos();
  return useMutation({
    mutationFn: async (todoId: string) => deleteTodo(todoId),
    onSuccess: invalidate,
  });
}

// TODO GROUPS

export function useCreateTodoGroupMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; color: string }) => createTodoGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todoGroups });
    },
  });
}

export function useUpdateTodoGroupMutation(groupId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string }) => updateTodoGroup(groupId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.todoGroups });
    },
  });
}
