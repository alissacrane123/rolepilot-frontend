import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function SkillsInput({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addSkill = () => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
      setInput("");
    }
  };

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
    if (e.key === "Backspace" && input === "" && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {skills.map((skill) => (
          <Badge
            key={skill}
            variant="outline"
            className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
            onClick={() => removeSkill(skill)}
          >
            {skill} ×
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter"
          className="bg-zinc-800/50 border-zinc-700 text-zinc-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addSkill}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
}