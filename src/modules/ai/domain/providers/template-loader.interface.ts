export abstract class ITemplateLoader {
  /**
   * Loads a template by its name/path identifier
   */
  abstract load(templateName: string): Promise<string>;
}
