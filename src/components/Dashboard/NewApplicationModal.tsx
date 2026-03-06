import { useState } from "react";
import { useCreateApplicationMutation } from "@/hooks/useApi";
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
import InputField from "@/components/common/InputField";
import InputLabel from "@/components/common/InputLabel";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function NewApplicationModal({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [postingText, setPostingText] = useState("");
  const mutation = useCreateApplicationMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await mutation.mutateAsync({
        company_name: companyName || undefined,
        role_title: roleTitle || undefined,
        job_url: jobUrl || undefined,
        raw_posting_text: postingText || undefined,
      });
      setOpen(false);
      setCompanyName("");
      setRoleTitle("");
      setJobUrl("");
      setPostingText("");
      onCreated();
    } catch {
      // error handled by mutation.error
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="primary">+ New Application</Button>
      </DialogTrigger>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="grid grid-cols-2 gap-3">
              <InputField
                label="Company"
                value={companyName}
                onChange={setCompanyName}
                placeholder="Stripe"
              />
              <InputField
                label="Role Title"
                value={roleTitle}
                onChange={setRoleTitle}
                placeholder="Senior Engineer"
              />
            </div>
            <InputField
              label="Job URL"
              value={jobUrl}
              onChange={setJobUrl}
              placeholder="https://boards.greenhouse.io/..."
            />
            <div className="space-y-1.5">
              <InputLabel label="Job Description">
                Job Description{" "}
                <span className="text-white/15 font-normal">
                  (paste for AI analysis)
                </span>
              </InputLabel>
              <InputField
                isTextarea
                value={postingText}
                onChange={setPostingText}
                placeholder="Paste the full job description here..."
              />
            </div>
            <ErrorMessage message={(mutation.error as Error)?.message} />
          </DialogBody>
          <DialogFooter>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
