import { useState } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import TransitionModalShell from "./TransitionModalShell";
import InputField from "@/components/common/InputField";

export default function ConfirmTransitionModal({ transition, onConfirm, onCancel }: StageModalProps) {
  const { app, toStage } = transition;
  const mutation = useUpdateStageMutation();
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({ id: app.id, toStage, notes });
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
        label="Notes"
        isTextarea
        value={notes}
        onChange={setNotes}
        placeholder="Add notes about this transition..."
      />
    </TransitionModalShell>
  );
}
