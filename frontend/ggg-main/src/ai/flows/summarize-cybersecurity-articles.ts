'use server';

/**
 * @fileOverview Summarizes cybersecurity articles from given URLs. (Now returns static summaries)
 *
 * - summarizeCybersecurityArticles - A function that summarizes cybersecurity articles from given URLs.
 * - SummarizeCybersecurityArticlesInput - The input type for the summarizeCybersecurityArticles function.
 * - SummarizeCybersecurityArticlesOutput - The return type for the summarizeCybersecurityArticles function.
 */

import {ai}from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCybersecurityArticlesInputSchema = z.object({
  urls: z
    .array(z.string().url())
    .describe('An array of URLs pointing to cybersecurity articles.'),
});
export type SummarizeCybersecurityArticlesInput = z.infer<
  typeof SummarizeCybersecurityArticlesInputSchema
>;

const SummarizeCybersecurityArticlesOutputSchema = z.object({
  summaries: z
    .array(z.string())
    .describe('An array of summaries, one for each input URL.'),
});
export type SummarizeCybersecurityArticlesOutput = z.infer<
  typeof SummarizeCybersecurityArticlesOutputSchema
>;

export async function summarizeCybersecurityArticles(
  input: SummarizeCybersecurityArticlesInput
): Promise<SummarizeCybersecurityArticlesOutput> {
  return summarizeCybersecurityArticlesFlow(input);
}

// Les définitions de prompt et la fonction fetchArticleContent sont supprimées.
// const articleSummaryPrompt = ai.definePrompt({ ... });
// async function fetchArticleContent(url: string): Promise<string> { ... }

const summarizeCybersecurityArticlesFlow = ai.defineFlow(
  {
    name: 'summarizeCybersecurityArticlesFlow',
    inputSchema: SummarizeCybersecurityArticlesInputSchema,
    outputSchema: SummarizeCybersecurityArticlesOutputSchema,
  },
  async (input) => {
    // Retourne des résumés statiques pour chaque URL.
    const summaries: string[] = input.urls.map(url => 
        `Ceci est un résumé de test statique pour l'URL : ${url}. Le contenu réel n'a pas été récupéré ni analysé par une IA.`
    );
    return {summaries};
  }
);
