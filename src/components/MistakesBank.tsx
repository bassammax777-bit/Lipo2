import React, { useState } from 'react';
import {
  AlertCircle,
  Play,
  RotateCcw,
  CheckCircle2,
  Trash2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { Question } from '../types/quiz';
import { QUESTIONS_BANK } from '../data/questions';

interface MistakesBankProps {
  mistakeIds: string[];
  onStartMistakeQuiz: () => void;
  onRemoveMistake: (id: string) => void;
  onClearAllMistakes: () => void;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const MistakesBank: React.FC<MistakesBankProps> = ({
  mistakeIds,
  onStartMistakeQuiz,
  onRemoveMistake,
  onClearAllMistakes,
  onClose,
  lang,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mistakeQuestions = QUESTIONS_BANK.filter((q) =>
    mistakeIds.includes(q.id)
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Header card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="p-3.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {lang === 'ar' ? 'بنك مراجعة الأخطاء الذكي' : 'Smart Mistakes Bank'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {lang === 'ar'
                ? `لديك ${mistakeQuestions.length} أسئلة بحاجة إلى تثبيت ومراجعة`
                : `You have ${mistakeQuestions.length} questions queued for mastery`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {mistakeQuestions.length > 0 && (
            <button
              onClick={onStartMistakeQuiz}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-500/25 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{lang === 'ar' ? 'بدء اختبار الأخطاء' : 'Test Mistakes Now'}</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
          >
            {lang === 'ar' ? 'رجوع' : 'Back'}
          </button>
        </div>
      </div>

      {/* List of mistakes */}
      {mistakeQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              {lang === 'ar' ? 'سجل الأخطاء نظيف تماماً!' : 'Zero Mistakes!'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'ar'
                ? 'رائع جداً! لقد أجبت على جميع الأسئلة السابقة بشكل صحيح أو أتقنت جميع أخطائك.'
                : 'Outstanding! You have no unresolved mistakes.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-400">
              {lang === 'ar' ? 'اضغط على السؤال للاطلاع على شرحه:' : 'Click to read clinical rationale:'}
            </span>
            <button
              onClick={onClearAllMistakes}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'مسح الكل' : 'Clear All'}</span>
            </button>
          </div>

          {mistakeQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden"
              >
                <div className="p-4 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="flex-1 text-right flex items-center gap-3 cursor-pointer"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {lang === 'ar' ? q.questionAr : q.questionEn}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {lang === 'ar' ? q.categoryTitleAr : q.categoryTitleEn} • ص {q.pageNumber}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onRemoveMistake(q.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
                      title={lang === 'ar' ? 'تم الإتقان (إزالة)' : 'Mark Mastered'}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 text-slate-400 hover:text-white"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 space-y-3 text-xs sm:text-sm">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>
                        {lang === 'ar' ? 'الإجابة النموذجية والشرح:' : 'Correct Answer & Rationale:'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                      ✓ {lang === 'ar' ? q.optionsAr[q.correctIndex] : q.optionsEn[q.correctIndex]}
                    </div>
                    <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      {lang === 'ar' ? q.explanationAr : q.explanationEn}
                    </p>
                    <div className="text-cyan-300 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-900/40 text-xs">
                      💡 <strong>قاعدة طبية:</strong> {q.clinicalPearlAr}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
