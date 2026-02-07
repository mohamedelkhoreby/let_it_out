import mongoose from "mongoose";
import * as dbServices from "../../database/services/db_service.js";
import { conversationModel } from "../../models/conversation.model.js";
import { messageModel } from "../../models/message.model.js";
import AppError from "../../utils/app_error.js";

export const sendMessage = async (
  conversationId,
  senderId,
  content,
  type = "text",
  attachment,
) => {
  const session = await dbServices.startSession();
  session.startTransaction();

  try {
    const conversation = await dbServices.findOne({
      model: conversationModel,
      filter: { _id: conversationId },
      session,
    });

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const isParticipant = conversation.participants
      .map((id) => id.toString())
      .includes(senderId.toString());

    if (!isParticipant) {
      throw new AppError(
        "Sender is not a participant of the conversation",
        403,
      );
    }

    const message = await dbServices.create({
      model: messageModel,
      data: {
        conversation: conversationId,
        sender: senderId,
        content,
        type,
        attachment: attachment || null,
      },
      session,
    });

    await dbServices.updateOne({
      model: conversationModel,
      filter: { _id: conversationId },
      data: {
        lastMessage: message._id,
      },
      session,
    });

    await session.commitTransaction();
    session.endSession();

    return message;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(error.message, 500);
  }
};

export const getNewMessages = async (conversationId, since) => {
  return await messageModel
    .find({
      conversation: conversationId,
      createdAt: { $gt: new Date(since) },
    })
    .sort({ createdAt: 1 });
};

export const markMessagesAsRead = async (conversationId, userId) => {
  await messageModel.updateMany(
    {
      conversation: conversationId,
      sender: { $ne: userId },
      readBy: { $ne: userId },
    },
    {
      $addToSet: { readBy: userId },
    },
  );
};

export const countUnreadMessages = async (conversationId, userId) => {
  return await messageModel.countDocuments({
    conversation: conversationId,
    sender: { $ne: userId },
    readBy: { $ne: userId },
  });
};

