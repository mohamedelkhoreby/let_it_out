import Joi from "joi";
import { userFeild } from "../../validators/common.schema.js";

export const createUserSchema = {
  body: Joi.object({
    firstname: userFeild.firstname.required(),
    lastname: userFeild.lastname.required(),
    phoneNumber: userFeild.phoneNumber.required(),
    email: userFeild.email.required(),
    password: userFeild.password.required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")),
  }).with("password", "confirmPassword"),
};

export const updateUserSchema = {
  body: Joi.object({
    firstname: userFeild.firstname,
    lastname: userFeild.lastname,
    email: userFeild.email,
    password: userFeild.password,
    confirmPassword: Joi.valid(Joi.ref("password")).required(),
  }).with("password", "confirmPassword"),
};

export const loginUserSchema = {
  body: Joi.object({
    email: userFeild.email.required(),
    password: userFeild.password.required(),
  }),
};

export const sendEmailSchema = {
  body: Joi.object({
    email: userFeild.email.required(),
  }),
};

export const changePasswordSchema = {
  body: Joi.object({
    currentPassword: userFeild.password.required(),
    newPassword: userFeild.password.required(),
    confirmPassword: Joi.valid(Joi.ref("password")).required(),
  }).with("newPassword", "confirmNewPassword"),
};

export const resetPasswordSchema = {
  body: Joi.object({
    email: userFeild.email.required(),
  }),
};

export const setNewPasswordSchema = {
  body: Joi.object({
    newPassword: userFeild.password.required(),
    confirmPassword: Joi.valid(Joi.ref("password")).required(),
  }).with("newPassword", "confirmNewPassword"),
};
