import React from 'react';
import {
  Flame,
  Award,
  Clock,
  Play,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import { UserStats, CategoryId, ExamMode } from '../types/quiz';
import { CATEGORIES, QUESTIONS_BANK } from '../data/questions';
import { calculateLevel, BADGES_LIST } from '../utils/quizLogic';

interface DashboardProps {
  stats: UserStats;
  onSelectCategory: (categoryId: CategoryId, mode: ExamMode) => void;
  onStartExam: (mode: ExamMode) => void;
  onOpenAtpCalc: () => void;
  onOpenCheatSheet: () => void;
  onOpenMistakes: () => void;
  lang: 'ar' | 'en';
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  onSelectCategory,
  onStartExam,
  onOpenAtpCalc,
  onOpenCheatSheet,
  onOpenMistakes,
  lang,
}) => {
  const levelInfo = calculateLevel(stats.xp);
  const accuracy =
    stats.totalAnswered > 0
      ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100)
      : 0;

  const mistakesCount = stats.mistakeQuestionIds.length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fadeIn pb-16 px-4 sm:px-6">
      {/* Hero Student Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {lang === 'ar'
                    ? 'منهج كيمياء الدهون الطبية - د. سعيد عرابي'
                    : 'Medical Biochemistry - Lipid Metabolism'}
                </span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
                <span>{QUESTIONS_BANK.length}</span>
                <span className="font-sans font-normal">
                  {lang === 'ar' ? 'سؤالاً طبياً شاملاً' : 'Curated Questions'}
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {lang === 'ar' ? (
                <>
                  أهلاً بك يا دكتور، جاهز{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    لاختبار معلوماتك؟
                  </span>
                </>
              ) : (
                <>
                  Ready for your{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                    Biochemistry Exam?
                  </span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {lang === 'ar'
                ? `امتحانات تفاعلية فورية تشمل ${QUESTIONS_BANK.length} سؤالاً دقيقاً مستخرجاً من محاضرات د. سعيد عرابي، مع ترتيب عشوائي دوري للخيارات، وتغذية راجعة فورية عند كل إجابة، وتفسير طبي وسريري لكل خيار مع تتبع مستمر للتقدم ومكافآت تحفيزية.`
                : `Interactive exams featuring ${QUESTIONS_BANK.length} curated questions from Prof. Said Oraby's lecture notes, with dynamic option shuffling, instant corrections, detailed rationales, clinical pearls, and continuous progress tracking.`}
            </p>


            {/* Level and XP Progress Bar */}
            <div className="pt-2 max-w-md space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white font-bold flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? levelInfo.titleAr : levelInfo.titleEn}</span>
                </span>
                <span className="text-slate-400 font-mono text-[11px]">
                  {stats.xp} / {levelInfo.nextLevelXp} XP ({levelInfo.progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${levelInfo.progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick CTA Card */}
          <div className="w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={() => onStartExam('practice')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lang === 'ar' ? 'بدء تدريب فوري سريع' : 'Quick Practice Mode'}</span>
            </button>

            <button
              onClick={() => onStartExam('timed')}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition cursor-pointer"
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'امتحان محدد بوقت (Mock)' : 'Timed Exam'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'ar' ? 'الأسئلة المحلولة' : 'Solved Questions'}</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {stats.totalAnswered}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'ar'
              ? `${stats.totalCorrect} إجابة صحيحة`
              : `${stats.totalCorrect} correct answers`}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'ar' ? 'نسبة الدقة' : 'Accuracy Rate'}</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
            {accuracy}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {accuracy >= 75
              ? lang === 'ar'
                ? 'مستوى ممتاز ومتقدم'
                : 'Excellent mastery'
              : lang === 'ar'
              ? 'مستوى جيد، استمر بالممارسة'
              : 'Keep practicing'}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'ar' ? 'أفضل سلسلة متتالية' : 'Best Streak'}</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
            {stats.bestStreak}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'ar'
              ? `الحالية: ${stats.streak}`
              : `Current: ${stats.streak}`}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>{lang === 'ar' ? 'الأوسمة والجوائز' : 'Badges Earned'}</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono">
            {stats.unlockedBadgeIds.length} / {BADGES_LIST.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {lang === 'ar' ? 'مكافآت تحفيزية مستمرة' : 'Milestone rewards'}
          </div>
        </div>
      </div>

      {/* Featured Clinical Tools & Mistakes Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mistakes Bank Callout */}
        <div
          onClick={onOpenMistakes}
          className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 hover:border-rose-500/50 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertCircle className="w-5 h-5" />
              </span>
              <span className="text-xs font-black font-mono px-2 py-0.5 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300">
                {mistakesCount}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-3 group-hover:text-rose-300 transition">
              {lang === 'ar' ? 'بنك مراجعة الأخطاء' : 'Smart Mistakes Bank'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'تدريب مخصص على الأسئلة التي أخطأت بها حتى تتقنها 100%'
                : 'Targeted drills on missed questions until 100% mastery.'}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-rose-400 font-bold">
            <span>{lang === 'ar' ? 'فتح بنك الأخطاء' : 'Open Mistakes'}</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* ATP Calculator Callout */}
        <div
          onClick={onOpenAtpCalc}
          className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/50 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Zap className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {lang === 'ar' ? 'تفاعلي' : 'Interactive'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-3 group-hover:text-emerald-300 transition">
              {lang === 'ar' ? 'حاسبة طاقة أكسدة بيتا (ATP)' : 'Beta-Oxidation ATP Calculator'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'احسب طاقة أي حمض دهني بالخطوات التلقائية لمعادلة د. سعيد عرابي'
                : 'Calculate net ATP yield for any fatty acid step-by-step.'}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400 font-bold">
            <span>{lang === 'ar' ? 'تشغيل الحاسبة' : 'Open Calculator'}</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* Cheat Sheets Callout */}
        <div
          onClick={onOpenCheatSheet}
          className="p-5 rounded-2xl bg-gradient-to-br from-teal-950/40 via-slate-900 to-slate-900 border border-teal-500/30 hover:border-teal-500/50 transition cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
                <BookOpen className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold text-teal-400">
                {lang === 'ar' ? 'مذكرات' : 'Lectures'}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-3 group-hover:text-teal-300 transition">
              {lang === 'ar' ? 'ملخص الجداول والمقارنات' : 'Clinical Summary Cheat Sheets'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'جداول مقارنة البروتينات الدهنية والليباز وأمراض التخزين الشحمي'
                : 'High-yield comparison tables for lipoproteins, lipases & lipidosis.'}
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-teal-400 font-bold">
            <span>{lang === 'ar' ? 'عرض الجداول' : 'View Tables'}</span>
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Categories / Modules Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {lang === 'ar' ? 'أقسام المنهج ومواضيع الاختبارات' : 'Curriculum Modules & Topics'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'اختر الموضوع للبدء في حله مع التغذية الراجعة والشرح المباشر'
                : 'Select any topic to practice with instant feedback'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const catQuestions =
              cat.id === 'all'
                ? QUESTIONS_BANK
                : QUESTIONS_BANK.filter((q) => q.categoryId === cat.id);

            const catStats = stats.categoryStats[cat.id] || { total: 0, correct: 0 };
            const catAccuracy =
              catStats.total > 0
                ? Math.round((catStats.correct / catStats.total) * 100)
                : 0;

            return (
              <div
                key={cat.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300">
                      {catQuestions.length} {lang === 'ar' ? 'أسئلة' : 'questions'}
                    </span>
                    {catStats.total > 0 && (
                      <span className="text-xs font-bold text-emerald-400 font-mono">
                        {catAccuracy}% {lang === 'ar' ? 'إتقان' : 'mastery'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                    {lang === 'ar' ? cat.titleAr : cat.titleEn}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.descriptionAr}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCategory(cat.id, 'practice')}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{lang === 'ar' ? 'تدريب فوري' : 'Practice'}</span>
                  </button>

                  <button
                    onClick={() => onSelectCategory(cat.id, 'timed')}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                    title={lang === 'ar' ? 'امتحان محدد بوقت' : 'Timed Quiz'}
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badges / Rewards section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>{lang === 'ar' ? 'أوسمة الإنجاز والتحفيز' : 'Achievements & Medals'}</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-amber-500/40 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900/40 border-slate-800 opacity-40 grayscale'
                }`}
                title={lang === 'ar' ? badge.descriptionAr : badge.descriptionEn}
              >
                <div className="text-2xl mb-1.5">{badge.icon}</div>
                <div className="text-xs font-bold text-white truncate">
                  {lang === 'ar' ? badge.titleAr : badge.titleEn}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5">
                  {isUnlocked
                    ? lang === 'ar'
                      ? 'مكتسب ✓'
                      : 'Unlocked'
                    : lang === 'ar'
                    ? 'قيد القفل'
                    : 'Locked'}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
