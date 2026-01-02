"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { chatService } from "@/services/chat.service";
import { socketService } from "@/services/socket.service";
import { ChatMessage, Conversation } from "@/types/chat";
import { Loader2, MessageCircle, Send, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TempChatMessage extends ChatMessage {
  tempId?: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!socketService.isConnected()) {
      socketService.connect(token);
    }

    // Listen for new messages from users
    const handleNewUserMessage = (data: unknown) => {
      const msgData = data as { message: ChatMessage; userId: string };
      console.log("[AdminChat] New user message received:", msgData);

      // Update conversation list
      void loadConversations();

      // If this is the selected user, add to messages
      if (msgData.userId === selectedUserId) {
        setMessages((prev) => [...prev, msgData.message]);
      }
    };

    // Listen for admin message sent confirmation
    const handleMessageSent = (data: unknown) => {
      const msgData = data as { message: ChatMessage; tempId?: string };
      setMessages((prev) => {
        // Replace temporary message or add new
        if (msgData.tempId) {
          return prev.map((msg) =>
            "tempId" in msg && (msg as TempChatMessage).tempId === msgData.tempId ? msgData.message : msg
          );
        }
        return [...prev, msgData.message];
      });
    };

    // Listen for user typing indicator
    const handleUserTyping = (data: unknown) => {
      const typingData = data as { userId: string; isTyping: boolean };
      if (typingData.userId === selectedUserId) {
        setIsTyping(typingData.isTyping);
      }
    };

    socketService.on("chat:new_user_message", handleNewUserMessage);
    socketService.on("chat:message_sent", handleMessageSent);
    socketService.on("chat:user_typing", handleUserTyping);

    return () => {
      socketService.off("chat:new_user_message", handleNewUserMessage);
      socketService.off("chat:message_sent", handleMessageSent);
      socketService.off("chat:user_typing", handleUserTyping);
    };
  }, [selectedUserId]);

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      void loadUserMessages(selectedUserId);
    }
  }, [selectedUserId]);

  const loadConversations = async () => {
    try {
      const response = await chatService.getAdminConversations();
      // Sort by unread count first, then by time
      const sorted = (response.data || []).sort((a: Conversation, b: Conversation) => {
        if (b.unreadCount !== a.unreadCount) {
          return b.unreadCount - a.unreadCount;
        }
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
      });
      setConversations(sorted);

      // Calculate total unread
      const total = sorted.reduce((sum: number, conv: Conversation) => sum + conv.unreadCount, 0);
      setTotalUnread(total);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tải cuộc hội thoại");
    }
  };

  const loadUserMessages = async (targetUserId: string) => {
    try {
      setIsLoading(true);
      const response = await chatService.getAdminUserChatHistory(targetUserId);
      setMessages(response.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tải tin nhắn");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedUserId || !socketService.isConnected()) return;

    const tempId = `temp_${Date.now()}`;

    // Optimistically add message
    const tempMessage: TempChatMessage = {
      _id: tempId,
      tempId,
      userId: selectedUserId,
      message: newMessage.trim(),
      senderType: "admin",
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    socketService.emit("chat:admin_send_message", {
      message: newMessage.trim(),
      targetUserId: selectedUserId,
      tempId,
    });

    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedConversation = conversations.find((c) => c.userId === selectedUserId);

  return (
    <div className="space-y-6">
      <PageHeader title="Quản lý chat" description="Chat với khách hàng, hỗ trợ trực tuyến" showSearch={false} />

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="flex flex-col">
          <div className="p-4 border-b bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Cuộc hội thoại</h3>
              </div>
              {totalUnread > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {totalUnread}
                </Badge>
              )}
            </div>
          </div>

          <ScrollArea className="flex-1">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Chưa có cuộc hội thoại</p>
                <p className="text-xs mt-1">Đợi khách hàng gửi tin nhắn</p>
              </div>
            ) : (
              <div className="p-2 space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedUserId(conv.userId)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-colors",
                      "hover:bg-accent",
                      selectedUserId === conv.userId
                        ? "bg-accent border border-primary/20"
                        : "border border-transparent"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="h-11 w-11 shrink-0 border-2 border-white shadow-md">
                          <AvatarFallback className="bg-gradient-to-br from-orange-400 to-pink-500 text-white font-semibold text-base">
                            {conv.user?.fullName?.[0] || conv.user?.email?.[0] || "?"}
                          </AvatarFallback>
                        </Avatar>
                        {/* Online status indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-sm truncate">
                            {conv.user?.fullName || conv.user?.email || "Khách hàng"}
                          </p>
                          {conv.unreadCount > 0 && (
                            <Badge variant="destructive" className="ml-2 shrink-0">
                              {conv.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {conv.lastMessage || "Chưa có tin nhắn"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{formatTime(conv.lastMessageTime)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col">
          {selectedUserId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b">
                {selectedConversation && (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-lg">
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white font-bold text-lg">
                          {selectedConversation.user?.fullName?.[0] || selectedConversation.user?.email?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online status indicator */}
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {selectedConversation.user?.fullName || selectedConversation.user?.email || "Khách hàng"}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedConversation.user?.email || ""}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mb-3 opacity-50" />
                    <p className="text-sm">Chưa có tin nhắn</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={cn("flex", msg.senderType === "admin" ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[70%] rounded-lg p-3",
                            msg.senderType === "admin" ? "bg-primary text-primary-foreground" : "bg-accent"
                          )}
                        >
                          <p className="text-sm break-words">{msg.message}</p>
                          <p
                            className={cn(
                              "text-xs mt-1",
                              msg.senderType === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}
                          >
                            {formatTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-accent rounded-lg p-3">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={!socketService.isConnected()}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !socketService.isConnected()}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageCircle className="h-16 w-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">Chọn một cuộc hội thoại</p>
              <p className="text-sm mt-1">Chọn khách hàng để bắt đầu chat</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
