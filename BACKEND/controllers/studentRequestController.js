import { submitComponentRequest } from "../services/studentRequestService.js";

export const createComponentRequest = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { purpose, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Please add at least one component.",
      });
    }

    const result = await submitComponentRequest(
      studentId,
      purpose,
      items
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};