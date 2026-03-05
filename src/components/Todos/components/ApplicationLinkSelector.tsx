import { LinkIcon, SearchIcon, XIcon } from "lucide-react";
import type { JobApplication } from "@/lib/types";

interface ApplicationLinkSelectorProps {
  linkedApp: JobApplication | undefined;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  appSearch: string;
  setAppSearch: (value: string) => void;
  appSearchRef: React.RefObject<HTMLInputElement | null>;
  filteredApps: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
  onClearApp: () => void;
}

export function ApplicationLinkSelector({
  linkedApp,
  isOpen,
  setIsOpen,
  appSearch,
  setAppSearch,
  appSearchRef,
  filteredApps,
  onSelectApp,
  onClearApp,
}: ApplicationLinkSelectorProps): React.JSX.Element {
  if (linkedApp) {
    return <LinkedAppCard app={linkedApp} onClear={onClearApp} />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen((v) => !v);
          setTimeout(() => appSearchRef.current?.focus(), 50);
        }}
        aria-label="Link to application"
        className="w-full flex items-center gap-2.5 bg-white/[0.04] border border-[#1e1e2e] rounded-lg px-3 py-2.5 text-sm text-left transition-colors hover:border-white/[0.12] focus:border-indigo-500/40 outline-none cursor-pointer"
      >
        <LinkIcon width="13" height="13" className="text-white/20" />
        <span className="text-white/30">Select an application...</span>
      </button>

      {isOpen && (
        <AppDropdown
          appSearch={appSearch}
          setAppSearch={setAppSearch}
          appSearchRef={appSearchRef}
          filteredApps={filteredApps}
          onSelectApp={onSelectApp}
        />
      )}
    </div>
  );
}

interface LinkedAppCardProps {
  app: JobApplication;
  onClear: () => void;
}

function LinkedAppCard({
  app,
  onClear,
}: LinkedAppCardProps): React.JSX.Element {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-[12px] font-mono font-bold text-indigo-400 shrink-0">
        {app.company_name?.[0] ?? "?"}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-slate-200 truncate">
          {app.company_name}
        </p>
        <p className="text-[11px] font-mono text-slate-500 truncate">
          {app.role_title}
        </p>
      </div>
      <button
        onClick={onClear}
        aria-label="Unlink application"
        className="w-6 h-6 rounded-md flex items-center justify-center text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors cursor-pointer"
      >
        <XIcon width="13" height="13" />
      </button>
    </div>
  );
}

interface AppDropdownProps {
  appSearch: string;
  setAppSearch: (value: string) => void;
  appSearchRef: React.RefObject<HTMLInputElement | null>;
  filteredApps: JobApplication[];
  onSelectApp: (app: JobApplication) => void;
}

function AppDropdown({
  appSearch,
  setAppSearch,
  appSearchRef,
  filteredApps,
  onSelectApp,
}: AppDropdownProps): React.JSX.Element {
  return (
    <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-[#0f0f1a] border border-[#1e1e2e] rounded-lg shadow-xl overflow-hidden">
      <div className="px-3 py-2 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-[#1e1e2e] rounded-md px-2.5 py-1.5">
          <SearchIcon
            width="12"
            height="12"
            className="text-white/20 shrink-0"
          />
          <input
            ref={appSearchRef}
            value={appSearch}
            onChange={(e) => setAppSearch(e.target.value)}
            placeholder="Search applications..."
            className="flex-1 bg-transparent text-xs text-slate-200 outline-none placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="max-h-[200px] overflow-y-auto">
        {filteredApps.length === 0 ? (
          <p className="px-3 py-4 text-xs text-white/20 text-center">
            No applications found
          </p>
        ) : (
          filteredApps.map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app)}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-white/[0.04] cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-[#1e1e2e] flex items-center justify-center text-[11px] font-mono font-bold text-slate-500 shrink-0">
                {app.company_name?.[0] ?? "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">
                  {app.company_name}
                </p>
                <p className="text-[11px] font-mono text-slate-600 truncate">
                  {app.role_title}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
