import { getAllIssuedComponents, returnIssuedComponent } from "../services/issuedComponentsService.js";

export const fetchIssuedComponents = async (req, res) => {
  try {
    const issuedComponents = await getAllIssuedComponents();

    res.status(200).json({
      success: true,
      data: issuedComponents,
    });
  } catch (error) {
    console.error("Issued Components Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch issued components",
    });
  }
};

export const markAsReturned = async (req, res) => {
  try {
    const issueId = req.params.id;
    const result = await returnIssuedComponent(issueId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Mark As Returned Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to mark component as returned",
    });
  }
};