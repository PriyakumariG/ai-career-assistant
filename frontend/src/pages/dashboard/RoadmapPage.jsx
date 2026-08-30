import { useState } from "react";
import ResumeUpload from "../../components/ResumeUpload";
import ResumeSelector from "../../components/ResumeSelector";
import { analyzeResume, generateLearningRoadmap } from "../../api/resumes";
import { useResume } from "../../context/ResumeContext";
import { Loader2, Map, Copy, Check, Download } from "lucide-react";

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

export default function RoadmapPage() {
  const { activeResume: resume, setActiveResume: setResume } = useResume();
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const runAnalysis = async (resumeId) => {
    setError("");
    setIsAnalyzing(true);
    try {
      const response = await analyzeResume(
        resumeId,
        jobDescription.trim() || null
      );
      setAnalysis(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadSuccess = (resumeData) => {
    setResume(resumeData);
    setAnalysis(null);
    setRoadmap(null);
    setJobDescription("");
    setError("");
  };

  const handleChangeFile = () => {
    setResume(null);
    setAnalysis(null);
    setRoadmap(null);
    setJobDescription("");
    setError("");
  };

  const handleGenerateRoadmap = async () => {
    if (!resume || !analysis) return;
    setError("");
    setIsGeneratingRoadmap(true);
    try {
      const response = await generateLearningRoadmap(
        resume.id,
        analysis.missing_skills || [],
        jobDescription.trim() || null
      );
      setRoadmap(response.data.roadmap);
    } catch (err) {
      setError(err.response?.data?.detail || "Roadmap generation failed.");
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">
          Your Learning Roadmap
        </h2>
        <p className="text-text-muted">
          Upload a resume — we'll find your skill gaps and build a phased
          plan to close them.
        </p>
      </div>

      {!resume ? (
        <div className="space-y-3">
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          <ResumeSelector onSelect={handleUploadSuccess} />
        </div>
      ) : (
        <>
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
            <p className="text-text font-medium">{resume.file_name}</p>
            <button
              onClick={handleChangeFile}
              className="text-text-muted hover:text-text text-sm transition"
            >
              Change file
            </button>
          </div>

          {!analysis && (
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <div>
                <label className="block text-sm text-text-muted mb-1.5">
                  Job description (optional)
                </label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                  placeholder="Paste a job description to target your roadmap to a specific role, or leave blank for general skill gaps."
                  className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition resize-none"
                />
              </div>

              {error && (
                <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={() => runAnalysis(resume.id)}
                disabled={isAnalyzing}
                className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-2.5 rounded-lg transition"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Finding your skill gaps...
                  </>
                ) : (
                  "Find My Skill Gaps"
                )}
              </button>
            </div>
          )}

          {analysis && !roadmap && (
            <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-accent-muted text-accent text-sm px-3 py-1 rounded-full border border-accent/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {error && (
                <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                onClick={handleGenerateRoadmap}
                disabled={isGeneratingRoadmap}
                className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-2.5 rounded-lg transition"
              >
                {isGeneratingRoadmap ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Building roadmap...
                  </>
                ) : (
                  <>
                    <Map size={18} />
                    Generate Learning Roadmap
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {roadmap && (
        <div className="space-y-5">
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