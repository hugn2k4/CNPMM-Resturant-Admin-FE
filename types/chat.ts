// Chat types for Admin
export interface ChatMessage {
  _id: string;
  userId: string;
  message: string;
  senderType: "user" | "admin";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  userId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  user: {
    _id: string;
    fullName: string;
    email: string;
    avatar?: string;
  };
}

export interface ChatHistoryResponse {
  statusCode: number;
  message: string;
  data: ChatMessage[];
}

export interface ConversationsResponse {
  statusCode: number;
  message: string;
  data: Conversation[];
}
