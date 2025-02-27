"use client";

import { useState, useMemo } from "react";
import NoteEditor from "@/components/NoteEditor";
import NotesGrid from "@/components/NotesGrid";
import SearchAndFilters from "@/components/SearchAndFilters";
import useNotes from "@/hooks/useNotes";
import { Note } from "@/types";
import { FaPlus, FaSync, FaFeather } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const {
    notes,
    loading,
    error,
    fetchNotes,
    addNote,
    editNote,
    removeNote,
    pinNote,
  } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Extract all unique tags from notes
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    notes.forEach((note) => {
      note.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, [notes]);

  // Filter notes based on search query and tag filter
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch =
        searchQuery === "" ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag = tagFilter === null || note.tags?.includes(tagFilter);

      return matchesSearch && matchesTag;
    });
  }, [notes, searchQuery, tagFilter]);

  const handleAddNote = () => {
    setCurrentNote(undefined);
    setIsEditing(true);
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setIsEditing(true);
  };

  const handleSaveNote = async (note: Note) => {
    if (note.id && notes.some((n) => n.id === note.id)) {
      await editNote(note);
    } else {
      await addNote(note);
    }
    setIsEditing(false);
    setCurrentNote(undefined);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setCurrentNote(undefined);
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-5xl">
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center group cursor-pointer"
            onClick={() => setIsEditing(false)}
          >
            <div className="bg-[#00C805] text-white p-2 rounded-lg mr-3 group-hover:bg-[#00A804] transition-colors">
              <FaFeather className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center">
                <span>Thought</span>
                <span className="text-[#00C805] group-hover:text-[#00A804] transition-colors">
                  Box
                </span>
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Your personal thought space
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => fetchNotes()}
              disabled={loading}
              aria-label="Refresh notes"
            >
              <FaSync
                className={`${
                  loading ? "animate-spin" : ""
                } text-[#00C805] w-4 h-4`}
              />
            </button>
            <button
              className="bg-[#00C805] hover:bg-[#00A804] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={handleAddNote}
              disabled={isEditing}
            >
              <FaPlus className="inline mr-2 w-3 h-3" /> New Note
            </button>
          </div>
        </div>

        {!isEditing && (
          <SearchAndFilters
            onSearch={setSearchQuery}
            onFilterByTag={setTagFilter}
            availableTags={availableTags}
          />
        )}

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mt-4 text-sm">
            <span>{error}</span>
          </div>
        )}
      </header>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NoteEditor
              note={currentNote}
              onSave={handleSaveNote}
              onCancel={handleCancelEdit}
              availableTags={availableTags}
            />
          </motion.div>
        ) : (
          <motion.div
            key="notes-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <NotesGrid
              notes={filteredNotes}
              onEdit={handleEditNote}
              onDelete={removeNote}
              onPin={pinNote}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
