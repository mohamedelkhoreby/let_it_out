import { userModel } from "../database/models/user.model.js";
import AppError from "../utils/app_error.js";

export const ensureUniqueUser = async ({ email, phoneNumber }) => {
  const user = await userModel.findOne({
    $or: [{ email }, { phoneNumber }],
  });

  if (!user) return;

  if (user.email === email) {
    throw new AppError("Email already in use", 409);
  }

  if (user.phoneNumber === phoneNumber) {
    throw new AppError("Phone number already in use", 409);
  }
};
