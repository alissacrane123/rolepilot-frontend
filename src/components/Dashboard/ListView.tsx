import type { JobApplication, BoardView } from "@/lib/api";
import { STAGES, STAGE_MAP } from "@/lib/api";
import { formatDate } from "@/lib/dateUtils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/table";

export default function ListView({
  board,
  activeStage,
  onCardClick,
}: {
  board: BoardView;
  activeStage: string | null;
  onCardClick: (id: string) => void;
}) {
  const allApps: (JobApplication & { _stageKey: string })[] = [];
  for (const stage of STAGES) {
    if (activeStage && activeStage !== stage.key) continue;
    const apps = (board[stage.key as keyof BoardView] ||
      []) as JobApplication[];
    for (const app of apps) {
      allApps.push({ ...app, _stageKey: stage.key });
    }
  }

  return (
    <div className="rounded-xl border border-white/[0.15] overflow-hidden bg-white/[0.01]">
      <Table>
        <TableHeader>
          <TableRow className="bg-white/[0.02] hover:bg-white/[0.02]">
            <TableHead className="w-[30%]">Role</TableHead>
            <TableHead className="w-[15%]">Company</TableHead>
            <TableHead className="w-[15%]">Stage</TableHead>
            <TableHead className="w-[25%]">Salary</TableHead>
            <TableHead className="w-[15%]">Applied</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allApps.length === 0 && (
            <TableEmpty>No applications to show</TableEmpty>
          )}

          {allApps.map((app, i) => {
            const stage = STAGE_MAP[app._stageKey];
            return (
              <TableRow
                key={app.id}
                onClick={() => onCardClick(app.id)}
                className="cursor-pointer animate-slide-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0">
                      <span className="text-[11px] font-semibold text-indigo-400">
                        {(app.company_name || "?")[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-white/90 truncate tracking-tight">
                        {app.role_title || "Untitled Role"}
                      </div>
                      <div className="flex gap-1 mt-0.5">
                        {app.remote_policy &&
                          app.remote_policy !== "not_specified" && (
                            <span className="text-[10px] text-white/30 uppercase tracking-wide font-medium">
                              {app.remote_policy}
                            </span>
                          )}
                        {app.experience_level && (
                          <span className="text-[10px] text-white/30 uppercase tracking-wide font-medium">
                            {app.experience_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-[13px] text-white/70 font-medium truncate">
                  {app.company_name || "Unknown"}
                </TableCell>

                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/55">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: stage?.color }}
                    />
                    {stage?.label}
                  </span>
                </TableCell>

                <TableCell className="text-xs text-white/50 font-mono">
                  {app.salary_range || "—"}
                </TableCell>

                <TableCell className="text-[13px] text-white/35">
                  {app.applied_at ? formatDate(app.applied_at) : "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
