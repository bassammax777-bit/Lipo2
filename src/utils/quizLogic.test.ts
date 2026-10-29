import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNetAtpForFattyAcid,
  calculateXpGain,
  calculateLevel,
  evaluateExam,
  shuffleQuestionOptions,
} from './quizLogic';
import { Question } from '../types/quiz';

test('calculateNetAtpForFattyAcid for palmitic acid (16 carbons) yields 129 ATP', () => {
  const result = calculateNetAtpForFattyAcid(16);
  assert.equal(result.carbons, 16);
  assert.equal(result.turns, 7);
  assert.equal(result.acetylCoACount, 8);
  assert.equal(result.betaCyclesAtp, 35); // 7 * 5
  assert.equal(result.krebsAtp, 96); // 8 * 12
  assert.equal(result.activationCost, 2);
  assert.equal(result.netAtp, 129); // 35 + 96 - 2 = 129
});

test('calculateNetAtpForFattyAcid for stearic acid (18 carbons) yields 146 ATP', () => {
  const result = calculateNetAtpForFattyAcid(18);
  assert.equal(result.turns, 8);
  assert.equal(result.acetylCoACount, 9);
  assert.equal(result.betaCyclesAtp, 40); // 8 * 5
  assert.equal(result.krebsAtp, 108); // 9 * 12
  assert.equal(result.netAtp, 146); // 40 + 108 - 2 = 146
});

test('calculateXpGain calculates correct XP with difficulty and streak', () => {
  // Correct answer with easy difficulty and no streak
  const xp1 = calculateXpGain(true, 0, 'easy');
  assert.equal(xp1, 15);

  // Correct answer with hard difficulty and 5 streak
  const xp2 = calculateXpGain(true, 5, 'hard');
  assert.equal(xp2, 50); // 40 + min(10, 30) = 50

  // Incorrect answer grants consolation XP
  const xpWrong = calculateXpGain(false, 3, 'hard');
  assert.equal(xpWrong, 5);
});

test('calculateLevel properly tracks student ranks and progress', () => {
  const lvl1 = calculateLevel(0);
  assert.equal(lvl1.level, 1);

  const lvl2 = calculateLevel(150);
  assert.equal(lvl2.level, 2);

  const lvlHigh = calculateLevel(2500);
  assert.equal(lvlHigh.level, 7);
});

test('evaluateExam computes scores, percentages and grades', () => {
  const answers = [
    { questionId: 'q1', selectedOption: 1, isCorrect: true },
    { questionId: 'q2', selectedOption: 0, isCorrect: true },
    { questionId: 'q3', selectedOption: 2, isCorrect: false },
    { questionId: 'q4', selectedOption: 3, isCorrect: true },
  ];
  const evalResult = evaluateExam(answers);
  assert.equal(evalResult.total, 4);
  assert.equal(evalResult.correct, 3);
  assert.equal(evalResult.percentage, 75);
  assert.equal(evalResult.passed, true);
  assert.equal(evalResult.gradeAr, 'جيد');
});

test('shuffleQuestionOptions preserves correct text pairing and re-maps correctIndex', () => {
  const dummyQ: Question = {
    id: 'test_q',
    categoryId: 'fa_oxidation',
    categoryTitleAr: 'أكسدة الدهون',
    categoryTitleEn: 'FA Oxidation',
    difficulty: 'medium',
    questionAr: 'سؤال تجريبي',
    questionEn: 'Sample question',
    optionsAr: ['إجابة أ (صحيحة)', 'إجابة ب', 'إجابة ج', 'إجابة د'],
    optionsEn: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
    correctIndex: 0,
    explanationAr: 'شرح',
    explanationEn: 'Explanation',
    whyCorrectAr: 'السبب',
    commonMistakeAr: 'الخطأ',
    clinicalPearlAr: 'قاعدة',
    referencePdf: 'Doc',
    pageNumber: 1,
  };

  const correctTextAr = dummyQ.optionsAr[dummyQ.correctIndex];
  const correctTextEn = dummyQ.optionsEn[dummyQ.correctIndex];

  // Run multiple shuffles and verify correct text always matches new correctIndex
  const observedPositions = new Set<number>();
  for (let i = 0; i < 50; i++) {
    const shuffled = shuffleQuestionOptions(dummyQ);
    assert.equal(shuffled.optionsAr[shuffled.correctIndex], correctTextAr);
    assert.equal(shuffled.optionsEn[shuffled.correctIndex], correctTextEn);
    assert.equal(shuffled.optionsAr.length, 4);
    assert.equal(shuffled.optionsEn.length, 4);
    observedPositions.add(shuffled.correctIndex);
  }

  // Over 50 shuffles, it should have landed on more than one position (not strictly 0)
  assert.ok(observedPositions.size > 1, 'Shuffled questions must vary positions beyond 0');
});

test('QUESTIONS_BANK contains >= 100 curated questions from lecture PDFs with valid metadata', async () => {
  const { QUESTIONS_BANK } = await import('../data/questions.ts');
  assert.ok(QUESTIONS_BANK.length >= 100, `Expected >= 100 questions, got ${QUESTIONS_BANK.length}`);

  const ids = new Set<string>();
  for (const q of QUESTIONS_BANK) {
    assert.ok(!ids.has(q.id), `Duplicate question id found: ${q.id}`);
    ids.add(q.id);
    assert.equal(q.optionsAr.length, 4, `Question ${q.id} must have 4 Arabic options`);
    assert.equal(q.optionsEn.length, 4, `Question ${q.id} must have 4 English options`);
    assert.ok(q.correctIndex >= 0 && q.correctIndex <= 3, `Question ${q.id} correctIndex out of range`);
    assert.ok(q.questionAr.length > 5, `Question ${q.id} missing questionAr`);
    assert.ok(q.explanationAr.length > 5, `Question ${q.id} missing explanationAr`);
    assert.ok(q.whyCorrectAr.length > 5, `Question ${q.id} missing whyCorrectAr`);
    assert.ok(q.commonMistakeAr.length > 5, `Question ${q.id} missing commonMistakeAr`);
    assert.ok(q.clinicalPearlAr.length > 5, `Question ${q.id} missing clinicalPearlAr`);
    assert.ok(q.referencePdf.length > 3, `Question ${q.id} missing referencePdf`);
    assert.ok(q.pageNumber > 0, `Question ${q.id} missing pageNumber`);
  }
});

