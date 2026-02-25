export interface GenerateMaterialOutput {
  cards: Array<{
    title: string;
    text: string;
    imagePrompt: string;
    generatedImage?: string; // Base64 added after parallel generation
  }>;
  board: {
    title: string;
    text: string;
    imagePrompt: string;
    generatedImage?: string; // Base64 added after parallel generation
  };
  design: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
  tips: Array<string>;
}
