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
    Status: team.Status,
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
              <h3 className="text-white font-semibold mb-5">
                Progress Graph
              </h3>

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
              <p className="text-2xl font-bold text-white">
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