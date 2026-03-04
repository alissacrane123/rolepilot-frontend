import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";

export default function ResumeForm({
  resumeText,
  setResumeText,
  uploadingResume,
  handleSaveResumeText,
  handleFileUpload,
}: {
  resumeText: string;
  setResumeText: (text: string) => void;
  uploadingResume: boolean;
  handleSaveResumeText: () => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumeTab, setResumeTab] = useState<"file" | "text">("file");


  return (
    <div className="space-y-4">
      {/* Tab toggle */}
      <div className="flex gap-1 bg-zinc-800 rounded-md p-1">
        <button
          onClick={() => setResumeTab("file")}
          className={`flex-1 text-sm py-1.5 rounded transition-colors ${
            resumeTab === "file"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Upload File
        </button>
        <button
          onClick={() => setResumeTab("text")}
          className={`flex-1 text-sm py-1.5 rounded transition-colors ${
            resumeTab === "text"
              ? "bg-zinc-700 text-zinc-100"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          Paste Text
        </button>
      </div>

      {resumeTab === "file" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.md"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 border-dashed h-24"
            disabled={uploadingResume}
          >
            {uploadingResume
              ? "Uploading..."
              : "Click to upload PDF, TXT, or MD"}
          </Button>
          <p className="text-xs text-zinc-500 mt-2">
            Text will be automatically extracted from your resume for AI
            analysis.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <Textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text here..."
            className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[200px] text-sm font-mono"
          />
          <Button
            onClick={handleSaveResumeText}
            variant="outline"
            className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            disabled={uploadingResume || !resumeText.trim()}
          >
            {uploadingResume ? "Saving..." : "Save Resume Text"}
          </Button>
        </div>
      )}
    </div>
  );
}
