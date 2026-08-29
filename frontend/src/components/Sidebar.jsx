import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PenLine,
  HelpCircle,
  Map,
  History,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/dashboard/resume", label: "Resume", icon: FileText },
  { to: "/dashboard/cover-letter", label: "Cover Letter", icon: PenLine },
  { to: "/dashboard/interview-prep", label: "Interview Prep", icon: HelpCircle },
  { to: "/dashboard/roadmap", label: "Learning Roadmap", icon: Map },
  { to: "/dashboard/history", label: "Resume History", icon: History },
];

export default function Sidebar() {
  return (
    <aside className="w-56 flex-shrink-0 border-r border-border bg-surface hidden md:block">
      <nav className="p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive
                  ? "bg-accent-muted text-accent"
                  : "text-text-muted hover:text-text hover:bg-surface-hover"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}