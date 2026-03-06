import { useState } from "react";
import { STAGES } from "@/lib/api";
import { TERMINAL_STAGES } from "@/lib/constants";
import { useUpdateStageMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputField from "@/components/common/InputField";
import InputLabel from "@/components/common/InputLabel";
import ErrorMessage from "@/components/common/ErrorMessage";
import type { MoveStageModalProps } from "./types";

const INPUT_CLASS = "bg-white/[0.04] border-[#1e1e2e] text-slate-200";

export function MoveStageModal({ app, onMoved }: MoveStageModalProps) {
  const [isOpen, setIsOpen] = useState(false);
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
      setIsOpen(false);
      setToStage("");
      setNotes("");
      onMoved();
    } catch {
      // error handled by mutation.error
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Move Stage</Button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Update Application Stage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="space-y-2">
              <InputLabel label="Move to" />
              <Select value={toStage} onValueChange={setToStage}>
                <SelectTrigger className={INPUT_CLASS}>
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
            <InputField
              label="Notes"
              isTextarea
              value={notes}
              onChange={setNotes}
              placeholder="Add interview notes, feedback, next steps..."
            />
            <ErrorMessage message={(mutation.error as Error)?.message} />
          </DialogBody>
          <DialogFooter>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={mutation.isPending || !toStage}
            >
              {mutation.isPending ? "Updating..." : "Update Stage"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default MoveStageModal;
