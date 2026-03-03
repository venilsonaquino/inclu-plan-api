export interface GenerateHomeworkOutput {
  homework: {
    title: string;
    instructions: string;
    materialsNeeded: string;
    imagePrompt: string;
    generatedImage?: string;
  };
  design?: {
    fontFamily: string;
    primaryColor: string;
    secondaryColor: string;
    recommendedPrintSize: string;
  };
}
