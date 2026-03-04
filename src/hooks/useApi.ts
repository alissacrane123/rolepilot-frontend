import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoard,
  getApplication,
  getApplications,
  getMeetings,
  getUpcomingMeetings,
  getProfile,
  createApplication,
  updateStage,
  updateProfile,
  uploadResume,
  uploadResumeText,
  updateMeeting,
  deleteMeeting,
  type CreateMeetingData,
} from "@/lib/api";

export const queryKeys = {
  board: ["board"] as const,
  application: (id: string) => ["application", id] as const,
  applications: ["applications"] as const,
  meetings: (applicationId: string) => ["meetings", applicationId] as const,
  upcomingMeetings: ["meetings", "upcoming"] as const,
  profile: ["profile"] as const,
};

// ============================================
// QUERIES
// ============================================

export function useBoardQuery() {
  return useQuery({
    queryKey: queryKeys.board,
    queryFn: async () => {
      const res = await getBoard();
      return res.data!;
    },
    refetchInterval: 5000,
  });
}

export function useApplicationQuery(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.application(id!),
    queryFn: async () => {
      const res = await getApplication(id!);
      return res.data!;
    },
    enabled: !!id,
  });
}

export function useApplicationsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.applications,
    queryFn: async () => {
      const res = await getApplications();
      return res.data ?? [];
    },
    enabled,
  });
}

export function useMeetingsQuery(applicationId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.meetings(applicationId!),
    queryFn: async () => {
      const res = await getMeetings(applicationId!);
      return res.data ?? [];
    },
    enabled: !!applicationId,
  });
}

export function useUpcomingMeetingsQuery() {
  return useQuery({
    queryKey: queryKeys.upcomingMeetings,
    queryFn: async () => {
      const res = await getUpcomingMeetings();
      return res.data ?? [];
    },
    refetchInterval: 30000,
  });
}

export function useProfileQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const res = await getProfile();
      return res.data!;
    },
    enabled,
  });
}

// ============================================
// MUTATIONS
// ============================================

export function useCreateApplicationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      job_url?: string;
      raw_posting_text?: string;
      company_name?: string;
      role_title?: string;
    }) => createApplication(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.board });
      qc.invalidateQueries({ queryKey: queryKeys.applications });
    },
  });
}

export function useUpdateStageMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      toStage,
      meeting,
    }: {
      id: string;
      toStage: string;
      notes?: string;
      meeting?: CreateMeetingData;
    }) => updateStage(id, toStage, meeting),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.board });
      qc.invalidateQueries({ queryKey: queryKeys.applications });
      qc.invalidateQueries({ queryKey: queryKeys.upcomingMeetings });
    },
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      full_name?: string;
      skills?: string[];
      experience_years?: number;
      target_role?: string;
      target_salary_min?: number;
      target_salary_max?: number;
      preferred_locations?: string[];
    }) => updateProfile(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useUploadResumeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => uploadResume(file),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useUploadResumeTextMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (resumeText: string) => uploadResumeText(resumeText),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.profile });
    },
  });
}

export function useUpdateMeetingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      meetingId,
      data,
    }: {
      meetingId: string;
      data: Partial<CreateMeetingData> & {
        post_notes?: string;
        outcome?: string;
      };
    }) => updateMeeting(meetingId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.upcomingMeetings });
      qc.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}

export function useDeleteMeetingMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (meetingId: string) => deleteMeeting(meetingId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.upcomingMeetings });
      qc.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}
