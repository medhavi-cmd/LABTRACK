import jwt from "jsonwebtoken";

const verifyResetToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Reset token is required.",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (decoded.type !== "password_reset") {
      return res.status(401).json({
        message: "Invalid reset token.",
      });
    }

    req.resetUserId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Reset session expired.",
    });
  }
};

export default verifyResetToken;