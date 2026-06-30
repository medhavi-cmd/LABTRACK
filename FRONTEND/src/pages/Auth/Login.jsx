import React, { useState } from "react";
import { motion } from "framer-motion";
import bgImage from "../../assets/login-bg.jpg";
import { Link, useNavigate } from "react-router-dom";

import { ArrowUpRight } from "lucide-react";

import { loginUser } from "../../services/authService";

// Component Imports
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { RoleSelector } from "../../components/ui/RoleSelector";
import { getProfile } from "../../services/studentService";
import logo from "../../assets/logo.png";

import {
  GraduationCap,
  Presentation,
  Microscope,
  Mail,
  Lock,
  FlaskConical,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const [accessRole, setAccessRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await loginUser({
        email,
        password,
      });

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
    <div className="h-screen w-full flex bg-[#0b1326] text-[#dae2fd] font-sans antialiased selection:bg-[#22d3ee]/30 selection:text-[#22d3ee] overflow-hidden">
      {/* LEFT SIDE */}

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

        {/* tag line */}
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

      {/* RIGHT SIDE */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 relative bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)]">
        <motion.div
          className="w-full max-w-[460px] bg-[#171f33] border border-[#3c494c] rounded-lg p-8 sm:p-10 shadow-2xl relative"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-8">
            <h2 className="text-[24px] font-semibold text-[#22d3ee] tracking-tight leading-[1.3] mb-1.5">
              Welcome back
            </h2>
            <p className="text-sm text-[#bbc9cd]">
              Sign in to your LabTrack EME workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-2 mb-6">
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

            <div className="flex items-center justify-between pt-1 pb-2">
              <a
                href="#forgot"
                className="text-sm font-medium text-[#22d3ee] hover:text-[#8aebff] transition-colors"
              >
                Forgot password?
              </a>
            </div>

            <Button variant="primary" type="submit" className="w-full mt-2">
              Sign In
            </Button>

            {/* <div className="relative flex py-3 items-center">
              <div className="grow border-t border-[#3c494c]/60"></div>
              <span className="shrink mx-4 font-mono text-[11px] font-bold tracking-widest text-[#bbc9cd]/60 uppercase">
                OR SSO LOGIN
              </span>
              <div className="grow border-t border-[#3c494c]/60"></div>
            </div> */}

            {/* <Button
              variant="sso"
              type="button"
              onClick={() => console.log("Google login")}
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
              Sign in using Google
            </Button> */}
          </form>

          {/* <div className="mt-8 text-center">
            <p className="text-sm text-[#bbc9cd]">
              Don't have an account?{" "}
              <a
                href="#request"
                className="text-[#22d3ee] hover:text-[#8aebff] font-semibold inline-flex items-center gap-0.5 hover:underline transition-all"
              >
                Request access{" "}
                <ArrowRight size={14} className="inline ml-0.5" />
              </a>
            </p>
          </div> */}

          <div className="mt-6 text-center border-t border-[#3c494c]/40 pt-4">
            <p className="text-sm text-[#bbc9cd]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-[#22d3ee] hover:text-[#8aebff] font-semibold inline-flex items-center gap-0.5 hover:underline transition-all"
              >
                Sign Up <ArrowRight size={14} className="inline ml-0.5" />
              </Link>
            </p>
          </div>
          {/* <div className="mt-6 flex justify-center">
            <Link
              to="/aboutlabtrack"
              className="flex items-center gap-1 text-sm text-[#22d3ee] transition-colors"
            >
              About LABTRACK
              <ArrowUpRight size={16} />
            </Link>
          </div> */}
          <div className="mt-6 text-center">
            <Link
              to="/about-labtrack"
              className="inline-flex items-center gap-1 text-sm text-[#22d3ee] hover:text-[#8aebff] transition"
            >
              About LABTRACK
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
