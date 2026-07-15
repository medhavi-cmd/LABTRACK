import { X } from "lucide-react";
import ProjectSubmissionForm from "./ProjectSubmissionForm";

const AddProjectModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">

      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-slate-700 bg-[#0d1729] shadow-2xl">

        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white"
        >
          <X size={22} />
        </button>

        <div className="p-8">

          <ProjectSubmissionForm 
            onSuccess={onClose}
          />

        </div>

      </div>

    </div>
  );
};

export default AddProjectModal;