import mongoose, { Schema } from "mongoose";
import { roleEnum, genderEnum, authProviderEnum } from "../../utils/enums.js";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "First name must be at least 3 characters long"],
      maxlength: [30, "First name cannot exceed 30 characters"],
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
      maxlength: [30, "Last name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === authProviderEnum.local;
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: "Gender must be either 'male' or 'female'",
      },
      default: genderEnum.male,
    },
    phoneNumber: {
      type: String,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: "Role must be either 'user' or 'admin'",
      },
      default: roleEnum.user,
    },
    refreshToken: {
      type: String,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    googleId: {
      type: String,
      index: true,
    },
    avatar: {
      type: String,
    },
    freezeUser: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: Object.values(authProviderEnum),
      default: authProviderEnum.local,
    },
    tokensInvalidBefore: {
      type: Date,
      default: new Date(0), 
    },
  },

  { timestamps: true },
);

userSchema.pre(/^find/, async function () {
  if (!this.getOptions().includeDeleted) {
    this.where({ freezeUser: { $ne: true } });
  }
});

export const userModel =
  mongoose.models.User || mongoose.model("User", userSchema);
