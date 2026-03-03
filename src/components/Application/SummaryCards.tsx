import type { JobApplication } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SummaryCards({ app }: { app: JobApplication }) {
  if (!app.company_summary && !app.role_summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {app.company_summary && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              About the Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {app.company_summary}
            </p>
          </CardContent>
        </Card>
      )}
      {app.role_summary && (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-zinc-400">
              About the Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {app.role_summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
