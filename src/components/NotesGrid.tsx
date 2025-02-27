import { Note } from "@/types";
import NoteCard from "./NoteCard";
import { motion } from "framer-motion";
import { FaFileAlt, FaPlus } from "react-icons/fa";

interface NotesGridProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
}

export default function NotesGrid({
  notes,
  onEdit,
  onDelete,
  onPin,
}: NotesGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (notes.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg border border-gray-200"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#E8F9E9] p-6 rounded-full mb-6">
          <FaFileAlt className="text-[#00C805] text-6xl" />
        </div>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No notes yet</h3>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Create your first note to get started organizing your thoughts!
        </p>
        <button
          className="bg-[#00C805] hover:bg-[#00A804] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
          onClick={() =>
            document
              .querySelector<HTMLButtonElement>(".bg-\\[\\#00C805\\]")
              ?.click()
          }
        >
          <FaPlus className="inline mr-2 w-3 h-3" /> Create Note
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={item} layout className="h-full">
          <NoteCard
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
            onPin={onPin}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
