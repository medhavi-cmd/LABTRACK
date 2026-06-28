import { getAllRequests } from "../services/componentRequestService.js";

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