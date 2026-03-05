import { useState } from "react";
import { FileIcon, PlusIcon, Trash2 } from "lucide-react";
import type { Note } from "@/lib/api";
import NewCard from "../ui/NewCard";
import { useDeleteNoteMutation } from "@/hooks/useApi";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

function NoteItem({
  note,
  onNoteClick,
  onRequestDelete,
}: {
  note: Note;
  onNoteClick: (note: Note) => void;
  onRequestDelete: (note: Note) => void;
}) {
  const handleTrashClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onRequestDelete(note);
  };

  return (
    <NewCard
      onClick={() => onNoteClick(note)}
      icon={<FileIcon className="size-8 text-white" />}
      title={note.title}
      className="group relative h-36 w-36 items-center justify-center text-center items-center"
    >
      <button
        className="hidden cursor-pointer group-hover:block absolute top-2 right-2 text-zinc-400 hover:text-indigo-400"
        onClick={handleTrashClick}
      >
        <Trash2 className="cursor-pointer size-3 text-zinc-400 hover:text-indigo-400 transition-colors" />
      </button>
    </NewCard>
  );
}

export default function NotesList({
  notes,
  onNoteClick,
  onCreateNote,
}: {
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onCreateNote: () => void;
}) {
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const applicationId = notes[0]?.application_id;
  const deleteNoteMutation = useDeleteNoteMutation(applicationId);

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    try {
      await deleteNoteMutation.mutateAsync(noteToDelete.id);
    } catch (err) {
      console.error("Failed to delete note:", err);
    } finally {
      setNoteToDelete(null);
    }
  };

  return (
    <>
      <div className="flex gap-4">
        <NewCard
          onClick={onCreateNote}
          icon={<PlusIcon className="size-8 text-white" />}
          title="New Note"
          className="h-36 w-36 border-dashed border-1 border-white/30 hover:border-indigo-400 justify-center"
        />
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onNoteClick={onNoteClick}
            onRequestDelete={setNoteToDelete}
          />
        ))}
      </div>

      <Dialog
        open={noteToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setNoteToDelete(null);
        }}
      >
        <DialogContent className="bg-zinc-900 border-zinc-800 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-zinc-100">Delete note</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete "{noteToDelete?.title}"? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="secondary" onClick={() => setNoteToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteNoteMutation.isPending}
            >
              {deleteNoteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
