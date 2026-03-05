import { useState, useCallback } from "react";
import { type Note } from "@/lib/api";
import { Button } from "@/components/ui/button";
import NotesList from "../Notes/NotesList";
import {
  useCreateNoteMutation,
  useGetNotesQuery,
  useUpdateNoteMutation,
} from "@/hooks/useApi";
import { useDeleteNoteMutation } from "@/hooks/useApi";
import NoteEditorView from "../Notes/NoteEditorView";
import Content from "../Content";

export default function NotesTab({ applicationId }: { applicationId: string }) {
  const { data: notes = [], isLoading: loading } =
    useGetNotesQuery(applicationId);
  const createNoteMutation = useCreateNoteMutation(applicationId);
  const updateNoteMutation = useUpdateNoteMutation(applicationId);
  const deleteNoteMutation = useDeleteNoteMutation(applicationId);

  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const handleUpdate = useCallback(
    async (noteId: string, data: { title?: string; content?: string }) => {
      try {
        await updateNoteMutation.mutateAsync({ noteId, data });
      } catch (err) {
        console.error("Failed to update note:", err);
      }
    },
    [],
  );

  const handleDelete = async (noteId: string) => {
    try {
      await deleteNoteMutation.mutateAsync(noteId);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  const handleCreate = useCallback(async () => {
    try {
      await createNoteMutation.mutateAsync({
        applicationId,
        title: "Untitled Note",
        content: "",
      });
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  }, [createNoteMutation, applicationId]);

  const handleNoteClick = useCallback(
    (note: Note) => {
      setActiveNote(note);
    },
    [applicationId],
  );

  // Empty state
  if (loading || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-4">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-lg font-semibold text-zinc-200 mb-2">
          No notes yet
        </h3>
        <p className="text-sm text-zinc-500 text-center max-w-md mb-6">
          Keep track of interview prep, recruiter conversations, feedback, and
          anything else about this application.
        </p>
        <Button
          onClick={handleCreate}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? "Creating..." : "Add a Note"}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 animate-fade-in-up">
      {!activeNote && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <Button
              onClick={handleCreate}
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8"
              disabled={createNoteMutation.isPending}
            >
              + New Note
            </Button>
          </div>
          <NotesList notes={notes} onNoteClick={handleNoteClick} />
        </div>
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
