import { X } from "lucide-react";
import ProjectSubmissionForm from "./ProjectSubmissionForm";

const AddProjectModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 sm:p-6">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Close Modal"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-8">
          <ProjectSubmissionForm onSuccess={onClose} />
        </div>

      </div>
    </div>
  );
};

export default AddProjectModal;