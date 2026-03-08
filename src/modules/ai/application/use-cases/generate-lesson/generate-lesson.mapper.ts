import { Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { LessonPlan, StudentAdaptation } from '@/modules/lessons/domain/entities/lesson-plan.entity';
import { Student } from '@/modules/students/domain/entities/student.entity';
import { LessonRequest } from './generate-lesson.input';
import { IDisciplinaGenerationResponse, ILessonGenerationResponse } from '@/modules/ai/domain/interfaces/lesson-generation-response.interface';

export class GenerateLessonMapper {
  private static readonly logger = new Logger(GenerateLessonMapper.name);

  public static mapAiLessonToAggregate(
    teacherId: string,
    lessonReq: LessonRequest,
    aiDiscipline: IDisciplinaGenerationResponse,
    aiLesson: ILessonGenerationResponse,
    studentMap: Map<string, Student>
  ): LessonPlan {
    const planId = randomUUID();
    const adaptations = this.buildStudentAdaptations(aiLesson.adaptations, lessonReq.students, studentMap);

    return LessonPlan.create({
      teacherId,
      discipline: aiDiscipline.name,
      theme: lessonReq.discipline.theme,
      lessonTitle: aiDiscipline.lesson_title,
      estimatedPrepTime: aiDiscipline.estimated_prep_time,
      lessonNumber: aiLesson.lesson_number,
      objective: aiLesson.objective,
      learningObjects: aiLesson.learning_objects,
      bnccCode: aiLesson.bncc?.code,
      bnccDescription: aiLesson.bncc?.description,
      duration: aiLesson.duration,
      activitySteps: aiLesson.activity_steps,
      udlRepresentation: aiLesson.udl_strategies?.representation,
      udlActionExpression: aiLesson.udl_strategies?.action_and_expression,
      udlEngagement: aiLesson.udl_strategies?.engagement,
      resources: aiLesson.resources,
      evaluation: aiLesson.evaluation,
      adaptations
    }, planId);
  }

  private static buildStudentAdaptations(
    aiAdaptations: ILessonGenerationResponse['adaptations'],
    requestedStudentIds: string[],
    studentMap: Map<string, Student>
  ): StudentAdaptation[] {
    const lessonAdaptations = Array.isArray(aiAdaptations) ? aiAdaptations : [];
    const result: StudentAdaptation[] = [];

    requestedStudentIds.forEach(studentId => {
      const student = studentMap.get(studentId);
      if (!student) return;

      const adaptation = lessonAdaptations.find(a =>
        a.student_name && a.student_name.toLowerCase().trim() === student.name.toLowerCase().trim()
      );

      if (adaptation) {
        result.push(StudentAdaptation.create({
          studentId: studentId,
          studentName: student.name,
          studentGrade: adaptation.student_grade,
          studentNeurodivergencies: adaptation.student_neurodivergencies,
          strategy: adaptation.strategy,
          behavioralTips: adaptation.behavioral_tips,
          supportLevel: adaptation.support_level,
          successIndicators: adaptation.success_indicators,
        }, randomUUID()));
      } else {
        this.logger.warn(`No specific adaptation found for student ${student.name} (ID: ${studentId}). Skipping individual adaptation.`);
      }
    });

    return result;
  }
}
