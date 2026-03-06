export interface GenerateCardsOutput {
  cards: Array<{
    title: string;
    text: string;
    imagePrompt: string;
    generatedImage?: string; // In case we decide to hydrate it immediately
  }>;
  design?: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
  tips?: Array<string>;
}
