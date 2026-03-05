import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  useUpdateProfileMutation,
  useUploadResumeMutation,
  useUploadResumeTextMutation,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SkillsInput from "@/components/Profile/SkillsInput";
import ErrorMessage from "@/components/common/ErrorMessage";
import TabToggle from "@/components/common/TabToggle";

export default function OnboardingPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);

  const [resumeTab, setResumeTab] = useState<"file" | "text">("file");
  const [resumeText, setResumeText] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const [error, setError] = useState("");

  const uploadResumeMutation = useUploadResumeMutation();
  const uploadResumeTextMutation = useUploadResumeTextMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const uploadingResume =
    uploadResumeMutation.isPending || uploadResumeTextMutation.isPending;
  const saving = updateProfileMutation.isPending;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");

    try {
      const res = await uploadResumeMutation.mutateAsync(file);
      if (res.data?.resume_text) {
        setResumeText(res.data.resume_text);
      }
      setResumeUploaded(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveResumeText = async () => {
    if (!resumeText.trim()) return;
    setError("");

    try {
      await uploadResumeTextMutation.mutateAsync(resumeText);
      setResumeUploaded(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFinish = async () => {
    setError("");

    try {
      await updateProfileMutation.mutateAsync({
        skills: skills.length > 0 ? skills : undefined,
        experience_years: experienceYears
          ? parseInt(experienceYears)
          : undefined,
        target_role: targetRole || undefined,
        target_salary_min: salaryMin ? parseInt(salaryMin) : undefined,
        target_salary_max: salaryMax ? parseInt(salaryMax) : undefined,
      });
      await refreshUser();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`h-1.5 w-16 rounded-full ${
              step >= 1 ? "bg-indigo-500" : "bg-white/[0.04]"
            }`}
          />
          <div
            className={`h-1.5 w-16 rounded-full ${
              step >= 2 ? "bg-indigo-500" : "bg-white/[0.04]"
            }`}
          />
        </div>

        {/* Step 1: Resume */}
        {step === 1 && (
          <Card className="bg-[#0a0a0f] border-[#1e1e2e]">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">📄</div>
              <CardTitle className="text-xl text-slate-100">
                Upload Your Resume
              </CardTitle>
              <p className="text-sm text-white/40 mt-1">
                This powers AI job matching and interview prep
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    className={`w-full border-dashed h-28 transition-colors ${
                      resumeUploaded
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                        : "border-[#1e1e2e] text-slate-300 hover:bg-white/[0.08]"
                    }`}
                    disabled={uploadingResume}
                  >
                    {uploadingResume
                      ? "Uploading..."
                      : resumeUploaded
                        ? "✓ Resume uploaded — click to replace"
                        : "Click to upload PDF, TXT, or MD"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Textarea
                    value={resumeText}
                    onChange={(e) => {
                      setResumeText(e.target.value);
                      setResumeUploaded(false);
                    }}
                    placeholder="Paste your resume text here..."
                    className="bg-white/[0.04] border-[#1e1e2e] text-slate-200 min-h-[180px] text-sm font-mono"
                  />
                  {!resumeUploaded && resumeText.trim() && (
                    <Button
                      onClick={handleSaveResumeText}
                      variant="outline"
                      className="w-full border-[#1e1e2e] text-slate-300 hover:bg-white/[0.08]"
                      disabled={uploadingResume}
                    >
                      {uploadingResume ? "Saving..." : "Save Resume Text"}
                    </Button>
                  )}
                  {resumeUploaded && (
                    <div className="text-sm text-emerald-400 text-center">
                      ✓ Resume text saved
                    </div>
                  )}
                </div>
              )}

              <ErrorMessage message={error} />

              <Button
                onClick={() => {
                  setError("");
                  setStep(2);
                }}
                variant="primary"
                className="w-full"
                disabled={!resumeUploaded}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile Info */}
        {step === 2 && (
          <Card className="bg-[#0a0a0f] border-[#1e1e2e]">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <CardTitle className="text-xl text-slate-100">
                Tell Us About Your Search
              </CardTitle>
              <p className="text-sm text-white/40 mt-1">
                This helps AI tailor analysis to your goals
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-slate-300">Years of Experience</Label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                    className="bg-white/[0.04] border-[#1e1e2e] text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-300">Target Role</Label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Senior Engineer"
                    className="bg-white/[0.04] border-[#1e1e2e] text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Skills</Label>
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Salary Range</Label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="180,000"
                      className="bg-white/[0.04] border-[#1e1e2e] text-slate-200 pl-7"
                    />
                  </div>
                  <span className="text-white/35">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="250,000"
                      className="bg-white/[0.04] border-[#1e1e2e] text-slate-200 pl-7"
                    />
                  </div>
                </div>
              </div>

              <ErrorMessage message={error} />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-[#1e1e2e] text-slate-300 hover:bg-white/[0.08]"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinish}
                  variant="primary"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Start Tracking Jobs"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
