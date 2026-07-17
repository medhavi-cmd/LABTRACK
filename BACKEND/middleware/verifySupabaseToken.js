import { createRemoteJWKSet, jwtVerify } from "jose";

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Google token missing.",
      });
    }

    const token = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(token, JWKS);

    req.googleUser = payload;

    next();
  }  catch (error) {
  console.error("SUPABASE TOKEN VERIFY ERROR:", error);

  return res.status(401).json({
    message: "Invalid Google token.",
  });
}
};

export default verifySupabaseToken;