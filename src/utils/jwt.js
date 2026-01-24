import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

export const generateToken = ({payload={}, secretOrPrivateKey, options={}}) => {
  return jwt.sign(payload, secretOrPrivateKey, options);
};

export const verifyToken = (token, secret) => jwt.verify(token, secret);

export const getNewLoginCredentials = async (user) => {
  const jwtid = nanoid();

  const accessToken = generateToken({
    payload: { id: user._id, role: user.role },
    secretOrPrivateKey: process.env.JWT_ACCESS_SECRET,
    options: {
      expiresIn: "15m",
      jwtid,
    },
  });
  
  const refreshToken = generateToken({
    payload: { id: user._id, role: user.role },
    secretOrPrivateKey: process.env.JWT_REFRESH_SECRET,
    options: {
      expiresIn: "7d",
      jwtid,
    },
  });

  return { accessToken, refreshToken };
};

export const decodedToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new Error("Authorization header missing");
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);

  if (!decoded) {
    throw new Error("Invalid or expired token");
  }

  return decoded;
};