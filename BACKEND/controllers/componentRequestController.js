import {
  getAllRequests,
  approveRequestService,
} from "../services/componentRequestService.js";

// GET all component requests
export const fetchRequests = async (req, res) => {
  try {
    const requests = await getAllRequests();

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Component Request Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch component requests",
    });
  }
};

// APPROVE request
export const approveRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Temporary until JWT authentication is implemented
    const staffId = 1;

    await approveRequestService(id, staffId);

    res.status(200).json({
      success: true,
      message: "Request approved successfully",
    });
  } catch (err) {
    console.error("Approval Error:", err);

    res.status(500).json({
      success: false,
      message: err.message || "Approval failed",
    });
  }
};