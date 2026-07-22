import type { Response } from "express";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  error: any;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = "Success",
  statusCode = 200,
) => {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    data,
    error: null,
  };

  return res.status(statusCode).json(responseBody);
};

export const sendError = <T>(
  res: Response,
  message: string,
  errorCode = "INTERNAL_SERVER_ERROR",
  statusCode = 500,
) => {
  const responseBody: ApiResponse<T> = {
    success: false,
    message,
    data: null,
    error: {
      code: errorCode,
    },
  };

  return res.status(statusCode).json(responseBody);
};
