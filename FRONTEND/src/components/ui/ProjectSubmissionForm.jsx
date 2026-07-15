import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, FileText, Image, Loader2, FileUp } from "lucide-react";
import { submitProjectToGallery } from "../../services/galleryApi";

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

      alert("Project submitted successfully!");
      if (onSuccess) onSuccess();
      navigate("/student/gallery");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto px-1">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl font-bold tracking-tight text-white">Submit Project</h2>
        <p className="mt-1 text-sm text-slate-400">
          Submit your completed project details and files for faculty review.
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#0e1626] p-5 md:p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Project Objective
          </label>
          <textarea
            rows={3}
            required
            name="objective"
            placeholder="Describe the core objective or problem your project solves..."
            value={form.objective}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#111a2f] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Detailed Description
          </label>
          <textarea
            rows={5}
            required
            name="description"
            placeholder="Provide a comprehensive breakdown of your project implementation, architecture, and results..."
            value={form.description}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-slate-800 bg-[#111a2f] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="rounded-xl border border-slate-800 bg-[#0e1626] p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Cover Image
          </span>
          <label className="flex flex-col items-center justify-center flex-1 border border-dashed border-slate-800 hover:border-slate-700 bg-[#111a2f] rounded-xl p-4 cursor-pointer text-center group transition">
            <Image size={24} className="text-slate-400 group-hover:text-blue-400 mb-2 transition-colors" />
            <span className="text-xs font-medium text-slate-300 line-clamp-1 px-2">
              {coverImage ? coverImage.name : "Select cover image"}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Aspect ratio 16:9 preferred</span>
            <input
              required={!coverImage}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverImage(e.target.files[0])}
            />
          </label>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0e1626] p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Gallery Images
          </span>
          <label className="flex flex-col items-center justify-center flex-1 border border-dashed border-slate-800 hover:border-slate-700 bg-[#111a2f] rounded-xl p-4 cursor-pointer text-center group transition">
            <Upload size={24} className="text-slate-400 group-hover:text-blue-400 mb-2 transition-colors" />
            <span className="text-xs font-medium text-slate-300 line-clamp-1 px-2">
              {galleryImages.length > 0 ? `${galleryImages.length} images selected` : "Select gallery photos"}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Upload multiple snapshots</span>
            <input
              multiple
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setGalleryImages([...e.target.files])}
            />
          </label>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0e1626] p-5 flex flex-col justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            Project Report
          </span>
          <label className="flex flex-col items-center justify-center flex-1 border border-dashed border-slate-800 hover:border-slate-700 bg-[#111a2f] rounded-xl p-4 cursor-pointer text-center group transition">
            <FileText size={24} className="text-slate-400 group-hover:text-blue-400 mb-2 transition-colors" />
            <span className="text-xs font-medium text-slate-300 line-clamp-1 px-2">
              {report ? report.name : "Select report document"}
            </span>
            <span className="text-[10px] text-slate-500 mt-1">Strictly PDF format</span>
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
          className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-w-[160px] rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <FileUp size={16} />
              Submit Project
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectSubmissionForm;