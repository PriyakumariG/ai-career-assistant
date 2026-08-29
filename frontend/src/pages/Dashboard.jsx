import { useState } from "react";
import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import AnalysisResults from "../components/AnalysisResults";
import CoverLetterModal from "../components/CoverLetterModal";
import InterviewQuestionsModal from "../components/InterviewQuestionsModal";
import {
  analyzeResume,
  generateCoverLetter,
  generateInterviewQuestions,
} from "../api/resumes";
import { Loader2, Sparkles, FileText, HelpCircle } from "lucide-react";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const [coverLetter, setCoverLetter] = useState(null);
  const [isGeneratingLetter, setIsGeneratingLetter] = useState(false);

  const [interviewQuestions, setInterviewQuestions] = useState(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  const handleUploadSuccess = (resumeData) => {
    setResume(resumeData);
    setAnalysis(null);
    setJobDescription("");
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

  const handleGenerateCoverLetter = async () => {
    if (!resume) return;
    setError("");
    setIsGeneratingLetter(true);

    try {
      const response = await generateCoverLetter(
        resume.id,
        jobDescription.trim() || null
      );
      setCoverLetter(response.data.cover_letter);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Cover letter generation failed."
      );
    } finally {
      setIsGeneratingLetter(false);
    }
  };

  const handleGenerateQuestions = async () => {
    if (!resume) return;
    setError("");
    setIsGeneratingQuestions(true);

    try {
      const response = await generateInterviewQuestions(
        resume.id,
        jobDescription.trim() || null
      );
      setInterviewQuestions(response.data.questions);
    } catch (err) {
      setError(err.response?.data?.detail || "Question generation failed.");
    } finally {
      setIsGeneratingQuestions(false);
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
                setJobDescription("");
              }}
              className="text-text-muted hover:text-text text-sm transition"
            >
              Upload different file
            </button>
          </div>
        )}

        {resume && (
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

            <div className="flex flex-col sm:flex-row gap-3">
              {!analysis && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-2.5 rounded-lg transition"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze Resume
                    </>
                  )}
                </button>
              )}

              <button
                onClick={handleGenerateCoverLetter}
                disabled={isGeneratingLetter}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-hover hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed text-text font-semibold py-2.5 rounded-lg border border-border transition"
              >
                {isGeneratingLetter ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Writing...
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    Cover Letter
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGeneratingQuestions}
                className="flex-1 flex items-center justify-center gap-2 bg-surface-hover hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed text-text font-semibold py-2.5 rounded-lg border border-border transition"
              >
                {isGeneratingQuestions ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Preparing...
                  </>
                ) : (
                  <>
                    <HelpCircle size={18} />
                    Interview Prep
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {analysis && <AnalysisResults analysis={analysis} />}
      </main>

      {coverLetter && (
        <CoverLetterModal
          coverLetter={coverLetter}
          onClose={() => setCoverLetter(null)}
        />
      )}

      {interviewQuestions && (
        <InterviewQuestionsModal
          questions={interviewQuestions}
          onClose={() => setInterviewQuestions(null)}
        />
      )}
    </div>
  );
}