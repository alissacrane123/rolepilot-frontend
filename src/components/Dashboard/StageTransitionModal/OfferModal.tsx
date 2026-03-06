import { useState } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import TransitionModalShell from "./TransitionModalShell";
import { PartyPopperIcon } from "lucide-react";
import InputField from "@/components/common/InputField";

export default function OfferModal({ transition, onConfirm, onCancel }: StageModalProps) {
  const { app, toStage } = transition;
  const mutation = useUpdateStageMutation();

  const [offerAmount, setOfferAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parts = [notes];
    if (offerAmount) parts.push(`Offer Amount: ${offerAmount}`);
    if (deadline) parts.push(`Decision Deadline: ${deadline}`);
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
      icon={<PartyPopperIcon className="w-4 h-4" />}
    >
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Offer Amount"
          value={offerAmount}
          onChange={setOfferAmount}
          placeholder="$180,000"
        />
        <InputField
          label="Decision Deadline"
          type="date"
          value={deadline}
          onChange={setDeadline}
        />
      </div>

      <InputField
        label="Notes"
        isTextarea
        value={notes}
        onChange={setNotes}
        placeholder="Add notes about this offer..."
      />
    </TransitionModalShell>
  );
}
