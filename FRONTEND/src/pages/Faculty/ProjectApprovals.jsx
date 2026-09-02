import { useState, useCallback } from "react";
import { useListQuery } from "../../hooks/useListQuery";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import CommentsSection from "../../components/ui/CommentsSection";
import { getProjects, updateProjectStatus } from "../../services/projectService";
import { FiSearch, FiX, FiChevronUp, FiChevronDown, FiFilter, FiEye } from "react-icons/fi";

// ─── Sort Th ──────────────────────────────────────────────────────────
const SortTh = ({ label, field, sortField, sortDir, onSort }) => {
  const active = sortField === field;
  return (
    <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC] select-none">
      <button onClick={() => onSort(field)} className="flex items-center gap-1 group hover:text-[#2563EB] transition-colors">
        {label}
        <span className="flex flex-col opacity-50 group-hover:opacity-100">
          <FiChevronUp className={`w-3 h-3 -mb-0.5 ${active && sortDir === "asc" ? "text-[#2563EB] opacity-100" : ""}`} />
          <FiChevronDown className={`w-3 h-3 ${active && sortDir === "desc" ? "text-[#2563EB] opacity-100" : ""}`} />
        </span>
      </button>
    </th>
  );
};

// ─── Project Details Dialog ───────────────────────────────────────────
const ProjectDialog = ({ project, onClose, onApprove, onReject }) => {
  if (!project) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827]">Project Details</h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm mb-5">
          {[
            { label: "Project Title", value: project.title },
            { label: "Team", value: project.team },
            { label: "Faculty Guide", value: project.guide },
            { label: "Status", value: project.status },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[#6B7280] mb-1">{label}</p>
              <p
                className={`font-medium ${
                  label === "Status"
                    ? project.status === "Approved"
                      ? "text-green-700"
                      : project.status === "Rejected"
                      ? "text-red-700"
                      : "text-amber-700"
                    : "text-[#111827]"
                }`}
              >
                {value ?? "—"}
              </p>
            </div>
          ))}
        </div>

        {project.status === "Pending" ? (
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => onApprove(project)}
              className="flex-1 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(project)}
              className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              Reject
            </button>
          </div>
        ) : (
          <div className={`px-4 py-3 rounded-lg mb-4 font-semibold text-sm ${project.status === "Approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            Already {project.status}
          </div>
        )}

        <CommentsSection entityType="project" entityId={project.id} />

        <button onClick={onClose} className="mt-4 w-full px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────
// Search, filter and sort are resolved by the API (projectApprovalService.js).
const fetchProjectsPage = async (params, signal) => {
  const response = await getProjects(params, signal);
  return { data: response.data?.data ?? [], stats: response.data?.stats ?? null };
};

const EMPTY_STATS = { total: 0, pending: 0, approved: 0, rejected: 0 };

function ProjectApprovals() {
  const {
    data: filtered,
    extra,
    search: searchTerm,
    setSearch: setSearchTerm,
    filters,
    setFilter,
    sortField,
    sortDir,
    handleSort,
    reload: loadProjects,
  } = useListQuery(fetchProjectsPage, {
    initialFilters: { status: "all" },
    initialSortField: "title",
    initialSortDir: "asc",
  });

  const [selectedProject, setSelectedProject] = useState(null);

  const filterStatus = filters.status;
  const setFilterStatus = useCallback((value) => setFilter("status", value), [setFilter]);

  const stats = extra?.stats ?? EMPTY_STATS;
  const pendingCount  = stats.pending;
  const approvedCount = stats.approved;
  const rejectedCount = stats.rejected;

  const updateStatus = async (projectToUpdate, newStatus) => {
    try {
      await updateProjectStatus(projectToUpdate.id, newStatus);
      setSelectedProject({ ...projectToUpdate, status: newStatus });
      loadProjects();
    } catch (error) { console.error("Error updating project:", error); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader title="Project Approvals" subtitle="Review and approve student projects" />

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Projects" value={stats.total} change="Submitted projects" />
          <StatCard title="Pending" value={pendingCount} change="Awaiting approval" />
          <StatCard title="Approved" value={approvedCount} change="Accepted projects" />
          <StatCard title="Rejected" value={rejectedCount} change="Needs revision" />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-3.5 text-[#6B7280]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project title, team, or guide..."
              className="w-full border border-[#E5E7EB] rounded-lg pl-12 pr-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
            <FiFilter className="text-[#6B7280] shrink-0" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="outline-none text-sm text-[#4B5563] bg-transparent cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] text-[#4B5563] text-sm">
              <tr>
                <SortTh label="Title" field="title" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Team" field="team" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Status" field="status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <SortTh label="Guide" field="guide" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-[#6B7280]">No projects found.</td></tr>
              ) : (
                filtered.map((project, i) => (
                  <tr key={project.id ?? i} className="text-sm text-[#4B5563] hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-5 py-4 font-medium text-[#111827]">{project.title}</td>
                    <td className="px-5 py-4">{project.team}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                        project.status === "Approved" ? "bg-green-50 border-green-200 text-green-700"
                        : project.status === "Rejected" ? "bg-red-50 border-red-200 text-red-700"
                        : "bg-amber-50 border-amber-200 text-amber-700"
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">{project.guide}</td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <FiEye className="w-3.5 h-3.5" />View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedProject && (
        <ProjectDialog
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onApprove={(p) => updateStatus(p, "Approved")}
          onReject={(p) => updateStatus(p, "Rejected")}
        />
      )}
    </DashboardLayout>
  );
}

export default ProjectApprovals;