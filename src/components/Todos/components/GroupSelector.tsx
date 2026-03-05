import { ChevronDownIcon, PlusIcon } from "lucide-react";
import type { TodoGroup } from "@/lib/types/todos";
import { GROUP_COLOR_PALETTE } from "../constants";

interface GroupSelectorProps {
  groupId: string;
  groups: TodoGroup[];
  linkedGroup: TodoGroup | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  newGroupName: string;
  setNewGroupName: (value: string) => void;
  selectedColorIndex: number;
  setSelectedColorIndex: (value: number) => void;
  newGroupInputRef: React.RefObject<HTMLInputElement | null>;
  isCreatePending: boolean;
  onSelectGroup: (id: string) => void;
  onCreateGroup: () => void;
}

export function GroupSelector({
  groupId,
  groups,
  linkedGroup,
  isOpen,
  setIsOpen,
  newGroupName,
  setNewGroupName,
  selectedColorIndex,
  setSelectedColorIndex,
  newGroupInputRef,
  isCreatePending,
  onSelectGroup,
  onCreateGroup,
}: GroupSelectorProps): React.JSX.Element {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Select group"
        className="w-full flex items-center justify-between bg-white/[0.04] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-left transition-colors hover:border-white/[0.12] focus:border-indigo-500/40 outline-none cursor-pointer"
      >
        <span className="flex items-center gap-2">
          {linkedGroup ? (
            <>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: linkedGroup.color }}
              />
              <span className="text-slate-200">{linkedGroup.name}</span>
            </>
          ) : (
            <span className="text-white/30">No group</span>
          )}
        </span>
        <ChevronDownIcon
          width="14"
          height="14"
          className={`text-white/30 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-[#0f0f1a] border border-[#1e1e2e] rounded-lg shadow-xl overflow-hidden">
          <div className="max-h-[180px] overflow-y-auto">
            <button
              onClick={() => onSelectGroup("")}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                !groupId
                  ? "bg-indigo-500/10 text-indigo-300"
                  : "text-slate-400 hover:bg-white/[0.04]"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white/10 shrink-0" />
              None
            </button>

            {groups.map((g) => (
              <button
                key={g.id}
                onClick={() => onSelectGroup(g.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors cursor-pointer ${
                  groupId === g.id
                    ? "bg-indigo-500/10 text-indigo-300"
                    : "text-slate-400 hover:bg-white/[0.04]"
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: g.color }}
                />
                {g.name}
              </button>
            ))}
          </div>

          <CreateGroupForm
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            selectedColorIndex={selectedColorIndex}
            setSelectedColorIndex={setSelectedColorIndex}
            newGroupInputRef={newGroupInputRef}
            isCreatePending={isCreatePending}
            onCreateGroup={onCreateGroup}
          />
        </div>
      )}
    </div>
  );
}

interface CreateGroupFormProps {
  newGroupName: string;
  setNewGroupName: (value: string) => void;
  selectedColorIndex: number;
  setSelectedColorIndex: (value: number) => void;
  newGroupInputRef: React.RefObject<HTMLInputElement | null>;
  isCreatePending: boolean;
  onCreateGroup: () => void;
}

function CreateGroupForm({
  newGroupName,
  setNewGroupName,
  selectedColorIndex,
  setSelectedColorIndex,
  newGroupInputRef,
  isCreatePending,
  onCreateGroup,
}: CreateGroupFormProps): React.JSX.Element {
  return (
    <div className="border-t border-[#1e1e2e] px-3 py-2.5">
      <p className="text-[10px] font-medium text-white/25 uppercase tracking-widest mb-2">
        Create New Group
      </p>
      <div className="flex gap-1.5 mb-2">
        {GROUP_COLOR_PALETTE.map((color, i) => (
          <button
            key={color}
            onClick={() => setSelectedColorIndex(i)}
            aria-label={`Select color ${color}`}
            className={`w-5 h-5 rounded-full transition-all cursor-pointer ${
              selectedColorIndex === i
                ? "ring-2 ring-white/40 ring-offset-1 ring-offset-[#0f0f1a] scale-110"
                : "hover:scale-110"
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex gap-1.5">
        <input
          ref={newGroupInputRef}
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreateGroup()}
          placeholder="Group name..."
          className="flex-1 bg-white/[0.04] border border-[#1e1e2e] rounded-md px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500/40 transition-colors placeholder:text-white/20"
        />
        <button
          onClick={onCreateGroup}
          disabled={!newGroupName.trim() || isCreatePending}
          aria-label="Create group"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <PlusIcon width="12" height="12" />
          Add
        </button>
      </div>
    </div>
  );
}
