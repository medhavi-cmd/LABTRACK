import { useEffect, useMemo, useState } from "react";
import { Plus, Search, FolderGit2, Users, Loader2 } from "lucide-react";

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import GalleryCard from "../../components/ui/GalleryCard";
import AddProjectModal from "../../components/ui/AddProjectModal";
import ProjectDetailsModal from "../../components/ui/ProjectDetailsModal";
import {toast} from "sonner";
import {
  getGalleryProjects,
  getGalleryStatistics,
  getProjectDetails,
} from "../../services/galleryApi";

const ITEMS_PER_PAGE = 9;

const ProjectGallery = () => {
  const [projects, setProjects] = useState([]);
  const [statistics, setStatistics] = useState({
    total_projects: 0,
    total_teams: 0,
  });

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const [galleryData, stats] = await Promise.all([
        getGalleryProjects(),
        getGalleryStatistics(),
      ]);
      setProjects(galleryData);
      setStatistics(stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      return (
        project.project_title?.toLowerCase().includes(search.toLowerCase()) ||
        project.team_name?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [projects, search]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    return filteredProjects.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filteredProjects, currentPage]);

  const handleCardClick = async (project) => {
    try {
      setDetailsLoading(true);
      const details = await getProjectDetails(project.project_id);
      setSelectedProject(details);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load project details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <GroupLeaderLayout>
      <div className="space-y-6 sm:space-y-8 px-2 sm:px-4 max-w-7xl mx-auto text-slate-600 font-sans">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 sm:pb-6">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB]">
              Showcase
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
              Project Gallery
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Explore projects developed by students across different batches
              and departments.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#2563EB] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#1d4ed8] transition active:scale-[0.98] w-full sm:w-auto"
          >
            <Plus size={16} />
            Add Project
          </button>
        </div>

        <div className="grid gap-4 grid-cols-2">
     
          <div className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md">
            <div className="space-y-0.5 min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Total Projects
              </p>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
                {statistics.total_projects}
              </h2>
            </div>
            <div className="rounded-xl bg-cyan-50 p-2.5 sm:p-3 text-cyan-600 group-hover:scale-105 transition-transform shrink-0">
              <FolderGit2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>

   
          <div className="group rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex items-center justify-between transition-all duration-200 hover:shadow-md">
            <div className="space-y-0.5 min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Active Teams
              </p>
              <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
                {statistics.total_teams}
              </h2>
            </div>
            <div className="rounded-xl bg-cyan-50 p-2.5 sm:p-3 text-cyan-600 group-hover:scale-105 transition-transform shrink-0">
              <Users className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="h-7 w-7 animate-spin text-cyan-600" />
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Loading dynamic directory...
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white py-16 px-4 text-center shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              No Results Found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto font-medium">
              We couldn't find matches matching those details. Adjust your
              search parameters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProjects.map((project) => (
                <GalleryCard
                  key={project.project_id}
                  project={project}
                  onClick={handleCardClick}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between sm:justify-center gap-3 border-t border-slate-100 pt-5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                >
                  Prev
                </button>

                <span className="text-xs font-semibold text-slate-500">
                  <span className="hidden xs:inline">Page </span>
                  <span className="text-slate-900 font-bold">
                    {currentPage}
                  </span>
                  <span className="mx-1">/</span>
                  <span className="text-slate-900 font-bold">{totalPages}</span>
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="rounded-md border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {showModal && (
          <AddProjectModal
            open={showModal}
            onClose={() => {
              setShowModal(false);
              loadGallery();
            }}
          />
        )}

        {showModal && (
          <AddProjectModal
            open={showModal}
            onClose={() => {
              setShowModal(false);
              loadGallery();
            }}
          />
        )}

        {detailsLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xl max-w-xs w-full text-center">
              <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 animate-spin text-cyan-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Fetching Project Profiles...
              </span>
            </div>
          </div>
        )}

        <ProjectDetailsModal
          open={!!selectedProject}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </GroupLeaderLayout>
  );
};

export default ProjectGallery;
