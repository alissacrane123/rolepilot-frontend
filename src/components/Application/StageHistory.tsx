import { STAGE_MAP } from "@/lib/api";
import { formatDateTime } from "@/lib/dateUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApplicationProps } from "./types";

export function StageHistory({ app }: ApplicationProps) {
  if (!app.stage_history || app.stage_history.length === 0) return null;

  return (
    <Card className="bg-[#0a0a0f] border-[#1e1e2e]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-white/40">Stage History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {app.stage_history.map((h, i) => {
            const toStage = STAGE_MAP[h.to_stage];
            return (
              <div key={h.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5" />
                  {i < app.stage_history!.length - 1 && (
                    <div className="w-px flex-1 bg-white/[0.06] mt-1" />
                  )}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200">
                      {toStage?.emoji} {toStage?.label || h.to_stage}
                    </span>
                    <span className="text-xs text-white/30">
                      {formatDateTime(h.moved_at)}
                    </span>
                  </div>
                  {h.notes && (
                    <p className="text-xs text-white/40 mt-0.5">{h.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default StageHistory;
