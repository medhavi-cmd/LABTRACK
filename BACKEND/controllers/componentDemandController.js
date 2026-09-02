import {
  getComponentDemand,
  getComponentDemandStats,
} from "../services/componentDemandService.js";

export const fetchComponentDemand = async (req, res) => {
  try {
    const { search, demandStatus, sortField, sortDir } = req.query;
    const [demandData, stats] = await Promise.all([
      getComponentDemand({ search, demandStatus, sortField, sortDir }),
      getComponentDemandStats(),
    ]);
    res.status(200).json({ success: true, data: demandData, stats });
  } catch (error) {
    console.error("Component Demand Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch component demand" });
  }
};
