import type { ReactNode, FormEvent } from "react";
import { STAGE_MAP } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
} from "@/components/ui/dialog";
import ErrorMessage from "@/components/common/ErrorMessage";

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
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            Move to {stage?.label}
          </DialogTitle>
          <DialogDescription>{appLabel}</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit}>
          <DialogBody>
            {children}
            {error && <ErrorMessage message={error.message} />}
          </DialogBody>

          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
