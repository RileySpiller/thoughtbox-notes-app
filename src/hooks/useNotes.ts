import { useState, useEffect, useCallback } from "react";
import { Note } from "@/types";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  updateNotePinStatus,
} from "@/lib/noteService";

export default function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
      setError(null);
    } catch (err) {
      setError("Failed to fetch notes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = useCallback(async (note: Note) => {
    try {
      const createdNote = await createNote(note);
      if (createdNote) {
        // Optimistic update
        setNotes((prev) => [createdNote, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to add note");
      console.error(err);
      return false;
    }
  }, []);

  const editNote = useCallback(async (note: Note) => {
    try {
      const updatedNote = await updateNote(note);
      if (updatedNote) {
        // Optimistic update
        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? updatedNote : n))
        );
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update note");
      console.error(err);
      return false;
    }
  }, []);

  const removeNote = useCallback(async (id: string) => {
    try {
      const success = await deleteNote(id);
      if (success) {
        // Optimistic update
        setNotes((prev) => prev.filter((n) => n.id !== id));
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to delete note");
      console.error(err);
      return false;
    }
  }, []);

  const pinNote = useCallback(async (id: string, isPinned: boolean) => {
    try {
      const success = await updateNotePinStatus(id, isPinned);
      if (success) {
        // Optimistic update
        setNotes((prev) => {
          const updated = prev.map((n) =>
            n.id === id ? { ...n, is_pinned: isPinned } : n
          );

          // Re-sort to put pinned notes first
          return [...updated].sort((a, b) => {
            if (a.is_pinned && !b.is_pinned) return -1;
            if (!a.is_pinned && b.is_pinned) return 1;
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          });
        });
        return true;
      }
      return false;
    } catch (err) {
      setError("Failed to update pin status");
      console.error(err);
      return false;
    }
  }, []);

  return {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    editNote,
    removeNote,
    pinNote,
  };
}
