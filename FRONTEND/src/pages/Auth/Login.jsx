import React, { useState } from "react";
import { motion } from "framer-motion";
import bgImage from "../../assets/login-bg.jpg";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  Lock,
  GraduationCap,
  Presentation,
  Microscope,
  ArrowRight,
} from "lucide-react";
import { loginUser } from "../../services/authService";

// Component Imports
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { RoleSelector } from "../../components/ui/RoleSelector";
import { getProfile } from "../../services/studentService";
import logo from "../../assets/logo.png";

export default function LoginPage() {
  const [accessRole, setAccessRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ email, password });

      if (response.user.role !== accessRole) {
        alert(
          `This account belongs to ${response.user.role}. Please select the correct access role.`,
        );
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      if (response.user.role === "student") {
        try {
          const profile = await getProfile(response.user.user_id);
          if (profile && profile.student_id) {
            navigate("/student/student-dashboard");
          } else {
            navigate("/student/complete-profile");
          }
        } catch (err) {
          console.error("Profile fetch error:", err);
          alert("Unable to fetch profile");
        }
      } else if (response.user.role === "faculty") {
        navigate("/faculty/dashboard");
      } else if (response.user.role === "lab_staff") {
        navigate("/lab-staff/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 text-slate-900 font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-600 overflow-hidden">
      {/* LEFT SIDE: Clean High-Contrast Tech Panel */}
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

        {/* Header */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src={logo}
            alt="LABTRACK"
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Tagline */}
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

      {/* RIGHT SIDE: Minimal Light Workspace Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50">
        <motion.div
          className="w-full max-w-[440px] bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Sign in to your LabTrack EME workspace
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

            <Input
              label="Email Address"
              id="email"
              type="email"
              placeholder="dr.smith@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />

            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={Lock}
              required
            />

            <div className="flex items-center justify-between pt-0.5">
              <a
                href="#forgot"
                className="text-sm font-semibold text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors mt-2"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold inline-flex items-center gap-0.5 hover:underline transition-all"
              >
                Sign Up <ArrowRight size={14} className="inline ml-0.5" />
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/about-labtrack"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-[#1d4ed8] transition"
            >
              About LABTRACK
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
