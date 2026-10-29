import { UserStats, CategoryId, ExamHistoryItem } from '../types/quiz';

const STORAGE_KEY = 'biochem_quiz_progress_v1';
const SOUND_KEY = 'biochem_quiz_sound_enabled';
const LANG_KEY = 'biochem_quiz_language';

export const INITIAL_USER_STATS: UserStats = {
  totalAnswered: 0,
  totalCorrect: 0,
  streak: 0,
  bestStreak: 0,
  xp: 0,
  coins: 0,
  level: 1,
  unlockedBadgeIds: [],
  categoryStats: {
    all: { total: 0, correct: 0 },
    digestion_absorption: { total: 0, correct: 0 },
    fa_oxidation: { total: 0, correct: 0 },
    fa_synthesis: { total: 0, correct: 0 },
    lipogenesis_lipolysis: { total: 0, correct: 0 },
    ketone_bodies: { total: 0, correct: 0 },
    cholesterol_fatty_liver: { total: 0, correct: 0 },
    lipoproteins_atherosclerosis: { total: 0, correct: 0 },
    eicosanoids_phospholipids: { total: 0, correct: 0 },
  },
  mistakeQuestionIds: [],
  bookmarkedQuestionIds: [],
  examHistory: [],
};

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return INITIAL_USER_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_USER_STATS,
      ...parsed,
      categoryStats: {
        ...INITIAL_USER_STATS.categoryStats,
        ...(parsed.categoryStats || {}),
      },
    };
  } catch (e) {
    console.error('Failed to load user stats from localStorage', e);
    return INITIAL_USER_STATS;
  }
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save user stats', e);
  }
}

export function resetUserStats(): UserStats {
  saveUserStats(INITIAL_USER_STATS);
  return INITIAL_USER_STATS;
}

export function loadSoundSetting(): boolean {
  if (typeof window === 'undefined') return true;
  const val = localStorage.getItem(SOUND_KEY);
  return val !== 'false';
}

export function saveSoundSetting(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SOUND_KEY, String(enabled));
}

export function loadLanguageSetting(): 'ar' | 'en' {
  if (typeof window === 'undefined') return 'ar';
  const val = localStorage.getItem(LANG_KEY);
  return val === 'en' ? 'en' : 'ar';
}

export function saveLanguageSetting(lang: 'ar' | 'en'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LANG_KEY, lang);
}
