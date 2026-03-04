import { useState, useMemo } from "react";
import TimePicker from "@/components/ui/time-picker";
import InputField from "@/components/ui/InputField";
import InputLabel from "@/components/ui/InputLabel";

import { VStack } from "@/components/ui/stacks";
import type { CreateMeetingData, JobApplication } from "@/lib/api";
import { Button } from "../ui/button";

type InputField = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
};

export type CreateMeetingSubmitParams = {
  meeting: CreateMeetingData;
  applicationId: string;
  stage: string;
};

type CreateMeetingFormProps = {
  applicationId: string;
  stage?: string;
  onConfirm?: () => void;
  onCancel: () => void;
  onSubmit: (params: CreateMeetingSubmitParams) => Promise<void>;
  isPending?: boolean;
  cta?: string;
};

export default function CreateMeetingForm({
  applicationId,
  stage,
  onConfirm,
  onCancel,
  onSubmit,
  isPending = false,
  cta = "Confirm",
}: CreateMeetingFormProps) {
  const defaultMeetingType =
    stage === "phone_screen" ? "phone_screen" : "technical";

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [locationType, setLocationType] = useState("");
  const [locationDetails, setLocationDetails] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactTitle, setContactTitle] = useState("");
  const [prepNotes, setPrepNotes] = useState("");
  const [meetingType, setMeetingType] = useState(defaultMeetingType);
  const [meetingStage, setMeetingStage] = useState(stage || "");

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

    const meeting = {
      scheduled_at,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      location_type: "video" as const,
      duration_minutes: duration ? parseInt(duration, 10) : undefined,
      location_details: locationDetails,
      contact_name: contactName,
      contact_title: contactTitle,
      prep_notes: prepNotes,
      stage: meetingStage || "",
    };

    try {
      await onSubmit({ applicationId, stage: meetingStage || "", meeting });
      onConfirm?.();
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
    <VStack className="space-y-4">
      {!stage && (
        <InputField
          label="Meeting Stage"
          value={meetingStage}
          onChange={setMeetingStage}
          placeholder="Technical, phone, etc."
        />
      )}
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="Interview Date"
          value={date}
          onChange={setDate}
          placeholder="2026-01-01"
          type="date"
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
          onClick={handleSubmit}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={isPending}
        >
          {cta}
        </Button>
      </div>
    </VStack>
  );
}
