import React, { useState } from 'react';
import {
  Trophy,
  Award,
  RotateCcw,
  AlertCircle,
  Home,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Question } from '../types/quiz';
import { evaluateExam } from '../utils/quizLogic';

interface ExamResultsProps {
  questions: Question[];
  userAnswers: Record<string, number>;
  onRetake: () => void;
  onRetestMistakes: () => void;
  onGoHome: () => void;
  lang: 'ar' | 'en';
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  questions,
  userAnswers,
  onRetake,
  onRetestMistakes,
  onGoHome,
  lang,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const answerList = questions.map((q) => {
    const selected = userAnswers[q.id];
    const isCorrect = selected === q.correctIndex;
    return {
      questionId: q.id,
      selectedOption: selected,
      isCorrect,
    };
  });

  const evalResult = evaluateExam(answerList);
  const mistakeCount = evalResult.total - evalResult.correct;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Score Hero Card */}
      <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Decorative background glow */}
        <div
          className={`absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
            evalResult.passed ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 shadow-inner">
            <Trophy
              className={`w-8 h-8 ${
                evalResult.percentage >= 80
                  ? 'text-amber-400 animate-bounce'
                  : evalResult.passed
                  ? 'text-emerald-400'
                  : 'text-slate-400'
              }`}
            />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ar' ? 'تقرير نتيجة الاختبار' : 'Exam Performance Report'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {evalResult.passed
                ? lang === 'ar'
                  ? 'تهانينا! لقد حققت متطلبات النجاح وتجاوزت نسبة الإتقان'
                  : 'Congratulations! You successfully mastered the concepts'
                : lang === 'ar'
                ? 'فرصة ممتازة للتعلم ومراجعة الأخطاء لتثبيت المعلومات'
                : 'A great learning opportunity. Review mistakes to reinforce concepts'}
            </p>
          </div>

          {/* Big Percentage & Score */}
          <div className="py-2">
            <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white flex items-center justify-center gap-1">
              <span>{evalResult.percentage}</span>
              <span className="text-2xl text-slate-400 font-bold">%</span>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300">
              <span>
                {lang === 'ar'
                  ? `${evalResult.correct} إجابات صحيحة من أصل ${evalResult.total}`
                  : `${evalResult.correct} correct out of ${evalResult.total}`}
              </span>
              <span className="text-emerald-400 font-black">
                ({evalResult.gradeAr})
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {mistakeCount > 0 && (
              <button
                onClick={onRetestMistakes}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-rose-900/30 transition cursor-pointer"
              >
                <AlertCircle className="w-4 h-4" />
                <span>
                  {lang === 'ar'
                    ? `اختبر أخطائك فقط (${mistakeCount} أسئلة)`
                    : `Retest Mistakes (${mistakeCount})`}
                </span>
              </button>
            )}

            <button
              onClick={onRetake}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'إعادة الاختبار كاملاً' : 'Retake Full Exam'}</span>
            </button>

            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-bold border border-slate-700 transition cursor-pointer"
            >
              <Home className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'لوحة التحكم الرئيسية' : 'Dashboard'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Item-by-item breakdown */}
      <div className="space-y-3">
        <h2 className="text-sm font-extrabold text-slate-300 px-1">
          {lang === 'ar' ? 'مراجعة جميع الأسئلة والشروحات' : 'Review All Questions & Rationales'}
        </h2>

        {questions.map((q, idx) => {
          const selectedIdx = userAnswers[q.id];
          const isCorrect = selectedIdx === q.correctIndex;
          const isExpanded = expandedId === q.id;

          return (
            <div
              key={q.id}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isCorrect
                  ? 'bg-slate-900/70 border-slate-800'
                  : 'bg-rose-950/20 border-rose-900/50'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                className="w-full p-4 flex items-center justify-between gap-3 text-right cursor-pointer hover:bg-slate-800/40"
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200 line-clamp-1">
                    {idx + 1}. {lang === 'ar' ? q.questionAr : q.questionEn}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-md font-bold ${
                      isCorrect
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}
                  >
                    {isCorrect
                      ? lang === 'ar'
                        ? 'صحيح'
                        : 'Correct'
                      : lang === 'ar'
                      ? 'خطأ'
                      : 'Wrong'}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 space-y-4 text-xs sm:text-sm">
                  {/* Question full text */}
                  <div className="text-white font-semibold leading-relaxed">
                    {lang === 'ar' ? q.questionAr : q.questionEn}
                  </div>

                  {/* Options status */}
                  <div className="space-y-2">
                    {(lang === 'ar' ? q.optionsAr : q.optionsEn).map((opt, oIdx) => {
                      const isOptionCorrect = oIdx === q.correctIndex;
                      const isUserChoice = oIdx === selectedIdx;

                      let style = 'bg-slate-900 border-slate-800 text-slate-400';
                      if (isOptionCorrect) {
                        style = 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold';
                      } else if (isUserChoice && !isOptionCorrect) {
                        style = 'bg-rose-950/60 border-rose-500/60 text-rose-200 line-through';
                      }

                      return (
                        <div
                          key={oIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${style}`}
                        >
                          <span>{opt}</span>
                          <span className="text-[10px] font-bold">
                            {isOptionCorrect && '✓ الإجابة الصحيحة'}
                            {isUserChoice && !isOptionCorrect && '✗ اختيارك'}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Deep explanation */}
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'التوضيح الطبي:' : 'Rationale:'}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed text-xs">
                      {lang === 'ar' ? q.explanationAr : q.explanationEn}
                    </p>
                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                      📖 ص {q.pageNumber} - {q.referencePdf}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
