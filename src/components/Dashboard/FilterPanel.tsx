import { useState, useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import useClickOutside from "@/hooks/useClickOutside";
import { PRIORITY_COLORS } from "./TaskRow";
import { ChevronDownSmallIcon, CheckSmallIcon } from "./icons";
import { TODAY, DOW_LABELS, ALL_APPS_VALUE, ALL_GROUPS_VALUE } from "./constants";
import {
  addDays,
  isSameDay,
  dateKey,
  formatDay,
  getWeekDays,
  getDayLabel,
  stringToColor,
} from "./date-utils";
import type { JobApplication } from "@/lib/types";
import type {
  FilterPanelProps,
  DayNavigatorProps,
  DayStripProps,
  AppFilterOption,
  AppIconBadgeProps,
} from "./types";

// ── Helpers ──────────────────────────────────────────────────

function buildAppOptions(applications: JobApplication[]): AppFilterOption[] {
  const options: AppFilterOption[] = [
    { value: ALL_APPS_VALUE, label: "All Applications" },
  ];
  for (const app of applications) {
    const initial = (app.company_name ?? "?")[0].toUpperCase();
    options.push({
      value: app.id,
      label: app.company_name ?? app.role_title ?? "Untitled",
      icon: initial,
      iconBg: stringToColor(app.company_name ?? app.id),
    });
  }
  return options;
}

// ── Sub-components ───────────────────────────────────────────

function AppIconBadge({ icon, iconBg }: AppIconBadgeProps): React.JSX.Element {
  if (icon) {
    return (
      <div
        className="w-4 h-4 rounded shrink-0 flex items-center justify-center text-[8px] font-extrabold text-white"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
    );
  }
  return <div className="w-4 h-4 rounded shrink-0 bg-white/[0.06]" />;
}

function CollapsedStrip({
  pending,
}: Pick<FilterPanelProps, "pending">): React.JSX.Element {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      {pending.map((t) => (
        <div
          key={t.id}
          title={t.title}
          className="w-[22px] h-[3px] rounded-sm opacity-70"
          style={{ background: PRIORITY_COLORS[t.priority] ?? PRIORITY_COLORS[3] }}
        />
      ))}
      {pending.length > 0 && (
        <span className="mt-2 text-[10px] text-slate-600 font-bold [writing-mode:vertical-lr]">
          {pending.length}
        </span>
      )}
    </div>
  );
}

function DayNavigator({
  selectedDate,
  isToday,
  onSetToday,
  onNavigateDay,
}: DayNavigatorProps): React.JSX.Element {
  const label = getDayLabel(selectedDate, TODAY);

  return (
    <div className="flex items-center justify-between mb-2.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-bold text-slate-200 tracking-tight">
          {label}
        </span>
        {isToday && (
          <span className="text-[9px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-px rounded-lg tracking-wide">
            TODAY
          </span>
        )}
      </div>
      <div className="flex gap-[3px] items-center">
        {!isToday && (
          <button
            onClick={onSetToday}
            aria-label="Go to today"
            className="bg-indigo-500/10 border border-indigo-500/25 rounded-[5px] text-indigo-400 px-1.5 h-[22px] cursor-pointer text-[9px] font-bold tracking-wider"
          >
            TODAY
          </button>
        )}
        <button
          onClick={() => onNavigateDay(-1)}
          aria-label="Previous day"
          className="bg-white/[0.04] border border-[#1e1e2e] rounded-[5px] text-slate-500 w-[22px] h-[22px] cursor-pointer text-[15px] flex items-center justify-center transition-all duration-100 font-bold leading-none p-0"
        >
          ‹
        </button>
        <button
          onClick={() => onNavigateDay(1)}
          aria-label="Next day"
          className="bg-white/[0.04] border border-[#1e1e2e] rounded-[5px] text-slate-500 w-[22px] h-[22px] cursor-pointer text-[15px] flex items-center justify-center transition-all duration-100 font-bold leading-none p-0"
        >
          ›
        </button>
      </div>
    </div>
  );
}

function DayStrip({
  weekDays,
  selectedDate,
  tasksByDate,
  onSelectDay,
}: DayStripProps): React.JSX.Element {
  return (
    <div className="flex gap-0.5 mb-3">
      {weekDays.map((d, i) => {
        const f = formatDay(d);
        const isSel = isSameDay(d, selectedDate);
        const isT = isSameDay(d, TODAY);
        const hasTasks = (tasksByDate[dateKey(d)] ?? 0) > 0;

        return (
          <button
            key={i}
            onClick={() => onSelectDay(d)}
            aria-label={`Select ${DOW_LABELS[d.getDay()]} ${d.getDate()}`}
            className="flex-1 bg-transparent border-none cursor-pointer p-0"
          >
            <div
              className={`flex flex-col items-center py-[5px] px-0.5 rounded-lg transition-all duration-[120ms] border ${
                isSel
                  ? "bg-indigo-500/[0.18] border-indigo-500/[0.35]"
                  : "bg-transparent border-transparent"
              }`}
            >
              <span
                className={`text-[8px] font-bold tracking-wide uppercase mb-[3px] ${
                  isSel ? "text-indigo-400" : isT ? "text-slate-500" : "text-gray-700"
                }`}
              >
                {f.dow}
              </span>
              <span
                className={`text-xs leading-none ${
                  isSel
                    ? "font-extrabold text-indigo-400"
                    : isT
                      ? "font-extrabold text-slate-200"
                      : "font-semibold text-gray-600"
                }`}
              >
                {f.date}
              </span>
              <div
                className={`w-1 h-1 rounded-full mt-1 transition-all duration-[120ms] ${
                  hasTasks
                    ? isSel ? "bg-indigo-400" : "bg-slate-800"
                    : "bg-transparent"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}

function FilterDropdown<T extends string>({
  label,
  isOpen,
  onToggle,
  options,
  selectedValue,
  onSelect,
  triggerContent,
  dropdownRef,
  menuRef,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  options: { value: T; label: string; icon?: string; iconBg?: string }[];
  selectedValue: T;
  onSelect: (value: T) => void;
  triggerContent: React.ReactNode;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
  menuRef: React.RefObject<HTMLDivElement | null>;
}): React.JSX.Element {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 0 });

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    });
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      <div className="text-[9px] font-extrabold tracking-widest text-slate-800 uppercase mb-[5px]">
        {label}
      </div>
      <button
        ref={triggerRef}
        onClick={onToggle}
        aria-label={`Select ${label.toLowerCase()} filter`}
        className={`w-full bg-white/[0.03] rounded-lg py-[7px] px-2.5 flex items-center justify-between cursor-pointer transition-[border-color] duration-150 border ${
          isOpen ? "border-indigo-600" : "border-[#1a1a2e]"
        }`}
      >
        {triggerContent}
        <ChevronDownSmallIcon
          className={`text-slate-600 shrink-0 transition-transform duration-150 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>
      {isOpen && createPortal(
        <div
          ref={menuRef}
          className="fixed bg-[#111118] border border-[#1e1e2e] rounded-[9px] overflow-hidden z-[9999] shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
          style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        >
          {options.map((opt) => {
            const isSelected = opt.value === selectedValue;
            return (
              <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                aria-label={`Filter by ${opt.label}`}
                className={`w-full border-none py-2 px-2.5 flex items-center gap-[7px] cursor-pointer transition-colors duration-100 ${
                  isSelected ? "bg-indigo-500/[0.12]" : "bg-transparent hover:bg-white/[0.03]"
                }`}
              >
                {opt.icon !== undefined && (
                  <AppIconBadge icon={opt.icon} iconBg={opt.iconBg} />
                )}
                <span
                  className={`text-[11px] font-semibold flex-1 text-left ${
                    isSelected ? "text-indigo-400" : "text-slate-400"
                  }`}
                >
                  {opt.label}
                </span>
                {isSelected && <CheckSmallIcon className="text-indigo-400" />}
              </button>
            );
          })}
        </div>,
        document.body,
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function FilterPanel({
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
}: FilterPanelProps) {
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

  useClickOutside([appRef, groupRef, appMenuRef, groupMenuRef], handleCloseDropdowns);

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
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Day Navigator */}
      <div className="pt-3 px-3.5 shrink-0">
        <DayNavigator
          selectedDate={selectedDate}
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

      {/* Filter Dropdowns */}
      <div className="px-3.5 pb-2.5 flex flex-col gap-[7px] shrink-0 border-b border-[#131320]">
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
              {selectedApp?.icon && <AppIconBadge icon={selectedApp?.icon} iconBg={selectedApp?.iconBg} />}
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
                groupFilter === ALL_GROUPS_VALUE ? "text-slate-500" : "text-slate-300"
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
