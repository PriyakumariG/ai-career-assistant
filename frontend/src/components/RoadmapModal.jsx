import { X, Copy, Check, Download } from "lucide-react";
import { useState } from "react";

function formatRoadmapAsText(roadmap) {
  return roadmap
    .map(
      (phase) =>
        `${phase.phase}\nSkills: ${phase.skills.join(", ")}\n${phase.steps
          .map((s) => `- ${s}`)
          .join("\n")}`
    )
    .join("\n\n");
}

export default function RoadmapModal({ roadmap, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formatRoadmapAsText(roadmap));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = formatRoadmapAsText(roadmap);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "learning_roadmap.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-xl max-w-2xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-text font-semibold text-lg">
            Your Learning Roadmap
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1 space-y-5">
          {roadmap.map((phase, i) => (
            <div key={i} className="relative pl-6">
              {i < roadmap.length - 1 && (
                <div className="absolute left-[7px] top-6 bottom-[-20px] w-px bg-border" />
              )}
              <div className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full bg-accent" />

              <h4 className="text-text font-semibold text-sm mb-1.5">
                {phase.phase}
              </h4>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {phase.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="bg-accent-muted text-accent text-xs px-2 py-0.5 rounded-full border border-accent/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              <ul className="space-y-1.5">
                {phase.steps.map((step, k) => (
                  <li
                    key={k}
                    className="text-text-muted text-sm leading-relaxed"
                  >
                    • {step}
                  </li>
                ))}
              </ul>
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