import { Link } from "react-router-dom";
import {
  FileText,
  Target,
  Sparkles,
  Briefcase,
  Brain,
  PenLine,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    desc: "Get an instant ATS score and readability check based on real parsing standards.",
  },
  {
    icon: Target,
    title: "Job Match",
    desc: "Paste any job description and see exactly how well your resume fits.",
  },
  {
    icon: Sparkles,
    title: "AI Suggestions",
    desc: "Specific, actionable feedback grounded in your actual resume — not generic tips.",
  },
  {
    icon: Briefcase,
    title: "Interview Prep",
    desc: "Practice questions tailored to your real projects and experience.",
  },
  {
    icon: Brain,
    title: "Skill Gap Roadmap",
    desc: "A phased, week-by-week plan to close the gaps that actually matter.",
  },
  {
    icon: PenLine,
    title: "Cover Letters",
    desc: "A ready-to-send letter, written from your resume — no placeholders.",
  },
  {
    icon: MessageCircle,
    title: "Chat With Your Resume",
    desc: "Ask questions and get answers grounded in your own experience.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-base">
      <nav className="border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-text">
            AI Career <span className="text-accent">Assistant</span>
          </h1>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-text-muted hover:text-text text-sm font-medium transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-accent hover:bg-accent-hover text-base text-sm font-semibold px-4 py-2 rounded-lg transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 pt-20 pb-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-text leading-tight">
          Build a Better <span className="text-accent">Career</span>
        </h2>
        <p className="text-text-muted text-lg mt-4 max-w-xl mx-auto">
          Upload your resume. Get an AI-powered ATS score, a job match,
          interview prep, and a roadmap to close your skill gaps — all in
          one place.
        </p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 mt-8 bg-accent hover:bg-accent-hover text-base font-semibold px-6 py-3 rounded-lg transition group"
        >
          Analyze My Resume
          <ArrowRight
            size={18}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </main>

      <section className="max-w-5xl mx-auto px-4 pb-24">
        <h3 className="text-center text-text-muted text-sm font-semibold uppercase tracking-wide mb-8">
          What You Get
        </h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group bg-surface border border-border rounded-xl p-5 transition-all duration-200 hover:border-accent/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="bg-accent-muted rounded-lg p-2.5 w-fit mb-3 transition-transform duration-200 group-hover:scale-110">
                <Icon className="text-accent" size={20} />
              </div>
              <h3 className="text-text font-semibold text-sm mb-1.5">
                {title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6">
        <p className="text-center text-text-muted text-xs">
          Built with FastAPI, React, and Gemini AI.
        </p>
      </footer>
    </div>
  );
}