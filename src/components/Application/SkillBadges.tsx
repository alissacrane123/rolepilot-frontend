const colorMap: Record<string, string> = {
  indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/30",
};

export default function SkillBadges({
  skills,
  color,
}: {
  skills: string[];
  color: string;
}) {
  if (!skills || skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, i) => (
        <span
          key={i}
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${colorMap[color] || colorMap.indigo}`}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}
