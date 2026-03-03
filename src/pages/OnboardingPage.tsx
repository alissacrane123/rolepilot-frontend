import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { updateProfile, uploadResume, uploadResumeText } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

function SkillsInput({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
            onClick={() => removeSkill(skill)}
          >
            {skill} ×
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="bg-zinc-800 border-zinc-700 text-zinc-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addSkill}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);

  // Step 1: Resume
  const [resumeTab, setResumeTab] = useState<"file" | "text">("file");
  const [resumeText, setResumeText] = useState("");
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);

  // Step 2: Profile
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  // UI
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError("");

    try {
      const res = await uploadResume(file);
      if (res.data?.resume_text) {
        setResumeText(res.data.resume_text);
      }
      setResumeUploaded(true);
      // await refreshUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingResume(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveResumeText = async () => {
    if (!resumeText.trim()) return;
    setUploadingResume(true);
    setError("");

    try {
      await uploadResumeText(resumeText);
      setResumeUploaded(true);
      // await refreshUser();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploadingResume(false);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    setError("");

    try {
      await updateProfile({
        skills: skills.length > 0 ? skills : undefined,
        experience_years: experienceYears ? parseInt(experienceYears) : undefined,
        target_role: targetRole || undefined,
        target_salary_min: salaryMin ? parseInt(salaryMin) : undefined,
        target_salary_max: salaryMax ? parseInt(salaryMax) : undefined,
      });
      await refreshUser();
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div
            className={`h-1.5 w-16 rounded-full ${
              step >= 1 ? "bg-indigo-500" : "bg-zinc-800"
            }`}
          />
          <div
            className={`h-1.5 w-16 rounded-full ${
              step >= 2 ? "bg-indigo-500" : "bg-zinc-800"
            }`}
          />
        </div>

        {/* Step 1: Resume */}
        {step === 1 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">📄</div>
              <CardTitle className="text-xl text-zinc-100">
                Upload Your Resume
              </CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                This powers AI job matching and interview prep
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    className={`w-full border-dashed h-28 transition-colors ${
                      resumeUploaded
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/5"
                        : "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
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
                    className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[180px] text-sm font-mono"
                  />
                  {!resumeUploaded && resumeText.trim() && (
                    <Button
                      onClick={handleSaveResumeText}
                      variant="outline"
                      className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800"
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

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                onClick={() => {
                  setError("");
                  setStep(2);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                disabled={!resumeUploaded}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Profile Info */}
        {step === 2 && (
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <CardTitle className="text-xl text-zinc-100">
                Tell Us About Your Search
              </CardTitle>
              <p className="text-sm text-zinc-400 mt-1">
                This helps AI tailor analysis to your goals
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Years of Experience</Label>
                  <Input
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="5"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Target Role</Label>
                  <Input
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    placeholder="Senior Engineer"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Skills</Label>
                <SkillsInput skills={skills} onChange={setSkills} />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Salary Range</Label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      placeholder="180,000"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-7"
                    />
                  </div>
                  <span className="text-zinc-500">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      placeholder="250,000"
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 pl-7"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                >
                  Back
                </Button>
                <Button
                  onClick={handleFinish}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
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