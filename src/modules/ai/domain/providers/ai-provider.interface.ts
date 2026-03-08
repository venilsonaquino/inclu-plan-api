export abstract class IAiProvider {
  /**
   * Generates text based on system instructions and a user prompt.
   * Can optionally parse a base64 image part.
   */
  abstract generateText(systemInstruction: string, promptText: string, imagePartBase64?: string): Promise<any>;

  /**
   * Generates an image based on a prompt and returns the base64 string
   */
  abstract generateImage(imagePrompt: string): Promise<string | null>;

  /**
   * Generates a numerical vector embedding for a piece of text
   */
  abstract generateEmbeddings(text: string): Promise<number[]>;
}
