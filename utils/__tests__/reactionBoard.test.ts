import { calcMeanReactionTime, calcReactionImprovement, rateReactionTime } from '../physics';

describe('calcMeanReactionTime', () => {
  it('calculates average of reaction times', () => {
    expect(calcMeanReactionTime([200, 300, 400])).toBe(300);
  });

  it('returns 0 for empty array', () => {
    expect(calcMeanReactionTime([])).toBe(0);
  });
});

describe('calcReactionImprovement', () => {
  it('calculates positive improvement (faster)', () => {
    expect(calcReactionImprovement(400, 300)).toBeCloseTo(25, 1);
  });

  it('returns 0 for zero initial time', () => {
    expect(calcReactionImprovement(0, 300)).toBe(0);
  });
});

describe('rateReactionTime', () => {
  it('rates excellent under 200ms', () => {
    expect(rateReactionTime(150).level).toBe('Excellent');
  });

  it('rates needs practice over 600ms', () => {
    expect(rateReactionTime(700).level).toBe('Needs Practice');
  });
});
