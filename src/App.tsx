import React, { useState, useEffect } from 'react';
import {
  CategoryId,
  ExamMode,
  Question,
  UserStats,
} from './types/quiz';
import { QUESTIONS_BANK } from './data/questions';
import {
  calculateXpGain,
  checkNewUnlockedBadges,
  BADGES_LIST,
} from './utils/quizLogic';
import {
  loadUserStats,
  saveUserStats,
  loadSoundSetting,
  saveSoundSetting,
  loadLanguageSetting,
  saveLanguageSetting,
  INITIAL_USER_STATS,
} from './utils/storage';
import {
  playCorrectSound,
  playIncorrectSound,
  playFanfareSound,
  triggerRewardConfetti,
  triggerGrandConfetti,
} from './utils/sound';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { QuestionCard } from './components/QuestionCard';
import { ExamResults } from './components/ExamResults';
import { MistakesBank } from './components/MistakesBank';
import { AtpCalculatorModal } from './components/AtpCalculatorModal';
import { SummaryCheatSheetModal } from './components/SummaryCheatSheetModal';
import { Clock, AlertCircle, Award } from 'lucide-react';

export default function App() {
  // App state
  const [stats, setStats] = useState<UserStats>(loadUserStats);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(loadSoundSetting);
  const [lang, setLang] = useState<'ar' | 'en'>(loadLanguageSetting);

  // Active view: 'dashboard' | 'quiz' | 'results' | 'mistakes'
  const [currentView, setCurrentView] = useState<'dashboard' | 'quiz' | 'results' | 'mistakes'>('dashboard');

  // Exam session state
  const [examMode, setExamMode] = useState<ExamMode>('practice');
  const [activeCategoryId, setActiveCategoryId] = useState<CategoryId>('all');
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [sessionStartTime, setSessionStartTime] = useState<number>(Date.now());
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);

  // Modals state
  const [isAtpCalcOpen, setIsAtpCalcOpen] = useState<boolean>(false);
  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState<boolean>(false);
  const [newBadgeUnlocked, setNewBadgeUnlocked] = useState<string | null>(null);

  // Save stats on change
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  // Support ?autostart=1 query parameter as required by ultra-mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        startQuizSession('all', 'practice');
      }
    }
  }, []);

  // Timer effect for timed mode
  useEffect(() => {
    if (currentView !== 'quiz' || examMode !== 'timed' || timeLeftSeconds <= 0) return;

    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Finish exam on timeout
          finishExamSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentView, examMode, timeLeftSeconds]);

  // Start a quiz session
  const startQuizSession = (catId: CategoryId, mode: ExamMode, customQuestions?: Question[]) => {
    let pool: Question[] = [];
    if (customQuestions) {
      pool = customQuestions;
    } else if (catId === 'all') {
      pool = [...QUESTIONS_BANK];
    } else {
      pool = QUESTIONS_BANK.filter((q) => q.categoryId === catId);
    }

    if (pool.length === 0) {
      pool = [...QUESTIONS_BANK];
    }

    // Shuffle in timed or speed mode
    if (mode === 'timed' || mode === 'speed') {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    setActiveCategoryId(catId);
    setExamMode(mode);
    setExamQuestions(pool);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSessionStartTime(Date.now());

    // 45 seconds per question in timed mode
    if (mode === 'timed') {
      setTimeLeftSeconds(pool.length * 45);
    } else if (mode === 'speed') {
      setTimeLeftSeconds(60);
    }

    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle student selecting an option
  const handleSelectOption = (optionIndex: number) => {
    const activeQuestion = examQuestions[currentQuestionIndex];
    if (!activeQuestion) return;

    const isCorrect = optionIndex === activeQuestion.correctIndex;

    // Play feedback sound and effects
    if (isCorrect) {
      playCorrectSound(!soundEnabled);
      triggerRewardConfetti();
    } else {
      playIncorrectSound(!soundEnabled);
    }

    // Save answer
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: optionIndex,
    }));

    // Update student progress and stats
    setStats((prevStats) => {
      const newStreak = isCorrect ? prevStats.streak + 1 : 0;
      const newBestStreak = Math.max(prevStats.bestStreak, newStreak);
      const earnedXp = calculateXpGain(isCorrect, newStreak, activeQuestion.difficulty);

      // Mistakes tracking
      let updatedMistakes = [...prevStats.mistakeQuestionIds];
      if (!isCorrect) {
        if (!updatedMistakes.includes(activeQuestion.id)) {
          updatedMistakes.push(activeQuestion.id);
        }
      } else {
        // If answered correctly in practice, remove from mistakes if present
        updatedMistakes = updatedMistakes.filter((id) => id !== activeQuestion.id);
      }

      // Category stats
      const catKey = activeQuestion.categoryId;
      const currentCatStat = prevStats.categoryStats[catKey] || { total: 0, correct: 0 };
      const updatedCatStats = {
        ...prevStats.categoryStats,
        [catKey]: {
          total: currentCatStat.total + 1,
          correct: currentCatStat.correct + (isCorrect ? 1 : 0),
        },
      };

      const updatedStats: UserStats = {
        ...prevStats,
        totalAnswered: prevStats.totalAnswered + 1,
        totalCorrect: prevStats.totalCorrect + (isCorrect ? 1 : 0),
        streak: newStreak,
        bestStreak: newBestStreak,
        xp: prevStats.xp + earnedXp,
        categoryStats: updatedCatStats,
        mistakeQuestionIds: updatedMistakes,
      };

      // Check badge triggers
      const newBadges = checkNewUnlockedBadges(updatedStats);
      if (newBadges.length > 0) {
        const firstBadge = BADGES_LIST.find((b) => b.id === newBadges[0]);
        if (firstBadge) {
          setNewBadgeUnlocked(lang === 'ar' ? firstBadge.titleAr : firstBadge.titleEn);
          playFanfareSound(!soundEnabled);
        }
        updatedStats.unlockedBadgeIds = [...updatedStats.unlockedBadgeIds, ...newBadges];
      }

      return updatedStats;
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < examQuestions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      finishExamSession();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishExamSession = () => {
    triggerGrandConfetti();
    playFanfareSound(!soundEnabled);
    setCurrentView('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleBookmark = (id: string) => {
    setStats((prev) => {
      const isBookmarked = prev.bookmarkedQuestionIds.includes(id);
      return {
        ...prev,
        bookmarkedQuestionIds: isBookmarked
          ? prev.bookmarkedQuestionIds.filter((bId) => bId !== id)
          : [...prev.bookmarkedQuestionIds, id],
      };
    });
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    saveSoundSetting(next);
  };

  const handleToggleLang = () => {
    const next = lang === 'ar' ? 'en' : 'ar';
    setLang(next);
    saveLanguageSetting(next);
    if (typeof document !== 'undefined') {
      document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = next;
    }
  };

  // Open mistakes test
  const handleStartMistakesQuiz = () => {
    const mistakesQuestions = QUESTIONS_BANK.filter((q) =>
      stats.mistakeQuestionIds.includes(q.id)
    );
    if (mistakesQuestions.length > 0) {
      startQuizSession('all', 'mistakes', mistakesQuestions);
    }
  };

  const handleRemoveMistake = (id: string) => {
    setStats((prev) => ({
      ...prev,
      mistakeQuestionIds: prev.mistakeQuestionIds.filter((mId) => mId !== id),
    }));
  };

  const handleClearAllMistakes = () => {
    setStats((prev) => ({
      ...prev,
      mistakeQuestionIds: [],
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        stats={stats}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenAtpCalc={() => {
          setIsAtpCalcOpen(true);
          // Unlock ATP badge if not unlocked
          if (!stats.unlockedBadgeIds.includes('atp_calculator_explorer')) {
            setStats((prev) => ({
              ...prev,
              unlockedBadgeIds: [...prev.unlockedBadgeIds, 'atp_calculator_explorer'],
            }));
          }
        }}
        onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
        onOpenMistakes={() => setCurrentView('mistakes')}
        onGoHome={() => setCurrentView('dashboard')}
      />

      {/* Main Container */}
      <main className="flex-1 py-6 sm:py-8">
        {/* VIEW 1: DASHBOARD */}
        {currentView === 'dashboard' && (
          <Dashboard
            stats={stats}
            onSelectCategory={(catId, mode) => startQuizSession(catId, mode)}
            onStartExam={(mode) => startQuizSession('all', mode)}
            onOpenAtpCalc={() => setIsAtpCalcOpen(true)}
            onOpenCheatSheet={() => setIsCheatSheetOpen(true)}
            onOpenMistakes={() => setCurrentView('mistakes')}
            lang={lang}
          />
        )}

        {/* VIEW 2: QUIZ / EXAM SESSION */}
        {currentView === 'quiz' && examQuestions.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            {/* Session Top Bar */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="hover:text-white font-bold cursor-pointer"
              >
                ← {lang === 'ar' ? 'الخروج إلى لوحة التحكم' : 'Exit to Dashboard'}
              </button>

              {examMode === 'timed' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-cyan-300 font-mono font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {Math.floor(timeLeftSeconds / 60)}:
                    {(timeLeftSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}

              <div className="font-mono text-xs">
                {lang === 'ar' ? 'سؤال' : 'Question'} {currentQuestionIndex + 1} /{' '}
                {examQuestions.length}
              </div>
            </div>

            {/* Question Card */}
            <QuestionCard
              question={examQuestions[currentQuestionIndex]}
              questionIndex={currentQuestionIndex}
              totalQuestions={examQuestions.length}
              selectedOption={
                userAnswers[examQuestions[currentQuestionIndex].id] ?? null
              }
              onSelectOption={handleSelectOption}
              onNextQuestion={handleNextQuestion}
              onPrevQuestion={currentQuestionIndex > 0 ? handlePrevQuestion : undefined}
              isBookmarked={stats.bookmarkedQuestionIds.includes(
                examQuestions[currentQuestionIndex].id
              )}
              onToggleBookmark={() =>
                toggleBookmark(examQuestions[currentQuestionIndex].id)
              }
              lang={lang}
              isTimedMode={examMode === 'timed'}
              streak={stats.streak}
            />
          </div>
        )}

        {/* VIEW 3: EXAM RESULTS */}
        {currentView === 'results' && (
          <div className="max-w-4xl mx-auto px-4">
            <ExamResults
              questions={examQuestions}
              userAnswers={userAnswers}
              onRetake={() =>
                startQuizSession(activeCategoryId, examMode, examQuestions)
              }
              onRetestMistakes={() => {
                const missed = examQuestions.filter(
                  (q) => userAnswers[q.id] !== q.correctIndex
                );
                if (missed.length > 0) {
                  startQuizSession('all', 'mistakes', missed);
                }
              }}
              onGoHome={() => setCurrentView('dashboard')}
              lang={lang}
            />
          </div>
        )}

        {/* VIEW 4: MISTAKES BANK */}
        {currentView === 'mistakes' && (
          <div className="max-w-4xl mx-auto px-4">
            <MistakesBank
              mistakeIds={stats.mistakeQuestionIds}
              onStartMistakeQuiz={handleStartMistakesQuiz}
              onRemoveMistake={handleRemoveMistake}
              onClearAllMistakes={handleClearAllMistakes}
              onClose={() => setCurrentView('dashboard')}
              lang={lang}
            />
          </div>
        )}
      </main>

      {/* ATP Yield Calculator Modal */}
      <AtpCalculatorModal
        isOpen={isAtpCalcOpen}
        onClose={() => setIsAtpCalcOpen(false)}
        lang={lang}
      />

      {/* Summary Tables Modal */}
      <SummaryCheatSheetModal
        isOpen={isCheatSheetOpen}
        onClose={() => setIsCheatSheetOpen(false)}
        lang={lang}
      />

      {/* Badge Unlocked Toast Notification */}
      {newBadgeUnlocked && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 shadow-2xl flex items-center gap-3 animate-bounce">
          <Award className="w-6 h-6 shrink-0" />
          <div>
            <div className="text-xs font-black uppercase tracking-wider">
              {lang === 'ar' ? 'وسام إنجاز جديد!' : 'New Badge Unlocked!'}
            </div>
            <div className="text-sm font-black">{newBadgeUnlocked}</div>
          </div>
          <button
            onClick={() => setNewBadgeUnlocked(null)}
            className="ml-2 text-xs font-bold underline cursor-pointer"
          >
            {lang === 'ar' ? 'حسناً' : 'Dismiss'}
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-400">
            {lang === 'ar'
              ? 'منصة اختبارات كيمياء الدهون الطبية التفاعلية | مأخوذة من مذكرات أ.د. سعيد عرابي'
              : 'Interactive Medical Lipid Biochemistry Exam System | Prof. Said Oraby Notes'}
          </p>
          <p className="text-[11px] text-slate-400">
            {lang === 'ar'
              ? 'تغذية راجعة فورية • تحليل شامل للأخطاء • تتبع مستمر لتقدم الطلاب • تعزيز التميز الأكاديمي'
              : 'Instant Feedback • Deep Rationale Breakdown • Continuous Progress Tracking'}
          </p>
        </div>
      </footer>
    </div>
  );
}
