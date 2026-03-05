import type { JobApplication } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AnalysisCard({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: string;
}) {
  if (!items?.length) return null;
  return (
    <Card className="bg-[#0a0a0f] border-[#1e1e2e]">
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm text-${color}-400`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1.5">
          {items.map((item, i) => (
            <li key={i} className="text-sm text-slate-300 flex gap-2">
              <span className={`text-${color}-500 shrink-0`}>•</span>
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function AIAnalysis({ app }: { app: JobApplication }) {
  const hasAnalysis =
    app.matching_strengths?.length > 0 ||
    app.potential_gaps?.length > 0 ||
    app.suggested_talking_points?.length > 0 ||
    app.interview_focus_areas?.length > 0;

  if (!hasAnalysis) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-200">AI Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnalysisCard
          title="✅ Your Strengths"
          items={app.matching_strengths}
          color="emerald"
        />
        <AnalysisCard
          title="⚠️ Potential Gaps"
          items={app.potential_gaps}
          color="amber"
        />
        <AnalysisCard
          title="💬 Suggested Talking Points"
          items={app.suggested_talking_points}
          color="indigo"
        />
        <AnalysisCard
          title="🎯 Interview Focus Areas"
          items={app.interview_focus_areas}
          color="cyan"
        />
      </div>
    </div>
  );
}
