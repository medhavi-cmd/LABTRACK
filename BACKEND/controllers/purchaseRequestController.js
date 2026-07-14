import {
  getTeamDetailsForRequest,
  createPurchaseRequest,
  getPurchaseRequestsByTeam,
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