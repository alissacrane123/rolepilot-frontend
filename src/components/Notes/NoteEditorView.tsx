import { useState, useRef, useCallback } from "react";

import { useUpdateNoteMutation } from "@/hooks/useApi";
import { useAutoSave } from "@/hooks/useAutoSave.ts";
import type { Note } from "@/lib/api";
import Spinner from "@/components/Spinner";
import NoteEditor from "@/components/Notes/NoteEditor";
import { ArrowLeftIcon } from "lucide-react";

export default function NoteEditorView({
  note,
  handleBack,
}: {
  note: Note;
  handleBack: () => void;
}) {
  const [title, setTitle] = useState(note.title);
  const updateNoteMutation = useUpdateNoteMutation(note.application_id);

  const titleRef = useRef(title);
  titleRef.current = title;
  // The editor component exposes a getter so we can read its HTML at save time
  const getContentRef = useRef<(() => string) | null>(null);

  const {
    trigger: debouncedSave,
    saving,
    lastSaved,
  } = useAutoSave({
    onSave: async () => {
      if (!note) return;
      await updateNoteMutation.mutateAsync({
        noteId: note.id,
        data: {
          title: titleRef.current || "Untitled Note",
          content: getContentRef.current?.() ?? "",
        },
      });
    },
  });

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      debouncedSave();
    },
    [debouncedSave],
  );

  if (!note) return <Spinner />;

  return (
    <div className="flex flex-col min-h-[calc(100vh-8rem)]">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back
        </button>
        <span className="text-xs text-zinc-500">
          {saving
            ? "Saving..."
            : lastSaved
              ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
              : ""}
        </span>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Untitled Note"
        className="text-2xl font-semibold text-zinc-100 bg-transparent border-none outline-none w-full placeholder-zinc-600 mb-4"
      />

      {/* Editor + toolbar */}
      <NoteEditor
        initialContent={note.content ?? ""}
        onDirty={debouncedSave}
        getContentRef={getContentRef}
      />
    </div>
  );
}
