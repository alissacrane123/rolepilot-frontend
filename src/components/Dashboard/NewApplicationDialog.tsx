import { useState } from "react";
import { createApplication } from "@/lib/api";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createApplication({
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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
          + New Application
        </Button>
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
          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            disabled={loading}
          >
            {loading ? "Creating..." : "Add Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
