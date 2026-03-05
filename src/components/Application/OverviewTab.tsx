import { SummaryCards } from "./SummaryCards";
import { SkillsSection } from "./SkillsSection";
import type { ApplicationProps } from "./types";

export function OverviewTab({ app }: ApplicationProps) {
  return (
    <div className="space-y-5 animate-fade-in-up">
      <SummaryCards app={app} />
      <SkillsSection app={app} />

      {app.job_url && (
        <div className="text-sm pt-2">
          <a
            href={app.job_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline"
          >
            View Original Posting →
          </a>
        </div>
      )}
    </div>
  );
}

export default OverviewTab;
