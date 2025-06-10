
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date; // Frontend uses Date objects
  isLoading?: boolean;
}

// Type for messages when communicating with the API (timestamps as ISO strings)
export interface ApiChatMessage {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // API uses ISO string timestamps
}

export interface UserProfile {
  id: string; // Firebase UID
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export interface ConversationHistoryItem {
  id: string; // conversationId
  title: string;
  // lastActivity?: Date; // Optional: if your API provides this
  // messageCount?: number; // Optional: if your API provides this
}
