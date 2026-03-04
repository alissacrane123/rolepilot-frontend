import { useState } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TransitionModalShell from "./TransitionModalShell";

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
      <div className="space-y-2">
        <Label className="text-zinc-300">Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this transition..." className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px]" />
      </div>
    </TransitionModalShell>
  );
}
