import { getReturnHistory } from "../services/returnManagementService.js";

// GET /api/returns
export const fetchReturnHistory = async (req, res) => {
  try {
    const data = await getReturnHistory();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in fetchReturnHistory:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch return history.",
    });
  }
};