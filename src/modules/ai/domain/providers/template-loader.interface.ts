export const I_TEMPLATE_LOADER = 'ITemplateLoader';

export interface ITemplateLoader {
  /**
   * Loads a template by its name/path identifier
   */
  load(templateName: string): Promise<string>;
}
