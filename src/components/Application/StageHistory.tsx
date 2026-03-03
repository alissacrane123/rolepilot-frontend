import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StageHistory({ app }: { app: JobApplication }) {
  if (!app.stage_history || app.stage_history.length === 0) return null;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-zinc-400">Stage History</CardTitle>
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
                    <div className="w-px flex-1 bg-zinc-700 mt-1" />
                  )}
                </div>
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-zinc-200">
                      {toStage?.emoji} {toStage?.label || h.to_stage}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {new Date(h.moved_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {h.notes && (
                    <p className="text-xs text-zinc-400 mt-0.5">{h.notes}</p>
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
