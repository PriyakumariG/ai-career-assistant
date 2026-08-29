import { useState, useEffect } from "react";
import { listResumes } from "../api/resumes";
import { FileText, ChevronDown } from "lucide-react";

export default function ResumeSelector({ onSelect }) {
  const [resumes, setResumes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    listResumes()
      .then((response) => setResumes(response.data))
      .catch(() => setResumes([]));
  }, []);

  if (resumes.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 text-text-muted hover:text-text text-sm transition"
      >
        Or choose a previous upload
        <ChevronDown size={16} className={isOpen ? "rotate-180" : ""} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-surface border border-border rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {resumes.map((resume) => (
            <button
              key={resume.id}
              onClick={() => {
                onSelect(resume);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text hover:bg-surface-hover text-left transition"
            >
              <FileText size={14} className="text-accent flex-shrink-0" />
              <span className="truncate">{resume.file_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}