import { CheckCircle2, AlertCircle } from "lucide-react";

function getScoreColor(score) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-accent";
  return "text-danger";
}

export default function AnalysisResults({ analysis }) {
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
            <span className={`text-2xl font-bold ${getScoreColor(analysis.ats_score)}`}>
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
    </div>
  );
}