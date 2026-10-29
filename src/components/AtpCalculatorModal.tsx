import React, { useState } from 'react';
import { X, Sparkles, Zap, ArrowLeft, ArrowRight, Dna } from 'lucide-react';
import { calculateNetAtpForFattyAcid } from '../utils/quizLogic';

interface AtpCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

const COMMON_FAS = [
  { nameAr: 'حمض اللوريك (Lauric)', nameEn: 'Lauric acid', carbons: 12 },
  { nameAr: 'حمض الميريستيك (Myristic)', nameEn: 'Myristic acid', carbons: 14 },
  { nameAr: 'حمض البالميتيك (Palmitic)', nameEn: 'Palmitic acid', carbons: 16 },
  { nameAr: 'حمض الستياريك (Stearic)', nameEn: 'Stearic acid', carbons: 18 },
  { nameAr: 'حمض الأراكيديك (Arachidic)', nameEn: 'Arachidic acid', carbons: 20 },
];

export const AtpCalculatorModal: React.FC<AtpCalculatorModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [carbons, setCarbons] = useState<number>(16);

  if (!isOpen) return null;

  const result = calculateNetAtpForFattyAcid(carbons);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-900/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'ar'
                  ? 'حاسبة طاقة أكسدة بيتا للأحماض الدهنية (ATP Yield)'
                  : 'Fatty Acid Beta-Oxidation ATP Yield Calculator'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'مبنية بدقة على معادلة ومذكرات أ.د. سعيد عرابي'
                  : 'Based on Prof. Said Oraby formula'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick presets */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              {lang === 'ar' ? 'أمثلة شائعة في الامتحانات:' : 'High-Yield Exam Examples:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_FAS.map((fa) => (
                <button
                  key={fa.carbons}
                  onClick={() => setCarbons(fa.carbons)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    carbons === fa.carbons
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {lang === 'ar' ? fa.nameAr : fa.nameEn} ({fa.carbons}C)
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Slider */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-200">
                {lang === 'ar' ? 'عدد ذرات الكربون (N):' : 'Number of Carbon Atoms (N):'}
              </span>
              <span className="text-xl font-black text-emerald-400 font-mono px-3 py-0.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30">
                {carbons} C
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="2"
              value={carbons}
              onChange={(e) => setCarbons(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>4C (Butyric)</span>
              <span>16C (Palmitic)</span>
              <span>24C (Lignoceric)</span>
            </div>
          </div>

          {/* Big Result Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-cyan-950/30 border border-emerald-500/30 shadow-lg text-center relative overflow-hidden">
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold mb-1">
              {lang === 'ar' ? 'صافي الطاقة الناتجة (Net Energy Gain)' : 'Net Energy Yield'}
            </div>
            <div className="text-4xl sm:text-5xl font-black text-white font-mono flex items-center justify-center gap-2">
              <span>{result.netAtp}</span>
              <span className="text-emerald-400 text-2xl font-bold">ATP</span>
            </div>
            <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-950/70 py-1 px-3 rounded-lg inline-block border border-slate-800">
              {result.formulaString}
            </div>
          </div>

          {/* Detailed Step-by-Step Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'ar' ? 'الخطوات والتحليل التفصيلي:' : 'Step-by-Step Biochemical Calculation:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 mb-1">
                  {lang === 'ar' ? '1. عدد دورات أكسدة بيتا (Turns):' : '1. Beta-Oxidation Cycles (Turns):'}
                </div>
                <div className="text-base font-bold text-slate-200 font-mono">
                  (N/2 - 1) = ({carbons}/2 - 1) = <span className="text-emerald-400">{result.turns}</span> دورات
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  كل دورة تنتج: 1 FADH2 (2 ATP) + 1 NADH+H+ (3 ATP) = 5 ATP
                </div>
                <div className="text-emerald-400 font-bold mt-1">
                  المجموع من الدورات = {result.turns} × 5 = {result.betaCyclesAtp} ATP
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 mb-1">
                  {lang === 'ar' ? '2. جزيئات Acetyl CoA الناتجة:' : '2. Acetyl CoA Molecules:'}
                </div>
                <div className="text-base font-bold text-slate-200 font-mono">
                  (N/2) = ({carbons}/2) = <span className="text-cyan-400">{result.acetylCoACount}</span> Acetyl CoA
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  كل جزيء يتأكسد في دورة كريبس لينتج: 12 ATP
                </div>
                <div className="text-cyan-400 font-bold mt-1">
                  المجموع من كريبس = {result.acetylCoACount} × 12 = {result.krebsAtp} ATP
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 mb-1">
                  {lang === 'ar' ? '3. إجمالي الطاقة المنتجة (Gross):' : '3. Gross ATP Produced:'}
                </div>
                <div className="text-base font-bold text-slate-200 font-mono">
                  {result.betaCyclesAtp} + {result.krebsAtp} = <span className="text-white">{result.grossAtp}</span> ATP
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-slate-400 mb-1">
                  {lang === 'ar' ? '4. الطاقة المستهلكة في التنشيط:' : '4. Activation Energy Utilized:'}
                </div>
                <div className="text-base font-bold text-rose-400 font-mono">
                  -2 ATP (ATP → AMP + PPi)
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  تحدث مرة واحدة فقط في البداية بواسطة إنزيم Acyl CoA synthetase.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق الحاسبة' : 'Close Calculator'}
          </button>
        </div>
      </div>
    </div>
  );
};
