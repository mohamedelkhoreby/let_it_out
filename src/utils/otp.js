import { customAlphabet } from "nanoid";
import bcrypt from "bcrypt";
import { otpModel } from "../database/models/otp.model.js";

const generateOTP = customAlphabet("0123456789", 6);

export const createOTP = () => generateOTP();

export const hashOTP = async (otp) => {
  return await bcrypt.hash(otp, 10);
};

export const compareOTP = async (otp, hashedOTP) => {
  return await bcrypt.compare(otp, hashedOTP);
};

export const sendOTP = async ({ identifier, purpose }) => {
  const otp = createOTP();
  const hashedOTP = await hashOTP(otp);

  await otpModel.create({
    identifier,
    otp: hashedOTP,
    purpose,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
  });

  return otp;
};

export const verifyOTP = async ({ identifier, otp, purpose }) => {
  const record = await otpModel.findOne({
    identifier,
    purpose,
    verified: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!record) {
    throw new Error("OTP expired or invalid");
  }

  const isValid = await compareOTP(otp, record.otp);
  if (!isValid) {
    throw new Error("Invalid OTP");
  }

  record.verified = true;
  await record.save();

  return true;
};
