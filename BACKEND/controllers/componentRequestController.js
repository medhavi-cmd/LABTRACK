import {
  getAllRequests,
  approveRequestService,
} from "../services/ComponentRequestService.js";

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

    // req.user.id = users.user_id (bigint) set by requireAuth middleware
    // The service resolves this to lab_staff.staff_id internally
    const userId = req.user.id;

    await approveRequestService(id, userId);

    res.status(200).json({
      success: true,
      message: "Request approved successfully",
    });
  } catch (err) {
    console.error("Approval Error:", err.message);

    res.status(500).json({
      success: false,
      message: err.message || "Approval failed",
    });
  }
};