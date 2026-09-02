import {
  getReturnHistory,
  getReturnStats,
} from "../services/returnManagementService.js";

// GET /api/returns
export const fetchReturnHistory = async (req, res) => {
  try {
    const { search, condition, sortField, sortDir } = req.query;
    const [data, stats] = await Promise.all([
      getReturnHistory({ search, condition, sortField, sortDir }),
      getReturnStats(),
    ]);

    res.status(200).json({
      success: true,
      data,
      stats,
    });
  } catch (error) {
    console.error("Error in fetchReturnHistory:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch return history.",
    });
  }
};