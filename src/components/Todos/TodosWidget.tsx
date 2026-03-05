import { useState } from "react";
import type { Todo, CreateTodoData } from "@/lib/types/todos";
import {
  useTodoGroupsQuery,
  useTodosQuery,
  useTodosForDateQuery,
} from "@/hooks/queries/todos";
import {
  useCreateTodoMutation,
  useToggleTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from "@/hooks/mutations/todos";
import { getToday, getWeekDates } from "./dateHelpers";
import QuickAdd from "./QuickAdd";
import TodoRow from "./TodoRow";
import DetailModal from "./DetailModal";
import TodosDaySelector from "./TodosDaySelector";
import { TextTitle1 } from "../ui/text/TextTitle1";
import { TextBody } from "../ui/text/TextBody";
import TodosViewToggle from "../Dashboard/TodosViewToggle";

export default function TasksSection() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [view, setView] = useState<"Day" | "All" | "Groups">("Day");
  const [selected, setSelected] = useState<Todo | null>(null);

  const { data: groups = [] } = useTodoGroupsQuery();

  const dayQuery = useTodosForDateQuery(selectedDate);
  const allQuery = useTodosQuery();
  const groupsQuery = useTodosQuery({ completed: false });

  const activeQuery =
    view === "Day" ? dayQuery : view === "Groups" ? groupsQuery : allQuery;
  const todos = activeQuery.data ?? [];
  const loading = activeQuery.isLoading;

  const createMutation = useCreateTodoMutation();
  const toggleMutation = useToggleTodoMutation();
  const deleteMutation = useDeleteTodoMutation();
  const updateMutation = useUpdateTodoMutation();

  const addTodo = (title: string) => {
    createMutation.mutate({
      title,
      due_date: selectedDate,
      priority: 3,
    });
  };

  const toggleDone = (id: string) => {
    toggleMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const saveTodo = (id: string, data: Partial<CreateTodoData>) => {
    updateMutation.mutate({ todoId: id, data });
  };

  const pending = todos.filter((t) => !t.completed);
  const done = todos.filter((t) => t.completed);

  const weekDates = getWeekDates(10);

  return (
    <div>
      {/* header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <TextTitle1>Tasks</TextTitle1>
          <TextBody>
            {pending.length} pending · {done.length} done
          </TextBody>
        </div>

        <TodosViewToggle view={view} onChange={setView} />
      </div>

      {/* week strip */}
      {view === "Day" && (
        <TodosDaySelector
          weekDates={weekDates}
          selectedDate={selectedDate}
          todos={todos}
          setSelectedDate={setSelectedDate}
        />
      )}

      {/* list */}
      <div className="bg-white/[0.02] border border-white/[0.15] bg-white/[0.015] rounded-[10px] py-2.5 mb-6 min-h-[156px]">
        <div
          className={`px-2.5 pb-3 ${pending.length || done.length ? "border-b border-white/[0.15] bg-transparent " : ""}`}
        >
          <QuickAdd onAdd={addTodo} />
        </div>

        {loading && (
          <p className="py-8 text-center text-white/35 text-xs">
            Loading...
          </p>
        )}

        {!loading && pending.length === 0 && done.length === 0 && (
          <p className="py-8 text-center text-white/35 text-xs">
            No tasks · hit enter to add one
          </p>
        )}

        {!loading && pending.length > 0 && (
          <div className="pt-1.5">
            {pending.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={toggleDone}
                onClick={() => setSelected(todo)}
              />
            ))}
          </div>
        )}

        {!loading && done.length > 0 && (
          <div className="border-t border-white/[0.15] mt-2 pt-2">
            <p className="px-3.5 py-1 text-[10px] font-medium text-white/30 uppercase tracking-wider">
              Completed · {done.length}
            </p>
            {done.map((todo) => (
              <TodoRow
                key={todo.id}
                todo={todo}
                onToggle={toggleDone}
                onClick={() => setSelected(todo)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <DetailModal
          todo={selected}
          groups={groups}
          onClose={() => setSelected(null)}
          onSave={saveTodo}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
