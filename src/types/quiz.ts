export type CategoryId =
  | 'all'
  | 'digestion_absorption'
  | 'fa_oxidation'
  | 'fa_synthesis'
  | 'lipogenesis_lipolysis'
  | 'ketone_bodies'
  | 'cholesterol_fatty_liver'
  | 'lipoproteins_atherosclerosis'
  | 'eicosanoids_phospholipids';

export type ExamMode = 'practice' | 'timed' | 'speed' | 'mistakes';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  categoryId: CategoryId;
  categoryTitleAr: string;
  categoryTitleEn: string;
  difficulty: Difficulty;
  questionAr: string;
  questionEn: string;
  optionsAr: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationAr: string;
  explanationEn: string;
  whyCorrectAr: string;
  commonMistakeAr: string;
  clinicalPearlAr: string;
  referencePdf: string;
  pageNumber: number;
}

export interface UserAnswerRecord {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: number;
}

export interface UserStats {
  totalAnswered: number;
  totalCorrect: number;
  streak: number;
  bestStreak: number;
  xp: number;
  coins: number;
  level: number;
  unlockedBadgeIds: string[];
  categoryStats: Record<CategoryId, { total: number; correct: number }>;
  mistakeQuestionIds: string[];
  bookmarkedQuestionIds: string[];
  examHistory: ExamHistoryItem[];
}

export interface ExamHistoryItem {
  id: string;
  date: string;
  mode: ExamMode;
  categoryName: string;
  score: number;
  total: number;
  percentage: number;
  timeSpentSeconds: number;
}

export interface Badge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: string;
  reqType: 'streak' | 'total' | 'perfect' | 'category' | 'calculator';
  reqValue: number | string;
}
