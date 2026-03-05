import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";

const verifyToken = (req, res, next) => {
  // Try to get token from x-access-token header
  let token = req.headers["x-access-token"];

  // If not found, try Authorization header with Bearer token
  if (!token && req.headers["authorization"]) {
    const authHeader = req.headers["authorization"];
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]; // Extract the token part
    }
  }

  // If no token found in either header
  if (!token) {
    return res.status(401).send({ message: "No token provided" });
  }

  // Verify the token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token" });
    }

    req.userId = decoded.id;
    next();
  });
};

export default verifyToken;