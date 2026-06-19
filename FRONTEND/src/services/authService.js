import axios from "axios";

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