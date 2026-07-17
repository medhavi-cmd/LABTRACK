import { ArrowRight } from "lucide-react";

const GalleryCard = ({ project, onClick }) => {
  return (
    <div
      onClick={() => onClick(project)}
      className="group flex flex-col h-full cursor-pointer overflow-hidden rounded-xl border border-slate-200 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100 border-b border-slate-200 shrink-0">
        <img
          src={project.cover_image || "https://placehold.co/800x450?text=Project"}
          alt={project.project_title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
          loading="lazy"
        />
        {(project.branch || project.academic_year) && (
          <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm border border-slate-200 text-[10px] font-bold text-cyan-600 px-2 py-0.5 rounded shadow-sm">
            {project.branch || project.academic_year}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight group-hover:text-cyan-600 transition-colors duration-200 line-clamp-1">
            {project.project_title || "Untitled Project"}
          </h3>

          <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-500 line-clamp-2 min-h-[32px] sm:min-h-[40px] font-medium">
            {project.description || "No description available for this project."}
          </p>
        </div>

        <div className="mt-4 pt-3 flex items-center justify-between border-t border-slate-100">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400 truncate max-w-[110px] xs:max-w-[150px]">
            {project.team_name || "Independent"}
          </span>

          <div className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 transition-colors duration-200 group-hover:text-cyan-700 shrink-0">
            <span>View Details</span>
            <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryCard;