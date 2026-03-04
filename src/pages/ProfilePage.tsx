import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  useUpdateProfileMutation,
  useUploadResumeMutation,
  useUploadResumeTextMutation,
  
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BackButton from "@/components/BackButton";
import PageContainer from "@/components/PageContainer";
import Content from "@/components/Content";
import ProfileHero from "@/components/Profile/ProfileHero";
import { HStack, VStack } from "@/components/ui/stacks";
import ProfileSection from "@/components/Profile/ProfileSection";
import InputField from "@/components/ui/InputField";
import SkillsInput from "@/components/Profile/SkillsInput";
import ResumeForm from "@/components/Profile/ResumeForm";
import InputLabel from "@/components/ui/InputLabel";
import LocationsInput from "@/components/Profile/LocationsInput";
import Grid from "@/components/ui/Grid";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
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
      <Content>
        <BackButton />

        <HStack className="gap-3">
          <VStack className="gap-3 min-w-[300px]">
            <ProfileHero user={user} />
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Profile"}
            </Button>
          </VStack>
          <div className="flex-1">
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

            <ProfileSection
              title="Basic Info"
              description="Your contact details and background"
            >
              <Grid cols={2}>
                <InputField
                  label="Full Name"
                  value={fullName}
                  onChange={(v) => setFullName(v)}
                />
                <InputField label="Email" value={user?.email || ""} disabled />
                <InputField
                  label="Years of Experience"
                  value={experienceYears}
                  onChange={(v) => setExperienceYears(v)}
                  mono
                />
                <InputField
                  label="Target Role"
                  value={targetRole}
                  onChange={(v) => setTargetRole(v)}
                />
              </Grid>
            </ProfileSection>

            <ProfileSection
              title="Skills"
              description="Your skills and expertise"
            >
              <SkillsInput skills={skills} onChange={setSkills} />
            </ProfileSection>

            <ProfileSection
              title="Job Preferences"
              description="Your job preferences and salary range"
            >
              <VStack className="gap-2">
                <InputLabel label="Salary Range" />
                <HStack className="items-center gap-3">
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
                </HStack>
              </VStack>
              <VStack className="gap-2">
                <InputLabel label="Preferred Locations" />
                <LocationsInput locations={locations} onChange={setLocations} />
              </VStack>
            </ProfileSection>

            <ProfileSection
              title="Resume"
              description="Your resume and resume text"
            >
              <ResumeForm
                resumeText={resumeText}
                setResumeText={setResumeText}
                uploadingResume={uploadingResume}
                handleSaveResumeText={handleSaveResumeText}
                handleFileUpload={handleFileUpload}
              />
            </ProfileSection>
          </div>
        </HStack>
      </Content>
    </PageContainer>
  );
}
