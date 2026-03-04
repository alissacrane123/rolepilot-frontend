import { useState, useMemo } from "react";
import type { StageModalProps } from "./shared";
import { useUpdateStageMutation } from "@/hooks/useApi";
import TimePicker from "@/components/ui/time-picker";
import TransitionModalShell from "./TransitionModalShell";
import { PhoneIcon } from "lucide-react";
import InputField from "@/components/ui/InputField";
import InputLabel from "@/components/ui/InputLabel";

type InputField = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
};

export default function InterviewModal({
  transition,
  onConfirm,
  onCancel,
}: StageModalProps) {
  const { app, toStage } = transition;
  const mutation = useUpdateStageMutation();

  const defaultMeetingType = toStage === "phone_screen" ? "phone_screen" : "technical";

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [locationType, setLocationType] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [prepNotes, setPrepNotes] = useState("");
  const [meetingType, setMeetingType] = useState(defaultMeetingType);

  const fields: InputField[] = useMemo(() => {
    return [
      {
        label: "Duration (minutes)",
        value: duration,
        onChange: setDuration,
        placeholder: "45",
      },
      {
        label: "Meeting Type",
        value: meetingType,
        onChange: setMeetingType,
        placeholder: "Phone screen, technical, etc",
      },
      {
        label: "Location Type",
        value: locationType,
        onChange: setLocationType,
      },
      {
        label: "Location Details",
        value: locationDetails,
        onChange: setLocationDetails,
        placeholder: "Zoom link, address, etc.",
      },

      {
        label: "Contact Name",
        value: contactName,
        onChange: setContactName,
        placeholder: "Jane Smith",
      },
      {
        label: "Contact Title",
        value: contactTitle,
        onChange: setContactTitle,
        placeholder: "Engineering Manager",
      },
      {
        label: "Prep Notes",
        value: prepNotes,
        onChange: setPrepNotes,
        placeholder: "Add notes about this meeting...",
        isTextarea: true,
      },
    ];
  }, [
    date,
    time,
    duration,
    locationType,
    locationDetails,
    contactName,
    contactTitle,
    prepNotes,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let scheduled_at: string | undefined;
    if (date) {
      scheduled_at = new Date(`${date}T${time || "00:00"}:00`).toISOString();
    }

    const meeting = scheduled_at
      ? {
          scheduled_at,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          location_type: "video" as const,
          duration_minutes: duration ? parseInt(duration, 10) : undefined,
          location_details: locationDetails,
          contact_name: contactName,
          contact_title: contactTitle,
          prep_notes: prepNotes,
        }
      : undefined;

    try {
      await mutation.mutateAsync({ id: app.id, toStage, meeting });
      onConfirm();
    } catch {
      /* error surfaced via mutation.error */
    }
  };

  const textFields = useMemo(() => {
    return fields.filter((field) => !field.isTextarea);
  }, [fields]);

  const textareaFields = useMemo(() => {
    return fields.filter((field) => field.isTextarea);
  }, [fields]);

  return (
    <TransitionModalShell
      toStage={toStage}
      appLabel={`${app.role_title} at ${app.company_name}`}
      isPending={mutation.isPending}
      error={mutation.error as Error | null}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      icon={<PhoneIcon className="w-4 h-4" />}
    >
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Interview Date"
          value={date}
          onChange={setDate}
          placeholder="2026-01-01"
        />
        <div className="space-y-2">
          <InputLabel label="Interview Time" />
          <TimePicker value={time} onChange={setTime} />
        </div>
        {textFields.map((field) => (
          <InputField
            key={field.label}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            label={field.label}
            isTextarea={field.isTextarea}
          />
        ))}
      </div>
      <div className="flex flex-col gap-3 w-full">
        {textareaFields.map((field) => (
          <InputField
            key={field.label}
            value={field.value}
            onChange={field.onChange}
            placeholder={field.placeholder}
            label={field.label}
            isTextarea={field.isTextarea}
          />
        ))}
      </div>
    </TransitionModalShell>
  );
}
