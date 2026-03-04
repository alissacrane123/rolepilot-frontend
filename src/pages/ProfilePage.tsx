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
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/BackButton";
import PageContainer from "@/components/PageContainer";
import Content from "@/components/Content";

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

function LocationsInput({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (locations: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addLocation = () => {
    const trimmed = input.trim();
    if (trimmed && !locations.includes(trimmed)) {
      onChange([...locations, trimmed]);
      setInput("");
    }
  };

  const removeLocation = (loc: string) => {
    onChange(locations.filter((l) => l !== loc));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLocation();
    }
    if (e.key === "Backspace" && input === "" && locations.length > 0) {
      removeLocation(locations[locations.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {locations.map((loc) => (
          <Badge
            key={loc}
            variant="outline"
            className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
            onClick={() => removeLocation(loc)}
          >
            {loc} ×
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a location and press Enter"
          className="bg-zinc-800 border-zinc-700 text-zinc-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addLocation}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(user?.full_name || "");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [experienceYears, setExperienceYears] = useState<string>(
    user?.experience_years?.toString() || "",
  );
  const [targetRole, setTargetRole] = useState(user?.target_role || "");
  const [salaryMin, setSalaryMin] = useState<string>(
    user?.target_salary_min?.toString() || "",
  );
  const [salaryMax, setSalaryMax] = useState<string>(
    user?.target_salary_max?.toString() || "",
  );
  const [locations, setLocations] = useState<string[]>(
    user?.preferred_locations || [],
  );

  const [resumeText, setResumeText] = useState(user?.resume_text || "");
  const [resumeTab, setResumeTab] = useState<"file" | "text">(
    user?.resume_text ? "text" : "file",
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateProfileMutation = useUpdateProfileMutation();
  const uploadResumeMutation = useUploadResumeMutation();
  const uploadResumeTextMutation = useUploadResumeTextMutation();

  const saving = updateProfileMutation.isPending;
  const uploadingResume =
    uploadResumeMutation.isPending || uploadResumeTextMutation.isPending;

  const handleSaveProfile = async () => {
    setError("");
    setMessage("");

    try {
      await updateProfileMutation.mutateAsync({
        full_name: fullName,
        skills,
        experience_years: experienceYears
          ? parseInt(experienceYears)
          : undefined,
        target_role: targetRole || undefined,
        target_salary_min: salaryMin ? parseInt(salaryMin) : undefined,
        target_salary_max: salaryMax ? parseInt(salaryMax) : undefined,
        preferred_locations: locations,
      });
      await refreshUser();
      setMessage("Profile updated!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setMessage("");

    try {
      const res = await uploadResumeMutation.mutateAsync(file);
      if (res.data?.resume_text) {
        setResumeText(res.data.resume_text);
      }
      await refreshUser();
      setMessage("Resume uploaded!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveResumeText = async () => {
    if (!resumeText.trim()) return;
    setError("");
    setMessage("");

    try {
      await uploadResumeTextMutation.mutateAsync(resumeText);
      await refreshUser();
      setMessage("Resume text saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <PageContainer>
      {/* Header */}
      <Content>
        <BackButton />

        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Status Messages */}
          {message && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-md px-4 py-2">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-md px-4 py-2">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Basic Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Full Name</Label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Email</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="bg-zinc-800/50 border-zinc-700 text-zinc-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="Senior Software Engineer"
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillsInput skills={skills} onChange={setSkills} />
            </CardContent>
          </Card>

          {/* Job Preferences */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-zinc-100">Job Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-zinc-300 mb-2 block">Salary Range</Label>
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
              <div>
                <Label className="text-zinc-300 mb-2 block">
                  Preferred Locations
                </Label>
                <LocationsInput locations={locations} onChange={setLocations} />
              </div>
            </CardContent>
          </Card>

          {/* Save Profile */}
          <Button
            onClick={handleSaveProfile}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </Button>

          {/* Resume */}
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-zinc-100">Resume</CardTitle>
                {user?.resume_text && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400"
                  >
                    Resume on file
                  </Badge>
                )}
              </div>
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
            </CardContent>
          </Card>
        </div>
      </Content>
    </PageContainer>
  );
}
