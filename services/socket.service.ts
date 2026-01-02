import { io, Socket } from "socket.io-client";

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(data: unknown) => void>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) {
      return;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

    this.socket = io(socketUrl, {
      auth: {
        token,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      withCredentials: true,
    });

    this.socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });

    // Admin specific events
    this.socket.on("chat:new_user_message", (data) => {
      this.emitToListeners("chat:new_user_message", data);
    });

    this.socket.on("chat:message_sent", (data) => {
      this.emitToListeners("chat:message_sent", data);
    });

    this.socket.on("chat:user_typing", (data) => {
      this.emitToListeners("chat:user_typing", data);
    });

    this.socket.on("chat:error", (data) => {
      this.emitToListeners("chat:error", data);
      console.error("[Socket] Chat error:", data);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  on(event: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  off(event: string, callback: (data: unknown) => void) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event: string, data: unknown) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  private emitToListeners(event: string, data: unknown) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}

export const socketService = new SocketService();
