import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-border bg-surface">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-accent rounded-lg p-1.5">
            <Sparkles className="text-base" size={18} />
          </div>
          <h1 className="text-lg font-bold text-text">
            AI Career <span className="text-accent">Assistant</span>
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-text-muted text-sm hidden sm:block">
            {user?.full_name || user?.email}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-text-muted hover:text-text text-sm transition"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}