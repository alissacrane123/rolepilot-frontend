import { useState, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDownSmallIcon, CheckSmallIcon } from "../icons";
import { AppIconBadge } from "./AppIconBadge";
import type { FilterDropdownProps } from "../types";

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

export function FilterDropdown<T extends string>({
  label,
  isOpen,
  onToggle,
  options,
  selectedValue,
  onSelect,
  triggerContent,
  dropdownRef,
  menuRef,
}: FilterDropdownProps<T>): React.JSX.Element {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, left: 0, width: 0 });

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
      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className="fixed bg-[#111118] border border-[#1e1e2e] rounded-[9px] overflow-hidden z-[9999] shadow-[0_12px_32px_rgba(0,0,0,0.6)]"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
            }}
          >
            {options.map((opt) => {
              const isSelected = opt.value === selectedValue;
              return (
                <button
                  key={opt.value}
                  onClick={() => onSelect(opt.value as T)}
                  aria-label={`Filter by ${opt.label}`}
                  className={`w-full border-none py-2 px-2.5 flex items-center gap-[7px] cursor-pointer transition-colors duration-100 ${
                    isSelected
                      ? "bg-indigo-500/[0.12]"
                      : "bg-transparent hover:bg-white/[0.03]"
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
