import { Injectable, Logger, Inject } from '@nestjs/common';
import { GeminiProvider } from '@/modules/ai/infra/integrations/gemini.provider';
import { Result } from '@/shared/domain/utils/result';
import { GenerateLessonInput } from './generate-lesson.input';
import { GenerateLessonOutput } from './generate-lesson.output';
import { ILessonPlanRepository, I_LESSON_PLAN_REPOSITORY } from '@/modules/ai/domain/repositories/lesson-plan.repository.interface';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GenerateLessonUseCase {
  private readonly logger = new Logger(GenerateLessonUseCase.name);

  constructor(
    private readonly geminiProvider: GeminiProvider,
    @Inject(I_LESSON_PLAN_REPOSITORY) private readonly lessonRepository: ILessonPlanRepository
  ) { }

  private loadPromptTemplate(filename: string): string {
    try {
      // Usaremos o diretorio atual do arquivo ao compilar para acessar os prompts
      const promptPath = path.join(__dirname, 'prompts', filename);
      return fs.readFileSync(promptPath, 'utf8');
    } catch (error) {
      this.logger.error(`Could not load prompt file: ${filename}`, error);
      throw new Error(`Failed to load prompt template: ${filename}`);
    }
  }

  private buildStudentsContext(students: GenerateLessonInput['students']): string {
    return students
      .map((s) => `- NOME: ${s.name} | SÉRIE/ANO: ${s.grade || 'Não informada'} | PERFIL: ${s.profiles.join(', ')}`)
      .join('\n');
  }

  private buildContentsContext(days: GenerateLessonInput['days']): string {
    if (!days || days.length === 0) return '';
    return days.map(d =>
      `[${d.day}]\n` + d.disciplines.map(disc =>
        `  - ${disc.name} (Tema: ${disc.theme})${disc.observations ? ` | Observações: ${disc.observations}` : ''}\n`
      ).join('') + '\n'
    ).join('');
  }

  private buildSemanticVectorString(payload: GenerateLessonInput): string {
    const profiles = payload.students
      .map(s => `Série/Ano: ${s.grade || 'Não informada'}, Transtornos/Necessidades: ${s.profiles.join(', ')}`)
      .join(' | ');

    const disciplines = (payload.days || [])
      .flatMap(d => d.disciplines)
      .map(disc => `Disciplina: ${disc.name}, Tema: ${disc.theme}${disc.observations ? `, Observações: ${disc.observations}` : ''}`)
      .join(' | ');

    return `PERFIL DOS ALUNOS: ${profiles}. CONTEÚDO ACADÊMICO: ${disciplines}`;
  }

  async execute(payload: GenerateLessonInput): Promise<Result<GenerateLessonOutput>> {
    try {
      const studentsString = this.buildStudentsContext(payload.students);
      const contentsString = this.buildContentsContext(payload.days);

      // --- HYBRID RAG SIMULATION ---
      this.logger.log('Executing RAG Strategy: Checking Vector Memory...');

      // 1. Vetoriza um texto rico em semântica pedagógica (Série, Perfil + Disciplinas sem os dias)
      const semanticVectorString = this.buildSemanticVectorString(payload);
      const contentVector = await this.geminiProvider.generateEmbeddings(semanticVectorString);

      // 2. Hash das condições exatas do aluno para atuar como nossos "Hard SQL Filters" 
      const studentHash = Buffer.from(studentsString).toString('base64');

      // 3. Busca na memória (distância cosseno) via Repository
      this.logger.log('Executing RAG Strategy: Checking Vector Repository...');
      const SIMILARITY_THRESHOLD = 0.85;

      const cachedLesson = await this.lessonRepository.findSimilar(studentHash, contentVector, SIMILARITY_THRESHOLD);

      if (cachedLesson) {
        this.logger.log(`High Similarity Found! Returning cached lesson plan (Custo: $0.00)`);
        return Result.ok<GenerateLessonOutput>(cachedLesson.lessonResult);
      }

      this.logger.log('No cache found. Falling back to Gemini LLM generation...');

      const systemInstruction = this.loadPromptTemplate('generate-lesson.system.md');
      let promptText = this.loadPromptTemplate('generate-lesson.user.md');

      promptText = promptText
        .replace('{{STUDENTS_STR}}', studentsString)
        .replace('{{CONTENTS_STR}}', contentsString);

      const aiResponse = await this.geminiProvider.generateText(systemInstruction, promptText, payload.imagePart);

      // --- SAVE TO CACHE ---
      const generatedLesson = aiResponse as GenerateLessonOutput;

      await this.lessonRepository.save({
        id: crypto.randomUUID(),
        studentContextHash: studentHash,
        contentEmbedding: contentVector,
        lessonResult: generatedLesson
      });

      this.logger.log('Saved newly generated lesson plan to Vector Repository.');

      return Result.ok<GenerateLessonOutput>(generatedLesson);
    } catch (error) {
      this.logger.error('Failed to generate lesson', error);
      return Result.fail<GenerateLessonOutput>(error instanceof Error ? error.message : 'Unknown error generating lesson');
    }
  }
}

