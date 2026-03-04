import type { JobApplication } from "@/lib/api";

export interface StageTransition {
  app: JobApplication;
  fromStage: string;
  toStage: string;
}

export interface StageModalProps {
  transition: StageTransition;
  onConfirm: () => void;
  onCancel: () => void;
}

const STAGES_REQUIRING_CONFIRMATION = new Set([
  "phone_screen",
  "technical_interview",
  "onsite_final",
  "offer",
  "rejected",
  "withdrawn",
  "accepted",
]);

export function needsConfirmation(toStage: string): boolean {
  return STAGES_REQUIRING_CONFIRMATION.has(toStage);
}
