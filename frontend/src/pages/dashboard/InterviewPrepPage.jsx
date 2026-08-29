import { useState } from "react";
import ResumeUpload from "../../components/ResumeUpload";
import ResumeSelector from "../../components/ResumeSelector";
import { generateInterviewQuestions } from "../../api/resumes";
import { useResume } from "../../context/ResumeContext";
import { Loader2, HelpCircle, Copy, Check, Download } from "lucide-react";

const categoryStyles = {
  Behavioral: "bg-accent-muted text-accent border-accent/30",
  Technical: "bg-success/10 text-success border-success/30",
  "Resume-Specific": "bg-surface-hover text-text-muted border-border",
};

function formatQuestionsAsText(questions) {
  return questions
    .map((q, i) => `${i + 1}. [${q.category}] ${q.question}\nTip: ${q.tip}`)
    .join("\n\n");
}

export default function InterviewPrepPage() {
  const { activeResume: resume, setActiveResume: setResume } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resume) return;
    setError("");
    setIsGenerating(true);
    try {
      const response = await generateInterviewQuestions(
        resume.id,
        jobDescription.trim() || null
      );
      setQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.detail || "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatQuestionsAsText(questions));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = formatQuestionsAsText(questions);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "interview_questions.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">
          AI Interview Preparation
        </h2>
        <p className="text-text-muted">
          Get likely interview questions based on your resume, with tips on
          how to answer them.
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
                setQuestions(null);
              }}
              className="text-text-muted hover:text-text text-sm transition"
            >
              Change file
            </button>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={3}
            placeholder="Job description (optional) — tailors the questions to a specific role."
            className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition resize-none"
          />

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
                Preparing...
              </>
            ) : (
              <>
                <HelpCircle size={18} />
                Generate Questions
              </>
            )}
          </button>
        </div>
      )}

      {questions && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-xl p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-text font-medium text-sm leading-relaxed">
                  {i + 1}. {q.question}
                </p>
                <span
                  className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${
                    categoryStyles[q.category] || categoryStyles["Resume-Specific"]
                  }`}
                >
                  {q.category}
                </span>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                💡 {q.tip}
              </p>
            </div>
          ))}

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
