import { Note } from "@/types";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaEdit, FaTrash, FaThumbtack } from "react-icons/fa";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
  onPin: (id: string, isPinned: boolean) => void;
}

export default function NoteCard({
  note,
  onEdit,
  onDelete,
  onPin,
}: NoteCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardColors = {
    blue: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    green: "bg-green-50 border-green-200 hover:bg-green-100",
    yellow: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    purple: "bg-purple-50 border-purple-200 hover:bg-purple-100",
    pink: "bg-pink-50 border-pink-200 hover:bg-pink-100",
    default: "bg-white border-gray-200 hover:bg-gray-50",
  };

  const colorClass =
    note.color && cardColors[note.color as keyof typeof cardColors]
      ? cardColors[note.color as keyof typeof cardColors]
      : cardColors.default;

  return (
    <motion.div
      className={`${colorClass} border rounded-lg shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden cursor-pointer`}
      whileHover={{ scale: 1.02, y: -3 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onEdit(note)}
      layout
    >
      <div className="p-4 relative flex flex-col h-full">
        {note.is_pinned && (
          <div className="absolute top-2 right-2 z-10">
            <FaThumbtack className="text-[#00C805]" />
          </div>
        )}

        <h2 className="text-lg font-semibold mb-2 pr-6 line-clamp-2 text-gray-800 hover:text-[#00C805] transition-colors">
          {note.title || "Untitled Note"}
        </h2>
        <p className="text-sm text-gray-600 mb-4 line-clamp-4 min-h-[4em] flex-grow">
          {note.content || "No content"}
        </p>

        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-[#E8F9E9] text-[#00C805] text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {new Date(note.updated_at).toLocaleDateString()}
          </span>

          <div
            className={`flex gap-2 transition-all duration-300 ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin(note.id, !note.is_pinned);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
            >
              <FaThumbtack
                className={note.is_pinned ? "text-[#00C805]" : "text-gray-400"}
                size={14}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(note);
              }}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Edit note"
            >
              <FaEdit className="text-gray-600" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              className="p-1 rounded-full hover:bg-gray-100 hover:text-red-500"
              aria-label="Delete note"
            >
              <FaTrash className="text-gray-600" size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
