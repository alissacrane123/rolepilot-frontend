import { useState } from "react";
import { updateStage, STAGE_MAP } from "@/lib/api";
import type { JobApplication } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TimePicker from "@/components/ui/time-picker";

export interface StageTransition {
  app: JobApplication;
  fromStage: string;
  toStage: string;
}

interface TransitionField {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "date" | "time";
}

/**
 * Returns extra fields to collect based on the target stage.
 * This is the single place to extend when new stage-specific data is needed.
 */
function getFieldsForStage(toStage: string): TransitionField[] {
  switch (toStage) {
    case "phone_screen":
      return [
        {
          key: "scheduled_date",
          label: "Scheduled Date",
          placeholder: "",
          type: "date",
        },
        {
          key: "scheduled_time",
          label: "Scheduled Time",
          placeholder: "",
          type: "time",
        },
        {
          key: "interviewer",
          label: "Interviewer / Recruiter",
          placeholder: "Jane Smith",
          type: "text",
        },
      ];
    case "technical_interview":
      return [
        {
          key: "scheduled_date",
          label: "Interview Date",
          placeholder: "",
          type: "date",
        },
        {
          key: "scheduled_time",
          label: "Interview Time",
          placeholder: "",
          type: "time",
        },
        {
          key: "interview_type",
          label: "Interview Type",
          placeholder: "Live coding, system design, etc.",
          type: "text",
        },
      ];
    case "onsite_final":
      return [
        {
          key: "scheduled_date",
          label: "Onsite Date",
          placeholder: "",
          type: "date",
        },
        {
          key: "scheduled_time",
          label: "Onsite Time",
          placeholder: "",
          type: "time",
        },
      ];
    case "offer":
      return [
        {
          key: "offer_amount",
          label: "Offer Amount",
          placeholder: "$180,000",
          type: "text",
        },
        {
          key: "deadline",
          label: "Decision Deadline",
          placeholder: "",
          type: "date",
        },
      ];
    case "rejected":
      return [
        {
          key: "rejection_reason",
          label: "Reason (if known)",
          placeholder: "Position filled, not a fit, etc.",
          type: "text",
        },
      ];
    case "withdrawn":
      return [
        {
          key: "withdrawal_reason",
          label: "Reason",
          placeholder: "Accepted another offer, lost interest, etc.",
          type: "text",
        },
      ];
    default:
      return [];
  }
}

function needsConfirmation(toStage: string): boolean {
  const extraFields = getFieldsForStage(toStage);
  return (
    extraFields.length > 0 ||
    ["rejected", "withdrawn", "accepted"].includes(toStage)
  );
}

export { needsConfirmation };

export default function StageTransitionModal({
  transition,
  onConfirm,
  onCancel,
}: {
  transition: StageTransition;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const { app, toStage } = transition;
  const stage = STAGE_MAP[toStage];
  const extraFields = getFieldsForStage(toStage);

  const [notes, setNotes] = useState("");
  const [extraValues, setExtraValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setExtra = (key: string, value: string) =>
    setExtraValues((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const scheduledDate = extraValues["scheduled_date"];
    const scheduledTime = extraValues["scheduled_time"];
    const interviewer = extraValues["interviewer"];
    const interviewType = extraValues["interview_type"];

    let scheduledAt: string | undefined;
    if (scheduledDate) {
      const dateTime = new Date(
        `${scheduledDate}T${scheduledTime || "00:00:00"}`,
      );
      scheduledAt = dateTime.toISOString();
    }

    console.log({ scheduledAt });
    const meeting = scheduledAt
      ? {
          scheduled_at: scheduledAt,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          location_type: "video" as const,
          ...(interviewer && { contact_name: interviewer }),
          ...(interviewType && { meeting_type: interviewType }),
        }
      : undefined;

    const allNotes = [
      notes,
      ...extraFields
        .filter((f) => extraValues[f.key])
        .map((f) => `${f.label}: ${extraValues[f.key]}`),
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await updateStage(app.id, toStage, allNotes, meeting);
      onConfirm();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{stage?.emoji}</span>
            Move to {stage?.label}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {app.role_title} at {app.company_name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {extraFields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label className="text-zinc-300">{field.label}</Label>
              {field.type === "textarea" ? (
                <Textarea
                  value={extraValues[field.key] || ""}
                  onChange={(e) => setExtra(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px]"
                />
              ) : field.type === "time" ? (
                <TimePicker
                  value={extraValues[field.key] || ""}
                  onChange={(val) => setExtra(field.key, val)}
                />
              ) : (
                <Input
                  type={field.type === "date" ? "date" : "text"}
                  value={extraValues[field.key] || ""}
                  onChange={(e) => setExtra(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="bg-zinc-800 border-zinc-700 text-zinc-100"
                />
              )}
            </div>
          ))}

          <div className="space-y-2">
            <Label className="text-zinc-300">Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this transition..."
              className="bg-zinc-800 border-zinc-700 text-zinc-100 min-h-[80px]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-400/10 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 text-zinc-400 hover:text-zinc-100"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? "Moving..." : "Confirm Move"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
