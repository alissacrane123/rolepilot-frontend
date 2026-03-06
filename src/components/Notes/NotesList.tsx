import { useState } from "react";
import { FileIcon, PlusIcon } from "lucide-react";
import type { Note } from "@/lib/api";
import NewCard from "../common/NewCard";
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
import TrashButton from "../common/TrashButton";

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
      <TrashButton
        className="hidden group-hover:block absolute top-2 right-2"
        onClick={handleTrashClick}
      />
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
        <DialogContent className="sm:max-w-sm" showCloseButton>
          <DialogHeader>
            <DialogTitle>Delete note</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{noteToDelete?.title}&rdquo;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
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
