export const requireVerifiedEmail = (req, res, next) => {
  if (!req.user.confirmEmail) {
    return res.status(403).json({
      message: "Email verification required",
    });
    console.log(` User found: ${req.user}From verified middleware`);
  }

  next();
};