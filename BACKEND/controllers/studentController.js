import {
  createStudentProfile,
  getStudentProfile
} from "../services/studentService.js";

export const completeProfile = async (req, res) => {
  try {
    const { enrollment_no, phone_no } = req.body;

    if (!/^\d{6}$/.test(String(enrollment_no))) {
      return res.status(400).json({
        message: "Enrollment number must be exactly 6 digits.",
      });
    }

    if (!/^[1-9]\d{9}$/.test(String(phone_no))) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits.",
      });
    }
    const profile = await createStudentProfile(req.body);

    res.status(201).json(profile);
  }
  catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

export const fetchProfile = async (req, res) => {
  try {

    const profile =
      await getStudentProfile(
        req.params.userId
      );

    res.json(profile);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};