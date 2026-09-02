import { useCallback, useEffect, useState } from "react";
import { useListQuery } from "../../hooks/useListQuery";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CommentsSection from "../../components/ui/CommentsSection";
import { fetchAllTeamProgress, fetchTeamDetail } from "../../services/studentProgressService";
import {
  FiSearch, FiX, FiUsers, FiChevronUp, FiChevronDown,
  FiFilter, FiEye, FiAlertCircle, FiCheckCircle, FiBook, FiLoader,
} from "react-icons/fi";

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

const getStatusConfig = (status) => {
  if (status === "Excellent") return { style: "bg-green-50 border-green-200 text-green-700", icon: <FiCheckCircle className="w-3.5 h-3.5" /> };
  if (status === "Review Required") return { style: "bg-red-50 border-red-200 text-red-700", icon: <FiAlertCircle className="w-3.5 h-3.5" /> };
  return { style: "bg-amber-50 border-amber-200 text-amber-700", icon: <FiBook className="w-3.5 h-3.5" /> };
};

// ─── Team Detail Dialog ───────────────────────────────────────────────
const TeamDetailDialog = ({ teamId, onClose }) => {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!teamId) return;
    (async () => {
      try {
        setLoading(true); setError("");
        const data = await fetchTeamDetail(teamId);
        setDetail(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    })();
  }, [teamId]);

  const approvalConfig = detail ? getStatusConfig(
    detail.status === "Approved" ? "Excellent" : detail.status === "Rejected" ? "Review Required" : "On Track"
  ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#E5E7EB]">
          <h2 className="text-xl font-bold text-[#111827]">
            {loading ? "Loading..." : detail ? `${detail.team_name}` : "Team Details"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F8FAFC] transition-colors">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-[#6B7280]">
            <FiLoader className="w-5 h-5 animate-spin text-[#2563EB]" />Loading team details...
          </div>
        )}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-center text-red-600">
            <FiAlertCircle className="w-8 h-8" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && detail && (
          <>
            {/* Project Info */}
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              {[
                { label: "Project Title", value: detail.project_title },
                { label: "Guide", value: detail.guide_name },
                { label: "Members", value: detail.member_count },
                { label: "Project Status", value: detail.status },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[#6B7280] text-xs mb-1">{label}</p>
                  <p className={`font-semibold ${label === "Project Status" ? (detail.status === "Approved" ? "text-green-700" : detail.status === "Rejected" ? "text-red-700" : "text-amber-700") : "text-[#111827]"}`}>
                    {value ?? "—"}
                  </p>
                </div>
              ))}
              {detail.description && (
                <div className="col-span-2">
                  <p className="text-[#6B7280] text-xs mb-1">Description</p>
                  <p className="text-[#4B5563] text-sm leading-relaxed">{detail.description}</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-[#111827]">Evaluation Progress</span>
                <span className="font-bold text-[#2563EB]">{detail.progress_percent ?? 0}%</span>
              </div>
              <div className="w-full bg-[#F0F4FF] rounded-full h-2.5">
                <div
                  className="bg-[#2563EB] h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${detail.progress_percent ?? 0}%` }}
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-1">Current stage: {detail.current_stage}</p>
            </div>

            {/* Members */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#111827] mb-3 flex items-center gap-2">
                <FiUsers className="w-4 h-4 text-[#2563EB]" />Team Members
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(detail.members || []).map((m) => (
                  <div key={m.student_id} className="flex items-center justify-between bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm">
                    <span className="font-medium text-[#111827]">{m.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${m.role === "leader" ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                      {m.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluations */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#111827] mb-3">Evaluations</h4>
              {(detail.evaluations || []).length === 0 ? (
                <p className="text-[#6B7280] text-sm italic">No evaluations recorded yet.</p>
              ) : (
                <div className="space-y-2">
                  {detail.evaluations.map((ev) => (
                    <div key={ev.eval_id} className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm ${ev.completed ? "bg-green-50 border-green-200" : "bg-[#F8FAFC] border-[#E5E7EB]"}`}>
                      <div>
                        <span className={`font-medium ${ev.completed ? "text-green-700" : "text-[#111827]"}`}>{ev.eval_name}</span>
                        {ev.eval_date && <span className="ml-2 text-xs text-[#6B7280]">{ev.eval_date}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        {ev.completed && (
                          <span className="text-sm font-semibold text-green-700">
                            {ev.marks_obtained ?? 0} / {ev.max_marks ?? 0}
                          </span>
                        )}
                        <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold ${ev.completed ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"}`}>
                          {ev.completed ? "✓" : ev.eval_order}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Faculty Remarks */}
            {(detail.remarks || []).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-[#111827] mb-3">Faculty Remarks</h4>
                <div className="space-y-2">
                  {detail.remarks.map((r) => (
                    <div key={r.remark_id} className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-[#111827]">{r.faculty_name}</span>
                        <span className="text-xs text-[#6B7280]">{new Date(r.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#4B5563] leading-relaxed">{r.remark_text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <CommentsSection entityType="team" entityId={detail.team_id} />
          </>
        )}

        <button onClick={onClose} className="mt-4 w-full px-4 py-2 rounded-lg border border-[#E5E7EB] text-sm text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────
// Search, filter and sort are resolved by the API (studentProgressService.js).
const fetchProgressPage = async (params, signal) => {
  const data = await fetchAllTeamProgress(params, signal);
  return { data: data.teams ?? [], stats: data.stats ?? null };
};

function StudentProgress() {
  const {
    data: filtered,
    extra,
    loading,
    error,
    search: searchTerm,
    setSearch: setSearchTerm,
    filters,
    setFilter,
    sortField,
    sortDir,
    handleSort,
  } = useListQuery(fetchProgressPage, {
    initialFilters: { progressStatus: "all" },
    initialSortField: "team_name",
    initialSortDir: "asc",
  });

  const [activeTeamId, setActiveTeamId] = useState(null);

  const stats = extra?.stats ?? null;
  const filterStatus = filters.progressStatus;
  const setFilterStatus = useCallback((value) => setFilter("progressStatus", value), [setFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Student Progress</h1>
          <p className="text-[#6B7280] mt-1">Track project progress and evaluation status of all teams</p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-red-700 text-sm">
            <FiAlertCircle className="w-5 h-5 shrink-0" />{error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Active Teams",   value: stats?.active_teams ?? 0,  cls: "" },
            { label: "On Track",       value: stats?.on_track ?? 0,      cls: "text-amber-600" },
            { label: "Needs Review",   value: stats?.needs_review ?? 0,  cls: "text-red-600" },
            { label: "Completed",      value: stats?.completed ?? 0,     cls: "text-green-600" },
          ].map(({ label, value, cls }) => (
            <div key={label} className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-5">
              <p className="text-[#6B7280] text-sm">{label}</p>
              <h2 className={`text-3xl font-bold mt-2 ${cls}`}>{loading ? "—" : value}</h2>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-3.5 text-[#6B7280]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by team, project, or guide..."
              className="w-full border border-[#E5E7EB] rounded-lg pl-12 pr-4 py-3 text-sm outline-none focus:border-[#2563EB] bg-white"
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
            <FiFilter className="text-[#6B7280] shrink-0" />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="outline-none text-sm text-[#4B5563] bg-transparent cursor-pointer">
              <option value="all">All Status</option>
              <option value="On Track">On Track</option>
              <option value="Excellent">Excellent</option>
              <option value="Review Required">Review Required</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#111827]">Team Progress</h2>
            {!loading && <span className="text-sm text-[#6B7280]">{filtered.length} team{filtered.length !== 1 ? "s" : ""}</span>}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-16 gap-3 text-[#6B7280]">
              <FiLoader className="w-5 h-5 animate-spin text-[#2563EB]" />Loading team progress...
            </div>
          )}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center text-[#6B7280]">
              <FiUsers className="w-10 h-10 text-slate-300" />
              <p>{(stats?.active_teams ?? 0) === 0 ? "No teams found in the database." : "No teams match your filter."}</p>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F8FAFC] text-[#4B5563] text-sm">
                  <tr>
                    <SortTh label="Team" field="team_name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Project" field="project_title" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Guide" field="guide_name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Members" field="member_count" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Progress" field="progress_percent" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Stage" field="current_stage" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <SortTh label="Status" field="progress_status" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
                    <th className="px-5 py-4 font-medium text-left text-sm text-[#4B5563] bg-[#F8FAFC]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {filtered.map((team, i) => {
                    const statusCfg = getStatusConfig(team.progress_status);
                    return (
                      <tr key={team.team_id ?? i} className="text-sm text-[#4B5563] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-5 py-4 font-semibold text-[#111827]">{team.team_name}</td>
                        <td className="px-5 py-4 max-w-[180px] truncate" title={team.project_title}>{team.project_title ?? "—"}</td>
                        <td className="px-5 py-4">{team.guide_name}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5"><FiUsers className="w-4 h-4 text-[#6B7280]" />{team.member_count}</div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 min-w-[100px]">
                            <div className="flex-1 bg-[#F0F4FF] rounded-full h-2">
                              <div className="bg-[#2563EB] h-2 rounded-full" style={{ width: `${team.progress_percent ?? 0}%` }} />
                            </div>
                            <span className="text-xs font-medium text-[#2563EB] min-w-[30px]">{team.progress_percent ?? 0}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs">{team.current_stage}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusCfg.style}`}>
                            {statusCfg.icon}{team.progress_status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setActiveTeamId(team.team_id)}
                            className="flex items-center gap-1.5 bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                          >
                            <FiEye className="w-3.5 h-3.5" />View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {activeTeamId && (
        <TeamDetailDialog teamId={activeTeamId} onClose={() => setActiveTeamId(null)} />
      )}
    </DashboardLayout>
  );
}

export default StudentProgress;