import { useState, useEffect } from "react";
import { listResumes, getResume } from "../../api/resumes";
import { FileText, Loader2, X } from "lucide-react";

export default function HistoryPage() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    listResumes()
      .then((response) => {
        const seen = new Map();
        response.data.forEach((resume) => {
          const existing = seen.get(resume.file_name);
          if (
            !existing ||
            new Date(resume.uploaded_at) > new Date(existing.uploaded_at)
          ) {
            seen.set(resume.file_name, resume);
          }
        });
        const deduped = Array.from(seen.values()).sort(
          (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
        );
        setResumes(deduped);
      })
      .catch(() => setError("Failed to load resume history."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleView = async (resumeId) => {
    try {
      const response = await getResume(resumeId);
      setSelectedResume(response.data);
    } catch {
      setError("Failed to load resume details.");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">Resume History</h2>
        <p className="text-text-muted">All resumes you've uploaded.</p>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-text-muted">
          <Loader2 className="animate-spin" size={18} />
          Loading...
        </div>
      )}

      {error && (
        <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {!isLoading && resumes.length === 0 && (
        <p className="text-text-muted text-sm">
          No resumes uploaded yet. Head to the Resume tab to get started.
        </p>
      )}

      <div className="space-y-3">
        {resumes.map((resume) => (
          <button
            key={resume.id}
            onClick={() => handleView(resume.id)}
            className="w-full bg-surface border border-border hover:border-accent/50 rounded-xl p-4 flex items-center gap-3 text-left transition"
          >
            <FileText className="text-accent flex-shrink-0" size={20} />
            <div>
              <p className="text-text font-medium text-sm">
                {resume.file_name}
              </p>
              <p className="text-text-muted text-xs">
                Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>

      {selectedResume && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-text font-semibold">
                {selectedResume.file_name}
              </h3>
              <button
                onClick={() => setSelectedResume(null)}
                className="text-text-muted hover:text-text transition"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <p className="text-text-muted text-sm whitespace-pre-line leading-relaxed">
                {selectedResume.extracted_text}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}