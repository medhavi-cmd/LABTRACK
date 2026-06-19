import axios from "axios";

const API = "http://localhost:5000/api/team";

// Fetch student data from backend by enrollment number
export const getStudentByEnrollment = async (enrollmentNo) => {
    const response = await axios.get(`${API}/student/${enrollmentNo}`);
    return response.data;
};

// Send complete team registration payload to backend
export const registerTeam = async (data) => {
    const response = await axios.post(`${API}/register`, data);
    return response.data;
};