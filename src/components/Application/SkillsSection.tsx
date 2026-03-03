import type { JobApplication } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SkillBadges from "./SkillBadges";

export default function SkillsSection({ app }: { app: JobApplication }) {
  const hasAny =
    app.required_skills?.length > 0 ||
    app.nice_to_have_skills?.length > 0 ||
    app.key_technologies?.length > 0;

  if (!hasAny) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {app.required_skills?.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              Required Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBadges skills={app.required_skills} color="indigo" />
          </CardContent>
        </Card>
      )}
      {app.nice_to_have_skills?.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              Nice to Have
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBadges skills={app.nice_to_have_skills} color="amber" />
          </CardContent>
        </Card>
      )}
      {app.key_technologies?.length > 0 && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              Technologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillBadges skills={app.key_technologies} color="cyan" />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
