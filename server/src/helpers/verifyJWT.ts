import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request interface to include userId and role
interface CustomRequest extends Request {
  userId?: string;
  role?: string;
}

const verifyJWT = () => {
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    console.log("verifyJWT middleware triggered");

    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.ACCESS_TOKEN_SECRET) {
      console.error(
        "ACCESS_TOKEN_SECRET is not defined! Exiting application..."
      );
      process.exit(1);
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err: any, decoded: any) => {
        if (err) {
          console.error("JWT verification failed:", err);
          return res.status(403).json({ message: "Forbidden" });
        }

        if (!decoded.userId) {
          console.error("Decoded token missing userId", decoded);
          return res.status(403).json({ message: "Forbidden" });
        }
        console.log(decoded);
        req.body.userId = decoded.userId; // Attach userId to the request object
        console.log("User ID: on jwt", decoded.userId); // Log user ID

        next(); // Pass control to the next middleware or route handler
      }
    );
  };
};

export default verifyJWT;
