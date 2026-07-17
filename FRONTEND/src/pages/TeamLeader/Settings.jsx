import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarDays,
  Hash,
  Loader2,
  LogOut,
  Mail,
  Phone,
  School,
  User,
} from "lucide-react";

import GroupLeaderLayout from "../../layouts/GroupLeaderLayout";
import { getMyProfile } from "../../services/teamApi";

export default function Settings() {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMyProfile();
        setStudent(response);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError(err.message || "Unable to load profile details");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Not available";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not available";
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <GroupLeaderLayout>
        <div className="flex min-h-[80vh] items-center justify-center text-[#4B5563]">
          <div className="flex items-center gap-3 text-[#4B5563]">
            <Loader2 className="animate-spin text-[#2563EB]" size={22} />
            Loading profile settings...
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  if (error || !student) {
    return (
      <GroupLeaderLayout>
        <div className="p-5 text-[#4B5563] sm:p-8">
          <div className="max-w-3xl rounded-xl border border-red-200 bg-red-50 p-6">
            <div className="mb-3 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={22} />

              <h1 className="text-xl font-semibold text-red-900">
                Unable to Load Settings
              </h1>
            </div>

            <p className="text-red-700">
              {error || "Student profile details could not be loaded."}
            </p>
          </div>
        </div>
      </GroupLeaderLayout>
    );
  }

  const fullName = student.full_name || student.name || "Student";

  const profileDetails = [
    {
      label: "Full Name",
      value: fullName,
      icon: User,
    },
    {
      label: "Enrollment Number",
      value: student.enrollment_no || "Not available",
      icon: Hash,
    },
    {
      label: "Academic Email",
      value: student.email || "Not available",
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: student.phone_no || "Not available",
      icon: Phone,
    },
    {
      label: "Department",
      value: student.department || student.branch || "Not available",
      icon: School,
    },
  ];

  return (
    <GroupLeaderLayout>
      <div className="min-h-screen bg-[#F8FAFC] p-5 text-[#4B5563] sm:p-8">
        <div className="mx-auto max-w-6xl">
        
          <div className="mb-8">
            <p className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-[#2563EB]">
              Account Settings
            </p>

            <h1 className="text-3xl font-bold text-[#111827]">Settings</h1>

            <p className="mt-2 text-[#4B5563]">
              View your account and registered profile information.
            </p>
          </div>

          <section className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
    
            <div className="flex items-center gap-4 border-b border-[#E5E7EB] px-5 py-5 sm:px-7">
              <div className="rounded-lg border border-[#2563EB]/20 bg-[#EFF6FF] p-3">
                <User className="text-[#2563EB]" size={22} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-[#111827]">My Profile</h2>

                <p className="mt-1 text-sm text-[#4B5563]">
                  Your personal information as registered in the system.
                </p>
              </div>
            </div>

            <div className="px-5 sm:px-7">
              {profileDetails.map((detail) => {
                const Icon = detail.icon;

                return (
                  <div
                    key={detail.label}
                    className="grid grid-cols-1 gap-3 border-b border-[#E5E7EB] py-5 sm:grid-cols-2 sm:items-center"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="text-[#2563EB]" size={18} />

                      <p className="font-medium text-[#4B5563]">
                        {detail.label}
                      </p>
                    </div>

                    <p className="break-all text-sm font-semibold text-[#111827] sm:text-right">
                      {detail.value}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="px-5 py-6 sm:px-7">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-3.5 font-semibold text-red-600 transition hover:bg-red-100 hover:text-red-700"
              >
                <LogOut size={18} />
                Logout
              </button>

              <p className="mt-3 text-center text-xs text-[#6B7280]">
                Securely logout from your account on this device.
              </p>
            </div>
          </section>

          <div className="mt-6 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] p-4 text-sm text-[#1E40AF]">
            Your profile details are currently read-only. Contact the faculty
            coordinator or lab administrator if any registered information needs
            correction.
          </div>
        </div>
      </div>
    </GroupLeaderLayout>
  );
}