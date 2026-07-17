import {
  fetchLabStaffProfile,
  editLabStaffProfile,
} from "../services/labStaffProfileService.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await fetchLabStaffProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile.",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const updatedProfile = await editLabStaffProfile(
      req.user.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
};
