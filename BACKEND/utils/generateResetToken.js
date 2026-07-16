import jwt from "jsonwebtoken";

const generateResetToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
      type: "password_reset",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    }
  );
};

export default generateResetToken;