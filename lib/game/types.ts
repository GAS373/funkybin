export type DistrictId = "docs" | "debug" | "sql" | "regex" | "commit";

export type DifficultyLevel = "Low" | "Medium" | "High";

export interface ValidatorOption {
  id: string;
  label: string;
  detail: string;
}

export interface DistrictScene {
  id: DistrictId;
  code: string;
  title: string;
  subtitle: string;
  accent: string;
  difficulty: DifficultyLevel;
  threatLevel: number;
  description: string;
  focus: string;
  brief: string;
  aiResponse: string;
  risk: string;
  signalTip: string;
  verifyChecklist: string[];
  incorrectConsequence: string;
  validatorOptions: ValidatorOption[];
  correctOptionId: string;
  explanation: string;
  lesson: string;
  rewardLabel: string;
}

export interface GameProgress {
  currentDistrict: DistrictId;
  unlockedDistricts: DistrictId[];
  completedDistricts: DistrictId[];
  selectedOptionByDistrict: Partial<Record<DistrictId, string>>;
}