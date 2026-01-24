import Joi from "joi";
import { roleEnum, genderEnum } from "../utils/enums.js";

export const userFeild = {
  firstname: Joi.string()
    .min(2)
    .max(30)
    .pattern(/^[\p{L} ]+$/u),
  lastname: Joi.string()
    .min(2)
    .max(30)
    .pattern(/^[\p{L} ]+$/u),
  email: Joi.string().email({ tlds: { allow: false } }),
  password: Joi.string()
    .min(8)
    .pattern(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/
    )
    .messages({
      "string.min": "Password must be at least 8 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character",
    }),
  phoneNumber: Joi.string().pattern(new RegExp("^(\\+20|0)[0-9]{10}$")),
  gender: Joi.string().valid(genderEnum).required(),
  role: Joi.string().valid(roleEnum).required(),
};
