
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import type { ChatMessage } from '@/lib/types';
import { MessageInput } from '@/components/chat/MessageInput';
import { ChatMessageDisplay } from '@/components/chat/ChatMessage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  createOrUpdateConversation,
  getFullConversation,
  generateChatResponse
} from '@/lib/chatApi';
import { getCurrentUserId } from '@/lib/firebaseAuth'; // Using placeholder

// Static suggested prompts as API doesn't provide them
const staticSuggestedPrompts: string[] = [
  "Quels sont les risques de phishing courants ?",
  "Comment puis-je sécuriser mon réseau Wi-Fi domestique ?",
  "Expliquez l'authentification à deux facteurs.",
  "Qu'est-ce qu'un ransomware et comment s'en protéger ?"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, []);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Effect to load conversation based on URL or start new
  useEffect(() => {
    async function loadConversation() {
      const conversationIdFromUrl = searchParams.get('id');
      const userId = await getCurrentUserId();

      if (!userId) {
        toast({ title: "Not Authenticated", description: "Please log in to use the chat.", variant: "destructive" });
        router.push('/auth'); // Redirect to login if no user
        return;
      }

      if (conversationIdFromUrl) {
        if (conversationIdFromUrl === currentConversationId) return; // Already loaded

        setIsLoading(true);
        try {
          const fetchedMessages = await getFullConversation(conversationIdFromUrl);
          setMessages(fetchedMessages);
          setCurrentConversationId(conversationIdFromUrl);
        } catch (error) {
          console.error('Error loading conversation:', error);
          toast({
            title: "Error Loading Chat",
            description: (error as Error).message || "Could not load the selected conversation.",
            variant: "destructive",
          });
          setMessages([]); // Clear messages on error
          setCurrentConversationId(null);
          router.replace('/chat'); // Go to new chat state
        } finally {
          setIsLoading(false);
        }
      } else {
        // New chat if no ID in URL
        setMessages([]);
        setCurrentConversationId(null);
      }
    }
    loadConversation();
  }, [searchParams, toast, router, currentConversationId]);


  const handleSendMessage = async (text: string) => {
    const userId = await getCurrentUserId();
    if (!userId) {
      toast({ title: "Not Authenticated", description: "Please log in to send messages.", variant: "destructive" });
      router.push('/auth');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    const loadingBotMessage: ChatMessage = {
      id: `bot-loading-${Date.now()}`,
      text: 'Thinking...',
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingBotMessage]);

    try {
      const botResponseText = await generateChatResponse(text, updatedMessages.slice(0, -1)); // Exclude loading message from context
      
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(prev => prev.map(m => m.id === loadingBotMessage.id ? botMessage : m));

      // Save conversation
      try {
        const savedConvo = await createOrUpdateConversation(currentConversationId, finalMessages);
        if (!currentConversationId) {
          setCurrentConversationId(savedConvo.conversationId);
          // Update URL to reflect new conversation ID without full page reload
          router.replace(`/chat?id=${savedConvo.conversationId}`, { scroll: false });
        }
      } catch (saveError) {
        console.error('Error saving conversation:', saveError);
        toast({
          title: "Error Saving Chat",
          description: (saveError as Error).message || "Could not save the conversation. Your messages are not persisted.",
          variant: "destructive",
        });
      }

    } catch (error) {
      console.error('Error getting answer:', error);
      const errorMessageText = (error as Error).message || 'Sorry, I encountered an error trying to respond.';
      const errorMessage: ChatMessage = {
        id: `bot-error-${Date.now()}`,
        text: errorMessageText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => prev.map(m => m.id === loadingBotMessage.id ? errorMessage : m));
       toast({
          title: "AI Error",
          description: errorMessageText,
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
      // Ensure scrollToBottom is called after state updates are likely processed
      setTimeout(scrollToBottom, 0);
    }
  };

  const handleSuggestedPromptClick = (promptText: string) => {
    handleSendMessage(promptText);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-var(--header-height,0px))]">
      <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
        <div className="max-w-3xl mx-auto space-y-2">
          {messages.length === 0 && !isLoading && (
            <div className="text-center py-10">
              <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome to Securibot!</h2>
              <p className="text-muted-foreground mb-6">Ask me anything about cybersecurity, or pick a suggestion.</p>
              {staticSuggestedPrompts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {staticSuggestedPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto text-left py-3"
                      onClick={() => handleSuggestedPromptClick(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessageDisplay key={msg.id} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
