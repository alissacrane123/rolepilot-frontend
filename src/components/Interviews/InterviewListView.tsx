import type { Meeting } from "@/lib/api";
import type { MeetingWithApp } from "./calendar-utils";
import InterviewCard from "./InterviewCard";

function groupByDate(meetings: MeetingWithApp[]) {
  const groups: Record<string, MeetingWithApp[]> = {};
  for (const m of meetings) {
    const key = m.scheduled_at
      ? new Date(m.scheduled_at).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })
      : "Unscheduled";
    if (!groups[key]) groups[key] = [];
    groups[key].push(m);
  }
  return groups;
}

export default function InterviewListView({
  meetings,
  onMeetingClick,
}: {
  meetings: MeetingWithApp[];
  onMeetingClick?: (meeting: Meeting) => void;
}) {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-3xl mb-3">📅</div>
        <p className="text-sm text-white/30">No upcoming interviews</p>
      </div>
    );
  }

  const groups = groupByDate(meetings);

  return (
    <div className="space-y-6">
      {Object.entries(groups).map(([dateLabel, items]) => (
        <div key={dateLabel}>
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
            {dateLabel}
          </h3>
          <div className="space-y-2">
            {items.map((meeting, i) => (
              <div
                key={meeting.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <InterviewCard
                  meeting={meeting}
                  companyName={meeting._companyName}
                  roleTitle={meeting._roleTitle}
                  onClick={() => onMeetingClick?.(meeting)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
