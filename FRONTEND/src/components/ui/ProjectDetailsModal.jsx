import { X, Download, Users, GraduationCap, FileText, Image as ImageIcon } from "lucide-react";

const ProjectDetailsModal = ({ open, onClose, project }) => {
  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-6 text-slate-600 font-sans">
      
      <div className="relative h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl transition-all duration-300">
        
        {/* ================= STICKY HEADER ================= */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-5 md:px-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              {project.project_title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-semibold text-cyan-600">
              {project.branch} <span className="text-slate-300 mx-1">|</span> {project.batch}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 p-2.5 text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors duration-200"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= MAIN CONTENT GRID ================= */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: MAIN DETAILS */}
          <div className="lg:col-span-2 space-y-6 sm:space-y-8">
            
            {/* Cover Image */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={project.cover_image || "https://placehold.co/800x450?text=Project"}
                alt={project.project_title}
                className="h-48 sm:h-64 md:h-[380px] w-full object-cover transition-transform duration-500"
              />
            </div>

            {/* Description Card */}
            <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="mb-3 text-base sm:text-lg font-bold text-slate-900">
                Description
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm text-slate-600 whitespace-pre-line font-medium">
                {project.description}
              </p>
            </section>

            {/* Objective Card */}
            <section className="bg-slate-50 border border-slate-200 rounded-xl p-5 md:p-6">
              <h3 className="mb-3 text-base sm:text-lg font-bold text-slate-900">
                Objective
              </h3>
              <p className="leading-relaxed text-xs sm:text-sm text-slate-600 font-medium">
                {project.objective}
              </p>
            </section>

            {/* Sub-Gallery Grid */}
            {project.images && project.images.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ImageIcon size={18} className="text-slate-500" />
                  Project Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {project.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 aspect-video">
                      <img
                        src={image.image_url}
                        alt={`Gallery view ${index + 1}`}
                        className="w-full h-full object-cover transition duration-300 hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: SIDEBAR DETAILS */}
          <div className="space-y-6">
            
            {/* Documents Action Card */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <FileText size={15} /> Documents
              </h4>
              <a
                href={project.report_file}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-md bg-cyan-600 hover:bg-cyan-700 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-sm transition duration-200 active:scale-95"
              >
                <Download size={15} />
                Download Report
              </a>
            </div>

            {/* Faculty Guides List */}
            {project.faculty_names && project.faculty_names.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <GraduationCap size={16} className="text-cyan-600" />
                  Faculty Guides
                </h4>
                <div className="space-y-2">
                  {project.faculty_names.map((faculty, index) => (
                    <div key={index} className="rounded-md bg-white border border-slate-200/80 px-4 py-2.5 text-xs sm:text-sm text-slate-700 font-semibold shadow-sm">
                      {faculty}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Team Members List */}
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h4 className="mb-3 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Users size={16} className="text-cyan-600" />
                  Team Members
                </h4>
                <div className="space-y-2">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md bg-white border border-slate-200/80 px-4 py-2.5 shadow-sm">
                      <span className="text-xs sm:text-sm font-semibold text-slate-700">
                        {member.name}
                      </span>
                      {member.role && (
                        <span className="text-[10px] font-mono font-bold bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-600">
                          {member.role}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;