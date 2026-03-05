import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagInputProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  badgeClassName?: string;
}

export default function TagInput({
  items,
  onChange,
  placeholder = "Type and press Enter",
  badgeClassName = "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addItem = () => {
    const trimmed = input.trim();
    if (trimmed && !items.includes(trimmed)) {
      onChange([...items, trimmed]);
      setInput("");
    }
  };

  const removeItem = (item: string) => {
    onChange(items.filter((i) => i !== item));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addItem();
    }
    if (e.key === "Backspace" && input === "" && items.length > 0) {
      removeItem(items[items.length - 1]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {items.map((item) => (
          <Badge
            key={item}
            variant="outline"
            className={`${badgeClassName} cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors`}
            onClick={() => removeItem(item)}
          >
            {item} ×
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-zinc-800 border-zinc-700 text-zinc-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
