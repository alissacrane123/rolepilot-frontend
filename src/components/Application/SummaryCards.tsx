import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ApplicationProps } from "./types";

export function SummaryCards({ app }: ApplicationProps) {
  if (!app.company_summary && !app.role_summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {app.company_summary && (
        <Card className="bg-[#0a0a0f] border-[#1e1e2e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/40">
              About the Company
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 leading-relaxed">
              {app.company_summary}
            </p>
          </CardContent>
        </Card>
      )}
      {app.role_summary && (
        <Card className="bg-[#0a0a0f] border-[#1e1e2e]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/40">
              About the Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-300 leading-relaxed">
              {app.role_summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default SummaryCards;
