import { X, Download, Users, GraduationCap, FileText, Image as ImageIcon } from "lucide-react";

const ProjectDetailsModal = ({ open, onClose, project }) => {
  if (!open || !project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
    
      <div className="relative h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl border border-slate-800 bg-[#090f1c] shadow-2xl transition-all duration-300">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800 bg-[#090f1c]/95 backdrop-blur px-6 py-5 md:px-8">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">
              {project.project_title}
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-medium text-cyan-400">
              {project.branch} <span className="text-slate-600">|</span> {project.batch}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-800 p-2.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors duration-200"
            aria-label="Close Modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <img
                src={project.cover_image}
                alt={project.project_title}
                className="h-48 sm:h-64 md:h-[380px] w-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
            </div>

            <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 md:p-6">
              <h3 className="mb-3 text-lg font-semibold text-white flex items-center gap-2">
                Description
              </h3>
              <p className="leading-relaxed text-sm sm:text-base text-slate-300 whitespace-pre-line">
                {project.description}
              </p>
            </section>

            <section className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 md:p-6">
              <h3 className="mb-3 text-lg font-semibold text-white">
                Objective
              </h3>
              <p className="leading-relaxed text-sm sm:text-base text-slate-300">
                {project.objective}
              </p>
            </section>

            {project.images && project.images.length > 0 && (
              <section>
                <h3 className="mb-4 text-lg font-semibold text-white flex items-center gap-2">
                  <ImageIcon size={18} className="text-slate-400" />
                  Project Gallery
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {project.images.map((image, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900 aspect-video">
                      <img
                        src={image.image_url}
                        alt={`Gallery view ${index + 1}`}
                        className="w-full h-full object-cover transition duration-300 hover:scale-[1.05]"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>


          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FileText size={16} /> Documents
              </h4>
              <a
                href={project.report_file}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-blue-600 hover:bg-blue-500 py-3 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition duration-200"
              >
                <Download size={16} />
                Download Report
              </a>
            </div>

            {project.faculty_names && project.faculty_names.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <GraduationCap size={18} className="text-cyan-400" />
                  Faculty Guides
                </h4>
                <div className="space-y-2">
                  {project.faculty_names.map((faculty, index) => (
                    <div key={index} className="rounded-lg bg-[#0d1729] border border-slate-800/40 px-4 py-2.5 text-sm text-slate-200 font-medium">
                      {faculty}
                    </div>
                  ))}
                </div>
              </div>
            )}

         
            {project.teamMembers && project.teamMembers.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />
                  Team Members
                </h4>
                <div className="space-y-2">
                  {project.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg bg-[#0d1729] border border-slate-800/40 px-4 py-3">
                      <span className="text-sm font-medium text-slate-200">
                        {member.name}
                      </span>
                      {member.role && (
                        <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-400 font-normal">
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