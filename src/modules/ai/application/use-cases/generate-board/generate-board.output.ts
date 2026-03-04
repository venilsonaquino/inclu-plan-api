export interface GenerateBoardOutput {
  board: {
    title: string;
    text: string;
    imagePrompt: string;
    generatedImage?: string; // Base64 added if hydrated
  };
  design?: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
}
