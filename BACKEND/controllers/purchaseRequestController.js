import {
  getTeamDetailsForRequest,
  createPurchaseRequest,
  getPurchaseRequestsByTeam,
  getAllPurchaseRequests,
  updatePurchaseRequest,
} from "../services/purchaseRequestService.js";

  //  GET FORM DETAILS
export const fetchRequestFormDetails = async (req, res) => {
  try {
    const data = await getTeamDetailsForRequest(req.user.id);

    if (!data) {
      return res.status(404).json({
        message: "Team not found.",
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch request form details",
    });
  }
};

  //  CREATE PURCHASE REQUEST
export const submitPurchaseRequest = async (req, res) => {
  try {
    const purchaseRequest = await createPurchaseRequest(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      message: "Purchase request submitted successfully",
      purchaseRequest,
    });
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      message: error.message,
    });
  }
};

  //  GET MY PURCHASE REQUESTS
export const fetchMyPurchaseRequests = async (req, res) => {
  try {
    const requests = await getPurchaseRequestsByTeam(req.user.id);

    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch purchase requests",
    });
  }
};

  // GET ALL PURCHASE REQUESTS (LAB STAFF)
export const fetchAllPurchaseRequests = async (req, res) => {
  try {
    const requests = await getAllPurchaseRequests();
    return res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch all purchase requests" });
  }
};

  // UPDATE PURCHASE REQUEST STATUS (LAB STAFF)
export const updatePurchaseRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await updatePurchaseRequest(id, status, remarks);
    
    return res.status(200).json({
      message: `Purchase request ${status}`,
      request: updated
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update purchase request status" });
  }
};