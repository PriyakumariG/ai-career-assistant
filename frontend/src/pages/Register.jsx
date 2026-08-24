import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, loginUser, getCurrentUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser(email, password, fullName);

      const loginResponse = await loginUser(email, password);
      const token = loginResponse.data.access_token;

      localStorage.setItem("access_token", token);
      const userResponse = await getCurrentUser();

      login(token, userResponse.data);
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 400) {
        setError(err.response.data.detail || "This email is already registered.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text">
            AI Career <span className="text-accent">Assistant</span>
          </h1>
          <p className="text-text-muted text-sm mt-2">
            Create your account
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition"
                placeholder="Priya Gupta"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-base border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm text-text-muted mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-base border border-border rounded-lg px-3 py-2 pr-10 text-text placeholder:text-text-muted/50 focus:outline-none focus:border-accent transition"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-base font-semibold py-2.5 rounded-lg transition"
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-text-muted text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent hover:text-accent-hover font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}