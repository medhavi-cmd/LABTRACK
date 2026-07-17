import axios from "axios";
import { supabase } from "../lib/supabase";

const API =
  "http://localhost:5000/api/auth";

export const signupUser =
  async (data) => {
    const response =
      await axios.post(
        `${API}/signup`,
        data
      );

    return response.data;
  };

export const loginUser =
  async (data) => {
    const response =
      await axios.post(
        `${API}/login`,
        data
      );

    return response.data;
  };

  export const forgotPassword = async (email) => {
  const response = await axios.post(
    `${API}/forgot-password`,
    { email }
  );

  return response.data;
};

export const verifyOTP = async (email, otp) => {
  const response = await axios.post(
    `${API}/verify-otp`,
    {
      email,
      otp,
    }
  );

  return response.data;
};

export const resetPassword = async (
  email,
  password,
  resetToken
) => {
  const response = await axios.post(
    `${API}/reset-password`,
    {
      email,
      newPassword: password,
    },
    {
      headers: {
        Authorization: `Bearer ${resetToken}`,
      },
    }
  );

  return response.data;
};



export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw error;
  }
};