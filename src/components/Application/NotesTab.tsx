import { useState, useCallback, useEffect } from "react";
import { type Note } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NotesList from "../Notes/NotesList";
import { useCreateNoteMutation, useGetNotesQuery } from "@/hooks/useApi";
import NoteEditorView from "../Notes/NoteEditorView";

export default function NotesTab({
  applicationId,
  initialNoteId,
  onActiveNoteChange,
}: {
  applicationId: string;
  initialNoteId?: string;
  onActiveNoteChange?: (noteId: string | undefined) => void;
}) {
  const { data: notes = [], isLoading: loading } =
    useGetNotesQuery(applicationId);
  const createNoteMutation = useCreateNoteMutation(applicationId);

  const [activeNote, setActiveNoteState] = useState<Note | null>(null);
  const [restoredFromHash, setRestoredFromHash] = useState(false);

  useEffect(() => {
    if (!restoredFromHash && initialNoteId && notes.length > 0) {
      const found = notes.find((n) => n.id === initialNoteId);
      if (found) setActiveNoteState(found);
      setRestoredFromHash(true);
    }
  }, [notes, initialNoteId, restoredFromHash]);

  const setActiveNote = useCallback((note: Note | null) => {
    setActiveNoteState(note);
    onActiveNoteChange?.(note?.id);
  }, [onActiveNoteChange]);

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
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  }, [createNoteMutation, applicationId]);

  const handleNoteClick = useCallback((note: Note) => {
    setActiveNote(note);
  }, []);

  // Empty state
  if (loading || notes.length === 0) {
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
        <NoteEditorView
          note={activeNote}
          handleBack={() => setActiveNote(null)}
        />
      )}
    </div>
  );
}
