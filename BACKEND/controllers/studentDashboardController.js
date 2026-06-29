import { getDashboardData } from "../services/studentDashboardService.js";

export const fetchDashboardData = async (req, res) => {
  try {
    const dashboardData = await getDashboardData(req.user.id);

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      message: error.message || "Failed to load dashboard",
    });
  }
};