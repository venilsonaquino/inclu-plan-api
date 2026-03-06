export const I_AI_PROVIDER = 'IAiProvider';

export interface IAiProvider {
  /**
   * Generates text based on system instructions and a user prompt.
   * Can optionally parse a base64 image part.
   */
  generateText(
    systemInstruction: string,
    promptText: string,
    imagePartBase64?: string,
  ): Promise<any>;

  /**
   * Generates an image based on a prompt and returns the base64 string
   */
  generateImage(imagePrompt: string): Promise<string | null>;

  /**
   * Generates a numerical vector embedding for a piece of text
   */
  generateEmbeddings(text: string): Promise<number[]>;
}
