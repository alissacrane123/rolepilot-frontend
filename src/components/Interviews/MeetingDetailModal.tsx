import { useState, useMemo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { type Meeting, MEETING_TYPES, LOCATION_TYPES } from "@/lib/api";
import {
  useUpdateMeetingMutation,
  useDeleteMeetingMutation,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import InputLabel from "@/components/common/InputLabel";
import TimePicker from "@/components/ui/time-picker";
import ErrorMessage from "@/components/common/ErrorMessage";
import { extractDate, extractTime } from "@/lib/dateUtils";
import InputField from "../common/InputField";

const INPUT_CLASS = "bg-white/[0.04] border-[#1e1e2e] text-slate-200";

interface MeetingFormValues {
  date: string;
  time: string;
  duration_minutes: string;
  meeting_type: string;
  location_type: string;
  location_details: string;
  contact_name: string;
  contact_title: string;
  prep_notes: string;
  post_notes: string;
  outcome: string;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <InputLabel label={label} />
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-3">{children}</div>;
}

function SelectField({
  label,
  value,
  onChange,
  placeholder,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <Field label={label}>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={INPUT_CLASS}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-[#0f0f1a] border-[#1e1e2e]">
          {options.map((t) => (
            <SelectItem
              key={t.value}
              value={t.value}
              className="text-slate-200"
            >
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

function buildInitialValues(meeting: Meeting): MeetingFormValues {
  return {
    date: extractDate(meeting.scheduled_at),
    time: extractTime(meeting.scheduled_at),
    duration_minutes: meeting.duration_minutes?.toString() ?? "",
    meeting_type: meeting.meeting_type ?? "",
    location_type: meeting.location_type ?? "",
    location_details: meeting.location_details ?? "",
    contact_name: meeting.contact_name ?? "",
    contact_title: meeting.contact_title ?? "",
    prep_notes: meeting.prep_notes ?? "",
    post_notes: meeting.post_notes ?? "",
    outcome: meeting.outcome ?? "",
  };
}

export default function MeetingDetailModal({
  meeting,
  companyName,
  roleTitle,
  onClose,
}: {
  meeting: Meeting;
  companyName?: string;
  roleTitle?: string;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const initial = useMemo(() => buildInitialValues(meeting), [meeting]);
  const [values, setValues] = useState<MeetingFormValues>(initial);
  const updateMutation = useUpdateMeetingMutation();
  const deleteMutation = useDeleteMeetingMutation();

  const set = (key: keyof MeetingFormValues, val: string) =>
    setValues((prev) => ({ ...prev, [key]: val }));

  const isDirty = useMemo(
    () =>
      (Object.keys(initial) as (keyof MeetingFormValues)[]).some(
        (k) => values[k] !== initial[k],
      ),
    [values, initial],
  );

  const handleSave = async () => {
    let scheduled_at: string | undefined;
    if (values.date) {
      const time = values.time || "00:00";
      scheduled_at = new Date(`${values.date}T${time}:00`).toISOString();
    }

    const emptyToUndef = (v: string) => v || undefined;
    try {
      await updateMutation.mutateAsync({
        meetingId: meeting.id,
        data: {
          scheduled_at,
          duration_minutes: values.duration_minutes
            ? parseInt(values.duration_minutes, 10)
            : undefined,
          meeting_type: emptyToUndef(values.meeting_type),
          location_type: emptyToUndef(values.location_type),
          location_details: emptyToUndef(values.location_details),
          contact_name: emptyToUndef(values.contact_name),
          contact_title: emptyToUndef(values.contact_title),
          prep_notes: emptyToUndef(values.prep_notes),
          post_notes: emptyToUndef(values.post_notes),
          outcome: emptyToUndef(values.outcome),
        },
      });
      onClose();
    } catch {
      /* error surfaced via mutation.error */
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this meeting?")) return;
    try {
      await deleteMutation.mutateAsync(meeting.id);
      onClose();
    } catch {
      /* error surfaced via mutation.error */
    }
  };

  const error = updateMutation.error || deleteMutation.error;
  const saving = updateMutation.isPending;
  const deleting = deleteMutation.isPending;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent showCloseButton>
        <DialogHeader>
          <DialogTitle>Meeting Details</DialogTitle>
          <DialogDescription
            onClick={() => {
              onClose();
              navigate(`/applications/${meeting.application_id}`);
            }}
          >
            {roleTitle || "Interview"} {companyName ? `at ${companyName}` : ""}{" "}
            →
          </DialogDescription>
        </DialogHeader>

        <DialogBody>
          <Row>
            <InputField
              label="Date"
              type="date"
              value={values.date}
              onChange={(v) => set("date", v)}
            />
            <Field label="Time">
              <TimePicker
                value={values.time}
                onChange={(val) => set("time", val)}
              />
            </Field>
          </Row>

          <Row>
            <InputField
              label="Duration (min)"
              type="number"
              value={values.duration_minutes}
              onChange={(v) => set("duration_minutes", v)}
              placeholder="45"
            />
            <SelectField
              label="Interview Type"
              value={values.meeting_type}
              onChange={(v) => set("meeting_type", v)}
              placeholder="Select type..."
              options={MEETING_TYPES}
            />
          </Row>

          <Row>
            <SelectField
              label="Location Type"
              value={values.location_type}
              onChange={(v) => set("location_type", v)}
              placeholder="Select..."
              options={LOCATION_TYPES}
            />

            <InputField
              label="Location Details"
              value={values.location_details}
              onChange={(v) => set("location_details", v)}
              placeholder="Zoom link, address, etc."
            />
          </Row>

          <Row>
            <InputField
              label="Contact Name"
              value={values.contact_name}
              onChange={(v) => set("contact_name", v)}
              placeholder="Jane Smith"
            />
            <InputField
              label="Contact Title"
              value={values.contact_title}
              onChange={(v) => set("contact_title", v)}
              placeholder="Engineering Manager"
            />
          </Row>

          <InputField
            label="Prep Notes"
            isTextarea
            value={values.prep_notes}
            onChange={(v) => set("prep_notes", v)}
            placeholder="Topics to review, questions to ask..."
          />

          <InputField
            label="Post-Interview Notes"
            isTextarea
            value={values.post_notes}
            onChange={(v) => set("post_notes", v)}
            placeholder="How it went, follow-ups..."
          />

          <InputField
            label="Outcome"
            value={values.outcome}
            onChange={(v) => set("outcome", v)}
            placeholder="Passed, next round, etc."
          />

          <ErrorMessage message={(error as Error)?.message} />
        </DialogBody>

        <DialogFooter>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleting || saving}
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            className="text-white/40 hover:text-slate-100"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="disabled:opacity-40"
            onClick={handleSave}
            disabled={!isDirty || saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
