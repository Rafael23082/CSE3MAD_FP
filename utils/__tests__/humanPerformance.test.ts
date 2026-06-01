import {
  calcAvgVibration,
  calcSmoothnessScore,
  rateCoordination,
} from '../humanPerformance';

describe('calcAvgVibration', () => {
  it('calculates average of absolute readings', () => {
    expect(calcAvgVibration([1, 2, 3])).toBeCloseTo(2, 4);
  });

  it('handles negative readings (sensor direction)', () => {
    expect(calcAvgVibration([-2, 3, -1])).toBeCloseTo(2, 4);
  });

  it('returns 0 for empty array', () => {
    expect(calcAvgVibration([])).toBe(0);
  });
});

describe('calcSmoothnessScore', () => {
  it('returns 0 for less than 2 readings', () => {
    expect(calcSmoothnessScore([5])).toBe(0);
  });

  it('calculates standard deviation', () => {
    const result = calcSmoothnessScore([1, 2, 3, 4, 5]);
    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThan(2);
  });
});

describe('rateCoordination', () => {
  it('returns Excellent for very low smoothness score', () => {
    expect(rateCoordination(0.3).level).toBe('Excellent');
  });

  it('returns Needs Practice for high smoothness score', () => {
    expect(rateCoordination(3.0).level).toBe('Needs Practice');
  });
});
