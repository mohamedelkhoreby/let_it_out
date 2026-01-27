import { userModel } from "../../database/models/user.model.js";
import { tokenModel } from "../../database/models/token.model.js";
import * as dbServices from "../../database/services/db_service.js";
import bcrypt from "bcrypt";
import {
  getNewLoginCredentials,
  verifyToken,
  generateToken,
} from "../../utils/jwt.js";
import { verifyOTP } from "../../utils/otp.js";
import { ensureUniqueUser } from "../../utils/helper.js";
import AppError from "../../utils/app_error.js";

export const createUser = async ({
  firstname,
  lastname,
  email,
  gender,
  password,
  phoneNumber,
  role,
}) => {
  await ensureUniqueUser({ email, phoneNumber });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await dbServices.create({
    data: {
      firstname,
      lastname,
      email,
      gender,
      password: hashedPassword,
      phoneNumber,
      role: role,
    },
    options: { new: true, runValidators: true },
    model: userModel,
  });

  const { accessToken, refreshToken } = await getNewLoginCredentials(user);

  const userObject = user.toObject();
  delete userObject.password;

  return { user: userObject, refreshToken, accessToken };
};

export const verifyEmailOTPService = async ({ email, otp }) => {
  const verifyEmailOTPService = await verifyOTP({
    identifier: email,
    otp,
    purpose: "email_verification",
  });
  if (!verifyEmailOTPService) {
    throw new AppError("otp not correct");
  }
  const updatedUser = await userModel.findOneAndUpdate(
    { email },
    { confirmEmail: true, emailVerifiedAt: new Date() },
    { new: true },
  );

  if (!updatedUser) {
    throw new AppError("Invalid credentials");
  }

  return updatedUser;
};

export const login = async (email, password) => {
  const user = await dbServices.findByEmail({ model: userModel, email });

  if (!user) {
    throw new AppError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials");
  }

  const { accessToken, refreshToken } = await getNewLoginCredentials(user);
  if (!accessToken || !refreshToken) {
    throw new AppError("Token generation failed");
  }

  if (!user.confirmEmail) {
    throw new AppError("Email not verified");
  }

  const userObject = user.toObject();
  delete userObject.password;

  return {
    user: userObject,
    accessToken,
    refreshToken,
  };
};

export const logoutService = async (user, decoded) => {
  try {
    const token = await tokenModel.create({
      jti: decoded.jti,
      userId: user.id,
      revoked: true,
      expiresAt: new Date(decoded.exp * 1000),
    });
  } catch (error) {
throw new AppError("Logout failed");
  }
  return true;
};

export const updateUser = async (user, updateData) => {
  const allowedFields = ["firstname", "lastname", "phoneNumber", "avatar"];
  const safeData = {};

  if (!user.confirmEmail) {
    throw new AppError("Email verification required");
  }

  for (const key of allowedFields) {
    if (updateData[key] !== undefined) safeData[key] = updateData[key];
  }

  Object.assign(user, safeData);
  await user.save();

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

export const refreshTokens = async (token) => {
  try {
    const decoded = verifyToken(token, process.env.JWT_REFRESH_SECRET);
    if (!decoded) throw new AppError("Invalid token");

    const user = await dbServices.findById({
      model: userModel,
      id: decoded.id,
    });

    if (!user || user.refreshToken !== token) {
      throw new AppError("Invalid token");
    }

    const { accessToken } = generateToken(
      { id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
        jwtid: jti,
      },
    );

    return accessToken;
  } catch (err) {
    return null;
  }
};

export const findByEmail = async (email) => {
  return await dbServices.findByEmail({ model: userModel, email });
};

export const softDeleteUser = async (_id, password) => {
  const user = await dbServices.findById({
    model: userModel,
    id: _id,
  });

  if (!user) {
    throw new AppError("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials");
  }
  const updatedUser = await dbServices.findByIdAndUpdate({
    id: _id,
    updateData: { freezeUser: true },
    options: { new: true },
    model: userModel,
  });

  if (!updatedUser) {
    throw new AppError("Invalid credentials");
  }

  return updatedUser;
};

export const hardDeleteUser = async (_id, password) => {
  const user = await dbServices.findById({
    model: userModel,
    id: _id,
  });

  if (!user || user.freezeUser) {
    throw new AppError("Invalid credentials");
  }

  if (!user.confirmEmail) {
    throw new AppError("Email verification required");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials");
  }

  await dbServices.findByIdAndDelete({
    model: userModel,
    id: _id,
  });

  return true;
};
export const logoutAllService = async (userId) => {
  await userModel.findByIdAndUpdate(userId, {
    tokensInvalidBefore: new Date(),
  });
};
