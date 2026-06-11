import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";
import StatCard from "../../components/ui/StatCard";

function ProjectApprovals() {
  const [projects, setProjects] = useState([
    {
      title: "Smart Attendance",
      team: "Team Alpha",
      guide: "Dr. Sharma",
      domain: "IoT",
      techStack: "React, Node.js, Arduino",
      abstract: "A smart attendance system using IoT-based device authentication.",
      status: "Pending",
    },
    {
      title: "AI Lab Assistant",
      team: "Team Beta",
      guide: "Dr. Singh",
      domain: "AI / ML",
      techStack: "React, Python, TensorFlow",
      abstract: "An AI assistant to help students with lab instructions and project queries.",
      status: "Pending",
    },
    {
      title: "Inventory Tracker",
      team: "Team Gamma",
      guide: "Dr. Verma",
      domain: "Web Application",
      techStack: "React, Node.js, PostgreSQL",
      abstract: "A system to track lab inventory, issued components and return records.",
      status: "Approved",
    },
  ]);

  const [selectedProject, setSelectedProject] = useState(null);

  const updateStatus = (projectToUpdate, newStatus) => {
    const updatedProjects = projects.map((project) =>
      project.title === projectToUpdate.title && project.team === projectToUpdate.team
        ? { ...project, status: newStatus }
        : project
    );

    setProjects(updatedProjects);
    setSelectedProject({ ...projectToUpdate, status: newStatus });
  };

  const tableData = projects.map((project) => ({
    Title: project.title,
    Team: project.team,
    Status: (
      <span
        className={`font-semibold ${
          project.status === "Approved"
            ? "text-green-400"
            : project.status === "Rejected"
            ? "text-red-400"
            : "text-yellow-400"
        }`}
      >
        {project.status}
      </span>
    ),
    Guide: project.guide,
    Actions: (
      <ActionButton
        text="View"
        onClick={() => setSelectedProject(project)}
      />
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
          <div className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-6 space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Project Details
              </h2>
              <p className="text-slate-400 mt-1">
                Review submitted project before approval
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Project Title</p>
                <p className="text-white font-medium">{selectedProject.title}</p>
              </div>

              <div>
                <p className="text-slate-400">Team</p>
                <p className="text-white font-medium">{selectedProject.team}</p>
              </div>

              <div>
                <p className="text-slate-400">Guide</p>
                <p className="text-white font-medium">{selectedProject.guide}</p>
              </div>

              <div>
                <p className="text-slate-400">Domain</p>
                <p className="text-white font-medium">{selectedProject.domain}</p>
              </div>

              <div>
                <p className="text-slate-400">Tech Stack</p>
                <p className="text-cyan-300 font-medium">{selectedProject.techStack}</p>
              </div>

              <div>
                <p className="text-slate-400">Status</p>
                <p
                  className={`font-medium ${
                    selectedProject.status === "Approved"
                      ? "text-green-400"
                      : selectedProject.status === "Rejected"
                      ? "text-red-400"
                      : "text-yellow-400"
                  }`}
                >
                  {selectedProject.status}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-slate-400">Abstract</p>
                <p className="text-white font-medium">{selectedProject.abstract}</p>
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
                    ? "text-green-400"
                    : "text-red-400"
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