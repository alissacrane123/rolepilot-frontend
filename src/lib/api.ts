const API_BASE = "http://localhost:8080/api";

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  full_name: string;
  resume_url?: string;
  resume_text?: string;
  skills: string[];
  experience_years?: number;
  target_role?: string;
  target_salary_min?: number;
  target_salary_max?: number;
  preferred_locations: string[];
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_url?: string;
  raw_posting_text?: string;
  company_name?: string;
  company_summary?: string;
  role_title?: string;
  role_summary?: string;
  required_skills: string[];
  nice_to_have_skills: string[];
  key_technologies: string[];
  experience_level?: string;
  salary_range?: string;
  location?: string;
  remote_policy?: string;
  match_score?: number;
  matching_strengths: string[];
  potential_gaps: string[];
  interview_focus_areas: string[];
  suggested_talking_points: string[];
  current_stage: string;
  processing_status: string;
  applied_at: string;
  created_at: string;
  updated_at: string;
  stage_history?: StageHistory[];
}

export interface StageHistory {
  id: string;
  application_id: string;
  from_stage?: string;
  to_stage: string;
  notes?: string;
  moved_at: string;
}

export interface BoardView {
  applied: JobApplication[];
  recruiter_response: JobApplication[];
  phone_screen: JobApplication[];
  technical_interview: JobApplication[];
  onsite_final: JobApplication[];
  offer: JobApplication[];
  accepted: JobApplication[];
  rejected: JobApplication[];
  withdrawn: JobApplication[];
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface Meeting {
  id: string;
  application_id: string;
  user_id: string;
  stage: string;
  scheduled_at?: string;
  duration_minutes?: number;
  timezone?: string;
  location_type: string;
  location_details?: string;
  meeting_type?: string;
  contact_name?: string;
  contact_title?: string;
  prep_notes?: string;
  post_notes?: string;
  outcome?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMeetingData {
  scheduled_at?: string;
  duration_minutes?: number;
  timezone?: string;
  location_type: string;
  location_details?: string;
  meeting_type?: string;
  contact_name?: string;
  contact_title?: string;
  prep_notes?: string;
}

// ============================================
// HTTP HELPERS
// ============================================

function getToken(): string | null {
  return localStorage.getItem("token");
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<APIResponse<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData requests
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// ============================================
// AUTH
// ============================================

export async function register(
  email: string,
  password: string,
  full_name: string,
) {
  const res = await request<{ token: string; user: User }>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, full_name }),
  });
  if (res.data?.token) {
    setToken(res.data.token);
  }
  return res;
}

export async function login(email: string, password: string) {
  const res = await request<{ token: string; user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (res.data?.token) {
    setToken(res.data.token);
  }
  return res;
}

// ============================================
// PROFILE
// ============================================

export async function getProfile() {
  return request<User>("/profile");
}

export async function updateProfile(data: {
  full_name?: string;
  skills?: string[];
  experience_years?: number;
  target_role?: string;
  target_salary_min?: number;
  target_salary_max?: number;
  preferred_locations?: string[];
}) {
  return request<User>("/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function uploadResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  return request<User>("/profile/resume", {
    method: "POST",
    body: formData,
  });
}

export async function uploadResumeText(resume_text: string) {
  return request<User>("/profile/resume/text", {
    method: "POST",
    body: JSON.stringify({ resume_text }),
  });
}

// ============================================
// APPLICATIONS
// ============================================

export async function createApplication(data: {
  job_url?: string;
  raw_posting_text?: string;
  company_name?: string;
  role_title?: string;
}) {
  return request<JobApplication>("/applications", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getApplications() {
  return request<JobApplication[]>("/applications");
}

export async function getBoard() {
  return request<BoardView>("/applications/board");
}

export async function getApplication(id: string) {
  return request<JobApplication>(`/applications/${id}`);
}

export async function updateStage(
  id: string,
  to_stage: string,
  notes: string,
  meeting?: CreateMeetingData,
) {
  return request<JobApplication>(`/applications/${id}/stage`, {
    method: "PATCH",
    body: JSON.stringify({ to_stage, notes, meeting }),
  });
}

export async function getStageHistory(id: string) {
  return request<StageHistory[]>(`/applications/${id}/history`);
}

// ============================================
// MEETING
// ============================================

export async function createMeeting(
  applicationId: string,
  data: CreateMeetingData,
) {
  return request<Meeting>(`/applications/${applicationId}/meetings`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMeetings(applicationId: string) {
  return request<Meeting[]>(`/applications/${applicationId}/meetings`);
}

export async function getUpcomingMeetings() {
  return request<Meeting[]>("/meetings/upcoming");
}

export async function updateMeeting(
  meetingId: string,
  data: Partial<CreateMeetingData> & { post_notes?: string; outcome?: string },
) {
  return request<Meeting>(`/meetings/${meetingId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteMeeting(meetingId: string) {
  return request<void>(`/meetings/${meetingId}`, {
    method: "DELETE",
  });
}

// ============================================
// HELPERS
// ============================================

export const MEETING_TYPES = [
  { value: "phone_screen", label: "Phone Screen" },
  { value: "technical", label: "Technical" },
  { value: "system_design", label: "System Design" },
  { value: "behavioral", label: "Behavioral" },
  { value: "hiring_manager", label: "Hiring Manager" },
  { value: "culture_fit", label: "Culture Fit" },
  { value: "take_home", label: "Take Home" },
  { value: "panel", label: "Panel" },
  { value: "other", label: "Other" },
] as const;

export const LOCATION_TYPES = [
  { value: "video", label: "Video Call" },
  { value: "phone", label: "Phone" },
  { value: "onsite", label: "Onsite" },
] as const;

export const STAGES = [
  { key: "applied", label: "Applied", emoji: "📨", color: "#6366f1" },
  {
    key: "recruiter_response",
    label: "Recruiter Response",
    emoji: "📞",
    color: "#8b5cf6",
  },
  { key: "phone_screen", label: "Phone Screen", emoji: "🎧", color: "#a78bfa" },
  {
    key: "technical_interview",
    label: "Technical Interview",
    emoji: "💻",
    color: "#c4b5fd",
  },
  {
    key: "onsite_final",
    label: "Onsite / Final",
    emoji: "🏢",
    color: "#ddd6fe",
  },
  { key: "offer", label: "Offer", emoji: "🎉", color: "#34d399" },
  { key: "accepted", label: "Accepted", emoji: "✅", color: "#22c55e" },
  { key: "rejected", label: "Rejected", emoji: "❌", color: "#ef4444" },
  { key: "withdrawn", label: "Withdrawn", emoji: "🚪", color: "#71717a" },
] as const;

export const STAGE_MAP = Object.fromEntries(
  STAGES.map((s) => [s.key, s]),
) as Record<string, (typeof STAGES)[number]>;
