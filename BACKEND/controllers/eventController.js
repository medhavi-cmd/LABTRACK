import { getNextEvent } from "../services/eventService.js";

export const fetchNextEvent = async (req, res) => {
  try {
    const event = await getNextEvent();

    res.json(event);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch event",
    });
  }
};