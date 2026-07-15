import { getTopbarData } from "../services/topbarService.js";

export const fetchTopbarData = async (req, res) => {
  try {
    const data = await getTopbarData(req.user.id);

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to fetch topbar data",
    });
  }
};