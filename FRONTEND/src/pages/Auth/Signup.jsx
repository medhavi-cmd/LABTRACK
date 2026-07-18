import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../../assets/login-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authService";
import {
  GraduationCap,
  Presentation,
  Microscope,
  Mail,
  Lock,
  User,
  Hash,
  ArrowRight,
  Briefcase,
} from "lucide-react";
import {toast} from "sonner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { RoleSelector } from "../../components/ui/RoleSelector";
import logo from "../../assets/logo.png";

export default function SignupPage() {
  const [accessRole, setAccessRole] = useState("student");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    if (accessRole === "student") {
      if (!enrollmentNo.trim()) {
        toast.error("Enrollment number is required");
        return;
      }
      if (!/^\d{6}$/.test(enrollmentNo)) {
        toast.error("Enrollment number must be exactly 6 digits.");
  return;
}
    }

    if (accessRole !== "student") {
      if (!employeeId.trim()) {
        toast.error("Employee ID is required");
        return;
      }
      if (!/^\d+$/.test(employeeId)) {
        toast.error("Employee ID must contain numbers only");
        return;
      }
    }

    try {
      const response = await signupUser({
        role: accessRole,
        name: name.trim(),
        email: email.trim(),
        password,
        enrollmentNo: accessRole === "student" ? enrollmentNo : null,
        employeeId: accessRole !== "student" ? employeeId : null,
      });

      localStorage.setItem("token", response.token);
      toast.success("Registration Successful");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 text-slate-900 font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-600 overflow-hidden">

      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 overflow-hidden bg-slate-950 text-white">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(
                to bottom,
                rgba(15, 23, 42, 0.25),
                rgba(15, 23, 42, 0.55)
              ),
              url(${bgImage})
            `,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative z-10 flex items-center gap-3">
          <img
            src={logo}
            alt="LABTRACK"
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        </div>

        <div className="relative max-w-xl my-auto py-5 text-left flex flex-col items-start justify-center z-10">
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-slate-100">
            Powering the next generation of discovery.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mt-4">
            The unified operating system for academic research, inventory
            control, and collaborative project tracking.
          </p>
        </div>

        <div className="h-10 w-full pointer-events-none" />
      </div>


      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50 overflow-y-auto">
        <motion.div
          className="w-full max-w-[440px] bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 relative my-auto max-h-[95vh] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              Create Account
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Get started with your LabTrack EME workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5 mb-4">
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Access Role
              </span>
              <div className="flex gap-2">
                <RoleSelector
                  label="Student"
                  icon={GraduationCap}
                  active={accessRole === "student"}
                  onClick={() => setAccessRole("student")}
                />
                <RoleSelector
                  label="Faculty"
                  icon={Presentation}
                  active={accessRole === "faculty"}
                  onClick={() => setAccessRole("faculty")}
                />
                <RoleSelector
                  label="Lab Staff"
                  icon={Microscope}
                  active={accessRole === "lab_staff"}
                  onClick={() => setAccessRole("lab_staff")}
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {accessRole === "student" ? (
                <motion.div
                  key="student-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="space-y-4"
                >
                  <Input
                    label="Full Name"
                    id="studentName"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={User}
                    required
                  />

                  <Input
                    label="Enrollment Number"
                    id="enrollmentNumber"
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter numeric enrollment number"
                    maxLength={6}
                    value={enrollmentNo}
                    onChange={(e) =>
                      setEnrollmentNo(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    icon={Hash}
                    className="font-mono"
                    required
                  />

                  <Input
                    label="Email Address"
                    id="studentEmail"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                  />

                  <Input
                    label="Password"
                    id="studentPassword"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="staff-faculty-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="space-y-4"
                >
                  <Input
                    label="Official Full Name"
                    id="staffName"
                    type="text"
                    placeholder="Dr. Morgan Smith"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    icon={User}
                    required
                  />

                  <Input
                    label={
                      accessRole === "faculty"
                        ? "Faculty Registry ID"
                        : "Staff Identification ID"
                    }
                    id="employeeId"
                    type="text"
                    placeholder="Enter employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    icon={Briefcase}
                    className="font-mono"
                    required
                  />

                  <Input
                    label="Email Address"
                    id="staffEmail"
                    type="email"
                    placeholder="m.smith@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={Mail}
                    required
                  />

                  <Input
                    label="Password"
                    id="staffPassword"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={Lock}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              variant="primary"
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors mt-2"
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold inline-flex items-center gap-0.5 hover:underline transition-all"
              >
                Sign In <ArrowRight size={14} className="inline ml-0.5" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
