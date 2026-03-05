import type { CoverLetter } from "@/lib/api";
import { formatDateTime } from "@/lib/dateUtils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import { VStack } from "../ui/stacks";
import { CopyCheckIcon, CopyIcon, DownloadIcon } from "lucide-react";
import jsPDF from "jspdf";

export default function CoverLetterItem({
  letter,
  companyName,
}: {
  letter: CoverLetter;
  companyName: string;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleCopy = () => {
    if (!letter) return;
    setCopied(true);
    navigator.clipboard.writeText(letter.content);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!letter) return;
    const doc = new jsPDF("p", "in", "letter");
    const margin = 1;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;
    const lineHeight = 0.22;

    doc.setFont("helvetica");
    doc.setFontSize(11);

    const paragraphs = letter.content.split("\n");
    let y = margin;

    for (const paragraph of paragraphs) {
      if (paragraph.trim() === "") {
        y += lineHeight;
        continue;
      }
      const lines = doc.splitTextToSize(paragraph.trim(), maxWidth);
      for (const line of lines) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      }
    }

    const filename = `cover-letter-${(companyName || "company").toLowerCase().replace(/\s+/g, "-")}-v${letter.version}.pdf`;
    doc.save(filename);
  };

  return (
    <VStack
      className={`hover:border-indigo-500/40 cursor-pointer gap-3 h-full rounded-xl border overflow-hidden animate-fade-in-up transition-all duration-200 border-white/[0.06] bg-white/[0.015] p-5`}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between border-zinc-800"
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
            className="border-zinc-700 text-zinc-400 text-xs capitalize"
          >
            {letter.tone}
          </Badge>
          <span className="text-xs text-zinc-600">
            {formatDateTime(letter.created_at)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={`text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 text-xs ${copied ? "text-green-400 hover:text-green-400" : ""}`}
          >
            {copied ? <CopyCheckIcon /> : <CopyIcon />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadPDF}
            className={
              "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 text-xs"
            }
          >
            <DownloadIcon className="size-4" />
          </Button>
        </div>
      </div>

      <div
        className={` ${expanded ? "" : "max-h-[150px] overflow-scroll scrollbar-hide"}`}
      >
        <div className="text-sm text-zinc-300 leading-7 whitespace-pre-wrap max-w-2xl">
          {letter.content}
        </div>
      </div>
      {!expanded && (
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none" />
      )}
    </VStack>
  );
}
