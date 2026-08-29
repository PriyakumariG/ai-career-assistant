import { useState } from "react";
import ResumeUpload from "../../components/ResumeUpload";
import ResumeSelector from "../../components/ResumeSelector";
import { generateCoverLetter } from "../../api/resumes";
import { useResume } from "../../context/ResumeContext";
import { Loader2, FileText, Copy, Check, Download } from "lucide-react";

export default function CoverLetterPage() {
  const { activeResume: resume, setActiveResume: setResume } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resume) return;
    setError("");
    setIsGenerating(true);
    try {
      const response = await generateCoverLetter(
        resume.id,
        jobDescription.trim() || null
      );
      setCoverLetter(response.data.cover_letter);
    } catch (err) {
      setError(err.response?.data?.detail || "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([coverLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cover_letter.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">
          AI Cover Letter Generator
        </h2>
        <p className="text-text-muted">
          Upload a resume and get a personalized, ready-to-send cover letter.
        </p>
      </div>

      {!resume ? (
        <div className="space-y-3">
          <ResumeUpload onUploadSuccess={setResume} />
          <ResumeSelector onSelect={setResume} />
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-text font-medium">{resume.file_name}</p>
            <button
              onClick={() => {
                setResume(null);
                setCoverLetter("");
              }}
              className="text-text-muted hover:text-text text-sm transition"
            >
              Change file
            </button>
          </div>

          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              Job description (optional)
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={4}
              placeholder="Paste a job description to tailor the letter, or leave blank for a general one."
              className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition resize-none"
            />
          </div>

          {error && (
            <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-2.5 rounded-lg transition"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Writing...
              </>
            ) : (
              <>
                <FileText size={18} />
                Generate Cover Letter
              </>
            )}
          </button>
        </div>
      )}

      {coverLetter && (
        <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-text font-semibold">Generated Cover Letter</h3>
          <p className="text-text whitespace-pre-line leading-relaxed text-sm">
            {coverLetter}
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 bg-surface-hover hover:bg-border text-text text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-base text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              <Download size={16} />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}