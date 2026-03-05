import { useState } from "react";
import { type JobApplication, STAGES } from "@/lib/api";
import { useUpdateStageMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ErrorMessage from "@/components/common/ErrorMessage";

const TERMINAL_STAGES = ["accepted", "rejected", "withdrawn"];

export default function MoveStageDialog({
  app,
  onMoved,
}: {
  app: JobApplication;
  onMoved: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [toStage, setToStage] = useState("");
  const [notes, setNotes] = useState("");
  const mutation = useUpdateStageMutation();

  if (TERMINAL_STAGES.includes(app.current_stage)) return null;

  const availableStages = STAGES.filter((s) => s.key !== app.current_stage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!toStage) return;

    try {
      await mutation.mutateAsync({
        id: app.id,
        toStage,
        notes,
      });
      setOpen(false);
      setToStage("");
      setNotes("");
      onMoved();
    } catch {
      // error handled by mutation.error
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Move Stage</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0f0f1a] border-[#1e1e2e] text-slate-100">
        <DialogHeader>
          <DialogTitle>Update Application Stage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-slate-300">Move to</Label>
            <Select value={toStage} onValueChange={setToStage}>
              <SelectTrigger className="bg-white/[0.04] border-[#1e1e2e] text-slate-200">
                <SelectValue placeholder="Select stage..." />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f1a] border-[#1e1e2e]">
                {availableStages.map((s) => (
                  <SelectItem
                    key={s.key}
                    value={s.key}
                    className="text-slate-200"
                  >
                    {s.emoji} {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview notes, feedback, next steps..."
              className="bg-white/[0.04] border-[#1e1e2e] text-slate-200 min-h-[80px]"
            />
          </div>
          <ErrorMessage message={(mutation.error as Error)?.message} />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={mutation.isPending || !toStage}
          >
            {mutation.isPending ? "Updating..." : "Update Stage"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
