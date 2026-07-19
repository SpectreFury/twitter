import { Router } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

const authRouter = Router();

authRouter.post("/google", async (req, res) => {
  try {
    const client_id = process.env.GOOGLE_CLIENT_ID!;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirect_uri = process.env.REDIRECT_URI!;
    const { code } = req.body;

    const tokenUrl = "https://oauth2.googleapis.com/token";
    const userInfoUrl = "https://www.googleapis.com/oauth2/v3/userinfo";

    const params = new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: "authorization_code",
    });

    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Unable to get access token");
    }

    const { access_token } = data;

    const infoResponse = await fetch(userInfoUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const infoData = await infoResponse.json();

    console.log("User data: ", infoData);

    // Add the user to DB if not already present

    let user = await prisma.user.findUnique({
      where: { sub: infoData.sub },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          first_name: infoData.given_name,
          last_name: infoData.family_name,
          sub: infoData.sub,
          email: infoData.email,
          image_url: infoData.picture,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { sub: infoData.sub },
        data: {
          first_name: infoData.given_name,
          last_name: infoData.family_name,
          email: infoData.email,
          image_url: infoData.picture,
        },
      });
    }

    const payload = {
      sub: infoData.sub,
      first_name: infoData.given_name,
      last_name: infoData.family_name,
      email: infoData.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Logged in",
      data: { token, ...payload },
    });
  } catch (error) {
    console.log("Login error: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Login error", error });
  }
});

export { authRouter };
