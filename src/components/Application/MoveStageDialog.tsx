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
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Move Stage
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Update Application Stage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-300">Move to</Label>
            <Select value={toStage} onValueChange={setToStage}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                <SelectValue placeholder="Select stage..." />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {availableStages.map((s) => (
                  <SelectItem
                    key={s.key}
                    value={s.key}
                    className="text-zinc-100"
                  >
                    {s.emoji} {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview notes, feedback, next steps..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px]"
            />
          </div>
          {mutation.error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
              {(mutation.error as Error).message}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={mutation.isPending || !toStage}
          >
            {mutation.isPending ? "Updating..." : "Update Stage"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
