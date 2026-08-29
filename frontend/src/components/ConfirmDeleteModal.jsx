import { AlertTriangle, X } from "lucide-react";

export default function ConfirmDeleteModal({ fileName, onConfirm, onCancel, isDeleting }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-xl max-w-sm w-full p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-danger/10 rounded-full p-2">
            <AlertTriangle className="text-danger" size={20} />
          </div>
          <button
            onClick={onCancel}
            className="text-text-muted hover:text-text transition"
          >
            <X size={18} />
          </button>
        </div>

        <h3 className="text-text font-semibold mb-1">Delete this resume?</h3>
        <p className="text-text-muted text-sm mb-6">
          <span className="text-text font-medium">{fileName}</span> and all
          its analyses will be permanently deleted. This can't be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 bg-surface-hover hover:bg-border text-text text-sm font-medium py-2 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 bg-danger hover:bg-danger/90 disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}