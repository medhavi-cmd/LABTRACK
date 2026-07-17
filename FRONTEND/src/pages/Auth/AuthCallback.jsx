import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { supabase } from "../../lib/supabase";
import { getProfile } from "../../services/studentService";

export default function AuthCallback() {
  const navigate = useNavigate();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    const handleGoogleLogin = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/google`,
          {},
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        const user = response.data.user;

        if (user.role === "student") {
          try {
            const profile = await getProfile(user.user_id);

            if (profile && profile.student_id) {
              navigate("/student/student-dashboard");
            } else {
              navigate("/student/complete-profile");
            }
          } catch (error) {
            console.error("Profile fetch failed:", error);
            navigate("/student/complete-profile");
          }
        } else if (user.role === "faculty") {
          navigate("/faculty/dashboard");
        } else if (user.role === "lab_staff") {
          navigate("/lab-staff/dashboard");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);

        alert(
          err.response?.data?.message ||
            "Google login failed."
        );

        navigate("/login");
      }
    };

    handleGoogleLogin();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-medium text-slate-700">
        Signing you in...
      </p>
    </div>
  );
}