import { OAuth2Client } from "google-auth-library";
import { userModel } from "../../database/models/user.model.js";
import { getNewLoginCredentials} from "../../utils/jwt.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginService = async (idToken) => {
  // 1️⃣ verify token مع Google
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { email, given_name, family_name, picture, sub } = payload;

  // 2️⃣ دور على اليوزر
  let user = await userModel.findOne({ email });

  // 3️⃣ لو مش موجود → create
  if (!user) {
    user = await userModel.create({
      firstname: given_name,
      lastname: family_name,
      email,
      googleId: sub,
      avatar: picture,
      provider: "google",
      emailVerifiedAt: new Date(),
    });
  }
  const { accessToken, refreshToken } = await getNewLoginCredentials(user);

 getNewLoginCredentials
  return {
    user,
    accessToken,
    refreshToken,
  };
};
