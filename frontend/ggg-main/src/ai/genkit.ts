import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/googleai'; // Supprimé

export const ai = genkit({
  plugins: [], // googleAI() supprimé
  // model: 'googleai/gemini-2.0-flash', // Modèle par défaut supprimé
});
