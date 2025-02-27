import { Note } from "@/types";
import { supabase } from "./supabase";

export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching notes:", error);
    return [];
  }

  return data || [];
}

export async function createNote(note: Note): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .insert(note)
    .select()
    .single();

  if (error) {
    console.error("Error creating note:", error);
    return null;
  }

  return data;
}

export async function updateNote(note: Note): Promise<Note | null> {
  const { data, error } = await supabase
    .from("notes")
    .update(note)
    .eq("id", note.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating note:", error);
    return null;
  }

  return data;
}

export async function deleteNote(id: string): Promise<boolean> {
  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting note:", error);
    return false;
  }

  return true;
}

export async function updateNotePinStatus(
  id: string,
  isPinned: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from("notes")
    .update({ is_pinned: isPinned })
    .eq("id", id);

  if (error) {
    console.error("Error updating pin status:", error);
    return false;
  }

  return true;
}
