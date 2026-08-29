import { useState } from "react";
import { X, Copy, Check, Download } from "lucide-react";

const categoryStyles = {
  Behavioral: "bg-accent-muted text-accent border-accent/30",
  Technical: "bg-success/10 text-success border-success/30",
  "Resume-Specific": "bg-surface-hover text-text-muted border-border",
};

function formatQuestionsAsText(questions) {
  return questions
    .map(
      (q, i) =>
        `${i + 1}. [${q.category}] ${q.question}\nTip: ${q.tip}`
    )
    .join("\n\n");
}

export default function InterviewQuestionsModal({ questions, onClose }) {
  const [copied, setCopied] = useState(false);

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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-text font-semibold text-lg">
            Interview Questions to Prepare For
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
          {questions.map((q, i) => (
            <div
              key={i}
              className="border border-border rounded-lg p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-text font-medium text-sm leading-relaxed">
                  {i + 1}. {q.question}
                </p>
                <span
                  className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${
                    categoryStyles[q.category] ||
                    categoryStyles["Resume-Specific"]
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
        </div>

        <div className="flex items-center gap-3 px-6 py-4 border-t border-border">
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
    </div>
  );
}