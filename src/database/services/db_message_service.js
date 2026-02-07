export const getUserAndUnreadConversations = async (userId, model) => {
  return await model.aggregate([
    {
      $match: {
        participants: userId,
      },
    },

    //احسب عدد الرسائل غير المقروءة
    {
      $lookup: {
        from: "messages",
        let: { convId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$conversation", "$$convId"] },
                  { $not: { $in: [userId, "$readBy"] } },
                ],
              },
            },
          },
          {
            $count: "count",
          },
        ],
        // هتنفذ ال lookup و هتحط النتيجة في مصفوفة اسمها unread
        as: "unread",
      },
    },

    //طلع unreadCount رقم مباشر
    {
      $addFields: {
        unreadCount: {
          $ifNull: [{ $arrayElemAt: ["$unread.count", 0] }, 0],
        },
      },
    },
    // 0  تعني شيل ال unread من المصفوفه
    {
      $project: {
        unread: 0,
      },
    },
  ]);
};
