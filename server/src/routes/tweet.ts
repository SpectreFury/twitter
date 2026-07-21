import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendError, sendSuccess } from "../lib/apiResponse.js";

const tweetRouter = Router();

tweetRouter.get("/", authenticateToken, async (req: any, res) => {
  try {
    const sub = req.user.sub;

    const user = await prisma.user.findUnique({
      where: {
        sub,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return sendError(res, "User not found", "USER_NOT_FOUND", 400);
    }

    const tweets = await prisma.tweet.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            image_url: true,
            first_name: true,
            last_name: true,
            id: true,
            handle: true,
          },
        },
      },
    });

    sendSuccess(res, tweets, "Tweets fetched", 200);
  } catch (error) {}
});

tweetRouter.get("/:username/:id", authenticateToken, async (req: any, res) => {
  try {
    const sub = req.user.sub;
    const { id, username } = req.params;

    const idNumber = Number(id);

    if (!Number.isInteger(idNumber) || idNumber < 1) {
      return sendError(res, "tweetId should be a Int", "MALFORMED_ID", 400);
    }

    const tweet = await prisma.tweet.findUnique({
      where: {
        id: idNumber,
        user: {
          handle: username,
        },
      },

      include: {
        user: {
          select: {
            image_url: true,
            first_name: true,
            last_name: true,
            id: true,
            handle: true,
          },
        },
      },
    });

    if (!tweet) {
      return sendError(res, "Tweet not found", "NOT_FOUND", 400);
    }

    return sendSuccess(res, tweet, "Tweet fetched", 200);
  } catch (error) {
    console.log("Tweet error: ", error);
    return sendError(res, "Unable to create tweet", "TWEET_ERROR", 500);
  }
});

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
      include: {
        user: {
          select: {
            image_url: true,
            first_name: true,
            last_name: true,
            id: true,
            handle: true,
          },
        },
      },
    });

    return sendSuccess(res, tweet, "Tweet created", 200);
  } catch (error) {
    console.log("Tweet error: ", error);
    return sendError(res, "Unable to create tweet", "TWEET_ERROR", 500);
  }
});

export { tweetRouter };
