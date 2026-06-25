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
      <div className="min-h-screen bg-[#0b1326] p-8 text-[#dae2fd]">
        <h1 className="text-3xl font-bold text-white">Add Team Members</h1>
        <p className="mt-2 text-sm text-[#bbc9cd]">
          Project: <span className="text-[#22d3ee]">{projectData.projectName}</span>
        </p>

        <StepIndicator currentStep={2} />

        <form
          onSubmit={handleReview}
          className="mx-auto mt-8 max-w-5xl rounded-xl border border-[#222a3d] bg-[#131b2e] p-8"
        >
          {formError && (
            <div className="mb-6 flex gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle size={18} />
              {formError}
            </div>
          )}

          <section>
            <div className="mb-6 flex items-center gap-2 border-b border-[#222a3d] pb-4">
              <User size={18} className="text-[#22d3ee]" />
              <h2 className="font-bold">Team Leader Details</h2>
            </div>

            {loadingLeader ? (
              <p className="text-sm text-[#859397]">Loading your profile...</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {[
                  ["Full Name", leader?.name],
                  ["Enrollment Number", leader?.enrollment_no],
                  ["Institutional Email", leader?.email],
                  ["Phone Number", leader?.phone_no],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="mb-1 block text-xs text-[#bbc9cd]">
                      {label}
                    </label>
                    <input
                      value={value || "Not available"}
                      readOnly
                      className="h-11 w-full cursor-not-allowed rounded-md border border-[#222a3d] bg-[#0b1326] px-4 text-sm text-[#859397]"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <div className="mb-6 flex items-center justify-between border-b border-[#222a3d] pb-4">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#22d3ee]" />
                <h2 className="font-bold">Team Members</h2>
              </div>
              <span className="text-xs text-[#859397]">{members.length}/5 members</span>
            </div>

            <div className="space-y-5">
              {members.map((member, index) => (
                <div
                  key={member.id}
                  className="relative rounded-lg border border-[#222a3d] bg-[#0b1326]/40 p-5"
                >
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="absolute right-4 top-4 text-[#859397] hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <p className="mb-4 text-sm font-semibold text-white">
                    Member {index + 1}
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs text-[#bbc9cd]">
                        Enrollment Number *
                      </label>
                      <input
                        value={member.enrollmentNo}
                        onChange={(e) =>
                          updateMember(member.id, "enrollmentNo", e.target.value)
                        }
                        onBlur={() => fetchMemberDetails(member)}
                        placeholder="Enter enrollment number"
                        className="h-10 w-full rounded-md border border-[#222a3d] bg-[#0b1326] px-3 text-sm text-white outline-none focus:border-[#22d3ee]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#bbc9cd]">
                        Full Name
                      </label>
                      <input
                        value={member.loading ? "Fetching..." : member.name}
                        readOnly
                        className="h-10 w-full cursor-not-allowed rounded-md border border-[#222a3d] bg-[#0b1326] px-3 text-sm text-[#859397]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#bbc9cd]">
                        Institutional Email
                      </label>
                      <input
                        value={member.email}
                        readOnly
                        className="h-10 w-full cursor-not-allowed rounded-md border border-[#222a3d] bg-[#0b1326] px-3 text-sm text-[#859397]"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-[#bbc9cd]">
                        Phone Number
                      </label>
                      <input
                        value={member.phone}
                        readOnly
                        className="h-10 w-full cursor-not-allowed rounded-md border border-[#222a3d] bg-[#0b1326] px-3 text-sm text-[#859397]"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-xs text-[#bbc9cd]">
                        Role in Project *
                      </label>
                      <div className="relative">
                        <select
                          value={member.role}
                          onChange={(e) =>
                            updateMember(member.id, "role", e.target.value)
                          }
                          className="h-10 w-full appearance-none rounded-md border border-[#222a3d] bg-[#0b1326] px-3 pr-10 text-sm text-white outline-none focus:border-[#22d3ee]"
                        >
                          <option value="">Select role</option>
                          <option value="Hardware Engineer">Hardware Engineer</option>
                          <option value="Frontend Developer">Frontend Developer</option>
                          <option value="Backend Developer">Backend Developer</option>
                          <option value="Data Analyst">Data Analyst</option>
                          <option value="Research Lead">Research Lead</option>
                        </select>
                        <ChevronDown
                          size={16}
                          className="pointer-events-none absolute right-3 top-3 text-[#859397]"
                        />
                      </div>
                    </div>
                  </div>

                  {member.error && (
                    <p className="mt-3 text-xs text-red-400">{member.error}</p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addMember}
              disabled={members.length >= 5}
              className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed border-[#22d3ee]/50 text-sm text-[#22d3ee] disabled:opacity-40"
            >
              <Plus size={16} /> Add Another Member
            </button>
          </section>

          <div className="mt-8 flex justify-between border-t border-[#222a3d] pt-6">
            <button
              type="button"
              onClick={() =>
                navigate("/student/team-management/register", {
                  state: { projectData },
                })
              }
              className="flex items-center gap-2 text-sm text-[#bbc9cd]"
            >
              <ArrowLeft size={16} /> Back
            </button>

            <button
              type="submit"
              className="rounded-md bg-[#22d3ee] px-6 py-3 text-sm font-bold text-[#00363e]"
            >
              Review Registration
            </button>
          </div>
        </form>
      </div>
    </GroupLeaderLayout>
  );
}