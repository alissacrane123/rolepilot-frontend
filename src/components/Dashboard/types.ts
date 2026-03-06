import type { Todo } from "@/lib/types/todos";
import type { TodoGroup } from "@/lib/types/todos";
import type { JobApplication } from "@/lib/types";
import type { DAY_FILTER_OPTIONS } from "./constants";

export type DayFilterId = (typeof DAY_FILTER_OPTIONS)[number]["id"];

export interface TaskFilterState {
  dayFilter: DayFilterId;
  groupId: string | null;
}

export interface AppFilterOption {
  value: string;
  label: string;
  icon?: string;
  iconBg?: string;
}

export interface FormattedDay {
  dow: string;
  date: number;
}

export interface FilterPanelProps {
  collapsed: boolean;
  pending: Todo[];
  groups: TodoGroup[];
  applications: JobApplication[];
  selectedDate: Date;
  onSelectedDateChange: (date: Date | ((prev: Date) => Date)) => void;
  appFilter: string;
  onAppFilterChange: (value: string) => void;
  groupFilter: string;
  onGroupFilterChange: (value: string) => void;
}

export interface DayNavigatorProps {
  isToday: boolean;
  onSetToday: () => void;
  onNavigateDay: (offset: number) => void;
}

export interface DayStripProps {
  weekDays: Date[];
  selectedDate: Date;
  tasksByDate: Record<string, number>;
  onSelectDay: (d: Date) => void;
}

export interface FilterDropdownProps<T extends string> {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  options: AppFilterOption[];
  selectedValue: T;
  onSelect: (value: T) => void;
  triggerContent: React.ReactNode;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
}

export interface AppIconBadgeProps {
  icon?: string;
  iconBg?: string;
}
