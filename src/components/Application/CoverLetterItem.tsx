import { formatDateTime } from "@/lib/dateUtils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import { VStack } from "../ui/stacks";
import { CopyCheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import { downloadCoverLetterPDF } from "./utils";
import type { CoverLetterItemProps } from "./types";

export function CoverLetterItem({
  letter,
  companyName,
}: CoverLetterItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = () => {
    if (!letter) return;
    setIsCopied(true);
    navigator.clipboard.writeText(letter.content);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadPDF = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!letter) return;
    downloadCoverLetterPDF({
      content: letter.content,
      companyName,
      version: letter.version,
    });
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <VStack
      className="hover:border-indigo-500/40 cursor-pointer gap-3 h-full rounded-xl border overflow-hidden animate-fade-in-up transition-all duration-200 border-white/[0.15] bg-white/[0.015] p-5"
    >
      <div
        onClick={handleToggleExpand}
        className="flex items-center justify-between border-[#1e1e2e]"
      >
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="border-indigo-500/30 text-indigo-400 text-xs"
          >
            Version {letter.version}
          </Badge>
          <Badge
            variant="outline"
            className="border-[#1e1e2e] text-white/40 text-xs capitalize"
          >
            {letter.tone}
          </Badge>
          <span className="text-xs text-white/25">
            {formatDateTime(letter.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`text-white/40 hover:text-slate-200 hover:bg-white/[0.08] text-xs ${isCopied ? "text-green-400 hover:text-green-400" : ""}`}
          >
            {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadPDF}
            className="text-white/40 hover:text-slate-200 hover:bg-white/[0.08] text-xs"
          >
            <DownloadIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className={isExpanded ? "" : "max-h-[150px] overflow-scroll scrollbar-hide"}
      >
        <div className="text-sm text-slate-300 leading-7 whitespace-pre-wrap max-w-2xl">
          {letter.content}
        </div>
      </div>
      {!isExpanded && (
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#0a0a0f]/90 to-transparent pointer-events-none" />
      )}
    </VStack>
  );
}

export default CoverLetterItem;
