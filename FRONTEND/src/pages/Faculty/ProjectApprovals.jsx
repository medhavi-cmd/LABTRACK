import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";
import StatCard from "../../components/ui/StatCard";
import {
  getProjects,
  updateProjectStatus,
} from "../../services/projectService";

function ProjectApprovals() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const updateStatus = async (projectToUpdate, newStatus) => {
    try {
      await updateProjectStatus(projectToUpdate.id, newStatus);

      const updatedProjects = projects.map((project) =>
        project.id === projectToUpdate.id
          ? { ...project, status: newStatus }
          : project
      );

      setProjects(updatedProjects);
      setSelectedProject({ ...projectToUpdate, status: newStatus });
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const tableData = projects.map((project) => ({
    Title: project.title,
    Team: project.team,
    Status: (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
          project.status === "Approved"
            ? "bg-green-50 border-green-200 text-green-700"
            : project.status === "Rejected"
            ? "bg-red-50 border-red-200 text-red-700"
            : "bg-amber-50 border-amber-200 text-amber-700"
        }`}
      >
        {project.status}
      </span>
    ),
    Guide: project.guide,
    Actions: (
      <ActionButton text="View" onClick={() => setSelectedProject(project)} />
    ),
  }));

  const pendingCount = projects.filter((project) => project.status === "Pending").length;
  const approvedCount = projects.filter((project) => project.status === "Approved").length;
  const rejectedCount = projects.filter((project) => project.status === "Rejected").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Project Approvals"
          subtitle="Review and approve student projects"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Total Projects" value={projects.length} change="Submitted projects" />
          <StatCard title="Pending" value={pendingCount} change="Awaiting approval" />
          <StatCard title="Approved" value={approvedCount} change="Accepted projects" />
          <StatCard title="Rejected" value={rejectedCount} change="Needs revision" />
        </div>

        <DataTable
          columns={["Title", "Team", "Status", "Guide", "Actions"]}
          data={tableData}
        />

        {selectedProject && (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-[#111827]">Project Details</h2>
              <p className="text-[#6B7280] mt-1">
                Review submitted project before approval
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#6B7280]">Project Title</p>
                <p className="text-[#111827] font-medium">{selectedProject.title}</p>
              </div>

              <div>
                <p className="text-[#6B7280]">Team</p>
                <p className="text-[#111827] font-medium">{selectedProject.team}</p>
              </div>

              <div>
                <p className="text-[#6B7280]">Guide</p>
                <p className="text-[#111827] font-medium">{selectedProject.guide}</p>
              </div>

              <div>
                <p className="text-[#6B7280]">Status</p>
                <p
                  className={`font-medium ${
                    selectedProject.status === "Approved"
                      ? "text-green-700"
                      : selectedProject.status === "Rejected"
                      ? "text-red-700"
                      : "text-amber-700"
                  }`}
                >
                  {selectedProject.status}
                </p>
              </div>
            </div>

            {selectedProject.status === "Pending" ? (
              <div className="flex gap-3">
                <ActionButton
                  text="Approve"
                  color="green"
                  onClick={() => updateStatus(selectedProject, "Approved")}
                />
                <ActionButton
                  text="Reject"
                  color="red"
                  onClick={() => updateStatus(selectedProject, "Rejected")}
                />
              </div>
            ) : (
              <p
                className={`font-semibold ${
                  selectedProject.status === "Approved"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                Already {selectedProject.status}
              </p>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ProjectApprovals;