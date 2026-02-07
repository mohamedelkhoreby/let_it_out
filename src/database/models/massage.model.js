import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },

    attachment: {
      secureUrl: String,
      publicId: String,
      size: Number,
      mimeType: String,
    },

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

messageSchema.index({ conversation: 1 });
messageSchema.index({ readBy: 1 });

export const messageModel =
  mongoose.models.Message || mongoose.model("Message", messageSchema);
