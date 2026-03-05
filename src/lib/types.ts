export type ValidStage =
  | "saved"
  | "applied"
  | "recruiter_response"
  | "phone_screen"
  | "technical_interview"
  | "onsite_final"
  | "offer"
  | "rejected"
  | "withdrawn";

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
  location_type?: string;
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
  location_type?: string;
  location_details?: string;
  meeting_type?: string;
  contact_name?: string;
  contact_title?: string;
  prep_notes?: string;
}

export interface CoverLetter {
  id: string;
  application_id: string;
  content: string;
  version: number;
  tone: string;
  created_at: string;
}

export interface Note {
  id: string;
  application_id: string;
  user_id: string;
  title: string;
  content?: string;
  created_at: string;
  updated_at: string;
}
