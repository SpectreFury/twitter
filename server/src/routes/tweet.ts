import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendError, sendSuccess } from "../lib/apiResponse.js";

const tweetRouter = Router();

tweetRouter.post("/", authenticateToken, async (req: any, res) => {
  try {
    const sub = req.user.sub;
    const { content } = req.body;

    if (!content) {
      return sendError(res, "Content is required for tweet", "NO_CONTENT", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        sub,
      },
    });

    if (!user) {
      return sendError(res, "User not found", "NO_USER", 400);
    }

    const tweet = await prisma.tweet.create({
      data: {
        content,
        userId: user.id,
      },
    });

    const responseBody = {
      id: tweet.id,
    };

    return sendSuccess(res, responseBody, "Tweet created", 200);
  } catch (error) {
    console.log("Tweet error: ", error);
    return sendError(res, "Unable to create tweet", "TWEET_ERROR", 500);
  }
});

export { tweetRouter };
