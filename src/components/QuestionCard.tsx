import React from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { Question } from '../types/quiz';

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedOption: number | null;
  onSelectOption: (optionIndex: number) => void;
  onNextQuestion: () => void;
  onPrevQuestion?: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  lang: 'ar' | 'en';
  isTimedMode?: boolean;
  streak: number;
}

const PRAISES_AR = [
  'إجابة ممتازة يا دكتور! استمر في هذا التألق!',
  'تشخيص كيميائي حيوي دقيق ورائع!',
  'أحسنت! إتقان تام للمفاهيم الأساسية!',
  'إجابة صحيحة نموذجية! معلوماتك في غاية القوة!',
  'بطل! خطوة جديدة نحو التميز الأكاديمي!',
];

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  questionIndex,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onNextQuestion,
  onPrevQuestion,
  isBookmarked,
  onToggleBookmark,
  lang,
  isTimedMode = false,
  streak,
}) => {
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === question.correctIndex;

  // Pick praise based on question index
  const praiseText = PRAISES_AR[questionIndex % PRAISES_AR.length];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* Question Card Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              {lang === 'ar' ? question.categoryTitleAr : question.categoryTitleEn}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
              {lang === 'ar'
                ? question.difficulty === 'easy'
                  ? 'مستوى سهل'
                  : question.difficulty === 'medium'
                  ? 'مستوى متوسط'
                  : 'مستوى متقدم'
                : question.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">
              {questionIndex + 1} / {totalQuestions}
            </span>
            <button
              onClick={onToggleBookmark}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title={lang === 'ar' ? 'حفظ السؤال للمراجعة' : 'Bookmark question'}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Question Text */}
        <div className="space-y-2 mb-6">
          <h2 className="text-base sm:text-xl font-bold text-white leading-relaxed">
            {lang === 'ar' ? question.questionAr : question.questionEn}
          </h2>
          {lang === 'ar' && (
            <p className="text-xs text-slate-400 font-sans tracking-wide">
              {question.questionEn}
            </p>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {(lang === 'ar' ? question.optionsAr : question.optionsEn).map(
            (optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isOptionCorrect = idx === question.correctIndex;

              let buttonStyle =
                'bg-slate-800/60 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:border-slate-600';
              let badgeStyle = 'bg-slate-700 text-slate-300';

              if (isAnswered) {
                if (isOptionCorrect) {
                  // Correct option
                  buttonStyle =
                    'bg-emerald-950/60 border-emerald-500 text-emerald-100 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-900/30';
                  badgeStyle = 'bg-emerald-500 text-slate-950 font-black';
                } else if (isSelected && !isOptionCorrect) {
                  // Selected wrong option
                  buttonStyle =
                    'bg-rose-950/60 border-rose-500 text-rose-100 ring-2 ring-rose-500/50 shadow-lg shadow-rose-900/30';
                  badgeStyle = 'bg-rose-500 text-white font-black';
                } else {
                  // Unselected non-correct
                  buttonStyle = 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60';
                  badgeStyle = 'bg-slate-800 text-slate-500';
                }
              }

              const letters = ['أ', 'ب', 'ج', 'د'];
              const lettersEn = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={idx}
                  onClick={() => !isAnswered && onSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 text-sm font-medium ${buttonStyle} ${
                    !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-3 text-right">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${badgeStyle}`}
                    >
                      {lang === 'ar' ? letters[idx] : lettersEn[idx]}
                    </span>
                    <span className="leading-relaxed">{optionText}</span>
                  </div>

                  {/* Feedback Icons */}
                  {isAnswered && (
                    <div className="shrink-0 mr-2">
                      {isOptionCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            }
          )}
        </div>

        {/* Instant Motivation / Reward Banner (when answered correctly) */}
        {isAnswered && isCorrect && (
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-emerald-900/50 via-teal-900/40 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-slate-950">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-300">
                  {lang === 'ar' ? 'إجابة صحيحة ومتقنة! +25 XP' : 'Correct Answer! +25 XP'}
                </div>
                <div className="text-sm font-extrabold text-white">
                  {lang === 'ar' ? praiseText : 'Outstanding clinical deduction!'}
                </div>
              </div>
            </div>

            {streak > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{streak}x {lang === 'ar' ? 'متتالي' : 'Streak'}</span>
              </div>
            )}
          </div>
        )}

        {/* Detailed Educational Breakdown (Shown for both correct & incorrect answers) */}
        {isAnswered && (
          <div
            className={`mt-6 p-5 sm:p-6 rounded-2xl border space-y-4 animate-fadeIn ${
              isCorrect
                ? 'bg-slate-950/70 border-emerald-500/30'
                : 'bg-rose-950/20 border-rose-500/40'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isCorrect
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">
                  {lang === 'ar'
                    ? 'التوضيح والتحليل الطبي المفصل'
                    : 'Comprehensive Clinical & Biochemical Explanation'}
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md font-mono">
                ص {question.pageNumber} - {question.referencePdf}
              </span>
            </div>

            {/* Why choice is correct */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'التفسير العلمي للإجابة الصحيحة:' : 'Scientific Rationale:'}
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {lang === 'ar' ? question.explanationAr : question.explanationEn}
              </p>
            </div>

            {/* Common mistake / Trap breakdown (vital for medical students) */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="text-amber-400 font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'تحليل الخطأ الشائع وفخ الاختيارات:'
                    : 'Common Pitfall & Trap Analysis:'}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {question.commonMistakeAr}
              </p>
            </div>

            {/* Clinical Pearl */}
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? 'اللؤلؤة السريرية (Clinical Pearl):'
                    : 'High-Yield Clinical Pearl:'}
                </span>
              </div>
              <p className="text-cyan-100 leading-relaxed bg-cyan-950/30 p-3 rounded-xl border border-cyan-800/40">
                {question.clinicalPearlAr}
              </p>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          {onPrevQuestion && questionIndex > 0 ? (
            <button
              onClick={onPrevQuestion}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'السابق' : 'Previous'}</span>
            </button>
          ) : (
            <div />
          )}

          {isAnswered && (
            <button
              onClick={onNextQuestion}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-sm font-extrabold shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>
                {questionIndex + 1 === totalQuestions
                  ? lang === 'ar'
                    ? 'عرض النتيجة النهائية'
                    : 'View Final Score'
                  : lang === 'ar'
                  ? 'السؤال التالي'
                  : 'Next Question'}
              </span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
