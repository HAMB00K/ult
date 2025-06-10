
'use server';

/**
 * @fileOverview This file defines a Genkit flow to suggest relevant cybersecurity prompts to the user.
 * THIS FILE IS NO LONGER USED by ChatPage.tsx as of API integration.
 * The chat page now uses static suggested prompts.
 * Kept for reference or potential future use with Genkit directly.
 *
 * - suggestRelevantPrompts - A function that returns a list of relevant cybersecurity prompts.
 * - RelevantPromptsOutput - The output type for the suggestRelevantPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelevantPromptsOutputSchema = z.array(z.string().describe('A relevant cybersecurity prompt.'));
export type RelevantPromptsOutput = z.infer<typeof RelevantPromptsOutputSchema>;

export async function suggestRelevantPrompts(): Promise<RelevantPromptsOutput> {
  return suggestRelevantPromptsFlow();
}

// La définition du prompt est supprimée car nous retournons des suggestions statiques.
// const prompt = ai.definePrompt({ ... });

const suggestRelevantPromptsFlow = ai.defineFlow(
  {
    name: 'suggestRelevantPromptsFlow',
    outputSchema: RelevantPromptsOutputSchema,
  },
  async () => {
    // Retourne des suggestions statiques.
    return [
        "Suggestion de prompt statique N°1 : Quels sont les risques ? (Genkit Flow - Not actively used in chat)",
        "Suggestion statique N°2 : Comment me protéger ? (Genkit Flow - Not actively used in chat)",
        "Prompt de test N°3 : Expliquez la cybersécurité. (Genkit Flow - Not actively used in chat)",
        "Quatrième suggestion statique pour tester. (Genkit Flow - Not actively used in chat)",
    ];
  }
);
