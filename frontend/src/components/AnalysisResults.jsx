import { useState } from "react";
import { CheckCircle2, AlertCircle, Map, Loader2 } from "lucide-react";
import { generateLearningRoadmap } from "../api/resumes";
import RoadmapModal from "./RoadmapModal";

function getScoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-accent";
  return "text-danger";
}

export default function AnalysisResults({ analysis, resumeId }) {
  const [roadmap, setRoadmap] = useState(null);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState("");

  const handleGenerateRoadmap = async () => {
    setRoadmapError("");
    setIsGeneratingRoadmap(true);

    try {
      const response = await generateLearningRoadmap(
        resumeId,
        analysis.missing_skills || [],
        analysis.job_description
      );
      setRoadmap(response.data.roadmap);
    } catch (err) {
      setRoadmapError(
        err.response?.data?.detail || "Roadmap generation failed."
      );
    } finally {
      setIsGeneratingRoadmap(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex-shrink-0">
          <svg className="w-24 h-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-border"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 - (251.2 * analysis.ats_score) / 100}
              strokeLinecap="round"
              className={getScoreColor(analysis.ats_score)}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-2xl font-bold ${getScoreColor(analysis.ats_score)}`}
            >
              {analysis.ats_score}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-text font-semibold text-lg">ATS Score</h3>
          <p className="text-text-muted text-sm">
            {analysis.job_description
              ? "Matched against the job description provided"
              : "General resume quality assessment"}
          </p>
        </div>
      </div>

      {analysis.matched_skills?.length > 0 && (
        <div>
          <h4 className="text-text font-medium mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-success" />
            Matched Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.matched_skills.map((skill, i) => (
              <span
                key={i}
                className="bg-success/10 text-success text-sm px-3 py-1 rounded-full border border-success/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {analysis.missing_skills?.length > 0 && (
        <div>
          <h4 className="text-text font-medium mb-2 flex items-center gap-1.5">
            <AlertCircle size={16} className="text-accent" />
            Missing Skills
          </h4>
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
        </div>
      )}

      {(analysis.experience_match != null || analysis.keyword_match != null) && (
        <div className="space-y-3">
          {analysis.experience_match != null && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Experience Match</span>
                <span className="text-text font-medium">
                  {analysis.experience_match}%
                </span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${analysis.experience_match}%` }}
                />
              </div>
            </div>
          )}

          {analysis.keyword_match != null && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-muted">Keyword Match</span>
                <span className="text-text font-medium">
                  {analysis.keyword_match}%
                </span>
              </div>
              <div className="w-full bg-surface-hover rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${analysis.keyword_match}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {analysis.suggestions && (
        <div>
          <h4 className="text-text font-medium mb-2 flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-success" />
            Suggestions
          </h4>
          <p className="text-text-muted text-sm leading-relaxed">
            {analysis.suggestions}
          </p>
        </div>
      )}

      {roadmapError && (
        <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
          {roadmapError}
        </p>
      )}

      {analysis.missing_skills?.length > 0 && (
        <button
          onClick={handleGenerateRoadmap}
          disabled={isGeneratingRoadmap}
          className="flex items-center justify-center gap-2 w-full bg-surface-hover hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed text-text font-semibold py-2.5 rounded-lg border border-border transition"
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
      )}

      {roadmap && (
        <RoadmapModal roadmap={roadmap} onClose={() => setRoadmap(null)} />
      )}
    </div>
  );
}