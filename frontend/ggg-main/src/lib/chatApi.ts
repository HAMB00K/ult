
import type { ChatMessage, ConversationHistoryItem, ApiChatMessage } from './types';
import { getUserIdToken, getCurrentUserId } from './firebaseAuth'; // Using real auth functions

const API_BASE_URL = '/api';

// The fetchWithAuth helper function is removed.

interface CreateOrUpdateConvoPayload {
  uid: string;
  conversationData: [
    { conversationId?: string | null },
    { conversation: { messages: ApiChatMessage[] } }
  ];
}

interface CreateOrUpdateConvoResponse {
  status: string;
  conversationId: string;
}

export async function createOrUpdateConversation(
  conversationId: string | null,
  messages: ChatMessage[]
): Promise<CreateOrUpdateConvoResponse> {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error('UID not found. User might not be logged in.');

  const apiMessages: ApiChatMessage[] = messages.map(msg => ({
    sender: msg.sender,
    text: msg.text,
    timestamp: msg.timestamp.toISOString(),
  }));

  const payload: CreateOrUpdateConvoPayload = {
    uid,
    conversationData: [
      { conversationId: conversationId },
      { conversation: { messages: apiMessages } },
    ],
  };

  const token = await getUserIdToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/currentConvo`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("API Error (createOrUpdateConversation):", errorData);
    throw new Error(`Failed to save conversation: ${response.status} ${errorData || response.statusText}`);
  }
  try {
    return await response.json();
  } catch (e) {
    console.error("Failed to parse JSON from createOrUpdateConversation", e);
    throw new Error("Failed to parse server response for saving conversation.");
  }
}

interface GetUserConvosResponse {
  conversations: ConversationHistoryItem[];
}

export async function getUserConversations(): Promise<ConversationHistoryItem[]> {
  const uid = await getCurrentUserId();
  if (!uid) return []; // Return empty if no user, or throw new Error('UID not found');

  const token = await getUserIdToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/getUserConvos`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ uid }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("API Error (getUserConversations):", errorData);
    throw new Error(`Failed to fetch user conversations: ${response.status} ${errorData || response.statusText}`);
  }
  try {
    const data: GetUserConvosResponse = await response.json();
    return data.conversations || [];
  } catch (e) {
    console.error("Failed to parse JSON from getUserConversations", e);
    throw new Error("Failed to parse server response for user conversations.");
  }
}

interface GetFullConvoResponse {
  conversation: { messages: ApiChatMessage[] };
}

export async function getFullConversation(conversationId: string): Promise<ChatMessage[]> {
  const uid = await getCurrentUserId();
  if (!uid) throw new Error('UID not found. User might not be logged in.');

  const token = await getUserIdToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/getFullConvo`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({ uid, conversationId }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("API Error (getFullConversation):", errorData);
    throw new Error(`Failed to fetch full conversation: ${response.status} ${errorData || response.statusText}`);
  }
  try {
    const data: GetFullConvoResponse = await response.json();
    if (data.conversation && Array.isArray(data.conversation.messages)) {
      return data.conversation.messages.map((msg, index) => ({
        id: `${conversationId}-msg-${index}-${new Date(msg.timestamp).getTime()}`,
        text: msg.text,
        sender: msg.sender,
        timestamp: new Date(msg.timestamp),
      }));
    }
    return [];
  } catch (e) {
    console.error("Failed to parse JSON from getFullConversation", e);
    throw new Error("Failed to parse server response for full conversation.");
  }
}

interface GenerateResponsePayload {
  prompt: string;
  context: ApiChatMessage[];
}

interface GenerateApiResponse {
  response: {
    role: 'assistant';
    content: Array<{ type: 'text'; text: string }>;
  };
}

export async function generateChatResponse(prompt: string, context: ChatMessage[]): Promise<string> {
  const apiContext: ApiChatMessage[] = context.map(msg => ({
    sender: msg.sender,
    text: msg.text,
    timestamp: msg.timestamp.toISOString(),
  }));

  const payload: GenerateResponsePayload = { prompt, context: apiContext };

  const token = await getUserIdToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}/generate`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("API Error (generateChatResponse):", errorData);
    throw new Error(`Failed to generate response: ${response.status} ${errorData || response.statusText}`);
  }
  try {
    const data: GenerateApiResponse = await response.json();
    if (data.response && data.response.content && data.response.content.length > 0 && data.response.content[0].type === 'text') {
      return data.response.content[0].text;
    }
    console.error("Invalid response format from generate API:", data);
    throw new Error('Invalid response format from generate API');
  } catch (e) {
    console.error("Failed to parse JSON from generateChatResponse", e);
    throw new Error("Failed to parse server response for chat generation.");
  }
}
