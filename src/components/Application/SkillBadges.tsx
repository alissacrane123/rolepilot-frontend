import { SKILL_COLOR_MAP } from "./constants";
import type { SkillBadgesProps } from "./types";

export function SkillBadges({ skills, color }: SkillBadgesProps) {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <span
          key={i}
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${SKILL_COLOR_MAP[color] || SKILL_COLOR_MAP.indigo}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

export default SkillBadges;
