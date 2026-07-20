import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token is missing or invalid" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (error: any, decodedPayload: any) => {
      if (error) {
        return res.status(403).json({
          success: false,
          message: "Token is invalid or expired",
          error,
        });
      }

      req.user = decodedPayload;

      next();
    },
  );
};
