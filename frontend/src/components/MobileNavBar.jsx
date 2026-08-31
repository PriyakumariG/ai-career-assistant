import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navItems, linkClass } from "./Sidebar";

export default function MobileNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
        <span className="text-text font-medium text-sm">Menu</span>
        <button
          onClick={() => setIsOpen(true)}
          className="text-text-muted hover:text-text transition"
        >
          <Menu size={22} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-border p-4 overflow-y-auto">
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
    </div>
  );
}