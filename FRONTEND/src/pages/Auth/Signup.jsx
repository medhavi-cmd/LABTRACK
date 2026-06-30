import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bgImage from "../../assets/login-bg.jpg";
import { Link, useNavigate } from "react-router-dom";

import { signupUser } from "../../services/authService";

// Component Imports
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { RoleSelector } from "../../components/ui/RoleSelector";
import logo from "../../assets/logo.png";

import {
  GraduationCap,
  Presentation,
  Microscope,
  Mail,
  Lock,
  FlaskConical,
  User,
  Hash,
  ArrowRight,
  Briefcase,
} from "lucide-react";

export default function SignupPage() {
  const [accessRole, setAccessRole] = useState("student");
  const navigate = useNavigate();
  // Registration Form States
  const [name, setName] = useState("");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert("Please fill all required fields");
      return;
    }

    if (accessRole === "student") {
      if (!enrollmentNo.trim()) {
        alert("Enrollment number is required");
        return;
      }

      if (!/^\d+$/.test(enrollmentNo)) {
        alert("Enrollment number must contain numbers only");
        return;
      }
    }

    if (accessRole !== "student") {
      if (!employeeId.trim()) {
        alert("Employee ID is required");
        return;
      }

      if (!/^\d+$/.test(employeeId)) {
        alert("Employee ID must contain numbers only");
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

      alert("Registration Successful");

      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="h-screen w-full flex bg-[#0b1326] text-[#dae2fd] font-sans antialiased selection:bg-[#22d3ee]/30 selection:text-[#22d3ee] overflow-hidden">
      {/* LEFT SIDE — IDENTICAL TO LOGIN PAGE */}
      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-12 overflow-hidden border-r border-[#3c494c]">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(6,14,32,.65), rgba(6,14,32,.65)), url(${bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.15),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#859397_1px,transparent_1px),linear-gradient(to_bottom,#859397_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Header */}
        <motion.div
          className="relative flex items-center gap-3 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="h-18 border-b border-[#222a3d] flex items-center justify-center px-4">
            <img
              src={logo}
              alt="LABTRACK"
              className="h-10 w-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Tagline */}
        <div className="relative max-w-2xl mx-auto my-auto py-5 text-left flex flex-col items-start justify-center z-10">
          <motion.h1
            className="text-5xl font-bold text-[#dae2fd] tracking-tight leading-[1.2] mb-4 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Powering the next generation of discovery.
          </motion.h1>
          <motion.p
            className="text-[#bbc9cd] text-xl leading-[1.6] text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            The unified operating system for academic research, inventory
            control, and collaborative project tracking.
          </motion.p>
        </div>

        <div className="h-10 w-full pointer-events-none" />
      </div>

      {/* RIGHT SIDE — MATCHED TO LOGIN FOOTPRINT WITH DYNAMIC FIELDS */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)] overflow-y-auto">
        <motion.div
          className="w-full max-w-[460px] bg-[#171f33] border border-[#3c494c] rounded-lg p-8 sm:p-10 shadow-2xl relative my-auto max-h-[95vh] overflow-y-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>

          <div className="mb-6">
            <h2 className="text-[24px] font-semibold text-[#22d3ee] tracking-tight leading-[1.3] mb-1.5">
              Create Account
            </h2>
            <p className="text-sm text-[#bbc9cd]">
              Get started with your LabTrack EME workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2 mb-4">
              <span className="font-mono text-[12px] font-semibold uppercase tracking-wider text-[#bbc9cd]">
                Access Role
              </span>
              <div className="flex gap-2.5">
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

            {/* CONDITIONAL FIELD INJECTION MATRIX */}
            <AnimatePresence mode="wait">
              {accessRole === "student" ? (
                <motion.div
                  key="student-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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
                    value={enrollmentNo}
                    onChange={(e) =>
                      setEnrollmentNo(e.target.value.replace(/\D/g, ""))
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
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

            <Button variant="primary" type="submit" className="w-full pt-1">
              Sign Up
            </Button>

            {/* <div className="relative flex py-2 items-center">
              <div className="grow border-t border-[#3c494c]/60"></div>
              <span className="shrink mx-4 font-mono text-[11px] font-bold tracking-widest text-[#bbc9cd]/60 uppercase">
                OR SSO REGISTER
              </span>
              <div className="grow border-t border-[#3c494c]/60"></div>
            </div> */}

            {/* <Button
              variant="sso"
              type="button"
              onClick={() => console.log("Google Signup Node Initialized")}
            >
              <svg
                className="w-4 h-4 mr-1"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign up using Google
            </Button> */}
          </form>

          <div className="mt-6 text-center border-t border-[#3c494c]/40 pt-4">
            <p className="text-sm text-[#bbc9cd]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#22d3ee] hover:text-[#8aebff] font-semibold inline-flex items-center gap-0.5 hover:underline transition-all"
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
