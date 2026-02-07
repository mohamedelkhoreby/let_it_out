import * as dbMessagesServices from "../../database/services/db_message_service.js";
import * as dbServices from "../../database/services/db_service.js";
import { conversationModel } from "../../models/conversation.model.js";

export const createConversation = async (participantIds) => {
  const conversation = await dbServices.create({
    model: conversationModel,
    data: {
      participants: participantIds,
    },
  });
  return conversation;
};

export const deleteConversation = async (conversationId) => {
  const conversation = await dbServices.deleteOne({
    model: conversationModel,
    filter: { _id: conversationId },
  });
  return conversation;
};

export const getUserUnreadConversations = async (userId) => {
  const getConversations =
    await dbMessagesServices.getUserAndUnreadConversations(
      userId,
      conversationModel,
    );
  return getConversations;
};
