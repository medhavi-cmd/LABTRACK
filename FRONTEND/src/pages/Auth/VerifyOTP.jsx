import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {toast} from "sonner";
import {
  KeyRound,
  ArrowLeft,
  ArrowUpRight,
} from "lucide-react";

import bgImage from "../../assets/login-bg.jpg";
import logo from "../../assets/logo.png";

import { verifyOTP } from "../../services/authService";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await verifyOTP(email, otp);

      navigate("/reset-password", {
        state: {
          email,
          resetToken: response.resetToken,
        },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 text-slate-900 font-sans antialiased overflow-hidden">

      <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between p-16 overflow-hidden bg-slate-950 text-white">

        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(
                to bottom,
                rgba(15,23,42,0.25),
                rgba(15,23,42,0.55)
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
            className="h-7 brightness-0 invert"
          />
        </div>

        <div className="relative z-10 max-w-xl my-auto">

          <h1 className="text-4xl font-bold tracking-tight leading-tight">
            Verify your identity.
          </h1>

          <p className="text-slate-400 text-lg mt-4 leading-relaxed">
            Enter the verification code sent to your registered email address to continue resetting your password.
          </p>

        </div>

        <div className="h-10"></div>

      </div>


      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-slate-50">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-[440px] bg-white border border-slate-200/80 rounded-2xl p-8 sm:p-10 shadow-xl shadow-slate-200/40"
        >

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900 mb-1">
              Verify OTP
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed">
              Enter the 6-digit verification code sent to
              <br />
              <span className="font-semibold text-slate-700">
                {email}
              </span>
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <Input
              label="Verification Code"
              id="otp"
              type="text"
              icon={KeyRound}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </Button>

          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-4">

            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2563EB] hover:underline"
            >
              <ArrowLeft size={16} />
              Back
            </Link>

          </div>

          <div className="mt-4 text-center">
            <Link
              to="/about-labtrack"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#2563EB] hover:text-[#1d4ed8]"
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