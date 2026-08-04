import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendError, sendSuccess } from "../lib/apiResponse.js";

const searchRouter = Router();

searchRouter.get("/", async (req, res) => {
  try {
    const q = req.query.q as string;

    if (!q.trim() || q.trim().length <= 2) {
      return sendError(res, "Too short", "SHORT_QUERY", 400);
    }

    const users = await prisma.user.findMany({
      where: {
        handle: {
          contains: q,
          mode: "insensitive",
        },
      },

      take: 10,
    });

    return sendSuccess(res, users, "Search successful", 200);
  } catch (error) {}
});

export { searchRouter };
