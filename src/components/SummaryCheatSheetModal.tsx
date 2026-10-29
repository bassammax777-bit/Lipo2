import React, { useState } from 'react';
import { X, BookOpen, Layers, Flame, HeartPulse, Activity } from 'lucide-react';

interface SummaryCheatSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const SummaryCheatSheetModal: React.FC<SummaryCheatSheetModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<'lipoproteins' | 'lipases' | 'pathways' | 'lipidosis'>('lipoproteins');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-teal-900/40 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {lang === 'ar' ? 'ملخص الجداول والمقارنات السريرية' : 'High-Yield Clinical Summary Tables'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar'
                  ? 'مستخلصة مباشرة من مذكرات د. سعيد عرابي لسرعة المراجعة والحفظ'
                  : 'Extracted directly from Prof. Said Oraby biochemistry lectures'}
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

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 py-2 gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('lipoproteins')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lipoproteins'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'البروتينات الدهنية (Lipoproteins)' : 'Lipoproteins'}</span>
          </button>

          <button
            onClick={() => setActiveTab('lipases')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lipases'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إنزيمات الليباز (Lipases)' : 'Lipases'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pathways')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pathways'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'مقارنة مسارات الدهون (Pathways)' : 'Pathways Matrix'}</span>
          </button>

          <button
            onClick={() => setActiveTab('lipidosis')}
            className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'lipidosis'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'أمراض التخزين الشحمي (Lipidosis)' : 'Lipidosis Diseases'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'lipoproteins' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                <table className="w-full text-right border-collapse text-slate-300">
                  <thead className="bg-slate-800/90 text-white font-bold text-xs uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-700">الكسر (Fraction)</th>
                      <th className="p-3 border-b border-slate-700">المصدر (Source)</th>
                      <th className="p-3 border-b border-slate-700">الدهن الأساسي</th>
                      <th className="p-3 border-b border-slate-700">نسبة البروتين</th>
                      <th className="p-3 border-b border-slate-700">أنواع Apoproteins</th>
                      <th className="p-3 border-b border-slate-700">الهجرة الكهربائية</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-emerald-400">Chylomicrons</td>
                      <td className="p-3">الأمعاء (Intestine)</td>
                      <td className="p-3">Triacylglycerols (90%)</td>
                      <td className="p-3 font-mono">2%</td>
                      <td className="p-3">A, B48, C, E</td>
                      <td className="p-3 text-slate-400">نقطة البداية (Origin)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-cyan-400">VLDL</td>
                      <td className="p-3">الكبد (Liver)</td>
                      <td className="p-3">Triacylglycerols (60%)</td>
                      <td className="p-3 font-mono">10%</td>
                      <td className="p-3">B100, C, E</td>
                      <td className="p-3 text-slate-400">Pre-β lipoprotein</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-amber-400">LDL</td>
                      <td className="p-3">الدم (من VLDL)</td>
                      <td className="p-3">كوليسترول وإستراته (50%)</td>
                      <td className="p-3 font-mono">22%</td>
                      <td className="p-3">B100</td>
                      <td className="p-3 text-slate-400">β-lipoprotein</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-purple-400">HDL</td>
                      <td className="p-3">الكبد (Liver)</td>
                      <td className="p-3">فوسفوليبيدات وكوليسترول</td>
                      <td className="p-3 font-mono text-emerald-300 font-bold">50%</td>
                      <td className="p-3">A-1, C, D, E</td>
                      <td className="p-3 text-slate-400">α-lipoprotein (أسرع نحو المصعد)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-rose-400">FFA-Albumin</td>
                      <td className="p-3">النسيج الدهني</td>
                      <td className="p-3">Free Fatty Acids (FFA)</td>
                      <td className="p-3 font-mono">99%</td>
                      <td className="p-3">Albumin</td>
                      <td className="p-3 text-slate-400">Albumin complex</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                💡 <strong className="text-slate-200">قاعدة ذهبية:</strong> ترتيب الكثافة بالطرد المركزي الفائق: Chylomicrons &lt; VLDL &lt; LDL &lt; HDL. بينما ترتيب الهجرة الكهربائية من القطب السالب إلى الموجب: Chylomicrons (Origin) ثم β (LDL) ثم Pre-β (VLDL) ثم α (HDL).
              </div>
            </div>
          )}

          {activeTab === 'lipases' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                <table className="w-full text-right border-collapse text-slate-300">
                  <thead className="bg-slate-800/90 text-white font-bold text-xs uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-700">الإنزيم (Enzyme)</th>
                      <th className="p-3 border-b border-slate-700">المصدر</th>
                      <th className="p-3 border-b border-slate-700">مكان العمل</th>
                      <th className="p-3 border-b border-slate-700">الوظيفة</th>
                      <th className="p-3 border-b border-slate-700">خصائص مميزة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">Gastric lipase</td>
                      <td className="p-3">المعدة</td>
                      <td className="p-3">المعدة</td>
                      <td className="p-3">هضم دهون الحليب لدى الرضع</td>
                      <td className="p-3 text-amber-300">يحتاج pH حمضي (5) وغير نشط بالبالغين</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">Pancreatic lipase</td>
                      <td className="p-3">البنكرياس</td>
                      <td className="p-3">الأمعاء الدقيقة</td>
                      <td className="p-3">شطر دهون الطعام عند الموضع 1 و 3</td>
                      <td className="p-3 text-emerald-300">يحتاج إلى Colipase وأملاح الصفراء</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">Lipoprotein lipase (LPL)</td>
                      <td className="p-3">الدم وبطانة الأوعية</td>
                      <td className="p-3">جدار الشعيرات الدموية</td>
                      <td className="p-3">تكسير ثلاثي الجليسريد في Chylomicrons و VLDL</td>
                      <td className="p-3 text-cyan-300">يفرز بالهيبارين وينشطه Apo C-II</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">Hormone-sensitive lipase</td>
                      <td className="p-3">النسيج الدهني</td>
                      <td className="p-3">النسيج الدهني</td>
                      <td className="p-3">تحليل مخزون الدهون أثناء الصيام</td>
                      <td className="p-3 text-rose-300">ينشطه cAMP والجلوكاجون ويوقفه الأنسولين</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-white">Hepatic lipase</td>
                      <td className="p-3">الكبد</td>
                      <td className="p-3">الكبد</td>
                      <td className="p-3">إزالة الأحماض الدهنية من بقايا الكيلوميكرون و HDL</td>
                      <td className="p-3 text-purple-300">يعمل في خلايا الكبد</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'pathways' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                <table className="w-full text-right border-collapse text-slate-300">
                  <thead className="bg-slate-800/90 text-white font-bold text-xs uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-700">المسار</th>
                      <th className="p-3 border-b border-slate-700">المكان الخلوي والعضوي</th>
                      <th className="p-3 border-b border-slate-700">الإنزيم المفتاحي (Key Enzyme)</th>
                      <th className="p-3 border-b border-slate-700">التنظيم الرئيسي</th>
                      <th className="p-3 border-b border-slate-700">المرض المرتبط</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-emerald-400">FA Synthesis</td>
                      <td className="p-3">Cytosol (الكبد والنسيج الدهني)</td>
                      <td className="p-3 font-semibold text-white">Acetyl CoA carboxylase</td>
                      <td className="p-3">ينشطه الأنسولين والسترات، يثبطه الجلوكاجون</td>
                      <td className="p-3 text-slate-400">الكبد الدهني</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-rose-400">FA Oxidation (β)</td>
                      <td className="p-3">Mitochondria (الكبد، العضلات، الكلى)</td>
                      <td className="p-3 font-semibold text-white">Carnitine Palmitoyl Transferase I</td>
                      <td className="p-3">يثبطه Malonyl CoA بقوة</td>
                      <td className="p-3 text-slate-400">متلازمة نقص الكارنيتين</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-purple-400">Ketogenesis</td>
                      <td className="p-3">Mitochondria (الكبد فقط)</td>
                      <td className="p-3 font-semibold text-white">HMG-CoA synthase</td>
                      <td className="p-3">يحفزه الصيام وغياب الأنسولين وارتفاع الأحماض الحرة</td>
                      <td className="p-3 text-rose-400 font-bold">الحماض الكيتوني (Ketosis/DKA)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-cyan-400">Cholesterol Synthesis</td>
                      <td className="p-3">Cytosol (الكبد أساساً)</td>
                      <td className="p-3 font-semibold text-white">HMG-CoA reductase</td>
                      <td className="p-3">تغذية راجعة سلبية بالكوليسترول، وتثبيطه بالستاتينات</td>
                      <td className="p-3 text-slate-400">تصلب الشرايين (Atherosclerosis)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'lipidosis' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-xl border border-slate-700/80">
                <table className="w-full text-right border-collapse text-slate-300">
                  <thead className="bg-slate-800/90 text-white font-bold text-xs uppercase">
                    <tr>
                      <th className="p-3 border-b border-slate-700">المرض (Disease)</th>
                      <th className="p-3 border-b border-slate-700">الإنزيم الناقص (Enzyme Deficient)</th>
                      <th className="p-3 border-b border-slate-700">المادة المتراكمة</th>
                      <th className="p-3 border-b border-slate-700">الأعراض السريرية المميزة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-amber-300">Gaucher’s disease</td>
                      <td className="p-3">Glucocerebrosidase</td>
                      <td className="p-3">Glucocerebroside</td>
                      <td className="p-3">تضخم الكبد والطحال، تأخر عقلي، تآكل العظام</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-rose-300">Niemann-Pick disease</td>
                      <td className="p-3">Sphingomyelinase</td>
                      <td className="p-3">Sphingomyelin</td>
                      <td className="p-3">تضخم الكبد والطحال، بقعة كرزية بالعين، وفاة مبكرة</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-purple-300">Tay-Sachs disease</td>
                      <td className="p-3">Hexosaminidase A</td>
                      <td className="p-3">Ganglioside GM2</td>
                      <td className="p-3">تأخر عقلي حاد، عمى، بقعة كرزية حمراء (لا تضخم كبدي)</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-cyan-300">Krabbe’s disease</td>
                      <td className="p-3">Galactocerebrosidase</td>
                      <td className="p-3">Galactocerebroside</td>
                      <td className="p-3">غياب شبه تام للميالين، تلف عصبي شديد</td>
                    </tr>
                    <tr className="hover:bg-slate-800/50">
                      <td className="p-3 font-bold text-emerald-300">Fabry’s disease</td>
                      <td className="p-3">Ceramide trihexosidase</td>
                      <td className="p-3">Globosides</td>
                      <td className="p-3">طفح جلدي، فشل كلوي، وراثة مرتبط بالجنس X-linked</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق الملخص' : 'Close Summary'}
          </button>
        </div>
      </div>
    </div>
  );
};
