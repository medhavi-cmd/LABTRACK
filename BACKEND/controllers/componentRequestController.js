import { getAllRequests } from "../services/componentRequestService.js";

export const fetchRequests = async (req, res) => {
  try {
    const requests = await getAllRequests();

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};