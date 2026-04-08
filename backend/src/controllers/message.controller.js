import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';

import { updateConversationAfterCreateMessage } from '../utils/messageHelper.js';
export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;
    const senderId = req.user.id; // Assuming you have user authentication in place

    let conversation;
    if (!content) {
      return res.status(400).json({ message: "Thiếu nội dung tin nhắn" });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }
    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() }
        ],
        lastMessageAt: new Date(),
        unreadCounts: new Map()
      })
    }

    // Cập nhật số lượng tin nhắn chưa đọc cho người nhận
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({ message: "Tin nhắn đã được gửi", message: message });

  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn trực tiếp:', error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
}
export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user.id; // Assuming you have user authentication in place
    const conversation = req.conversation; // Conversation đã được middleware checkGroupMembership kiểm tra và gắn vào req

    if (!content) {
      return res.status(400).json({ message: "Thiếu nội dung tin nhắn" });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);
    await conversation.save();

    return res.status(201).json({ message: "Tin nhắn đã được gửi", message: message });

  } catch (error) {
    console.error('Lỗi sảy ra khi gửi tin nhắn nhóm:', error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
}