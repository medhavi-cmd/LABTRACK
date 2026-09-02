import { getAllComponents, getComponentCategories } from "../services/componentService.js";

export const fetchAllComponents = async (req, res) => {
  try {
    const { search, category, sortField, sortDir } = req.query;
    const [components, categories] = await Promise.all([
      getAllComponents({ search, category, sortField, sortDir }),
      getComponentCategories(),
    ]);

    return res.status(200).json({ data: components, categories });
  } catch (error) {
    console.error("fetchAllComponents:", error);

    return res.status(500).json({
      message: "Failed to fetch components",
    });
  }
};