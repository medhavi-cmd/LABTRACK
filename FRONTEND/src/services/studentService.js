import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/student`;

export const completeProfile =
async(data)=>{

  const response =
    await axios.post(
      `${API}/complete-profile`,
      data
    );

  return response.data;
};

export const getProfile =
async(userId)=>{

  const response =
    await axios.get(
      `${API}/profile/${userId}`
    );

  return response.data;
};