import { getAllIssuedComponents } from "../services/issuedComponentsService.js";

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