import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useResume } from "../../context/ResumeContext";
import { listResumes } from "../../api/resumes";
import {
  FileText,
  PenLine,
  HelpCircle,
  Map,
  MessageCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";

const quickLinks = [
  {
    to: "/dashboard/resume",
    icon: FileText,
    title: "Analyze Resume",
    desc: "ATS score, missing skills, suggestions",
  },
  {
    to: "/dashboard/cover-letter",
    icon: PenLine,
    title: "Cover Letter",
    desc: "Generate a ready-to-send letter",
  },
  {
    to: "/dashboard/interview-prep",
    icon: HelpCircle,
    title: "Interview Prep",
    desc: "Questions tailored to your resume",
  },
  {
    to: "/dashboard/roadmap",
    icon: Map,
    title: "Learning Roadmap",
    desc: "Close your skill gaps, phase by phase",
  },
  {
    to: "/dashboard/chat",
    icon: MessageCircle,
    title: "Chat With Resume",
    desc: "Ask questions, get grounded answers",
  },
];

export default function Overview() {
  const { user } = useAuth();
  const { activeResume } = useResume();
  const [resumeCount, setResumeCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    listResumes()
      .then((response) => setResumeCount(response.data.length))
      .catch(() => setResumeCount(0))
      .finally(() => setIsLoading(false));
  }, []);

  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-text mb-1">
          Good to see you, {firstName} 👋
        </h2>
        <p className="text-text-muted">
          {activeResume
            ? `You're currently working with ${activeResume.file_name}.`
            : "Upload a resume to get started with AI-powered career insights."}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-text-muted text-sm mb-1">Resumes uploaded</p>
          <p className="text-2xl font-bold text-text">
            {isLoading ? (
              <Loader2 className="animate-spin text-accent" size={22} />
            ) : (
              resumeCount
            )}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-text-muted text-sm mb-1">Active resume</p>
          <p className="text-text font-semibold text-sm truncate mt-2">
            {activeResume ? activeResume.file_name : "None selected"}
          </p>
        </div>
      </div>

      {!activeResume && (
        <div className="bg-surface border border-border rounded-xl p-6 text-center">
          <FileText className="text-accent mx-auto mb-3" size={28} />
          <p className="text-text font-medium mb-1">No resume selected yet</p>
          <p className="text-text-muted text-sm mb-4">
            Head to the Resume tab to upload one, or pick from your history.
          </p>
          <Link
            to="/dashboard/resume"
            className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-base text-sm font-semibold px-4 py-2 rounded-lg transition"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      )}

      <div>
        <h3 className="text-text font-semibold mb-3">Where to next</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {quickLinks.map(({ to, icon: Icon, title, desc }) => (
            <Link
              key={to}
              to={to}
              className="group bg-surface border border-border hover:border-accent/50 rounded-xl p-4 flex items-center gap-3 transition"
            >
              <div className="bg-accent-muted rounded-lg p-2 flex-shrink-0">
                <Icon className="text-accent" size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text font-medium text-sm">{title}</p>
                <p className="text-text-muted text-xs">{desc}</p>
              </div>
              <ArrowRight
                className="text-text-muted flex-shrink-0 transition-transform group-hover:translate-x-1"
                size={16}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}