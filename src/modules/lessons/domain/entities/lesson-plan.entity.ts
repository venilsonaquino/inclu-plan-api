import { Entity } from '@/shared/domain/entities/entity';

export interface StudentAdaptationProps {
  studentId: string;
  studentName?: string;
  studentGrade?: string;
  studentNeurodivergencies?: string;
  strategy: string;
  behavioralTips: string;
  supportLevel: string;
  successIndicators: string;
}

export class StudentAdaptation extends Entity<StudentAdaptationProps> {
  private constructor(props: StudentAdaptationProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  public static create(props: StudentAdaptationProps, id?: string, createdAt?: Date, updatedAt?: Date): StudentAdaptation {
    return new StudentAdaptation(props, id, createdAt, updatedAt);
  }

  get studentId(): string { return this.props.studentId; }
  get studentName(): string | undefined { return this.props.studentName; }
  get studentGrade(): string | undefined { return this.props.studentGrade; }
  get studentNeurodivergencies(): string | undefined { return this.props.studentNeurodivergencies; }
  get strategy(): string { return this.props.strategy; }
  get behavioralTips(): string { return this.props.behavioralTips; }
  get supportLevel(): string { return this.props.supportLevel; }
  get successIndicators(): string { return this.props.successIndicators; }
}

export interface LessonPlanProps {
  teacherId: string;
  discipline: string;
  theme: string;
  lessonTitle: string;
  estimatedPrepTime?: string;
  lessonNumber?: number;
  objective?: string;
  learningObjects?: string;
  bnccCode?: string;
  bnccDescription?: string;
  duration?: string;
  activitySteps?: string[];
  udlRepresentation?: string;
  udlActionExpression?: string;
  udlEngagement?: string;
  resources?: string;
  evaluation?: string;
  adaptations?: StudentAdaptation[];
}

export class LessonPlan extends Entity<LessonPlanProps> {
  private constructor(props: LessonPlanProps, id?: string, createdAt?: Date, updatedAt?: Date) {
    super(props, id, createdAt, updatedAt);
  }

  public static create(props: LessonPlanProps, id?: string, createdAt?: Date, updatedAt?: Date): LessonPlan {
    return new LessonPlan({
      ...props,
      adaptations: props.adaptations || []
    }, id, createdAt, updatedAt);
  }

  get teacherId(): string { return this.props.teacherId; }
  get discipline(): string { return this.props.discipline; }
  get theme(): string { return this.props.theme; }
  get lessonTitle(): string { return this.props.lessonTitle; }
  get estimatedPrepTime(): string | undefined { return this.props.estimatedPrepTime; }
  get lessonNumber(): number | undefined { return this.props.lessonNumber; }
  get objective(): string | undefined { return this.props.objective; }
  get learningObjects(): string | undefined { return this.props.learningObjects; }
  get bnccCode(): string | undefined { return this.props.bnccCode; }
  get bnccDescription(): string | undefined { return this.props.bnccDescription; }
  get duration(): string | undefined { return this.props.duration; }
  get activitySteps(): string[] | undefined { return this.props.activitySteps; }
  get udlRepresentation(): string | undefined { return this.props.udlRepresentation; }
  get udlActionExpression(): string | undefined { return this.props.udlActionExpression; }
  get udlEngagement(): string | undefined { return this.props.udlEngagement; }
  get resources(): string | undefined { return this.props.resources; }
  get evaluation(): string | undefined { return this.props.evaluation; }
  get adaptations(): StudentAdaptation[] { return this.props.adaptations || []; }

  public addAdaptation(adaptation: StudentAdaptation) {
    if (!this.props.adaptations) {
      this.props.adaptations = [];
    }
    this.props.adaptations.push(adaptation);
    this._updated_at = new Date();
  }
}
