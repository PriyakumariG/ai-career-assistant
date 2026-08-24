import { useState } from "react";
import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisResults from "../components/AnalysisResults";
import { analyzeResume } from "../api/resumes";
import { Loader2, Sparkles } from "lucide-react";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleUploadSuccess = (resumeData) => {
    setResume(resumeData);
    setAnalysis(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!resume) return;
    setError("");
    setIsAnalyzing(true);

    try {
      const response = await analyzeResume(
        resume.id,
        jobDescription.trim() || null
      );
      setAnalysis(response.data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Analysis failed. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-text mb-1">
            Analyze your resume
          </h2>
          <p className="text-text-muted">
            Upload a resume to get an ATS score, missing skills, and
            personalized suggestions.
          </p>
        </div>

        {!resume ? (
          <ResumeUpload onUploadSuccess={handleUploadSuccess} />
        ) : (
          <div className="bg-surface border border-border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-text font-medium">{resume.file_name}</p>
              <p className="text-text-muted text-sm">Uploaded successfully</p>
            </div>
            <button
              onClick={() => {
                setResume(null);
                setAnalysis(null);
              }}
              className="text-text-muted hover:text-text text-sm transition"
            >
              Upload different file
            </button>
          </div>
        )}

        {resume && !analysis && (
          <div className="bg-surface border border-border rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                Job description (optional)
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                placeholder="Paste a job description to get a match-specific analysis, or leave blank for a general resume review."
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition resize-none"
              />
            </div>

            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-2.5 rounded-lg transition"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        )}

        {analysis && <AnalysisResults analysis={analysis} />}
      </main>
    </div>
  );
}