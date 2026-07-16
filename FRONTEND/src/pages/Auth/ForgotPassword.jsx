import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

import bgImage from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";

import {
  Mail,
  ArrowLeft,
} from "lucide-react";

import { forgotPassword } from "../../services/authService";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await forgotPassword(email);

      alert(response.message);

      navigate("/verify-otp", {
        state: {
          email,
        },
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 text-slate-900 font-sans antialiased selection:bg-cyan-500/20 selection:text-cyan-600 overflow-hidden">

      {/* LEFT SIDE */}
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

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <img
            src={logo}
            alt="LABTRACK"
            className="h-7 w-auto object-contain brightness-0 invert"
          />
        </div>

        {/* Heading */}
        <div className="relative max-w-xl my-auto py-5 text-left flex flex-col items-start justify-center z-10">
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-slate-100">
            Powering the next generation of discovery.
          </h1>

          <p className="text-slate-400 text-lg leading-relaxed mt-4">
            The unified operating system for academic research,
            inventory control, and collaborative project tracking.
          </p>
        </div>

        <div className="h-10 w-full pointer-events-none" />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50">

        <motion.div
          className="w-full max-w-[440px] bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/40 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-1">
              Forgot Password
            </h2>

            <p className="text-sm text-slate-500 font-medium">
              Enter your registered email address to receive a verification OTP.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

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

            <Button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-medium py-2.5 rounded-lg shadow-sm transition-colors mt-2"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>

          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-[#2563EB] hover:text-[#1d4ed8] font-semibold hover:underline transition-all"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>

          </div>

        </motion.div>

      </div>

    </div>
  );
}