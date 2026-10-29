import { Question, CategoryId } from '../types/quiz';
import { DIGESTION_QUESTIONS } from './questions/digestion';
import { FA_OXIDATION_QUESTIONS } from './questions/faOxidation';
import { FA_SYNTHESIS_QUESTIONS } from './questions/faSynthesis';
import { LIPOGENESIS_LIPOLYSIS_QUESTIONS } from './questions/lipogenesisLipolysis';
import { KETONE_BODIES_QUESTIONS } from './questions/ketoneBodies';
import { CHOLESTEROL_FATTY_LIVER_QUESTIONS } from './questions/cholesterolFattyLiver';
import { LIPOPROTEINS_ATHEROSCLEROSIS_QUESTIONS } from './questions/lipoproteinsAtherosclerosis';
import { EICOSANOIDS_PHOSPHOLIPIDS_QUESTIONS } from './questions/eicosanoidsPhospholipids';

export interface CategoryInfo {
  id: CategoryId;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  icon: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'all',
    titleAr: 'جميع المواضيع (امتحان شامل 100+ سؤال)',
    titleEn: 'Comprehensive Exam (All 100+ Topics)',
    descriptionAr: 'اختبار شامل يغطي كامل منهج كيمياء الدهون وأمراضها السريرية بدقة',
    icon: 'GraduationCap',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    id: 'digestion_absorption',
    titleAr: 'هضم وامتصاص الدهون',
    titleEn: 'Lipid Digestion & Absorption',
    descriptionAr: 'الإنزيمات الهاضمة، المذيلات (Micelles)، وسوء الامتصاص (Steatorrhoea)',
    icon: 'Apple',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'fa_oxidation',
    titleAr: 'أكسدة الأحماض الدهنية ومكوك الكارنيتين',
    titleEn: 'Fatty Acid Oxidation & Carnitine',
    descriptionAr: 'أكسدة بيتا، حساب طاقة ATP، أكسدة ألفا وأوميغا، ومرض ريفسوم',
    icon: 'Flame',
    color: 'from-rose-500 to-red-600',
  },
  {
    id: 'fa_synthesis',
    titleAr: 'تصنيع الأحماض الدهنية',
    titleEn: 'Fatty Acid Synthesis (De Novo)',
    descriptionAr: 'معقد إنزيم سينثاز، استطالة السلسلة، ومصادر الـ NADPH',
    icon: 'Dna',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'lipogenesis_lipolysis',
    titleAr: 'تخليق وتكسير الدهون المخزنة والنسيج الدهني',
    titleEn: 'Lipogenesis & Lipolysis',
    descriptionAr: 'الليباز الحساس للهرمونات، الجليسروكاينيز، والنسيج الدهني البني',
    icon: 'Activity',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'ketone_bodies',
    titleAr: 'الأجسام الكيتونية والحماض الكيتوني',
    titleEn: 'Ketone Bodies & Ketosis',
    descriptionAr: 'تخليق وأكسدة الكيتونات، إنزيم ثيوفوريز، وغيبوبة السكر الكيتونية',
    icon: 'Zap',
    color: 'from-purple-500 to-violet-600',
  },
  {
    id: 'cholesterol_fatty_liver',
    titleAr: 'أيض الكوليسترول وأمراض الكبد الدهني',
    titleEn: 'Cholesterol & Fatty Liver',
    descriptionAr: 'تخليق الكوليسترول، أدوية الستاتين، والأملاح الصفراوية والعوامل الشحمية',
    icon: 'ShieldAlert',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'lipoproteins_atherosclerosis',
    titleAr: 'البروتينات الدهنية وتصلب الشرايين',
    titleEn: 'Lipoproteins & Atherosclerosis',
    descriptionAr: 'الكيلوميكرونات، VLDL، LDL، HDL، وخلايا الرغوة (Foam Cells)',
    icon: 'HeartPulse',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'eicosanoids_phospholipids',
    titleAr: 'الإيكوسانويدات والدهون الفوسفاتية والليبيدوسيز',
    titleEn: 'Eicosanoids, Phospholipids & Lipidosis',
    descriptionAr: 'البروستاغلاندينات، الليكوترينات، نيمان بيك، ومرض غوشيه',
    icon: 'Layers',
    color: 'from-indigo-500 to-purple-600',
  },
];

/**
 * Full Question Bank directly extracted from Prof. Said Oraby's 7 lecture notes.
 * Total questions: 104 high-yield medical biochemistry questions with bilingual
 * texts, detailed rationale, common mistake warnings, and exact PDF page citations.
 */
export const QUESTIONS_BANK: Question[] = [
  ...DIGESTION_QUESTIONS,
  ...FA_OXIDATION_QUESTIONS,
  ...FA_SYNTHESIS_QUESTIONS,
  ...LIPOGENESIS_LIPOLYSIS_QUESTIONS,
  ...KETONE_BODIES_QUESTIONS,
  ...CHOLESTEROL_FATTY_LIVER_QUESTIONS,
  ...LIPOPROTEINS_ATHEROSCLEROSIS_QUESTIONS,
  ...EICOSANOIDS_PHOSPHOLIPIDS_QUESTIONS,
];
