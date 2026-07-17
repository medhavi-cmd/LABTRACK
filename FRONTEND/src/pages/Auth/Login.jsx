import React, { useState } from "react";
import { motion } from "framer-motion";
import bgImage from "../../assets/login-bg.jpg";
import { loginWithGoogle } from "../../services/authService";
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
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { RoleSelector } from "../../components/ui/RoleSelector";
import { getProfile } from "../../services/studentService";
import logo from "../../assets/logo.png";
import {toast} from "sonner";


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
        toast.error(
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
          toast.error("Unable to fetch profile");
        }
      } else if (response.user.role === "faculty") {
        navigate("/faculty/dashboard");
      } else if (response.user.role === "lab_staff") {
        navigate("/lab-staff/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
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

            <div className="flex items-center justify-between pt-1">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[#2563EB] hover:text-[#1d4ed8] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              variant="primary"
              type="submit"
              className="w-full h-10 bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium text-sm rounded-lg shadow-xs transition-colors mt-3 flex items-center justify-center"
            >
              Sign In
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={loginWithGoogle}
              className="w-full h-10 border border-[#E5E7EB] bg-white text-[#4B5563] hover:bg-[#F8FAFC] hover:text-[#111827] font-medium text-sm rounded-lg shadow-xs transition-all mt-3 flex items-center justify-center gap-2"
            >
              <svg
                className="w-4 h-4 shrink-0"
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
              Continue with Google
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-[#E5E7EB] pt-5">
            <p className="text-sm text-[#6B7280]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold inline-flex items-center gap-0.5 hover:underline transition-colors"
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
