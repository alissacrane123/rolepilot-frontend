import TagInput from "./TagInput";

export default function LocationsInput({
  locations,
  onChange,
}: {
  locations: string[];
  onChange: (locations: string[]) => void;
}) {
  return (
    <TagInput
      items={locations}
      onChange={onChange}
      placeholder="Type a location and press Enter"
      badgeClassName="bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
    />
  );
}
