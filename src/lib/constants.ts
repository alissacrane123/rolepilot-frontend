export type ViewMode = "board" | "list";

export const ALWAYS_VISIBLE_STAGES = [
  "saved",
  "applied",
  "recruiter_response",
  "phone_screen",
  "technical_interview",
  "onsite_final",
  "offer",
  "rejected",
  // "withdrawn",
];

export const TERMINAL_STAGES = ["accepted", "rejected", "withdrawn"];

export type Stage  = {
  key: string;
  label: string;
  emoji: string;
  color: string;
}

export type ViewState = "start" | "end";