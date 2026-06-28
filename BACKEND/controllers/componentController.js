import { getAllComponents } from "../services/componentService.js";

export const fetchAllComponents = async (req, res) => {
  try {
    const components = await getAllComponents();

    return res.status(200).json(components);
  } catch (error) {
    console.error("fetchAllComponents:", error);

    return res.status(500).json({
      message: "Failed to fetch components",
    });
  }
};