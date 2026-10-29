import { Difficulty, UserStats, Question, Badge, CategoryId } from '../types/quiz';

export interface AtpYieldBreakdown {
  carbons: number;
  turns: number;
  acetylCoACount: number;
  fadh2Atp: number;
  nadhAtp: number;
  betaCyclesAtp: number;
  krebsAtp: number;
  grossAtp: number;
  activationCost: number;
  netAtp: number;
  formulaString: string;
}

/**
 * Calculates net ATP production from beta-oxidation of an even-numbered saturated fatty acid
 * based on Prof. Said Oraby's formula: [(N/2 - 1) * 5 ATP] + [(N/2) * 12 ATP] - 2 ATP
 */
export function calculateNetAtpForFattyAcid(carbons: number): AtpYieldBreakdown {
  if (carbons < 4 || carbons % 2 !== 0) {
    throw new Error('Carbons must be an even integer >= 4');
  }

  const turns = carbons / 2 - 1;
  const acetylCoACount = carbons / 2;
  const fadh2Atp = turns * 2;
  const nadhAtp = turns * 3;
  const betaCyclesAtp = turns * 5;
  const krebsAtp = acetylCoACount * 12;
  const grossAtp = betaCyclesAtp + krebsAtp;
  const activationCost = 2;
  const netAtp = grossAtp - activationCost;

  const formulaString = `[(${carbons}/2 - 1) × 5 ATP] + [(${carbons}/2) × 12 ATP] - 2 ATP = (${turns} × 5) + (${acetylCoACount} × 12) - 2 = ${netAtp} ATP`;

  return {
    carbons,
    turns,
    acetylCoACount,
    fadh2Atp,
    nadhAtp,
    betaCyclesAtp,
    krebsAtp,
    grossAtp,
    activationCost,
    netAtp,
    formulaString,
  };
}

/**
 * Calculates XP earned for an answer
 */
export function calculateXpGain(
  isCorrect: boolean,
  currentStreak: number,
  difficulty: Difficulty
): number {
  if (!isCorrect) return 5; // consolation XP for attempting and learning

  const baseDifficultyXp = {
    easy: 15,
    medium: 25,
    hard: 40,
  }[difficulty];

  // Streak bonus: +2 XP per active streak point (capped at +30)
  const streakBonus = Math.min(currentStreak * 2, 30);

  return baseDifficultyXp + streakBonus;
}

/**
 * Calculates user level from accumulated XP
 */
export function calculateLevel(xp: number): {
  level: number;
  titleAr: string;
  titleEn: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
} {
  // Level threshold: 100 * level^1.4
  const levels = [
    { lvl: 1, req: 0, titleAr: 'مستكشف الكيمياء الحيوية', titleEn: 'Biochem Novice' },
    { lvl: 2, req: 100, titleAr: 'طالب طب مجتهد', titleEn: 'Medical Student' },
    { lvl: 3, req: 250, titleAr: 'مختص كيمياء الدهون', titleEn: 'Lipid Scholar' },
    { lvl: 4, req: 500, titleAr: 'طبيب امتياز متفوق', titleEn: 'Resident Physician' },
    { lvl: 5, req: 850, titleAr: 'أخصائي أمراض التمثيل الغذائي', titleEn: 'Metabolic Specialist' },
    { lvl: 6, req: 1300, titleAr: 'خبير الكيمياء الحيوية السريرية', titleEn: 'Clinical Biochem Expert' },
    { lvl: 7, req: 2000, titleAr: 'استشاري وأستاذ الكيمياء الحيوية', titleEn: 'Chief Biochem Consultant' },
  ];

  let currentTier = levels[0];
  let nextTier = levels[1];

  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].req) {
      currentTier = levels[i];
      nextTier = levels[i + 1] || { lvl: levels[i].lvl + 1, req: levels[i].req + 1000, titleAr: 'القمة الأكاديمية', titleEn: 'Biochem Master' };
    } else {
      break;
    }
  }

  const range = nextTier.req - currentTier.req;
  const progressInTier = Math.max(0, xp - currentTier.req);
  const progressPercent = Math.min(100, Math.round((progressInTier / range) * 100));

  return {
    level: currentTier.lvl,
    titleAr: currentTier.titleAr,
    titleEn: currentTier.titleEn,
    currentLevelXp: currentTier.req,
    nextLevelXp: nextTier.req,
    progressPercent,
  };
}

/**
 * Available Badges
 */
export const BADGES_LIST: Badge[] = [
  {
    id: 'first_blood',
    titleAr: 'الخطوة الأولى',
    titleEn: 'First Step',
    descriptionAr: 'أجبت على أول سؤال بنجاح',
    descriptionEn: 'Answered your first question correctly',
    icon: '🎯',
    reqType: 'total',
    reqValue: 1,
  },
  {
    id: 'streak_5',
    titleAr: 'شعلة التركيز',
    titleEn: 'Focus Flame',
    descriptionAr: 'حققت سلسلة من 5 إجابات صحيحة متتالية',
    descriptionEn: 'Achieved a streak of 5 correct answers in a row',
    icon: '🔥',
    reqType: 'streak',
    reqValue: 5,
  },
  {
    id: 'streak_10',
    titleAr: 'سيد الإتقان',
    titleEn: 'Master of Flow',
    descriptionAr: 'حققت سلسلة مذهلة من 10 إجابات متتالية',
    descriptionEn: 'Achieved an amazing 10 consecutive correct streak',
    icon: '⚡',
    reqType: 'streak',
    reqValue: 10,
  },
  {
    id: 'beta_oxidation_ace',
    titleAr: 'عبقري أكسدة البيتا',
    titleEn: 'Beta-Oxidation Ace',
    descriptionAr: 'أجبت على 5 أسئلة صحيحة في مسار أكسدة الأحماض الدهنية',
    descriptionEn: 'Answered 5 questions correctly in Beta-Oxidation',
    icon: '🧬',
    reqType: 'category',
    reqValue: 'fa_oxidation:5',
  },
  {
    id: 'lipoprotein_pro',
    titleAr: 'صائد البروتينات الدهنية',
    titleEn: 'Lipoprotein Master',
    descriptionAr: 'أجبت على 5 أسئلة صحيحة في درس البروتينات الدهنية والكوليسترول',
    descriptionEn: 'Answered 5 questions correctly in Lipoproteins & Cholesterol',
    icon: '🩸',
    reqType: 'category',
    reqValue: 'lipoproteins_atherosclerosis:5',
  },
  {
    id: 'atp_calculator_explorer',
    titleAr: 'مهندس الـ ATP',
    titleEn: 'ATP Engineer',
    descriptionAr: 'استخدمت حاسبة طاقة الأحماض الدهنية التفاعلية',
    descriptionEn: 'Used the interactive ATP yield calculator',
    icon: '💡',
    reqType: 'calculator',
    reqValue: 1,
  },
  {
    id: 'scholar_25',
    titleAr: 'عالم الكيمياء الحيوية',
    titleEn: 'Biochem Scholar',
    descriptionAr: 'أجبت على 25 سؤالاً في المنصة',
    descriptionEn: 'Answered 25 total questions on the platform',
    icon: '🏆',
    reqType: 'total',
    reqValue: 25,
  },
];

/**
 * Checks if user unlocked any new badges
 */
export function checkNewUnlockedBadges(stats: UserStats): string[] {
  const newBadges: string[] = [];
  const existing = new Set(stats.unlockedBadgeIds);

  for (const badge of BADGES_LIST) {
    if (existing.has(badge.id)) continue;

    if (badge.reqType === 'total') {
      if (stats.totalAnswered >= Number(badge.reqValue)) {
        newBadges.push(badge.id);
      }
    } else if (badge.reqType === 'streak') {
      if (stats.bestStreak >= Number(badge.reqValue)) {
        newBadges.push(badge.id);
      }
    } else if (badge.reqType === 'category') {
      const [cat, countStr] = String(badge.reqValue).split(':');
      const targetCount = Number(countStr);
      const catKey = cat as CategoryId;
      const catStat = catKey in stats.categoryStats ? stats.categoryStats[catKey] : undefined;
      if (catStat && catStat.correct >= targetCount) {
        newBadges.push(badge.id);
      }
    }
  }

  return newBadges;
}

/**
 * Pure evaluation of an exam session
 */
export function evaluateExam(answers: { questionId: string; selectedOption: number; isCorrect: boolean }[]) {
  const total = answers.length;
  const correct = answers.filter((a) => a.isCorrect).length;
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const passed = percentage >= 60;

  let gradeAr = 'راسب';
  let gradeEn = 'Fail';
  if (percentage >= 90) {
    gradeAr = 'ممتاز مع مرتبة الشرف';
    gradeEn = 'High Distinction';
  } else if (percentage >= 80) {
    gradeAr = 'جيد جداً';
    gradeEn = 'Very Good';
  } else if (percentage >= 70) {
    gradeAr = 'جيد';
    gradeEn = 'Good';
  } else if (percentage >= 60) {
    gradeAr = 'مقبول';
    gradeEn = 'Pass';
  }

  return {
    total,
    correct,
    percentage,
    passed,
    gradeAr,
    gradeEn,
  };
}
