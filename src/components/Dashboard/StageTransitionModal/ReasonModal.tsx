import { useState } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TransitionModalShell from "./TransitionModalShell";

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
      <div className="space-y-2">
        <Label className="text-zinc-300">{config.reason}</Label>
        <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder={config.placeholder} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional notes..." className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px]" />
      </div>
    </TransitionModalShell>
  );
}
