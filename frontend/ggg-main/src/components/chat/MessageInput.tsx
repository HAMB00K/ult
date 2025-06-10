'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizonal, Mic } from 'lucide-react'; // Paperclip retiré, Mic ajouté
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast'; // Ajout de useToast

interface MessageInputProps {
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
}

export function MessageInput({ onSendMessage, isLoading }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { toast } = useToast(); // Initialisation de useToast

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleMicClick = () => {
    // Placeholder pour la fonctionnalité microphone
    toast({
      title: "Fonctionnalité à venir",
      description: "L'enregistrement par microphone n'est pas encore implémenté.",
      duration: 3000,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 z-10 flex items-end gap-2 border-t bg-background p-4 md:p-6"
    >
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask Securibot about cybersecurity..."
        className="flex-1 resize-none rounded-xl border-input bg-secondary focus-visible:ring-primary focus-visible:ring-2 min-h-[52px] max-h-[150px] overflow-y-auto pr-20" // Padding à droite conservé pour les boutons
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
          }
        }}
        rows={1}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <div className="absolute right-6 bottom-6 md:right-8 md:bottom-8 flex items-center gap-1">
        {/* Bouton Paperclip retiré */}
        <Button // Nouveau bouton Mic
          type="button"
          size="icon"
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
          onClick={handleMicClick}
          aria-label="Utiliser le microphone"
          disabled={isLoading} // Peut être activé même pendant le chargement si l'entrée micro est indépendante
        >
          <Mic className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          size="icon"
          variant="default"
          disabled={isLoading || !message.trim()}
          aria-label="Envoyer le message"
          className={cn(isLoading ? "bg-muted text-muted-foreground" : "bg-primary hover:bg-primary/90")}
        >
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
