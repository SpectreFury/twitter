import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendError, sendSuccess } from "../lib/apiResponse.js";
import { Prisma } from "../generated/prisma/client.js";

const tweetRouter = Router();

// Should later return all the tweet feed for the home page, right now returning the user tweets
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

        likes: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },

        _count: {
          select: { likes: true, replies: true },
        },
      },
    });

    const formattedTweets = tweets.map((tweet) => ({
      ...tweet,
      isLiked: tweet.likes.length > 0,
      likeCount: tweet._count.likes,
      replyCount: tweet._count.replies,
    }));

    sendSuccess(res, formattedTweets, "Tweets fetched", 200);
  } catch (error) {}
});

// Should later return all the tweet feed for the home page, right now returning the user tweets
tweetRouter.get("/:username", authenticateToken, async (req: any, res) => {
  try {
    const sub = req.user.sub;
    const username = req.params.username;

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

        likes: {
          where: {
            userId: user.id,
          },
          select: {
            id: true,
          },
        },

        _count: {
          select: { likes: true, replies: true },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedTweets = tweets.map((tweet) => ({
      ...tweet,
      isLiked: tweet.likes.length > 0,
      likeCount: tweet._count.likes,
      replyCount: tweet._count.replies,
    }));

    sendSuccess(res, formattedTweets, "Tweets fetched", 200);
  } catch (error) {}
});

// Return individual tweet and all its replies
tweetRouter.get("/:username/:id", authenticateToken, async (req: any, res) => {
  try {
    const sub = req.user.sub;
    const { id, username } = req.params;

    const idNumber = Number(id);

    if (!Number.isInteger(idNumber) || idNumber < 1) {
      return sendError(res, "tweetId should be a Int", "MALFORMED_ID", 400);
    }

    const user = await prisma.user.findUnique({
      where: { sub },
      select: { id: true },
    });

    if (!user) {
      return sendError(res, "User not found", "USER_NOT_FOUND", 400);
    }

    const tweet = await prisma.tweet.findUnique({
      where: {
        id: idNumber,
        user: {
          handle: username,
        },
      },

      include: {
        replies: {
          include: {
            likes: {
              where: { userId: user.id },
              select: {
                id: true,
              },
            },

            user: {
              select: {
                image_url: true,
                first_name: true,
                last_name: true,
                id: true,
                handle: true,
              },
            },

            _count: {
              select: { likes: true, replies: true },
            },
          },
        },

        user: {
          select: {
            image_url: true,
            first_name: true,
            last_name: true,
            id: true,
            handle: true,
          },
        },

        likes: {
          where: { userId: user.id },
          select: { id: true },
        },

        _count: {
          select: { likes: true, replies: true },
        },
      },
    });

    if (!tweet) {
      return sendError(res, "Tweet not found", "NOT_FOUND", 400);
    }

    const { likes, _count, replies, ...restTweet } = tweet;

    const formattedTweet = {
      ...restTweet,
      isLiked: likes.length > 0,
      likeCount: _count.likes,
      replyCount: _count.replies,
      replies: replies.map(
        ({ likes: replyLikes, _count: replyCount, ...reply }) => ({
          ...reply,
          isLiked: replyLikes.length > 0,
          likeCount: replyCount.likes,
          replyCount: replyCount.replies,
        }),
      ),
    };

    return sendSuccess(res, formattedTweet, "Tweet fetched", 200);
  } catch (error) {
    console.log("Tweet error: ", error);
    return sendError(res, "Unable to create tweet", "TWEET_ERROR", 500);
  }
});

tweetRouter.post(
  "/:tweetId/likes",
  authenticateToken,
  async (req: any, res) => {
    try {
      const sub = req.user.sub;
      const tweetId = Number(req.params.tweetId);

      const user = await prisma.user.findUnique({
        where: {
          sub,
        },
      });

      if (!user) {
        return sendError(res, "No user found", "NOT_FOUND", 404);
      }

      const like = await prisma.like.create({
        data: {
          tweetId: tweetId,
          userId: user.id,
        },
      });

      return sendSuccess(res, like, "Like created", 201);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return sendError(
          res,
          "You have already liked this tweet",
          "ALREADY_LIKED",
          409,
        );
      }

      console.log("Tweet error: ", error);
      return sendError(res, "Unable to create tweet", "TWEET_ERROR", 500);
    }
  },
);

tweetRouter.delete(
  "/:tweetId/likes",
  authenticateToken,
  async (req: any, res) => {
    try {
      const sub = req.user.sub;
      const tweetId = Number(req.params.tweetId);

      const user = await prisma.user.findUnique({
        where: {
          sub,
        },
      });

      if (!user) {
        return sendError(res, "No user found", "NOT_FOUND", 404);
      }

      const like = await prisma.like.deleteMany({
        where: {
          tweetId: tweetId,
          userId: user.id,
        },
      });

      if (like.count === 0) {
        return sendError(res, "Like not found", "NOT_FOUND", 404);
      }

      return sendSuccess(res, null, "Like removed", 200);
    } catch (error) {
      console.log("Unlike error: ", error);
      return sendError(res, "Unable to remove like", "UNLIKE_ERROR", 500);
    }
  },
);

tweetRouter.post("/", authenticateToken, async (req: any, res) => {
  try {
    const sub = req.user.sub;
    const { content, parentTweetId } = req.body;

    if (!content) {
      return sendError(res, "Content is required for tweet", "NO_CONTENT", 400);
    }

    const user = await prisma.user.findUnique({
      where: {
        sub,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      return sendError(res, "User not found", "NO_USER", 400);
    }

    const tweet = await prisma.tweet.create({
      data: {
        content,
        userId: user.id,
        parentTweetId: Number(parentTweetId) || null,
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

    return sendSuccess(res, tweet, "Tweet created", 201);
  } catch (error) {
    console.log("Tweet error: ", error);
    return sendError(res, "Unable to create tweet", "TWEET_ERROR", 500);
  }
});

export { tweetRouter };
