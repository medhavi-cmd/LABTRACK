import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { completeProfile } from "../../services/studentService";

export default function CompleteProfile() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    branch: "",
    section: "",
    year: "",
    semester: "",
    phone_no: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.branch ||
        !formData.section ||
        !formData.year ||
        !formData.semester
      ) {
        alert("Please fill all required fields");
        return;
      }

      await completeProfile({
        user_id: user.user_id,
        enrollment_no: String(user.enrollment_number),
        name: user.full_name,

        branch: formData.branch,
        section: formData.section,

        year: Number(formData.year),
        semester: Number(formData.semester),

        phone_no: formData.phone_no,
      });

      alert("Profile Completed Successfully");

      navigate("/student/leader-dashboard");
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || error.message || "Failed");
    }
  };

  return (
    <GroupLeaderLayout>
      <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 text-[#dae2fd] font-sans antialiased selection:bg-[#22d3ee]/30 selection:text-[#22d3ee]">
        {/* Profile Card Container */}
        <div className="w-full max-w-[540px] bg-[#171f33] border border-[#3c494c] rounded-xl p-8 sm:p-10 shadow-2xl relative my-auto">
          {/* Decorative Top Accent Glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22d3ee]/40 to-transparent" />

          <div className="mb-8">
            <h1 className="text-[26px] font-semibold text-[#22d3ee] tracking-tight leading-[1.3] mb-1.5">
              Complete Your Profile
            </h1>
            <p className="text-sm text-[#bbc9cd]">
              Configure your institutional matrix parameters to access the
              workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1: Branch & Section Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#bbc9cd]">
                  Branch
                </label>
                <input
                  name="branch"
                  placeholder="e.g. Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-[#0b1326] border border-[#3c494c] rounded-md px-4 py-2.5 text-[#dae2fd] text-sm placeholder-[#bbc9cd]/30 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                />
              </div>

              {/* DROPDOWN FOR SECTION */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#bbc9cd]">
                  Section
                </label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="w-full bg-[#0b1326] border border-[#3c494c] rounded-md px-4 py-2.5 text-[#dae2fd] text-sm focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all cursor-pointer dynamic-select"
                >
                  <option value="" className="bg-[#171f33] text-[#bbc9cd]/50">
                    Select
                  </option>
                  <option value="CSE I" className="bg-[#171f33] text-[#dae2fd]">
                    CSE I
                  </option>
                  <option
                    value="CSE II"
                    className="bg-[#171f33] text-[#dae2fd]"
                  >
                    CSE II
                  </option>
                  <option
                    value="CSE III"
                    className="bg-[#171f33] text-[#dae2fd]"
                  >
                    CSE III
                  </option>
                  <option
                    value="CSE IV"
                    className="bg-[#171f33] text-[#dae2fd]"
                  >
                    CSE IV
                  </option>
                  <option value="CSE V" className="bg-[#171f33] text-[#dae2fd]">
                    CSE V
                  </option>
                  <option
                    value="CSE VI"
                    className="bg-[#171f33] text-[#dae2fd]"
                  >
                    CSE VI
                  </option>
                  <option
                    value="CSE VII"
                    className="bg-[#171f33] text-[#dae2fd]"
                  >
                    CSE VII
                  </option>
                  <option
                    value="CSE VIII"
                    className="bg-[#171f33] text-[#dae2fd]"
                  >
                    CSE VIII
                  </option>
                </select>
              </div>
            </div>

            {/* Row 2: Year & Semester Numeric Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* DROPDOWN FOR ACADEMIC BATCH YEAR */}
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#bbc9cd]">
                  Year (Batch)
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                    className="w-full bg-[#0b1326] border border-[#3c494c] rounded-md px-4 py-2.5 text-[#dae2fd] text-sm focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all cursor-pointer dynamic-select"

                >
                  <option value="" className="bg-[#171f33] text-[#dae2fd]">Select Year</option>
                  <option value="1" className="bg-[#171f33] text-[#dae2fd]">1st Year</option>
                  <option value="2" className="bg-[#171f33] text-[#dae2fd]">2nd Year</option>
                  <option value="3" className="bg-[#171f33] text-[#dae2fd]">3rd Year</option>
                  <option value="4" className="bg-[#171f33] text-[#dae2fd]">4th Year</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#bbc9cd]">
                  Semester
                </label>
                <input
                  name="semester"
                  type="number"
                  placeholder="e.g. 6"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full bg-[#0b1326] border border-[#3c494c] rounded-md px-4 py-2.5 text-[#dae2fd] text-sm placeholder-[#bbc9cd]/30 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
                />
              </div>
            </div>

            {/* Row 3: Contact Vector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#bbc9cd]">
                Phone Number
              </label>
              <input
                name="phone_no"
                placeholder="e.g. +1 555-0199"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full bg-[#0b1326] border border-[#3c494c] rounded-md px-4 py-2.5 text-[#dae2fd] text-sm placeholder-[#bbc9cd]/30 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all"
              />
            </div>

            {/* Form Submission Action Matrix */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[#22d3ee] hover:bg-[#8aebff] text-[#00363e] font-semibold py-3 px-6 rounded-md shadow-md hover:shadow-[#22d3ee]/20 transition-all duration-200 text-sm uppercase tracking-wider font-mono"
              >
                Save Profile Matrix
              </button>
            </div>
          </form>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}
