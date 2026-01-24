import * as userService from "./user.service.js";
import { responseHandler } from "../../utils/response.js";
import { sendOTP } from "../../utils/otp.js";
import { asyncHandler } from "../../utils/async_handler.js";
import { sendEmail } from "../../utils/email.js";

export const register = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, phoneNumber, gender, password, role } =
    req.body;

  const { user, accessToken, refreshToken } = await userService.createUser({
    firstname,
    lastname,
    email,
    phoneNumber,
    gender,
    password,
    role,
  });
  if (!user) {
    return res.status(400).json({ message: "Email already in use" });
  }
  responseHandler(res, 201, "User created successfully", {
    user,
    accessToken,
    refreshToken,
  });
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userService.login(email, password);

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }
  responseHandler(res, 200, "Login successful", user);
});

export const logout = asyncHandler(async (req, res) => {
  await userService.logoutService(req.user, req.token);
  responseHandler(res, 200, "Logout successful");
});

export const sendEmailOTPController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userService.findByEmail(email);
  if (!user) return res.status(404).json({ message: "Invalid credentials" });

  if (user.confirmEmail) {
    return res.status(400).json({ message: "Email already verified" });
  }

  const otp = await sendOTP({
    identifier: email,
    purpose: "email_verification",
  });

  await sendEmail({
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
  });

  responseHandler(res, 200, "OTP sent successfully");
});

export const verifyEmailOTPController = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await userService.verifyEmailOTPService({ email, otp });
  if (!user) {
    return res.status(400).json({ message: "OTP verification failed" });
  }

  responseHandler(res, 200, "Email verified successfully!", user);
});

export const resendEmailOTPController = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await userService.findByEmail(email);

  const otp = await sendOTP({
    identifier: email,
    purpose: "email_verification",
  });

  await sendEmail({
    to: email,
    subject: "Your OTP for Email Verification (Resend)",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
  });

  responseHandler(res, 200, "If the email exists, OTP sent successfully");
});

export const refreshTokenController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing or malformed",
    });
  }

  const newAccessToken = await userService.refreshTokens(refreshToken);

  if (!newAccessToken) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  responseHandler(res, 200, "Token is refreshed", {
    accessToken: newAccessToken,
  });
});

export const update = asyncHandler(async (req, res) => {
  const { firstname, lastname, phoneNumber } = req.body;
  if (!req.user) {
    return res.status(401).json({
      message: "expired token or user not found",
    });
  }

  const updatedUser = await userService.updateUser(req.user, {
    firstname,
    lastname,
    phoneNumber,
  });

  if (!updatedUser) {
    return res.status(401).json({
      message: "expired token or user not found",
    });
  }
  responseHandler(res, 200, "User updated successfully", updatedUser);
});

export const removeUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);
  responseHandler(res, 200, "Delete successful");
});

export const freezeUser = asyncHandler(async (req, res) => {
  await userService.softDeleteUser(req.user._id, req.body.password);
  responseHandler(res, 200, "User frozen successfully");
});
