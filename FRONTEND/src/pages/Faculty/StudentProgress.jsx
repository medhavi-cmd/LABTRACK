import { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import SectionHeader from "../../components/ui/SectionHeader";
import StatCard from "../../components/ui/StatCard";
import DataTable from "../../components/ui/DataTable";
import ActionButton from "../../components/ui/ActionButton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function StudentProgress() {
  const teams = [
    {
      Team: "Team Alpha",
      Project: "Smart Attendance",
      Progress: "75%",
      CurrentStage: "Evaluation 3",
      Guide: "Dr. Sharma",
      Status: "On Track",
      evaluations: [
        { name: "Proposal", date: "05-06-2026", completed: true },
        { name: "Evaluation 1", date: "10-06-2026", completed: true },
        { name: "Evaluation 2", date: "18-06-2026", completed: true },
        { name: "Evaluation 3", date: "25-06-2026", completed: true },
        { name: "Final Evaluation", date: "Pending", completed: false },
      ],
      graphData: [
        { stage: "Proposal", progress: 15 },
        { stage: "Eval 1", progress: 35 },
        { stage: "Eval 2", progress: 55 },
        { stage: "Eval 3", progress: 75 },
        { stage: "Final", progress: 75 },
      ],
      scores: [
        { evaluation: "Proposal", marks: "8/10" },
        { evaluation: "Evaluation 1", marks: "16/20" },
        { evaluation: "Evaluation 2", marks: "18/20" },
        { evaluation: "Evaluation 3", marks: "19/20" },
        { evaluation: "Final Evaluation", marks: "Pending" },
      ],
      members: [
        { name: "Rahul Kumar", role: "Team Leader" },
        { name: "Priya Sharma", role: "Backend Developer" },
        { name: "Aman Gupta", role: "Frontend Developer" },
        { name: "Neha Singh", role: "Documentation" },
      ],
      remarks: [
        "Prototype flow is clear and implementation is on track.",
        "Final evaluation preparation is pending.",
],
projectDetails: {
  domain: "IoT",
  techStack: "React, Node.js, Arduino",
  repository: "https://github.com/teamalpha/smart-attendance",
  startDate: "01-06-2026",
  endDate: "30-06-2026",
},
    },
    {
      Team: "Team Beta",
      Project: "AI Lab Assistant",
      Progress: "60%",
      CurrentStage: "Evaluation 2",
      Guide: "Dr. Singh",
      Status: "Review Required",
      evaluations: [
        { name: "Proposal", date: "06-06-2026", completed: true },
        { name: "Evaluation 1", date: "12-06-2026", completed: true },
        { name: "Evaluation 2", date: "20-06-2026", completed: true },
        { name: "Evaluation 3", date: "Pending", completed: false },
        { name: "Final Evaluation", date: "Pending", completed: false },
      ],
      graphData: [
        { stage: "Proposal", progress: 15 },
        { stage: "Eval 1", progress: 35 },
        { stage: "Eval 2", progress: 60 },
        { stage: "Eval 3", progress: 60 },
        { stage: "Final", progress: 60 },
      ],
      scores: [
        { evaluation: "Proposal", marks: "7/10" },
        { evaluation: "Evaluation 1", marks: "15/20" },
        { evaluation: "Evaluation 2", marks: "14/20" },
        { evaluation: "Evaluation 3", marks: "Pending" },
        { evaluation: "Final Evaluation", marks: "Pending" },
      ],
      members: [
        { name: "Aryan Mehta", role: "Team Leader" },
        { name: "Kavya Rao", role: "AI/ML Developer" },
        { name: "Rohan Sinha", role: "Backend Developer" },
        { name: "Simran Kaur", role: "Research & Documentation" },
      ],
      remarks: [
        "AI model explanation needs improvement.",
        "Documentation should be updated before Evaluation 3.",
],
projectDetails: {
  domain: "AI / ML",
  techStack: "React, Python, TensorFlow",
  repository: "https://github.com/teambeta/ai-lab-assistant",
  startDate: "01-06-2026",
  endDate: "30-06-2026",
},
    },
    {
      Team: "Team Gamma",
      Project: "Inventory Tracker",
      Progress: "90%",
      CurrentStage: "Final Evaluation",
      Guide: "Dr. Verma",
      Status: "Excellent",
      evaluations: [
        { name: "Proposal", date: "03-06-2026", completed: true },
        { name: "Evaluation 1", date: "09-06-2026", completed: true },
        { name: "Evaluation 2", date: "16-06-2026", completed: true },
        { name: "Evaluation 3", date: "23-06-2026", completed: true },
        { name: "Final Evaluation", date: "30-06-2026", completed: true },
      ],
      graphData: [
        { stage: "Proposal", progress: 20 },
        { stage: "Eval 1", progress: 40 },
        { stage: "Eval 2", progress: 60 },
        { stage: "Eval 3", progress: 80 },
        { stage: "Final", progress: 90 },
      ],
      scores: [
        { evaluation: "Proposal", marks: "9/10" },
        { evaluation: "Evaluation 1", marks: "18/20" },
        { evaluation: "Evaluation 2", marks: "19/20" },
        { evaluation: "Evaluation 3", marks: "19/20" },
        { evaluation: "Final Evaluation", marks: "45/50" },
      ],
      members: [
        { name: "Aman Gupta", role: "Team Leader" },
        { name: "Sneha Yadav", role: "Frontend Developer" },
        { name: "Harsh Jain", role: "Backend Developer" },
        { name: "Megha Sharma", role: "Testing & Documentation" },
      ],
      remarks: [
        "Inventory workflow is complete.",
        "Final report and demo are ready for evaluation.",
        ],
        projectDetails: {
  domain: "Web Application",
  techStack: "React, Node.js, PostgreSQL",
  repository: "https://github.com/teamgamma/inventory-tracker",
  startDate: "01-06-2026",
  endDate: "30-06-2026",
},
    },
  ];

  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  const tableData = teams.map((team) => ({
    Team: (
      <button
        onClick={() => setSelectedTeam(team)}
        className="text-cyan-300 font-semibold hover:underline"
      >
        {team.Team}
      </button>
    ),
    Project: team.Project,
    Progress: team.Progress,
    CurrentStage: team.CurrentStage,
    Status: (
  <span
    className={`font-semibold ${
      team.Status === "On Track"
        ? "text-green-400"
        : team.Status === "Review Required"
        ? "text-yellow-400"
        : team.Status === "Excellent"
        ? "text-cyan-400"
        : "text-white"
    }`}
  >
    {team.Status}
  </span>
),
    Actions: (
      <ActionButton
        text="View Progress"
        onClick={() => setSelectedTeam(team)}
      />
    ),
  }));

  const completedCount = selectedTeam.evaluations.filter(
    (item) => item.completed
  ).length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SectionHeader
          title="Student Progress"
          subtitle="Track project progress, evaluations and completion timeline"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Active Teams" value="12" change="Ongoing projects" />
          <StatCard title="On Track" value="8" change="Meeting milestones" />
          <StatCard title="Needs Review" value="3" change="Faculty attention required" />
          <StatCard title="Completed" value="1" change="Ready for evaluation" />
        </div>

        <DataTable
          columns={[
            "Team",
            "Project",
            "Progress",
            "CurrentStage",
            "Status",
            "Actions",
          ]}
          data={tableData}
        />

        <div className="rounded-2xl border border-cyan-500/20 bg-[#081122] p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {selectedTeam.Team} Progress Dashboard
              </h2>
              <p className="text-slate-400 mt-1">
                {selectedTeam.Project} • Guided by {selectedTeam.Guide}
              </p>
            </div>

            <div className="text-right">
              <p className="text-4xl font-bold text-cyan-300">
                {selectedTeam.Progress}
              </p>
              <p className="text-slate-400 text-sm">Overall Progress</p>
            </div>
          </div>

          <div className="w-full bg-[#050816] rounded-full h-4 border border-cyan-500/20">
            <div
              className="bg-cyan-400 h-full rounded-full"
              style={{ width: selectedTeam.Progress }}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-[#050816] p-5">
              <h3 className="text-white font-semibold mb-5">Progress Graph</h3>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={selectedTeam.graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis dataKey="stage" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#081122",
                        border: "1px solid rgba(34,211,238,0.2)",
                        borderRadius: "10px",
                        color: "#fff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="progress"
                      stroke="#22d3ee"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-[#050816] p-5">
              <h3 className="text-white font-semibold mb-5">
                Completion Timeline
              </h3>

              <div className="space-y-4">
                {selectedTeam.evaluations.map((item) => (
                  <div key={item.name} className="flex gap-4">
                    <div
                      className={`w-5 h-5 rounded-full mt-1 ${
                        item.completed ? "bg-cyan-400" : "bg-slate-600"
                      }`}
                    />

                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-slate-400 text-sm">
                        {item.completed
                          ? `Completed on ${item.date}`
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050816] p-5">
            <h3 className="text-white font-semibold mb-5">Evaluation Scores</h3>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-300 text-sm">
                  <tr>
                    <th className="px-5 py-3 font-medium">Evaluation</th>
                    <th className="px-5 py-3 font-medium">Marks</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {selectedTeam.scores.map((score) => (
                    <tr key={score.evaluation} className="text-sm text-slate-300">
                      <td className="px-5 py-3">{score.evaluation}</td>
                      <td className="px-5 py-3 text-cyan-300 font-semibold">
                        {score.marks}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050816] p-5">
            <h3 className="text-white font-semibold mb-5">Team Members</h3>

            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left">
                <thead className="bg-white/5 text-slate-300 text-sm">
                  <tr>
                    <th className="px-5 py-3 font-medium">Member Name</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {selectedTeam.members.map((member) => (
                    <tr key={member.name} className="text-sm text-slate-300">
                      <td className="px-5 py-3 text-white">{member.name}</td>
                      <td className="px-5 py-3 text-cyan-300">
                        {member.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

                      <div className="rounded-xl border border-white/10 bg-[#050816] p-5">
  <h3 className="text-white font-semibold mb-5">
    Faculty Remarks
    <div className="rounded-xl border border-white/10 bg-[#050816] p-5">
  <h3 className="text-white font-semibold mb-5">
    Project Details
  </h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
    
    <div>
      <p className="text-slate-400">Domain</p>
      <p className="text-white font-medium">
        {selectedTeam.projectDetails.domain}
      </p>
    </div>

    <div>
      <p className="text-slate-400">Tech Stack</p>
      <p className="text-cyan-300 font-medium">
        {selectedTeam.projectDetails.techStack}
      </p>
    </div>

    <div>
      <p className="text-slate-400">Start Date</p>
      <p className="text-white">
        {selectedTeam.projectDetails.startDate}
      </p>
    </div>

    <div>
<p className="text-slate-400">Completion Date</p>
<p className="text-white">
  {selectedTeam.projectDetails.endDate}
</p>
    </div>

    <div className="md:col-span-2">
      <p className="text-slate-400">Repository</p>

      <a
        href={selectedTeam.projectDetails.repository}
        target="_blank"
        rel="noreferrer"
        className="text-cyan-300 hover:underline"
      >
        View Repository
      </a>
    </div>

  </div>
</div>
  </h3>

  <div className="space-y-3">
    {selectedTeam.remarks.map((remark, index) => (
      <div
        key={index}
        className="rounded-lg border border-white/10 bg-[#081122] p-4"
      >
        <p className="text-slate-300 text-sm">
          {remark}
        </p>
      </div>
    ))}
  </div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-[#050816] border border-white/10 p-4">
              <p className="text-slate-400 text-sm">Completed Milestones</p>
              <p className="text-2xl font-bold text-white">
                {completedCount}/{selectedTeam.evaluations.length}
              </p>
            </div>

            <div className="rounded-xl bg-[#050816] border border-white/10 p-4">
              <p className="text-slate-400 text-sm">Current Stage</p>
              <p className="text-2xl font-bold text-white">
                {selectedTeam.CurrentStage}
              </p>
            </div>

            <div className="rounded-xl bg-[#050816] border border-white/10 p-4">
              <p className="text-slate-400 text-sm">Status</p>
                <p
                className={`text-2xl font-bold ${
                    selectedTeam.Status === "On Track"
                    ? "text-green-400"
                    : selectedTeam.Status === "Review Required"
                    ? "text-yellow-400"
                    : selectedTeam.Status === "Excellent"
                    ? "text-cyan-400"
                    : "text-white"
                }`}
                >
                {selectedTeam.Status}
                </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default StudentProgress;