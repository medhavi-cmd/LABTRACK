import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Image, Loader2, FileUp } from "lucide-react";
import { submitProjectToGallery } from "../../services/galleryApi";
import {toast} from "sonner";

const ProjectSubmissionForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    description: "",
    objective: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [report, setReport] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await submitProjectToGallery({
        description: form.description,
        objective: form.objective,
        coverImage,
        galleryImages,
        report,
      });

      toast.success("Project submitted successfully!");
      if (onSuccess) onSuccess();
      navigate("/student/gallery");
    } catch (error) {
      toast.error(error.message || "Failed to submit project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto px-1 text-slate-600 font-sans">
      <div className="border-b border-slate-200 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Submit Project</h2>
        <p className="mt-1 text-sm text-slate-500">
          Submit your completed project details and files for faculty review.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 md:p-6 space-y-5 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Project Objective
          </label>
          <textarea
            rows={3}
            required
            name="objective"
            placeholder="Describe the core objective or problem your project solves..."
            value={form.objective}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm resize-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Detailed Description
          </label>
          <textarea
            rows={5}
            required
            name="description"
            placeholder="Provide a comprehensive breakdown of your project implementation, architecture, and results..."
            value={form.description}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Cover Image Upload */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">
            Cover Image
          </span>
          <label className="flex flex-col items-center justify-center flex-1 border border-dashed border-slate-200 hover:border-slate-300 bg-slate-50 rounded-lg p-4 cursor-pointer text-center group transition shadow-sm">
            <Image size={24} className="text-slate-400 group-hover:text-cyan-600 mb-2 transition-colors" />
            <span className="text-xs font-semibold text-slate-700 line-clamp-1 px-2">
              {coverImage ? coverImage.name : "Select cover image"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Aspect ratio 16:9 preferred</span>
            <input
              required={!coverImage}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* Gallery Images Upload */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">
            Gallery Images
          </span>
          <label className="flex flex-col items-center justify-center flex-1 border border-dashed border-slate-200 hover:border-slate-300 bg-slate-50 rounded-lg p-4 cursor-pointer text-center group transition shadow-sm">
            <Upload size={24} className="text-slate-400 group-hover:text-cyan-600 mb-2 transition-colors" />
            <span className="text-xs font-semibold text-slate-700 line-clamp-1 px-2">
              {galleryImages.length > 0 ? `${galleryImages.length} images selected` : "Select gallery photos"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Upload multiple snapshots</span>
            <input
              multiple
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setGalleryImages([...e.target.files])}
            />
          </label>
        </div>

        {/* Project Report Upload */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 flex flex-col justify-between shadow-sm">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-3">
            Project Report
          </span>
          <label className="flex flex-col items-center justify-center flex-1 border border-dashed border-slate-200 hover:border-slate-300 bg-slate-50 rounded-lg p-4 cursor-pointer text-center group transition shadow-sm">
            <FileText size={24} className="text-slate-400 group-hover:text-cyan-600 mb-2 transition-colors" />
            <span className="text-xs font-semibold text-slate-700 line-clamp-1 px-2">
              {report ? report.name : "Select report document"}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Strictly PDF format</span>
            <input
              required={!report}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setReport(e.target.files[0])}
            />
          </label>
        </div>

      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px] rounded-md bg-[#2563EB] px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1d4ed8] transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FileUp size={15} />
              Submit Project
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectSubmissionForm;