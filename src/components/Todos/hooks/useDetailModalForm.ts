import { useState, useRef, useCallback, useMemo } from "react";
import type { Todo, CreateTodoData, TodoGroup } from "@/lib/types/todos";
import type { JobApplication } from "@/lib/types";
import { useApplicationsQuery } from "@/hooks/useApi";
import { useCreateTodoGroupMutation } from "@/hooks/mutations/todos";
import { GROUP_COLOR_PALETTE } from "../constants";

interface UseDetailModalFormParams {
  todo: Todo;
  groups: TodoGroup[];
  onSave: (id: string, data: Partial<CreateTodoData>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

interface UseDetailModalFormReturn {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  dueTime: string;
  setDueTime: (value: string) => void;
  priority: number;
  setPriority: (value: number) => void;
  groupId: string;
  applicationId: string;
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;

  isGroupSelectOpen: boolean;
  setIsGroupSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newGroupName: string;
  setNewGroupName: (value: string) => void;
  selectedColorIndex: number;
  setSelectedColorIndex: (value: number) => void;
  newGroupInputRef: React.RefObject<HTMLInputElement | null>;

  isAppSelectOpen: boolean;
  setIsAppSelectOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appSearch: string;
  setAppSearch: (value: string) => void;
  appSearchRef: React.RefObject<HTMLInputElement | null>;

  filteredApps: JobApplication[];
  linkedApp: JobApplication | undefined;
  linkedGroup: TodoGroup | undefined;

  isCreateGroupPending: boolean;
  isSaveDisabled: boolean;

  handleSave: () => void;
  handleCreateGroup: () => void;
  handleSelectApp: (app: JobApplication) => void;
  handleClearApp: () => void;
  handleSelectGroup: (id: string) => void;
  handleDeleteAndClose: () => void;
}

export function useDetailModalForm({
  todo,
  groups,
  onSave,
  onDelete,
  onClose,
}: UseDetailModalFormParams): UseDetailModalFormReturn {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [dueDate, setDueDate] = useState(todo.due_date ?? "");
  const [dueTime, setDueTime] = useState(todo.due_time ?? "");
  const [priority, setPriority] = useState(todo.priority);
  const [groupId, setGroupId] = useState(todo.group_id ?? "");
  const [applicationId, setApplicationId] = useState(
    todo.application_id ?? "",
  );
  const [isRecurring, setIsRecurring] = useState(todo.is_recurring);

  const [isGroupSelectOpen, setIsGroupSelectOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const newGroupInputRef = useRef<HTMLInputElement>(null);

  const [isAppSelectOpen, setIsAppSelectOpen] = useState(false);
  const [appSearch, setAppSearch] = useState("");
  const appSearchRef = useRef<HTMLInputElement>(null);

  const { data: applications = [] } = useApplicationsQuery();
  const createGroupMutation = useCreateTodoGroupMutation();

  const filteredApps = useMemo((): JobApplication[] => {
    if (!appSearch) return applications;
    const query = appSearch.toLowerCase();
    return applications.filter(
      (app) =>
        app.company_name?.toLowerCase().includes(query) ||
        app.role_title?.toLowerCase().includes(query),
    );
  }, [applications, appSearch]);

  const linkedApp = useMemo(
    (): JobApplication | undefined =>
      applications.find((a) => a.id === applicationId),
    [applications, applicationId],
  );

  const linkedGroup = useMemo(
    (): TodoGroup | undefined => groups.find((g) => g.id === groupId),
    [groups, groupId],
  );

  const handleSave = useCallback((): void => {
    onSave(todo.id, {
      title,
      description: description || undefined,
      due_date: dueDate || undefined,
      due_time: dueTime || undefined,
      priority,
      group_id: groupId || undefined,
      application_id: applicationId || undefined,
      is_recurring: isRecurring,
    });
    onClose();
  }, [
    todo.id,
    title,
    description,
    dueDate,
    dueTime,
    priority,
    groupId,
    applicationId,
    isRecurring,
    onSave,
    onClose,
  ]);

  const handleCreateGroup = useCallback((): void => {
    const name = newGroupName.trim();
    if (!name) return;

    const color = GROUP_COLOR_PALETTE[selectedColorIndex];
    createGroupMutation.mutate(
      { name, color },
      {
        onSuccess: (res) => {
          if (res.data) {
            setGroupId(res.data.id);
          }
          setNewGroupName("");
          setIsGroupSelectOpen(false);
        },
      },
    );
  }, [newGroupName, selectedColorIndex, createGroupMutation]);

  const handleSelectApp = useCallback((app: JobApplication): void => {
    setApplicationId(app.id);
    setIsAppSelectOpen(false);
    setAppSearch("");
  }, []);

  const handleClearApp = useCallback((): void => {
    setApplicationId("");
  }, []);

  const handleSelectGroup = useCallback((id: string): void => {
    setGroupId(id);
    setIsGroupSelectOpen(false);
  }, []);

  const handleDeleteAndClose = useCallback((): void => {
    onDelete(todo.id);
    onClose();
  }, [todo.id, onDelete, onClose]);

  return {
    title,
    setTitle,
    description,
    setDescription,
    dueDate,
    setDueDate,
    dueTime,
    setDueTime,
    priority,
    setPriority,
    groupId,
    applicationId,
    isRecurring,
    setIsRecurring,

    isGroupSelectOpen,
    setIsGroupSelectOpen,
    newGroupName,
    setNewGroupName,
    selectedColorIndex,
    setSelectedColorIndex,
    newGroupInputRef,

    isAppSelectOpen,
    setIsAppSelectOpen,
    appSearch,
    setAppSearch,
    appSearchRef,

    filteredApps,
    linkedApp,
    linkedGroup,

    isCreateGroupPending: createGroupMutation.isPending,
    isSaveDisabled: !title.trim(),

    handleSave,
    handleCreateGroup,
    handleSelectApp,
    handleClearApp,
    handleSelectGroup,
    handleDeleteAndClose,
  };
}
