import React from 'react';
import {
  Flame,
  Volume2,
  VolumeX,
  Languages,
  Calculator,
  BookOpen,
  Award,
  AlertCircle,
  Dna,
} from 'lucide-react';
import { UserStats } from '../types/quiz';
import { calculateLevel } from '../utils/quizLogic';

interface NavbarProps {
  stats: UserStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  onOpenAtpCalc: () => void;
  onOpenCheatSheet: () => void;
  onOpenMistakes: () => void;
  onGoHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  soundEnabled,
  onToggleSound,
  lang,
  onToggleLang,
  onOpenAtpCalc,
  onOpenCheatSheet,
  onOpenMistakes,
  onGoHome,
}) => {
  const levelInfo = calculateLevel(stats.xp);
  const mistakeCount = stats.mistakeQuestionIds.length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-3 text-right group transition focus:outline-none"
          title="الرئيسية"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Dna className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="text-sm font-black tracking-wide bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              {lang === 'ar' ? 'امتحانات كيمياء الدهون' : 'Lipid Biochem Exam Pro'}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              {lang === 'ar' ? 'شروحات وتغذية راجعة فورية' : 'Instant Feedback & Explanations'}
            </div>
          </div>
        </button>

        {/* Center: Tools and Shortcuts */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={onOpenAtpCalc}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-emerald-500/50 transition cursor-pointer"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'حاسبة طاقة ATP' : 'ATP Calculator'}</span>
          </button>

          <button
            onClick={onOpenCheatSheet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-teal-500/50 transition cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'ar' ? 'ملخص الجداول' : 'Cheat Sheet'}</span>
          </button>

          {mistakeCount > 0 && (
            <button
              onClick={onOpenMistakes}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition cursor-pointer animate-pulse-subtle"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>
                {lang === 'ar' ? `بنك أخطائي (${mistakeCount})` : `Mistakes (${mistakeCount})`}
              </span>
            </button>
          )}
        </div>

        {/* Right Stats & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Streak indicator */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition ${
              stats.streak > 0
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm shadow-amber-500/10'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}
            title={lang === 'ar' ? `السلسلة الحالية: ${stats.streak}` : `Current streak: ${stats.streak}`}
          >
            <Flame className={`w-3.5 h-3.5 ${stats.streak > 0 ? 'text-amber-400 animate-bounce' : 'text-slate-500'}`} />
            <span>{stats.streak}</span>
          </div>

          {/* Level / XP */}
          <div
            className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-medium text-slate-200"
            title={`${levelInfo.titleAr} (${stats.xp} XP)`}
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-emerald-400">L{levelInfo.level}</span>
            <span className="hidden sm:inline text-slate-300 font-mono text-[11px]">{stats.xp} XP</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل المؤثرات الصوتية'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            aria-label="تبديل اللغة"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 hover:text-white text-xs font-bold transition cursor-pointer"
            title="تبديل اللغة (AR / EN)"
          >
            <Languages className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </div>

      {/* Mobile bar for quick tools */}
      <div className="flex md:hidden items-center justify-around px-2 py-1.5 bg-slate-950/70 border-t border-slate-800/60 text-xs">
        <button
          onClick={onOpenAtpCalc}
          className="flex items-center gap-1 text-slate-300 hover:text-emerald-400 py-1"
        >
          <Calculator className="w-3 h-3 text-emerald-400" />
          <span>{lang === 'ar' ? 'حاسبة ATP' : 'ATP Calc'}</span>
        </button>
        <button
          onClick={onOpenCheatSheet}
          className="flex items-center gap-1 text-slate-300 hover:text-teal-400 py-1"
        >
          <BookOpen className="w-3 h-3 text-teal-400" />
          <span>{lang === 'ar' ? 'الجداول' : 'Tables'}</span>
        </button>
        {mistakeCount > 0 && (
          <button
            onClick={onOpenMistakes}
            className="flex items-center gap-1 text-rose-400 font-bold py-1"
          >
            <AlertCircle className="w-3 h-3" />
            <span>{lang === 'ar' ? `أخطائي (${mistakeCount})` : `Mistakes (${mistakeCount})`}</span>
          </button>
        )}
      </div>
    </header>
  );
};
