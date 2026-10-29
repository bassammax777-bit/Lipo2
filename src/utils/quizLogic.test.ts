import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateNetAtpForFattyAcid,
  calculateXpGain,
  calculateLevel,
  evaluateExam,
} from './quizLogic';

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
