import { googleLoginService } from "./auth.service.js";

export const googleLoginController = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Google idToken is required",
      });
    }

    const { user, token } = await googleLoginService(idToken);

    res.status(200).json({
      message: "Google login successful",
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};
