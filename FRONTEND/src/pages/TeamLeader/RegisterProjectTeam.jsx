import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, Info, CheckCircle2, Circle, ArrowRight, ChevronDown, Search } from "lucide-react";
import {toast} from "sonner";
import { StepIndicator } from "../../components/ui/StepIndicator";
import { ContentCard } from "../../components/ui/ContentCard";
import { Button } from "../../components/ui/Button";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getFacultyList } from "../../services/teamApi";

export default function RegisterProjectTeam() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [projectName, setProjectName] = useState("");
  const [department, setDepartment] = useState("Mechanical Engineering");
  const [year, setYear] = useState("");
  const [section, setSection] = useState("CSE I");
  const [description, setDescription] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [facultyDropdown, setFacultyDropdown] = useState(false);
  const [facultySearch, setFacultySearch] = useState("");

  const projectData = {
    projectName,
    department,
    year,
    section,
    description,
    selectedFaculty,
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setFacultyDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadFaculty = async () => {
    try {
      const data = await getFacultyList();
      setFacultyList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleFaculty = (faculty) => {
    setSelectedFaculty((prev) => {
      const exists = prev.some((f) => f.faculty_id === faculty.faculty_id);
      if (exists) {
        return prev.filter((f) => f.faculty_id !== faculty.faculty_id);
      }
      return [...prev, faculty];
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (selectedFaculty.length === 0) {
      toast.error("Please select at least one faculty mentor.");
      return;
    }

    navigate("/student/team-management/add-members", {
      state: {
        projectData,
      },
    });
  };

  const handleDiscard = () => {
    setProjectName("");
    setDepartment("Mechanical Engineering");
    setYear("");
    setSection("CSE I");
    setDescription("");
    setSelectedFaculty([]);
    setFacultySearch("");
  };

  return (
    <GroupLeaderLayout>
      <div className="w-full min-h-screen bg-slate-50 text-slate-600 p-8 overflow-y-auto font-sans selection:bg-cyan-200 selection:text-cyan-900">
        <nav className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 mb-2">
          <span className="hover:text-slate-700 cursor-pointer transition-colors">
            Project Management
          </span>
          <span className="mx-2 text-slate-300">&gt;</span>
          <span className="text-slate-600">Create Team</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1.5">
            Create Project Team
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl">
            Register your project team and provide the academic details required
            for faculty review and approval.
          </p>
        </div>

        <StepIndicator currentStep={1} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8 items-start">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ContentCard className="bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4 mb-5">
                <FolderPlus size={18} className="text-cyan-600" />
                <h2 className="text-base font-bold tracking-wide text-slate-800">
                  Project Information
                </h2>
              </div>

              <form id="project-form" onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Project Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Smart Helmet for Bikers"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm rounded-md px-4 outline-none hover:border-slate-400 focus:border-cyan-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Department
                    </label>
                    <div className="relative w-full">
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-slate-400 focus:border-cyan-500 transition-all"
                      >
                        <option>Computer Science & Engineering</option>
                        <option>Mechanical Engineering</option>
                        <option>Electrical Engineering</option>
                        <option>Electronics & Communication Engineering</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Year
                    </label>
                    <div className="relative w-full">
                      <select
                        required
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-slate-400 focus:border-cyan-500 transition-all"
                      >
                        <option value="">Select Year</option>
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Section
                    </label>
                    <div className="relative w-full">
                      <select
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-slate-400 focus:border-cyan-500 transition-all"
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
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <ChevronDown size={16} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Faculty Mentor(s)
                  </label>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setFacultyDropdown(!facultyDropdown)}
                      className="w-full h-11 rounded-md border border-slate-200 bg-white px-4 text-left text-sm text-slate-900 hover:border-slate-400 flex items-center justify-between focus:border-cyan-500 outline-none shadow-sm"
                    >
                      <span>
                        {selectedFaculty.length === 0
                          ? "Select Faculty"
                          : `${selectedFaculty.length} Faculty Selected`}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform text-slate-400 ${facultyDropdown ? "rotate-180" : ""}`}
                      />
                    </button>

                    {facultyDropdown && (
                      <div className="absolute z-50 mt-2 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                        <div className="border-b border-slate-100 p-3">
                          <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search Faculty..."
                              value={facultySearch}
                              onChange={(e) => setFacultySearch(e.target.value)}
                              className="w-full rounded-md bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none border border-slate-200 focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                          {facultyList
                            .filter((faculty) =>
                              faculty.name.toLowerCase().includes(facultySearch.toLowerCase())
                            )
                            .map((faculty) => (
                              <label
                                key={faculty.faculty_id}
                                className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedFaculty.some((f) => f.faculty_id === faculty.faculty_id)}
                                  onChange={() => toggleFaculty(faculty)}
                                  className="accent-cyan-600"
                                />
                                <div>
                                  <p className="text-sm font-medium text-slate-900">{faculty.name}</p>
                                  <p className="text-xs text-slate-500">{faculty.department}</p>
                                </div>
                              </label>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Select all faculty members supervising this project.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Project Description
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe the project objective, proposed solution, technologies involved, and expected outcomes."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-sm rounded-md p-4 outline-none resize-none hover:border-slate-400 focus:border-cyan-500 transition-all"
                  />
                </div>
                <div className="flex items-center justify-end gap-6 pt-2">
              <button
                type="button"
                className="w-auto px-6 h-10 flex items-center gap-2  bg- bg-red-600 text-[#00363e] rounded-md hover:bg-[#b53333] shadow-lg transition-all  text-sm font-semibold text-white hover:text-[#dae2fd] transition-colors"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <Button
                variant="primary"
                type="submit"
                className="w-auto px-6 h-10 flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#2563EB] text-white rounded-md hover:bg-[#10359c] shadow-lg transition-all"
              >
                Continue to Team Members <ArrowRight size={14} />
              </Button>
            </div>
              </form>
            </ContentCard>

            
          </div>

          <div className="space-y-6">
            <ContentCard className="relative overflow-hidden bg-white border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-bold tracking-wide text-slate-900">
                  Project Guidelines
                </h3>
                <Info size={16} className="text-slate-400 opacity-60" />
              </div>

              <ul className="space-y-3.5 text-[12px] text-slate-600 leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>A project team must contain a minimum of two student members.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Project information should match the proposal submitted to the department.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Faculty mentor assignment and team member details will be completed in the next step.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <span>Projects become active only after departmental approval.</span>
                </li>
              </ul>
            </ContentCard>

            <ContentCard className="bg-white border border-slate-200 shadow-sm">
              <div className="mb-4">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Registration Progress
                </h4>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-600 font-medium">Team Registration</span>
                <span className="text-xs font-mono font-bold text-[#2563EB]">45%</span>
              </div>

              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-5 border border-slate-200">
                <div className="h-full bg-[#2563EB] rounded-full" style={{ width: "45%" }} />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-[#2563EB]">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span className="font-medium">Project information completed</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-400">
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