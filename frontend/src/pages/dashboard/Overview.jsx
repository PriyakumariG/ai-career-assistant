import { useAuth } from "../../context/AuthContext";

export default function Overview() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-1">
        Good to see you, {user?.full_name?.split(" ")[0] || "there"} 👋
      </h2>
      <p className="text-text-muted">
        Head to the Resume tab to upload and analyze your resume.
      </p>
    </div>
  );
}