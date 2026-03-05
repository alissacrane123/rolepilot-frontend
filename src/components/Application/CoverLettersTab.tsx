import type { JobApplication } from "@/lib/api";
import { useState } from "react";
import { type CoverLetter, COVER_LETTER_TONES } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGenerateCoverLetterMutation,
  useGetCoverLettersQuery,
} from "@/hooks/useApi";
import CoverLetterItem from "./CoverLetterItem";

export default function CoverLettersTab({
  app,
  companyName,
}: {
  app: JobApplication;
  companyName?: string;
  roleTitle?: string;
}) {
  const applicationId = app.id;
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const { data: letters = [], isLoading: loading } =
    useGetCoverLettersQuery(applicationId);
  const generateCoverLetterMutation =
    useGenerateCoverLetterMutation(applicationId);

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    try {
      await generateCoverLetterMutation.mutateAsync({ tone });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  // Empty state — no letters yet
  if (!loading && letters.length === 0 && !generating) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
          <span className="text-2xl">✍️</span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-200 mb-2">
          Generate a Cover Letter
        </h3>
        <p className="text-sm text-zinc-500 text-center max-w-md mb-6">
          AI will craft a tailored cover letter using the job description and
          your resume. Generate multiple versions with different tones.
        </p>
        <div className="flex items-center gap-3">
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-[160px] bg-zinc-800 border-zinc-700 text-zinc-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {COVER_LETTER_TONES.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className="text-zinc-100"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </div>
        {error && (
          <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2 mt-4">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top bar: version selector + actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger className="w-[140px] bg-zinc-800 border-zinc-700 text-zinc-100 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              {COVER_LETTER_TONES.map((t) => (
                <SelectItem
                  key={t.value}
                  value={t.value}
                  className="text-zinc-100"
                >
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleGenerate}
            size="sm"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
            disabled={generating}
          >
            {generating ? "Generating..." : "+ New Version"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}
      {generating && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <div
              className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
          <p className="text-sm text-zinc-400">
            Writing your cover letter for {companyName || "this role"}...
          </p>
        </div>
      )}

      {/* Cover letter content */}
      {letters?.map((letter) => (
        <CoverLetterItem
          key={letter.id}
          letter={letter}
          companyName={companyName || ""}
        />
      ))}
    </div>
  );
}
