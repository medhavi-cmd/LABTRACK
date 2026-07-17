import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { completeProfile } from "../../services/studentService";
import {toast} from "sonner";

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
        toast.error("Please fill all required fields");
        return;
      }

      if (!/^[1-9]\d{9}$/.test(formData.phone_no)) {
        toast.error("Phone number must be exactly 10 digits.");
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

      toast.success("Profile Completed Successfully");
      navigate("/student/student-dashboard");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || "Failed");
    }
  };

  return (
    <GroupLeaderLayout>
      <div className="min-h-[85vh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50 text-slate-600 font-sans antialiased selection:bg-cyan-200 selection:text-cyan-900">
        <div className="w-full max-w-[540px] bg-white border border-slate-200 rounded-xl p-8 sm:p-10 shadow-sm relative my-auto">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-600/40 to-transparent" />

          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
              Complete Your Profile
            </h1>
            <p className="text-sm text-slate-500">
              Configure your institutional matrix parameters to access the
              workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Branch
                </label>
                <input
                  name="branch"
                  placeholder="e.g. Computer Science"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Section
                </label>
                <div className="relative w-full">
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm outline-none focus:border-cyan-500 transition-all cursor-pointer shadow-sm appearance-none"
                  >
                    <option value="">Select</option>
                    <option value="CSE I">CSE I</option>
                    <option value="CSE II">CSE II</option>
                    <option value="CSE III">CSE III</option>
                    <option value="CSE IV">CSE IV</option>
                    <option value="CSE V">CSE V</option>
                    <option value="CSE VI">CSE VI</option>
                    <option value="CSE VII">CSE VII</option>
                    <option value="CSE VIII">CSE VIII</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Year (Batch)
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm outline-none focus:border-cyan-500 transition-all cursor-pointer shadow-sm appearance-none"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Semester
                </label>
                <input
                  name="semester"
                  type="number"
                  placeholder="e.g. 6"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Phone Number
              </label>
              <input
                name="phone_no"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="10-digit phone number"
                value={formData.phone_no}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone_no: e.target.value.replace(/\D/g, "").slice(0, 10),
                  })
                }
                className="w-full bg-white border border-slate-200 rounded-md px-4 py-2.5 text-slate-900 text-sm placeholder-slate-400 outline-none focus:border-cyan-500 transition-all shadow-sm"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-3 px-6 rounded-md shadow-sm transition-all duration-200 text-xs uppercase tracking-wider font-mono active:scale-95"
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
