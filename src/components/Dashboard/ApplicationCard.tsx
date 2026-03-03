import type { JobApplication } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// function MatchScore({
//   matchScore,
//   processingStatus,
// }: {
//   matchScore: number;
//   processingStatus: string;
// }) {
//   const fontColor =
//     matchScore && matchScore >= 75
//       ? "text-emerald-400"
//       : matchScore && matchScore >= 50
//         ? "text-amber-400"
//         : "text-zinc-500";
//   return (
//     <div className="shrink-0 w-12 ml-auto">
//       {matchScore != null && matchScore > 0 ? (
//         <div className={`text-sm font-bold flex items-center gap-1 ${fontColor}`}>
//           <div>{matchScore}</div>
//           <div className="text-xs font-normal text-nowrap">%</div>
//         </div>
//       ) : processingStatus === "processing" ? (
//         <div className="w-3 h-3 rounded-full bg-indigo-400 animate-pulse mx-auto" />
//       ) : (
//         <div className="text-xs text-zinc-600">—</div>
//       )}
//     </div>
//   );
// }

export default function ApplicationCard({
  app,
  onClick,
}: {
  app: JobApplication;
  onClick: () => void;
}) {
  return (
    <Card
      className="max-w-xs p-3 bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900 cursor-pointer transition-all group"
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col min-w-0 gap-4">
          <p className="text-xs font-bold text-indigo-400 truncate">
            {app.company_name || "Unknown Company"}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm text-zinc-100 truncate  transition-colors">
              {app.role_title || "Untitled Role"}
            </p>
            {app.processing_status === "processing" && (
              <span className="text-xs text-indigo-400">analyzing...</span>
            )}
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-3 shrink-0">
          <div className="flex gap-2">
            {app.remote_policy && app.remote_policy !== "not_specified" && (
              <Badge
                variant="outline"
                className="text-xs border-zinc-700 text-zinc-400"
              >
                {app.remote_policy}
              </Badge>
            )}
            {app.experience_level && (
              <Badge
                variant="outline"
                className="text-xs border-zinc-700 text-zinc-400"
              >
                {app.experience_level}
              </Badge>
            )}
          </div>
          {app.salary_range && (
            <span className="text-xs text-zinc-500 font-mono">
              {app.salary_range}
            </span>
          )}
        </div>

        {/* <MatchScore
          matchScore={app.match_score || 0}
          processingStatus={app.processing_status}
        /> */}
      </div>
    </Card>
  );
}
