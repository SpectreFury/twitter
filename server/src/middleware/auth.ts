import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { sendError } from "../lib/apiResponse.js";

export const authenticateToken = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return sendError(
      res,
      "Access token is missing or invalid",
      "ACCESS_TOKEN_ERROR",
      401,
    );
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    (error: any, decodedPayload: any) => {
      if (error) {
        return sendError(
          res,
          "Token is invalid or expired",
          "ACCESS_TOKEN_ERROR",
          403,
        );
      }

      req.user = decodedPayload;

      next();
    },
  );
};
