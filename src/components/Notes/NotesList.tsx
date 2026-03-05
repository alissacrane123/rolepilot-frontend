import { useGetNotesQuery } from "@/hooks/useApi";
import { VStack } from "../ui/stacks";
import { FileIcon } from "lucide-react";
import type { Note } from "@/lib/api";

export default function NotesList({
  notes,
  onNoteClick,
}: {
  notes: Note[];
  onNoteClick: (note: Note) => void;
}) {
  return (
    <div className="flex gap-2">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex flex-col gap-2 items-center cursor-pointer transition-all duration-200 hover:scale-105"
          onClick={() => onNoteClick(note)}
        >
          <FileIcon className="size-10 text-zinc-400 hover:text-zinc-200" />
          <span className="text-sm text-zinc-200">{note.title}</span>
        </div>
      ))}
    </div>
  );
}
