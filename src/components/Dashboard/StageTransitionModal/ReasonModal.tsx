import { useState } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import TransitionModalShell from "./TransitionModalShell";
import InputField from "@/components/common/InputField";

const LABELS: Record<string, { reason: string; placeholder: string }> = {
  rejected: { reason: "Reason (if known)", placeholder: "Position filled, not a fit, etc." },
  withdrawn: { reason: "Reason", placeholder: "Accepted another offer, lost interest, etc." },
};

export default function ReasonModal({ transition, onConfirm, onCancel }: StageModalProps) {
  const { app, toStage } = transition;
  const config = LABELS[toStage] ?? LABELS.rejected;
  const mutation = useUpdateStageMutation();

  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parts = [notes];
    if (reason) parts.push(`${config.reason}: ${reason}`);
    const allNotes = parts.filter(Boolean).join("\n");

    try {
      await mutation.mutateAsync({ id: app.id, toStage, notes: allNotes });
      onConfirm();
    } catch { /* error surfaced via mutation.error */ }
  };

  return (
    <TransitionModalShell
      toStage={toStage}
      appLabel={`${app.role_title} at ${app.company_name}`}
      isPending={mutation.isPending}
      error={mutation.error as Error | null}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <InputField
        label={config.reason}
        value={reason}
        onChange={setReason}
        placeholder={config.placeholder}
      />

      <InputField
        label="Notes"
        isTextarea
        value={notes}
        onChange={setNotes}
        placeholder="Any additional notes..."
      />
    </TransitionModalShell>
  );
}
