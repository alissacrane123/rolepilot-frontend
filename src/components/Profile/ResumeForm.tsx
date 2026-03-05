import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TabToggle from "@/components/common/TabToggle";
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
      <TabToggle
        value={resumeTab}
        onChange={setResumeTab}
        options={[
          { value: "file", label: "Upload File" },
          { value: "text", label: "Paste Text" },
        ]}
      />

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
            className="w-full border-[#1e1e2e] text-slate-300 hover:bg-white/[0.08] border-dashed h-24"
            disabled={uploadingResume}
          >
            {uploadingResume
              ? "Uploading..."
              : "Click to upload PDF, TXT, or MD"}
          </Button>
          <p className="text-xs text-white/35 mt-2">
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
            className="bg-white/[0.04] border-[#1e1e2e] text-slate-200 min-h-[200px] text-sm font-mono"
          />
          <Button
            onClick={handleSaveResumeText}
            variant="outline"
            className="w-full border-[#1e1e2e] text-slate-300 hover:bg-white/[0.08]"
            disabled={uploadingResume || !resumeText.trim()}
          >
            {uploadingResume ? "Saving..." : "Save Resume Text"}
          </Button>
        </div>
      )}
    </div>
  );
}
