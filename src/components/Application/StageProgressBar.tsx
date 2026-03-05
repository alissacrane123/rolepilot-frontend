import { TERMINAL_STAGES } from "@/lib/constants";
import { STAGES } from "@/lib/api";
import type { StagePipelineProps } from "./types";

export function StagePipeline({ currentStage }: StagePipelineProps) {
  const mainStages = STAGES.filter((s) => !TERMINAL_STAGES.includes(s.key));
  const currentIdx = mainStages.findIndex((s) => s.key === currentStage);

  return (
    <div className="flex items-start mt-5">
      {mainStages.map((stage, i) => (
        <div
          key={stage.key}
          className="flex flex-col items-center flex-1 relative"
        >
          <div
            className="w-2.5 h-2.5 rounded-full border-2 z-[2]"
            style={{
              background:
                i <= currentIdx ? stage.color : "rgba(255,255,255,0.06)",
              borderColor:
                i <= currentIdx ? stage.color : "rgba(255,255,255,0.1)",
            }}
          />
          {i < mainStages.length - 1 && (
            <div
              className="absolute top-[4px] left-[calc(50%+5px)] right-[calc(-50%+5px)] h-0.5"
              style={{
                background:
                  i < currentIdx ? stage.color : "rgba(255,255,255,0.06)",
              }}
            />
          )}
          <span
            className="text-[10px] font-medium mt-2 tracking-wide uppercase"
            style={{
              color:
                i <= currentIdx
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(255,255,255,0.25)",
            }}
          >
            {stage.label}
          </span>
        </div>
      ))}
    </div>
  );
}
