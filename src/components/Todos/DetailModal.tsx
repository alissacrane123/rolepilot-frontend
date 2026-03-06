import type { Todo, CreateTodoData, TodoGroup } from "@/lib/types/todos";
import { Toggle } from "./helpers";
import InputField from "../common/InputField";
import InputLabel from "../common/InputLabel";
import { useDetailModalForm } from "./hooks/useDetailModalForm";
import {
  PriorityPicker,
  GroupSelector,
  ApplicationLinkSelector,
} from "./components";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import TrashButton from "@/components/common/TrashButton";

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
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Configure
            <TrashButton onClick={form.handleDeleteAndClose} size={4} />
          </DialogTitle>
          {todo.company_name && (
            <DialogDescription>
              {todo.company_name} &middot; {todo.role_title}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogBody>
          <InputField
            value={form.title}
            onChange={form.setTitle}
            placeholder="Task title"
            label="Task"
          />

          <InputField
            isTextarea
            value={form.description}
            onChange={form.setDescription}
            placeholder="Add a description... (optional)"
          />

          <div className="h-px bg-white/[0.06]" />

          <div className="grid grid-cols-2 gap-3">
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

          <div>
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

          <div>
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

          <div className="h-px bg-white/[0.06]" />

          <Toggle
            checked={form.isRecurring}
            onChange={form.setIsRecurring}
            label="Recurring"
          />
        </DialogBody>

        <DialogFooter>
          <Button
            variant="primary"
            className="w-full disabled:opacity-40"
            onClick={form.handleSave}
            disabled={form.isSaveDisabled}
            aria-label="Save changes"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
