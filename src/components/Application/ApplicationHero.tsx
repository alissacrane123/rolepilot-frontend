import type { JobApplication } from "@/lib/api";
import { STAGE_MAP } from "@/lib/api";
import { formatDate } from "@/lib/dateUtils";
import { Badge } from "@/components/ui/badge";
import MoveStageDialog from "./MoveStageDialog";
import { StagePipeline } from "./StageProgressBar";
import { HStack } from "../ui/stacks";
import { ExternalLinkIcon } from "lucide-react";

function MetaRow({
  items,
  tags,
}: {
  items: (string | undefined | null)[];
  tags: (string | undefined | null)[];
}) {
  const visibleItems = items.filter(
    (item) => item && item !== "not_specified",
  ) as string[];
  
  const visibleTags = tags.filter(Boolean) as string[];

  return (
    <div className="flex items-center flex-wrap gap-2.5 pb-5 border-b border-white/[0.05]">
      {visibleItems.map((item, i) => (
        <span key={i} className="contents">
          {i > 0 && <span className="w-px h-3 bg-white/[0.08]" />}
          <span className="text-xs text-white/40 font-medium">{item}</span>
        </span>
      ))}

      {visibleTags.length > 0 && (
        <div className="flex gap-1 ml-auto">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium text-white/40 bg-white/[0.04] px-2 py-0.5 rounded uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApplicationHero({
  app,
  onMoved,
}: {
  app: JobApplication;
  onMoved: () => void;
}) {
  const stage = STAGE_MAP[app.current_stage];
  const initial = (app.company_name || "?")[0].toUpperCase();

  const appliedDate = formatDate(app.applied_at);

  return (
    <div className="rounded-[14px] border border-white/[0.06] bg-white/[0.015] p-7 animate-fade-in-up">
      {/* Top row: identity + move stage */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex gap-4 items-start">
          <div
            className="w-12 h-12 rounded-xl bg-white/[0.04] border-[1.5px] flex items-center justify-center shrink-0"
            style={{ borderColor: `${stage?.color ?? "#6366f1"}33` }}
          >
            <span
              className="text-xl font-extrabold"
              style={{ color: stage?.color ?? "#6366f1" }}
            >
              {initial}
            </span>
          </div>

          <div>
            <div className="flex gap-1.5 mb-1.5">
              <Badge
                variant="outline"
                className="text-[11px] font-medium border-indigo-500/15 bg-indigo-500/10 text-white/60 gap-1.5"
              >
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: stage?.color ?? "#6366f1" }}
                />
                {stage?.label ?? app.current_stage}
              </Badge>

              {app.processing_status === "processing" && (
                <Badge className="text-[11px] font-medium bg-indigo-500/10 text-indigo-400 border-indigo-500/30 animate-pulse">
                  AI Analyzing...
                </Badge>
              )}

              {app.match_score != null && app.match_score > 0 && (
                <Badge
                  variant="outline"
                  className={`text-[11px] font-semibold font-mono ${
                    app.match_score >= 75
                      ? "border-emerald-500/15 bg-emerald-500/[0.08] text-emerald-400"
                      : app.match_score >= 50
                        ? "border-amber-500/15 bg-amber-500/[0.08] text-amber-400"
                        : "border-zinc-600 bg-white/[0.04] text-zinc-400"
                  }`}
                >
                  {app.match_score}% match
                </Badge>
              )}
            </div>

            <a
              className="flex flex-col"
              href={app.job_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <HStack className="items-center gap-2 text-white/40 hover:text-indigo-400">
                <h1 className="text-[22px] font-bold tracking-tight leading-tight text-white hover:text-indigo-400">
                  {app.role_title || "Untitled Role"}
                </h1>
                <ExternalLinkIcon className="w-4 h-4" />
              </HStack>
              <p className="text-sm text-white/45 mt-0.5">
                {app.company_name || "Unknown Company"}
              </p>
            </a>
          </div>
        </div>

        <MoveStageDialog app={app} onMoved={onMoved} />
      </div>

      {/* Meta row */}
      <MetaRow
        items={[app.salary_range, app.location, `Applied ${appliedDate}`]}
        tags={[
          app.remote_policy && app.remote_policy !== "not_specified"
            ? app.remote_policy
            : null,
          app.experience_level ?? null,
        ]}
      />

      {/* Stage pipeline */}
      <StagePipeline currentStage={app.current_stage} />
    </div>
  );
}
