import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
    id: decoded.id,
    role: decoded.role,
};
    next();
  } 
  catch (error) {

    if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            message: "Session expired. Please login again."
        });
    }

    return res.status(401).json({
        message: "Invalid authentication token."
    });
}
};