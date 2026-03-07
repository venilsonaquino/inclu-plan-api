import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ITemplateLoader } from '@/modules/ai/domain/providers/template-loader.interface';

@Injectable()
export class FileTemplateLoader implements ITemplateLoader {
  private readonly logger = new Logger(FileTemplateLoader.name);

  // We define the base path from the root of the project where prompts live.
  // Assuming prompts are placed inside 'src/modules/ai/application/use-cases/[use-case-name]/prompts/'
  // For simplicity, we can load relative to process.cwd() or require absolute path mapping strategy.

  async load(templatePath: string): Promise<string> {
    try {
      // Resolve path relative to this file to work in both 'src' and 'dist'
      const fullPath = join(__dirname, '..', '..', 'application', 'use-cases', templatePath);
      return readFileSync(fullPath, 'utf8');
    } catch (error) {
      this.logger.error(`Could not load template file: ${templatePath}`, error);
      throw new Error(`Failed to load template: ${templatePath}`);
    }
  }
}
