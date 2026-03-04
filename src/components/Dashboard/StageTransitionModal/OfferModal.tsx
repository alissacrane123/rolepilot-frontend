import { useState } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TransitionModalShell from "./TransitionModalShell";
import { PartyPopperIcon } from "lucide-react";

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
        <div className="space-y-2">
          <Label className="text-zinc-300">Offer Amount</Label>
          <Input value={offerAmount} onChange={(e) => setOfferAmount(e.target.value)} placeholder="$180,000" className="bg-zinc-800 border-zinc-700 text-zinc-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-zinc-300">Decision Deadline</Label>
          <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-zinc-800 border-zinc-700 text-zinc-100" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-300">Notes</Label>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about this offer..." className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px]" />
      </div>
    </TransitionModalShell>
  );
}
