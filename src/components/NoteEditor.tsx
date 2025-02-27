import { Note } from "@/types";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  FaPlus,
  FaTimes,
  FaMicrophone,
  FaMicrophoneSlash,
  FaSave,
  FaArrowLeft,
  FaTag,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Add type definitions for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface NoteEditorProps {
  note?: Note;
  onSave: (note: Note) => void;
  onCancel: () => void;
  availableTags?: string[];
}

const colorOptions = [
  { name: "Default", value: "" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Pink", value: "pink" },
];

export default function NoteEditor({
  note,
  onSave,
  onCancel,
  availableTags = [],
}: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [color, setColor] = useState(note?.color || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [isPinned, setIsPinned] = useState(note?.is_pinned || false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTarget, setVoiceTarget] = useState<"title" | "content">(
    "content"
  );
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color || "");
      setTags(note.tags || []);
      setIsPinned(note.is_pinned || false);
    }
  }, [note]);

  useEffect(() => {
    if (tagInput.trim() === "") {
      setSuggestedTags([]);
      setShowTagSuggestions(false);
      return;
    }

    const filteredTags = availableTags
      .filter(
        (tag) =>
          tag.toLowerCase().includes(tagInput.toLowerCase()) &&
          !tags.includes(tag)
      )
      .slice(0, 5);

    setSuggestedTags(filteredTags);
    setShowTagSuggestions(filteredTags.length > 0);
  }, [tagInput, availableTags, tags]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      setShowTagSuggestions(false);
    }
  };

  const handleSelectTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
      setShowTagSuggestions(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    const now = new Date().toISOString();
    const updatedNote: Note = {
      id: note?.id || uuidv4(),
      title: title.trim() || "Untitled Note",
      content,
      tags,
      color: color || undefined,
      is_pinned: isPinned,
      created_at: note?.created_at || now,
      updated_at: now,
    };
    onSave(updatedNote);
  };

  const toggleVoiceRecognition = (target: "title" | "content") => {
    // Stop any existing recognition
    if ((window as any).currentRecognition) {
      (window as any).currentRecognition.stop();
    }

    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Voice recognition is not supported in your browser. Try Chrome or Edge."
      );
      return;
    }

    // Focus the appropriate input field
    if (target === "title" && titleRef.current) {
      titleRef.current.focus();
    } else if (target === "content" && contentRef.current) {
      contentRef.current.focus();
    }

    setVoiceTarget(target);

    if (isListening && voiceTarget === target) {
      setIsListening(false);
      return;
    }

    setIsListening(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false; // Changed to false to prevent repetition
    recognition.interimResults = true;
    recognition.lang = "en-US";

    let finalTranscript = "";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (target === "title") {
        setTitle(finalTranscript || interimTranscript);
      } else {
        if (finalTranscript) {
          setContent((prev) => prev + (prev ? " " : "") + finalTranscript);
        }
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // Restart recognition if we're still in listening mode
      if (isListening) {
        recognition.start();
      }
    };

    recognition.start();

    // Store recognition instance to stop it later
    (window as any).currentRecognition = recognition;
  };

  const stopVoiceRecognition = () => {
    if ((window as any).currentRecognition) {
      (window as any).currentRecognition.stop();
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      // Clean up recognition when component unmounts
      if ((window as any).currentRecognition) {
        (window as any).currentRecognition.stop();
      }
    };
  }, []);

  return (
    <motion.div
      className="bg-white max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-6">
          <button
            className="text-gray-500 hover:text-black p-2 mr-3 rounded-full hover:bg-gray-100 transition-colors"
            onClick={onCancel}
          >
            <FaArrowLeft className="w-4 h-4" />
          </button>
          <h2 className="text-xl font-medium text-black">
            {note ? "Edit Note" : "Create New Note"}
          </h2>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <div className="flex items-center mb-2">
              <label
                htmlFor="title"
                className="text-xs font-medium text-gray-500 mr-2"
              >
                Title
              </label>
              <button
                className={`p-1 rounded-full ${
                  isListening && voiceTarget === "title"
                    ? "bg-red-50 text-red-500"
                    : "text-[#00C805] hover:text-[#00A804]"
                }`}
                onClick={() =>
                  isListening && voiceTarget === "title"
                    ? stopVoiceRecognition()
                    : toggleVoiceRecognition("title")
                }
                title={
                  isListening && voiceTarget === "title"
                    ? "Stop voice input"
                    : "Start voice input for title"
                }
              >
                {isListening && voiceTarget === "title" ? (
                  <FaMicrophoneSlash size={12} />
                ) : (
                  <FaMicrophone size={12} />
                )}
              </button>
            </div>
            <input
              ref={titleRef}
              id="title"
              type="text"
              placeholder="Note title"
              className="w-full px-3 py-2 text-base border-b border-gray-200 focus:border-[#00C805] focus:outline-none transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="flex items-center mb-2">
              <label
                htmlFor="content"
                className="text-xs font-medium text-gray-500 mr-2"
              >
                Content
              </label>
              <button
                className={`p-1 rounded-full ${
                  isListening && voiceTarget === "content"
                    ? "bg-red-50 text-red-500"
                    : "text-[#00C805] hover:text-[#00A804]"
                }`}
                onClick={() =>
                  isListening && voiceTarget === "content"
                    ? stopVoiceRecognition()
                    : toggleVoiceRecognition("content")
                }
                title={
                  isListening && voiceTarget === "content"
                    ? "Stop voice input"
                    : "Start voice input for content"
                }
              >
                {isListening && voiceTarget === "content" ? (
                  <FaMicrophoneSlash size={12} />
                ) : (
                  <FaMicrophone size={12} />
                )}
              </button>
              {isListening && voiceTarget === "content" && (
                <span className="ml-2 text-xs text-[#00C805] animate-pulse">
                  Listening...
                </span>
              )}
            </div>
            <textarea
              ref={contentRef}
              id="content"
              placeholder="Type your thoughts here..."
              className="w-full min-h-[200px] p-3 text-sm border border-gray-200 rounded-lg focus:border-[#00C805] focus:outline-none transition-colors resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full flex items-center"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <div className="flex">
                  <div className="relative flex-grow">
                    <input
                      ref={tagInputRef}
                      type="text"
                      placeholder="Add a tag"
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-l-lg focus:border-[#00C805] focus:outline-none transition-colors"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                      onFocus={() =>
                        setShowTagSuggestions(suggestedTags.length > 0)
                      }
                      onBlur={() => {
                        // Delay hiding suggestions to allow for clicks
                        setTimeout(() => setShowTagSuggestions(false), 200);
                      }}
                    />
                    {showTagSuggestions && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-auto">
                        {suggestedTags.map((tag) => (
                          <div
                            key={tag}
                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-sm"
                            onClick={() => handleSelectTag(tag)}
                          >
                            <FaTag className="text-[#00C805] mr-2 w-3 h-3" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    className="bg-[#00C805] hover:bg-[#00A804] text-white px-3 py-2 rounded-r-lg"
                    onClick={handleAddTag}
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-2">
                  Note Color
                </label>
                <select
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-[#00C805] focus:outline-none transition-colors appearance-none bg-white"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colorOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-[#00C805] border-gray-300 rounded focus:ring-[#00C805] focus:ring-offset-0"
                    checked={isPinned}
                    onChange={() => setIsPinned(!isPinned)}
                  />
                  <span className="text-sm text-gray-700">Pin to top</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-100">
            <button
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 text-sm text-white bg-[#00C805] hover:bg-[#00A804] rounded-full transition-colors"
              onClick={handleSave}
              disabled={!content.trim()}
            >
              <FaSave className="inline mr-2 w-3 h-3" /> Save Note
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
