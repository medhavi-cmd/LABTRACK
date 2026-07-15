import { ArrowRight } from "lucide-react";

const GalleryCard = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group flex flex-col h-full cursor-pointer overflow-hidden rounded-xl border border-slate-855 bg-[#0e1626] transition-all duration-300 sm:hover:-translate-y-1 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900 border-b border-slate-800/60 shrink-0">
        <img
          src={project.cover_image || "https://placehold.co/800x450?text=Project"}
          alt={project.project_title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
          loading="lazy"
        />
        {(project.branch || project.academic_year) && (
          <span className="absolute top-2.5 left-2.5 bg-[#0e1626]/90 backdrop-blur-sm border border-slate-800/80 text-[10px] font-semibold text-cyan-400 px-2 py-0.5 rounded">
            {project.branch || project.academic_year}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
            {project.project_title || "Untitled Project"}
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400 line-clamp-2 min-h-[32px] sm:min-h-[40px]">
            {project.description || "No description available for this project."}
          </p>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-800/60">
          <span className="text-[11px] sm:text-xs text-slate-500 truncate max-w-[110px] xs:max-w-[150px]">
            {project.team_name || "Independent"}
          </span>

          <div className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 transition-colors duration-200 group-hover:text-blue-300 shrink-0">
            <span>View Details</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;