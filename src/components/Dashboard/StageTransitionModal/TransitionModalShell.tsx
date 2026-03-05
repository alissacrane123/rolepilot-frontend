import type { ReactNode, FormEvent } from "react";
import { STAGE_MAP } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/ErrorMessage";

export default function TransitionModalShell({
  toStage,
  appLabel,
  isPending,
  error,
  onSubmit,
  onCancel,
  children,
  icon,
}: {
  toStage: string;
  appLabel: string;
  isPending: boolean;
  error: Error | null;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  children: ReactNode;
  icon?: ReactNode;
}) {
  const stage = STAGE_MAP[toStage];

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 ">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            Move to {stage?.label}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {appLabel}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {children}

          {error && <ErrorMessage message={error.message} />}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={isPending}
            >
              {isPending ? "Moving..." : "Confirm Move"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
