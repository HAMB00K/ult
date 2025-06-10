
'use server';
/**
 * @fileOverview An AI agent that answers cybersecurity-related questions.
 * THIS FILE IS NO LONGER USED by ChatPage.tsx as of API integration.
 * Kept for reference or potential future use with Genkit directly.
 *
 * - answerCybersecurityQuestion - A function that handles the cybersecurity question answering process.
 * - AnswerCybersecurityQuestionInput - The input type for the answerCybersecurityQuestion function.
 * - AnswerCybersecurityQuestionOutput - The return type for the answerCybersecurityQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerCybersecurityQuestionInputSchema = z.object({
  question: z.string().describe('The cybersecurity-related question to be answered.'),
});
export type AnswerCybersecurityQuestionInput = z.infer<typeof AnswerCybersecurityQuestionInputSchema>;

const AnswerCybersecurityQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the cybersecurity-related question.'),
});
export type AnswerCybersecurityQuestionOutput = z.infer<typeof AnswerCybersecurityQuestionOutputSchema>;

export async function answerCybersecurityQuestion(
  input: AnswerCybersecurityQuestionInput
): Promise<AnswerCybersecurityQuestionOutput> {
  return answerCybersecurityQuestionFlow(input);
}

// La définition du prompt est supprimée car nous retournons une réponse statique.
// const prompt = ai.definePrompt({ ... });

const answerCybersecurityQuestionFlow = ai.defineFlow(
  {
    name: 'answerCybersecurityQuestionFlow',
    inputSchema: AnswerCybersecurityQuestionInputSchema,
    outputSchema: AnswerCybersecurityQuestionOutputSchema,
  },
  async (input) => {
    // Retourne une réponse statique au lieu d'appeler le prompt.
    return { answer: `Réponse de test à votre question : "${input.question}". Ceci est un texte statique généré localement. (Genkit Flow - Not actively used in chat)` };
  }
);
