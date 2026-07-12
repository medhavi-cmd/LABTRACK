import {
  getStudentByUserId,
  getStudentByEnrollment,
  registerTeam,
  getTeamByUserId,
  studentHasTeam,
  getAllFaculty,
} from "../services/teamService.js";

export const getMyProfile = async (req, res) => {
  try {
    const student = await getStudentByUserId(req.user.id);

    if (!student) {
      return res.status(404).json({
        message: "Student profile not found. Please complete your profile first.",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("getMyProfile error:", error);

    return res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

export const fetchFacultyList = async (req, res) => {
  try {
    const faculty = await getAllFaculty();

    return res.status(200).json(faculty);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch faculty",
    });
  }
};

export const fetchStudentByEnrollment = async (req, res) => {
  try {
    const enrollmentNo = req.params.enrollmentNo.trim();

    const student = await getStudentByEnrollment(enrollmentNo);

    if (!student) {
      return res.status(404).json({
        message: "No student found with this enrollment number",
      });
    }

    return res.status(200).json(student);
  } catch (error) {
    console.error("fetchStudentByEnrollment error:", error);

    return res.status(500).json({
      message: "Failed to fetch student",
    });
  }
};

export const checkMyTeamStatus = async (req, res) => {
  try {
    const hasTeam = await studentHasTeam(req.user.id);

    return res.status(200).json({ hasTeam });
  } catch (error) {
    console.error("checkMyTeamStatus error:", error);

    return res.status(500).json({
      message: "Failed to check team status",
    });
  }
};

export const getMyTeam = async (req, res) => {
  try {
    const team = await getTeamByUserId(req.user.id);

    if (!team) {
      return res.status(404).json({
        message: "No team registered yet",
      });
    }

    return res.status(200).json(team);
  } catch (error) {
    console.error("getMyTeam error:", error);

    return res.status(500).json({
      message: "Failed to fetch team details",
    });
  }
};

export const createTeam = async (req, res) => {
  try {
    const team = await registerTeam({
      leaderUserId: req.user.id,
      ...req.body,
    });

    return res.status(201).json({
      message: "Team registered successfully and is awaiting faculty approval",
      team,
    });
  } catch (error) {
    console.error("createTeam error:", error);

    return res.status(400).json({
      message: error.message || "Failed to register team",
    });
  }
};