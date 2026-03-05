import TagInput from "./TagInput";

export default function SkillsInput({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  return (
    <TagInput
      items={skills}
      onChange={onChange}
      placeholder="Type a skill and press Enter"
      badgeClassName="bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
    />
  );
}
