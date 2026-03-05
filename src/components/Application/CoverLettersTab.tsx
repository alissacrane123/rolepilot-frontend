import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useGenerateCoverLetterMutation,
  useGetCoverLettersQuery,
} from "@/hooks/useApi";
import ErrorMessage from "@/components/common/ErrorMessage";
import { CoverLetterItem } from "./CoverLetterItem";
import { ToneSelector } from "./ToneSelector";
import type { CoverLettersTabProps } from "./types";

export function CoverLettersTab({ app, companyName }: CoverLettersTabProps) {
  const applicationId = app.id;
  const [tone, setTone] = useState("professional");

  const { data: letters = [], isLoading } =
    useGetCoverLettersQuery(applicationId);
  const mutation = useGenerateCoverLetterMutation(applicationId);

  const handleGenerate = async () => {
    try {
      await mutation.mutateAsync({ tone });
    } catch {
      // error surfaced via mutation.error
    }
  };

  const isGenerating = mutation.isPending;
  const errorMessage = (mutation.error as Error | null)?.message ?? null;

  if (!isLoading && letters.length === 0 && !isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
          <span className="text-2xl">✍️</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          Generate a Cover Letter
        </h3>
        <p className="text-sm text-white/35 text-center max-w-md mb-6">
          AI will craft a tailored cover letter using the job description and
          your resume. Generate multiple versions with different tones.
        </p>
        <div className="flex items-center gap-3">
          <ToneSelector
            value={tone}
            onChange={setTone}
            className="w-[160px]"
          />
          <Button
            onClick={handleGenerate}
            variant="primary"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Cover Letter"}
          </Button>
        </div>
        <ErrorMessage message={errorMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ToneSelector
            value={tone}
            onChange={setTone}
            className="w-[140px] h-8 text-xs"
          />
          <Button
            onClick={handleGenerate}
            size="sm"
            variant="primary"
            className="text-xs h-8"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "+ New Version"}
          </Button>
        </div>
      </div>

      <ErrorMessage message={errorMessage} />
      {isGenerating && (
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
          <p className="text-sm text-white/40">
            Writing your cover letter for {companyName || "this role"}...
          </p>
        </div>
      )}

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

export default CoverLettersTab;
