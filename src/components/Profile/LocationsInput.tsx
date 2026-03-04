import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { VStack } from "@/components/ui/stacks";

export default function LocationsInput({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (locations: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const addLocation = () => {
    const trimmed = input.trim();
    if (trimmed && !locations.includes(trimmed)) {
      onChange([...locations, trimmed]);
      setInput("");
    }
  };

  const removeLocation = (loc: string) => {
    onChange(locations.filter((l) => l !== loc));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addLocation();
    }
    if (e.key === "Backspace" && input === "" && locations.length > 0) {
      removeLocation(locations[locations.length - 1]);
    }
  };

  return (
    <VStack className="gap-2">
      <div className="flex flex-wrap gap-1.5 min-h-[32px]">
        {locations.map((loc) => (
          <Badge
            key={loc}
            variant="outline"
            className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
            onClick={() => removeLocation(loc)}
          >
            {loc} ×
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a location and press Enter"
          className="bg-zinc-800 border-zinc-700 text-zinc-100"
        />
        <Button
          type="button"
          variant="outline"
          onClick={addLocation}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 shrink-0"
        >
          Add
        </Button>
      </div>
    </VStack>
  );
}