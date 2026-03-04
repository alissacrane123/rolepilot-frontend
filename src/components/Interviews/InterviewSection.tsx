import type { Meeting } from "@/lib/api";
import type { MeetingWithApp } from "./calendar-utils";
import InterviewListView from "./InterviewListView";

export function InterviewSection({
  meetings,
  onMeetingClick,
  title,
}: {
  meetings: MeetingWithApp[];
  onMeetingClick: (meeting: Meeting) => void;
  title: string;
}) {
  if (meetings.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg pb-2 font-bold text-white tracking-tight">
        {title}
      </h2>
      <InterviewListView meetings={meetings} onMeetingClick={onMeetingClick} />
    </div>
  );
}
