import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import CreateMeetingForm, {
  type CreateMeetingSubmitParams,
} from "./CreateMeetingForm";
import { useCreateMeetingMutation } from "@/hooks/useApi";
import { useState } from "react";
import { Button } from "../ui/button";

export default function CreateMeetingModal({
  applicationId,
  stage,
  onConfirm,
}: {
  applicationId: string;
  stage?: string;
  onConfirm?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const mutation = useCreateMeetingMutation();

  const handleSubmit = async (params: CreateMeetingSubmitParams) => {
    await mutation.mutateAsync({
      applicationId,
      meeting: params.meeting,
    });
    onConfirm?.();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">Create Meeting</Button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Create Meeting</DialogTitle>
        </DialogHeader>
        <CreateMeetingForm
          applicationId={applicationId}
          stage={stage}
          onConfirm={onConfirm}
          onCancel={() => setOpen(false)}
          onSubmit={handleSubmit}
          isPending={mutation.isPending}
          cta="Create Meeting"
        />
      </DialogContent>
    </Dialog>
  );
}
