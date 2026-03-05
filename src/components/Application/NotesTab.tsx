import { useState, useCallback, useEffect } from "react";
import { type Note } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NotesList from "../Notes/NotesList";
import { useCreateNoteMutation, useGetNotesQuery } from "@/hooks/useApi";
import NoteEditorView from "../Notes/NoteEditorView";
import type { NotesTabProps } from "./types";

export function NotesTab({
  applicationId,
  initialNoteId,
  onActiveNoteChange,
}: NotesTabProps) {
  const { data: notes = [], isLoading } = useGetNotesQuery(applicationId);
  const createNoteMutation = useCreateNoteMutation(applicationId);

  const [activeNote, setActiveNoteState] = useState<Note | null>(null);
  const [hasRestoredFromHash, setHasRestoredFromHash] = useState(false);

  useEffect(() => {
    if (!hasRestoredFromHash && initialNoteId && notes.length > 0) {
      const found = notes.find((n) => n.id === initialNoteId);
      if (found) setActiveNoteState(found);
      setHasRestoredFromHash(true);
    }
  }, [notes, initialNoteId, hasRestoredFromHash]);

  const setActiveNote = useCallback(
    (note: Note | null) => {
      setActiveNoteState(note);
      onActiveNoteChange?.(note?.id);
    },
    [onActiveNoteChange],
  );

  const handleCreate = useCallback(async () => {
    try {
      const { data } = await createNoteMutation.mutateAsync({
        applicationId,
        title: "Untitled Note",
        content: "",
      });
      if (data) {
        setActiveNote(data);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Unknown error creating note";
      throw new Error(message);
    }
  }, [createNoteMutation, applicationId, setActiveNote]);

  const handleNoteClick = useCallback(
    (note: Note) => {
      setActiveNote(note);
    },
    [setActiveNote],
  );

  const handleBack = useCallback(() => {
    setActiveNote(null);
  }, [setActiveNote]);

  if (isLoading || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          No notes yet
        </h3>
        <p className="text-sm text-white/35 text-center max-w-md mb-6">
          Keep track of interview prep, recruiter conversations, feedback, and
          anything else about this application.
        </p>
        <Button
          onClick={handleCreate}
          variant="primary"
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "Add a Note"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 animate-fade-in-up px-4">
      {!activeNote && (
        <NotesList
          onCreateNote={handleCreate}
          notes={notes}
          onNoteClick={handleNoteClick}
        />
      )}
      {activeNote && (
        <NoteEditorView note={activeNote} handleBack={handleBack} />
      )}
    </div>
  );
}

export default NotesTab;
