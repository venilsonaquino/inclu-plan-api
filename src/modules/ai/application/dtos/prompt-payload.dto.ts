export interface PromptPayloadDto {
  strategyOverride?: string;
  theme: string;
  objective: string;
  description: string;
  studentData: {
    name: string;
    grade: string;
    profile: string;
    adaptation: string;
  };
}
