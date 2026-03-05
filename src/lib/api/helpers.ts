import type {
  User,
  JobApplication,
  StageHistory,
  BoardView,
  APIResponse,
  Meeting,
  CreateMeetingData,
  CoverLetter,
  Note,
} from "@/lib/api.ts";

export type {
  User,
  JobApplication,
  StageHistory,
  BoardView,
  APIResponse,
  Meeting,
  CreateMeetingData,
  CoverLetter,
  Note,
};
import { API_BASE } from "@/config";

if (!API_BASE) {
  throw new Error("VITE_API_BASE is not set in environment");
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

export async function request<T>(
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

export const queryKeys = {
  board: ["board"] as const,
  application: (id: string) => ["application", id] as const,
  applications: ["applications"] as const,
  meetings: (applicationId: string) => ["meetings", applicationId] as const,
  upcomingMeetings: ["meetings", "upcoming"] as const,
  profile: ["profile"] as const,
  coverLetters: (applicationId: string) =>
    ["cover-letters", applicationId] as const,
  notes: (applicationId: string) => ["notes", applicationId] as const,
  todoGroups: ["todo-groups"] as const,
  todos: (groupId: string) => ["todos", groupId] as const,

  todo: (todoId: string) => ["todo", todoId] as const,
  todoReminders: (todoId: string) => ["todo-reminders", todoId] as const,
  todoNotes: (todoId: string) => ["todo-notes", todoId] as const,
  todoAttachments: (todoId: string) => ["todo-attachments", todoId] as const,
  todoLabels: (todoId: string) => ["todo-labels", todoId] as const,
  todoChecklists: (todoId: string) => ["todo-checklists", todoId] as const,
  todoComments: (todoId: string) => ["todo-comments", todoId] as const,
};
