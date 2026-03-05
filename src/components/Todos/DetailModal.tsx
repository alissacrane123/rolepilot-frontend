import type { Todo, CreateTodoData, TodoGroup } from "@/lib/types/todos";
import { Toggle } from "./helpers";
import { Textarea } from "@/components/ui/textarea";
import InputField from "../common/InputField";
import InputLabel from "../common/InputLabel";
import { useDetailModalForm } from "./hooks/useDetailModalForm";
import {
  ModalHeader,
  PriorityPicker,
  GroupSelector,
  ApplicationLinkSelector,
} from "./components";

interface DetailModalProps {
  todo: Todo;
  groups: TodoGroup[];
  onClose: () => void;
  onSave: (id: string, data: Partial<CreateTodoData>) => void;
  onDelete: (id: string) => void;
}

export default function DetailModal({
  todo,
  groups,
  onClose,
  onSave,
  onDelete,
}: DetailModalProps): React.JSX.Element {
  const form = useDetailModalForm({ todo, groups, onSave, onDelete, onClose });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />

      <div className="relative w-[500px] max-h-[88vh] overflow-y-auto bg-[#0f0f1a] border border-[#1e1e2e] rounded-2xl p-7 shadow-2xl z-10">
        <ModalHeader
          companyName={todo.company_name}
          roleTitle={todo.role_title}
          onDelete={form.handleDeleteAndClose}
          onClose={onClose}
        />

        <InputField
          value={form.title}
          onChange={form.setTitle}
          placeholder="Task title"
          className="mb-2.5"
          label="Task"
        />

        <Textarea
          value={form.description}
          onChange={(e) => form.setDescription(e.target.value)}
          placeholder="Add a description... (optional)"
          rows={2}
        />

        <div className="h-px bg-white/[0.06] mb-5" />

        <div className="grid grid-cols-2 gap-3 mb-5">
          <InputField
            type="date"
            value={form.dueDate}
            onChange={form.setDueDate}
            label="Due Date"
          />
          <InputField
            type="time"
            value={form.dueTime}
            onChange={form.setDueTime}
            label="Due Time"
          />
        </div>

        <PriorityPicker
          priority={form.priority}
          onChangePriority={form.setPriority}
        />

        <div className="mb-5">
          <InputLabel label="Group" />
          <GroupSelector
            groupId={form.groupId}
            groups={groups}
            linkedGroup={form.linkedGroup}
            isOpen={form.isGroupSelectOpen}
            setIsOpen={form.setIsGroupSelectOpen}
            newGroupName={form.newGroupName}
            setNewGroupName={form.setNewGroupName}
            selectedColorIndex={form.selectedColorIndex}
            setSelectedColorIndex={form.setSelectedColorIndex}
            newGroupInputRef={form.newGroupInputRef}
            isCreatePending={form.isCreateGroupPending}
            onSelectGroup={form.handleSelectGroup}
            onCreateGroup={form.handleCreateGroup}
          />
        </div>

        <div className="mb-5">
          <InputLabel label="Link to Application">
            Link to Application{" "}
            <span className="text-white/15 normal-case font-normal">
              — optional
            </span>
          </InputLabel>
          <ApplicationLinkSelector
            linkedApp={form.linkedApp}
            isOpen={form.isAppSelectOpen}
            setIsOpen={form.setIsAppSelectOpen}
            appSearch={form.appSearch}
            setAppSearch={form.setAppSearch}
            appSearchRef={form.appSearchRef}
            filteredApps={form.filteredApps}
            onSelectApp={form.handleSelectApp}
            onClearApp={form.handleClearApp}
          />
        </div>

        <div className="h-px bg-white/[0.06] mb-5" />

        <div className="flex flex-col gap-3.5 mb-5">
          <Toggle
            checked={form.isRecurring}
            onChange={form.setIsRecurring}
            label="Recurring"
          />
        </div>

        <button
          onClick={form.handleSave}
          aria-label="Save changes"
          className={`w-full py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
            form.isSaveDisabled
              ? "bg-white/[0.04] text-white/20 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-500"
          }`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
