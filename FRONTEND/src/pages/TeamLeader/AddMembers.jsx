import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  Plus,
  Trash2,
  User,
  Users,
  Grab,
} from "lucide-react";


import { StepIndicator } from "../../components/ui/StepIndicator";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import {
  getMyProfile,
  getStudentByEnrollment,
} from "../../services/teamApi";

const createEmptyMember = () => ({
  id: crypto.randomUUID(),
  enrollmentNo: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  loading: false,
  error: "",
});

export default function AddMembers() {
  const navigate = useNavigate();
  const location = useLocation();

  const projectData = location.state?.projectData;
  const previousTeamData = location.state?.teamData;

  const [leader, setLeader] = useState(null);
  const [loadingLeader, setLoadingLeader] = useState(true);
  const [members, setMembers] = useState(
    previousTeamData?.members || [createEmptyMember()]
  );
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!projectData) {
      navigate("/student/team-management");
      return;
    }

    const loadLeader = async () => {
      try {
        const profile = await getMyProfile();
        setLeader(profile);
      } catch (error) {
        setFormError(error.message);
      } finally {
        setLoadingLeader(false);
      }
    };

    loadLeader();
  }, [projectData, navigate]);

  const updateMember = (id, field, value) => {
    setMembers((current) =>
      current.map((member) =>
        member.id === id
          ? {
              ...member,
              [field]: value,
              ...(field === "enrollmentNo"
                ? { name: "", email: "", phone: "", error: "" }
                : {}),
            }
          : member
      )
    );
  };

  const fetchMemberDetails = async (member) => {
    const enrollmentNo = member.enrollmentNo.trim();

    if (!enrollmentNo) return;

    if (
      leader?.enrollment_no?.toLowerCase() === enrollmentNo.toLowerCase()
    ) {
      updateMember(member.id, "enrollmentNo", enrollmentNo);
      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? { ...item, error: "You cannot add yourself as a member." }
            : item
        )
      );
      return;
    }

    const duplicate = members.some(
      (item) =>
        item.id !== member.id &&
        item.enrollmentNo.trim().toLowerCase() === enrollmentNo.toLowerCase()
    );

    if (duplicate) {
      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? { ...item, error: "This enrollment number is already added." }
            : item
        )
      );
      return;
    }

    setMembers((current) =>
      current.map((item) =>
        item.id === member.id
          ? { ...item, loading: true, error: "" }
          : item
      )
    );

    try {
      const student = await getStudentByEnrollment(enrollmentNo);

      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? {
                ...item,
                name: student.name,
                email: student.email || "",
                phone: student.phone_no || "",
                enrollmentNo: student.enrollment_no,
                loading: false,
                error: "",
              }
            : item
        )
      );
    } catch (error) {
      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? {
                ...item,
                name: "",
                email: "",
                phone: "",
                loading: false,
                error: error.message,
              }
            : item
        )
      );
    }
  };

  const addMember = () => {
    if (members.length >= 5) return;
    setMembers((current) => [...current, createEmptyMember()]);
  };

  const removeMember = (id) => {
    setMembers((current) => current.filter((member) => member.id !== id));
  };

  const handleReview = (event) => {
    event.preventDefault();
    setFormError("");

    if (!leader) {
      setFormError("Leader profile is still loading.");
      return;
    }

    if (members.length < 1) {
      setFormError("Add at least one team member.");
      return;
    }

    const invalidMember = members.some(
      (member) =>
        !member.enrollmentNo ||
        !member.name ||
        !member.email ||
        !member.role ||
        member.loading ||
        member.error
    );

    if (invalidMember) {
      setFormError(
        "Please enter valid enrollment numbers and complete every member role."
      );
      return;
    }

    navigate("/student/team-management/review-team-details", {
      state: {
        projectData,
        teamData: {
          leader,
          members,
        },
      },
    });
  };

  if (!projectData) return null;

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-slate-50 p-4 sm:p-8 text-slate-600 font-sans selection:bg-[#2563EB] selection:text-white">
        <div className="mb-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add Team Members</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Project: <span className="text-[#2563EB] font-bold">{projectData.projectName}</span>
          </p>
        </div>

        <StepIndicator currentStep={2} />

        <form
          onSubmit={handleReview}
          className="mx-auto mt-8 max-w-5xl rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          {formError && (
            <div className="mb-6 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 font-medium shadow-sm">
              <AlertCircle size={18} className="text-red-600 shrink-0" />
              {formError}
            </div>
          )}

          <section>
            <div className="mb-6 flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <User size={18} className="text-[#2563EB]" />
              <h2 className="text-base font-bold tracking-wide text-slate-800">Team Leader Details</h2>
            </div>

            {loadingLeader ? (
              <p className="text-xs sm:text-sm font-medium text-slate-400">Loading your profile...</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {[
                  ["Full Name", leader?.name],
                  ["Enrollment Number", leader?.enrollment_no],
                  ["Institutional Email", leader?.email],
                  ["Phone Number", leader?.phone_no],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1.5">
                    <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {label}
                    </label>
                    <input
                      value={value || "Not available"}
                      readOnly
                      className="h-11 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Users size={18} className="text-[#2563EB]" />
                <h2 className="text-base font-bold tracking-wide text-slate-800">Team Members</h2>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400">{members.length}/5 members</span>
            </div>

            <div className="space-y-6">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="relative rounded-xl border border-slate-200 bg-slate-50/50 p-5 shadow-sm group hover:shadow-md transition-shadow duration-200"
                >
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <p className="mb-4 text-sm font-bold text-slate-900">
                    Member {index + 1}
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Enrollment Number *
                      </label>
                      <input
                        value={member.enrollmentNo}
                        onChange={(e) =>
                          updateMember(member.id, "enrollmentNo", e.target.value)
                        }
                        onBlur={() => fetchMemberDetails(member)}
                        placeholder="Enter enrollment number"
                        className="h-11 w-full rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-[#2563EB] transition-all shadow-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Full Name
                      </label>
                      <input
                        value={member.loading ? "Fetching..." : member.name}
                        readOnly
                        className="h-11 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Institutional Email
                      </label>
                      <input
                        value={member.email}
                        readOnly
                        className="h-11 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Phone Number
                      </label>
                      <input
                        value={member.phone}
                        readOnly
                        className="h-11 w-full cursor-not-allowed rounded-md border border-slate-200 bg-slate-50 px-4 text-sm text-slate-400 outline-none"
                      />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-1.5">
                      <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        Role in Project *
                      </label>
                      <div className="relative w-full">
                        <select
                          value={member.role}
                          onChange={(e) =>
                            updateMember(member.id, "role", e.target.value)
                          }
                          className="w-full h-11 bg-white border border-slate-200 text-slate-900 text-sm rounded-md px-4 pr-10 outline-none appearance-none cursor-pointer hover:border-slate-400 focus:border-[#2563EB] transition-all shadow-sm"
                        >
                          <option value="">Select role</option>
                          <option value="Hardware Engineer">Hardware Engineer</option>
                          <option value="Frontend Developer">Frontend Developer</option>
                          <option value="Backend Developer">Backend Developer</option>
                          <option value="Data Analyst">Data Analyst</option>
                          <option value="Research Lead">Research Lead</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {member.error && (
                    <p className="mt-3 text-xs font-semibold text-red-500 flex items-center gap-1.5">
                      <AlertCircle size={12} /> {member.error}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMember}
              disabled={members.length >= 5}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#2563EB]/60 bg-white text-sm font-bold text-[#2563EB] hover:bg-[#2563EB]/10 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99]"
            >
              <Plus size={16} /> Add Another Member
            </button>
          </section>

          <div className="mt-8 flex justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() =>
                navigate("/student/team-management/register", {
                  state: { projectData },
                })
              }
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium active:scale-95"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              type="submit"
              className="rounded-md bg-[#2563EB] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1a4ca0] transition-all shadow-sm active:scale-95"
            >
              Review Registration
            </button>
          </div>
        </form>
      </div>
    </GroupLeaderLayout>
  );
}
