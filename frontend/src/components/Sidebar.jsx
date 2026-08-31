import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PenLine,
  HelpCircle,
  Map,
  History,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/dashboard/cover-letter", label: "Cover Letter", icon: PenLine },
  { to: "/dashboard/interview-prep", label: "Interview Prep", icon: HelpCircle },
  { to: "/dashboard/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/dashboard/chat", label: "Resume Chat", icon: MessageCircle },
  { to: "/dashboard/history", label: "Resume History", icon: History },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive
        ? "bg-accent-muted text-accent"
        : "text-text-muted hover:text-text hover:bg-surface-hover"
    }`;

  return (
    <>
      {/* Mobile top bar with hamburger */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <span className="text-text font-medium text-sm">Menu</span>
        <button
          onClick={() => setIsOpen(true)}
          className="text-text-muted hover:text-text transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-border bg-surface hidden md:block">
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile slide-out menu */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-text font-semibold">Navigation</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text transition"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={linkClass}
                >
                  <Icon size={18} />
                  {label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}