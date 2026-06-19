import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FolderPlus,
  Info,
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

// Sub-component Imports
import { StepIndicator } from "../../components/ui/StepIndicator";
import { ContentCard } from "../../components/ui/ContentCard";
import { Button } from "../../components/ui/Button";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";

export default function RegisterProjectTeam() {
  // Controlled States for only the requested fields
  const [projectName, setProjectName] = useState("");
  const [department, setDepartment] = useState("Mechanical Engineering");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Project Team Data:", {
      projectName,
      department,
      year,
      section,
      description,
    });
  };
  const navigate = useNavigate();

  return (
    <GroupLeaderLayout>
      <div className="w-full min-h-screen bg-[#0b1326] text-[#dae2fd] p-8 overflow-y-auto font-sans selection:bg-[#22d3ee]/30 selection:text-[#22d3ee]">
        {/* BREADCRUMB NAVIGATION */}
        <nav className="text-xs font-mono font-semibold uppercase tracking-wider text-[#859397] mb-2">
          <span className="hover:text-[#dae2fd] cursor-pointer transition-colors">
            Project Management
          </span>
          <span className="mx-2 text-[#3c494c]">&gt;</span>
          <span className="text-[#bbc9cd]">Create Team</span>
        </nav>

        {/* HEADER TITLE SECTION */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5">
            Create Project Team
          </h1>

          <p className="text-sm text-[#bbc9cd] max-w-2xl">
            Register your project team and provide the academic details required
            for faculty review and approval.
          </p>
        </div>

        {/* STEPPERS */}
        <StepIndicator currentStep={1} />

        {/* TWO COLUMN GRID CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-start">
          {/* LEFT COLUMN: FORM DETAILS (Takes up 2/3 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ContentCard>
              {/* Card Header Title */}
              <div className="flex items-center gap-2.5 border-b border-[#222a3d] pb-4 mb-5">
                <FolderPlus size={18} className="text-[#22d3ee]" />
                <h2 className="text-base font-bold tracking-wide text-[#dae2fd]">
                  Project Information
                </h2>
              </div>

              {/* Input Form Fields */}
              <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Row 1: Project Name & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Project Name */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#bbc9cd]">
                      Project Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Smart Helmet for Bikers"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full h-11 bg-[#0b1326] border border-[#222a3d] text-[#dae2fd] placeholder-[#3c494c] text-sm rounded-md px-4 outline-none hover:border-[#3c494c] focus:border-[#22d3ee] transition-all"
                    />
                  </div>

                  {/* Department */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#bbc9cd]">
                      Department
                    </label>
                    <div className="relative w-full">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full h-11 bg-[#0b1326] border border-[#222a3d] text-[#dae2fd] text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-[#3c494c] transition-all"
                      >
                        <option>Computer Science & Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Electrical Engineering</option>
                        <option>Electronics & Communication Engineering</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#859397]">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Year & Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Year */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#bbc9cd]">
                      Year
                    </label>
                    <div className="relative w-full">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-11 bg-[#0b1326] border border-[#222a3d] text-[#dae2fd] text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-[#3c494c] transition-all"
                      >
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#859397]">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  {/* Section */}
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#bbc9cd]">
                      Section
                    </label>
                    <div className="relative w-full">
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full h-11 bg-[#0b1326] border border-[#222a3d] text-[#dae2fd] text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-[#3c494c] transition-all"
                      >
                        <option>CSE I</option>
                        <option>CSE II</option>
                        <option>CSE III</option>
                        <option>CSE IV</option>
                        <option>CSE V</option>
                        <option>CSE VI</option>
                        <option>CSE VII</option>
                        <option>CSE VIII</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#859397]">
                        <ChevronDown size={16} />
                      </div>
                  </div>
                </div>
                </div>

                {/* Row 3: Description */}
                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#bbc9cd]">
                    Project Description
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe the project objective, proposed solution, technologies involved, and expected outcomes."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#0b1326] border border-[#222a3d] text-[#dae2fd] placeholder-[#3c494c] text-sm rounded-md p-4 outline-none resize-none hover:border-[#3c494c] focus:border-[#22d3ee] transition-all"
                  />
                </div>
              </form>
            </ContentCard>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-6 pt-2">
              <button
                type="button"
                className="w-auto px-6 h-10 flex items-center gap-2  bg- bg-red-900 text-[#00363e] rounded-md hover:bg-[#b53333] shadow-lg transition-all  text-sm font-semibold text-[#859397] hover:text-[#dae2fd] transition-colors"
                onClick={() => {
                  setProjectName("");
                  setYear("");
                  setSection("");
                  setDescription("");
                }}
              >
                Discard
              </button>
              <Button
                variant="primary"
                onClick={() =>
                  navigate("/student/team-management/add-members", {
                    state: {
                      projectData: {
                        projectName,
                        department,
                        year,
                        section,
                        description,
                      },
                    },
                  })
                }
                className="w-auto px-6 h-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#22d3ee] text-[#00363e] rounded-md hover:bg-[#8aebff] shadow-lg transition-all"
              >
                Continue to Team Members <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: GUIDELINES & METRICS */}
          <div className="space-y-6">
            {/* Project Guidelines Card */}
            <ContentCard className="relative overflow-hidden">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-bold tracking-wide text-white">
                  Project Guidelines
                </h3>
                <Info size={16} className="text-[#859397] opacity-60" />
              </div>

              <ul className="space-y-3.5 text-[12px] text-[#bbc9cd] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#22d3ee] shrink-0 mt-0.5"
                  />
                  <span>
                    A project team must contain a minimum of two student
                    members.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#22d3ee] shrink-0 mt-0.5"
                  />
                  <span>
                    Project information should match the proposal submitted to
                    the department.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#22d3ee] shrink-0 mt-0.5"
                  />
                  <span>
                    Faculty mentor assignment and team member details will be
                    completed in the next step.
                  </span>
                </li>

                <li className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={14}
                    className="text-[#22d3ee] shrink-0 mt-0.5"
                  />
                  <span>
                    Projects become active only after departmental approval.
                  </span>
                </li>
              </ul>
            </ContentCard>

            {/* Setup Progress Card */}
            <ContentCard>
              <div className="mb-4">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#859397]">
                  Registration Progress
                </h4>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#bbc9cd] font-medium">
                  Team Registration
                </span>
                <span className="text-xs font-mono font-bold text-[#22d3ee]">
                  45%
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#0b1326] rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-[#22d3ee] rounded-full"
                  style={{ width: "45%" }}
                />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#22d3ee]">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span className="font-medium">
                    Project information completed
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-[#859397]">
                  <Circle size={14} className="shrink-0" />
                  <span>Team member details pending</span>
                </div>
              </div>
            </ContentCard>
          </div>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}
