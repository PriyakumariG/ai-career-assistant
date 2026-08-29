import { useState, useEffect } from "react";
import { listResumes, getResume, deleteResume } from "../../api/resumes";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { FileText, Loader2, X, Trash2 } from "lucide-react";

export default function HistoryPage() {
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResume, setSelectedResume] = useState(null);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
  listResumes()
    .then((response) => {
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at)
      );
      setResumes(sorted);
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

  const handleDelete = async () => {
    if (!resumeToDelete) return;
    setIsDeleting(true);
    try {
      await deleteResume(resumeToDelete.id);
      setResumes((prev) => prev.filter((r) => r.id !== resumeToDelete.id));
      setResumeToDelete(null);
    } catch {
      setError("Failed to delete resume.");
    } finally {
      setIsDeleting(false);
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
          <div
            key={resume.id}
            className="bg-surface border border-border hover:border-accent/50 rounded-xl p-4 flex items-center gap-3 transition"
          >
            <button
              onClick={() => handleView(resume.id)}
              className="flex items-center gap-3 flex-1 text-left min-w-0"
            >
              <FileText className="text-accent flex-shrink-0" size={20} />
              <div className="min-w-0">
                <p className="text-text font-medium text-sm truncate">
                  {resume.file_name}
                </p>
                <p className="text-text-muted text-xs">
                  Uploaded {new Date(resume.uploaded_at).toLocaleDateString()}
                </p>
              </div>
            </button>
            <button
              onClick={() => setResumeToDelete(resume)}
              className="text-text-muted hover:text-danger transition flex-shrink-0"
            >
              <Trash2 size={18} />
            </button>
          </div>
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

      {resumeToDelete && (
        <ConfirmDeleteModal
          fileName={resumeToDelete.file_name}
          onConfirm={handleDelete}
          onCancel={() => setResumeToDelete(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}