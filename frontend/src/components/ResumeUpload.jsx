import { useState, useRef } from "react";
import { uploadResume } from "../api/resumes";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function ResumeUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "docx"].includes(ext)) {
      setError("Only PDF and DOCX files are supported.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const response = await uploadResume(file);
      onUploadSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition ${
          isDragging
            ? "border-accent bg-accent-muted"
            : "border-border hover:border-text-muted"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-accent" size={32} />
            <p className="text-text-muted">Uploading and extracting text...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-surface-hover rounded-full p-3">
              <Upload className="text-accent" size={24} />
            </div>
            <div>
              <p className="text-text font-medium">
                Drop your resume here, or click to browse
              </p>
              <p className="text-text-muted text-sm mt-1">
                PDF or DOCX, up to 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-danger text-sm bg-danger/10 border border-danger/30 rounded-lg px-3 py-2 mt-3">
          {error}
        </p>
      )}
    </div>
  );
}