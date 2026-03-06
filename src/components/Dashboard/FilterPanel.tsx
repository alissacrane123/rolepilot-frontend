import { useState, useRef, useMemo, useCallback } from "react";
import useClickOutside from "@/hooks/useClickOutside";
import { TODAY, ALL_APPS_VALUE, ALL_GROUPS_VALUE } from "./constants";
import { addDays, isSameDay, getWeekDays, buildAppOptions } from "./date-utils";
import type { FilterPanelProps } from "./types";
import {
  AppIconBadge,
  CollapsedStrip,
  DayNavigator,
  DayStrip,
  FilterDropdown,
} from "./components";

export function FilterPanel({
  collapsed,
  pending,
  groups,
  applications,
  selectedDate,
  onSelectedDateChange,
  appFilter,
  onAppFilterChange,
  groupFilter,
  onGroupFilterChange,
}: FilterPanelProps): React.JSX.Element {
  const [isAppOpen, setIsAppOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const appRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const appMenuRef = useRef<HTMLDivElement>(null);
  const groupMenuRef = useRef<HTMLDivElement>(null);

  const handleCloseDropdowns = useCallback((): void => {
    setIsAppOpen(false);
    setIsGroupOpen(false);
  }, []);

  useClickOutside(
    [appRef, groupRef, appMenuRef, groupMenuRef],
    handleCloseDropdowns,
  );

  const isToday = isSameDay(selectedDate, TODAY);
  const weekDays = useMemo(() => getWeekDays(selectedDate), [selectedDate]);

  const appOptions = useMemo(
    () => buildAppOptions(applications),
    [applications],
  );

  const selectedApp = useMemo(
    () => appOptions.find((o) => o.value === appFilter) ?? appOptions[0],
    [appOptions, appFilter],
  );

  const groupOptions = useMemo(
    () => [
      { value: ALL_GROUPS_VALUE, label: ALL_GROUPS_VALUE },
      ...groups.map((g) => ({ value: g.name, label: g.name })),
    ],
    [groups],
  );

  const tasksByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of pending) {
      if (t.due_date) {
        map[t.due_date] = (map[t.due_date] ?? 0) + 1;
      }
    }
    return map;
  }, [pending]);

  const handleSetToday = useCallback((): void => {
    onSelectedDateChange(TODAY);
  }, [onSelectedDateChange]);

  const handleNavigateDay = useCallback(
    (offset: number): void => {
      onSelectedDateChange((prev) => addDays(prev, offset));
    },
    [onSelectedDateChange],
  );

  const handleSelectDay = useCallback(
    (d: Date): void => {
      onSelectedDateChange(d);
    },
    [onSelectedDateChange],
  );

  const handleSelectApp = useCallback(
    (value: string): void => {
      onAppFilterChange(value);
      setIsAppOpen(false);
    },
    [onAppFilterChange],
  );

  const handleToggleAppDropdown = useCallback((): void => {
    setIsAppOpen((o) => !o);
    setIsGroupOpen(false);
  }, []);

  const handleToggleGroupDropdown = useCallback((): void => {
    setIsGroupOpen((o) => !o);
    setIsAppOpen(false);
  }, []);

  const handleSelectGroup = useCallback(
    (value: string): void => {
      onGroupFilterChange(value);
      setIsGroupOpen(false);
    },
    [onGroupFilterChange],
  );

  if (collapsed) {
    return <CollapsedStrip pending={pending} />;
  }

  const isAllApps = appFilter === ALL_APPS_VALUE;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-2">
      <div className="pt-3 px-3.5 shrink-0">
        <DayNavigator
          isToday={isToday}
          onSetToday={handleSetToday}
          onNavigateDay={handleNavigateDay}
        />
        <DayStrip
          weekDays={weekDays}
          selectedDate={selectedDate}
          tasksByDate={tasksByDate}
          onSelectDay={handleSelectDay}
        />
      </div>

      <div className="px-3.5 pb-4 flex flex-col gap-[7px] shrink-0">
        <FilterDropdown
          label="Application"
          isOpen={isAppOpen}
          onToggle={handleToggleAppDropdown}
          options={appOptions}
          selectedValue={appFilter}
          onSelect={handleSelectApp}
          dropdownRef={appRef}
          menuRef={appMenuRef}
          triggerContent={
            <div className="flex items-center gap-1.5">
              {selectedApp?.icon && (
                <AppIconBadge
                  icon={selectedApp.icon}
                  iconBg={selectedApp.iconBg}
                />
              )}
              <span
                className={`text-[11px] font-semibold ${
                  isAllApps ? "text-slate-500" : "text-slate-300"
                }`}
              >
                {selectedApp?.label}
              </span>
            </div>
          }
        />

        <FilterDropdown
          label="Group"
          isOpen={isGroupOpen}
          onToggle={handleToggleGroupDropdown}
          options={groupOptions}
          selectedValue={groupFilter}
          onSelect={handleSelectGroup}
          dropdownRef={groupRef}
          menuRef={groupMenuRef}
          triggerContent={
            <span
              className={`text-[11px] font-semibold ${
                groupFilter === ALL_GROUPS_VALUE
                  ? "text-slate-500"
                  : "text-slate-300"
              }`}
            >
              {groupFilter}
            </span>
          }
        />
      </div>
    </div>
  );
}

export default FilterPanel;
