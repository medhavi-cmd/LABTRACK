import {
  createStudentProfile,
  getStudentProfile
} from "../services/studentService.js";

export const completeProfile = async (req, res) => {
  try {
    const profile = await createStudentProfile(req.body);

    res.status(201).json(profile);
  }
  catch(error){
    console.error(error);

    res.status(500).json({
      message:"Server Error"
    });
  }
};

export const fetchProfile = async (req,res) => {
  try {

    const profile =
      await getStudentProfile(
        req.params.userId
      );

    res.json(profile);

  } catch(error){
    console.error(error);

    res.status(500).json({
      message:"Server Error"
    });
  }
};