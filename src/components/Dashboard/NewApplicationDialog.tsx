import { useState } from "react";
import { useCreateApplicationMutation } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ErrorMessage from "@/components/ErrorMessage";

export default function NewApplicationDialog({
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
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Job Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-zinc-300">Company</Label>
              <Input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Stripe"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-300">Role Title</Label>
              <Input
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="Senior Engineer"
                className="bg-zinc-800 border-zinc-700 text-zinc-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">Job URL</Label>
            <Input
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://boards.greenhouse.io/..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-300">
              Job Description{" "}
              <span className="text-zinc-500 font-normal">
                (paste for AI analysis)
              </span>
            </Label>
            <Textarea
              value={postingText}
              onChange={(e) => setPostingText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[120px]"
            />
          </div>
          <ErrorMessage message={(mutation.error as Error)?.message} />
          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Add Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
