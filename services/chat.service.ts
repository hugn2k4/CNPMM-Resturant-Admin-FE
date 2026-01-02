import { ChatHistoryResponse, ConversationsResponse } from "@/types/chat";
import { chatApiClient } from "./chat-api-client";

export const chatService = {
  // Get all conversations for admin
  getAdminConversations: async (): Promise<ConversationsResponse> => {
    return chatApiClient.get<ConversationsResponse>("/chat/admin/conversations");
  },

  // Get chat history with a specific user
  getAdminUserChatHistory: async (userId: string): Promise<ChatHistoryResponse> => {
    return chatApiClient.get<ChatHistoryResponse>(`/chat/admin/conversation/${userId}`);
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]): Promise<void> => {
    return chatApiClient.post("/chat/mark-read", { messageIds });
  },
};
