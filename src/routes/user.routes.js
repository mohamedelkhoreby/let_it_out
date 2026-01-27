import { Router } from "express";
import {
  register,
  login,
  logout,
  sendEmailOTPController,
  verifyEmailOTPController,
  resendEmailOTPController,
  removeUser,
  freezeUser,
  update,
  uplodaAvatarController,
} from "../modules/user/user.controller.js";
import { authenticate } from "../middleware/authentication.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { googleLoginController } from "../modules/auth/auth.controller.js";
import { validate } from "../middleware/validtation/validtation.middleware.js";
import { requireVerifiedEmail } from "../middleware/verified.middleware.js";
import { resizeAvatar } from "../middleware/image/resize.avatar.middleware.js";
import { validateImageContent } from "../middleware/image/validate.image.middleware.js";
import {
  createUserSchema,
  loginUserSchema,
  sendEmailSchema,
} from "../modules/user/user.validtation.js";
import { localFileUpload } from "../utils/multer/local.multer.js";
const router = Router();

router.post("/register", validate(createUserSchema), register);

router.post("/login", validate(loginUserSchema), login);

router.post("/logout", authenticate, logout);

router.post("/sendEmailOtp", validate(sendEmailSchema), sendEmailOTPController);

router.patch("/verifyOtp", verifyEmailOTPController);

router.post(
  "/resend-email-otp",
  validate(sendEmailSchema),
  resendEmailOTPController,
);

router.post("/update", authenticate, requireVerifiedEmail, update);

router.delete("/hard-delete", authenticate, authorize("admin"), removeUser);

router.delete("/soft-delete", authenticate, freezeUser);

router.patch(
  "/upload-avatar",
  authenticate,
  requireVerifiedEmail,
  localFileUpload({ customPath: "users" }),
  validateImageContent,
  resizeAvatar,
  uplodaAvatarController,
);

router.post("/google", googleLoginController);

export default router;
