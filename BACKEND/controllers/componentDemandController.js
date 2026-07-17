import { getComponentDemand } from "../services/componentDemandService.js";

export const fetchComponentDemand = async (req, res) => {
  try {
    const demandData = await getComponentDemand();
    res.status(200).json({ success: true, data: demandData });
  } catch (error) {
    console.error("Component Demand Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch component demand" });
  }
};
