import {
  calcBreathsPerMinute,
  calcBreathingDepth,
  classifyBreathingRate,
  calcRecoveryRate,
  rateRecovery,
} from '../breathing';

describe('calcBreathsPerMinute', () => {
  it('calculates BPM from intervals in ms', () => {
    const intervals = Array(10).fill(3000);
    expect(calcBreathsPerMinute(intervals)).toBeCloseTo(20, 1);
  });

  it('returns 0 for empty intervals', () => {
    expect(calcBreathsPerMinute([])).toBe(0);
  });
});

describe('calcBreathingDepth', () => {
  it('calculates average absolute chest movement', () => {
    expect(calcBreathingDepth([2, 4, 6])).toBeCloseTo(4, 4);
  });

  it('returns 0 for empty array', () => {
    expect(calcBreathingDepth([])).toBe(0);
  });
});

describe('classifyBreathingRate', () => {
  it('classifies 10 BPM as Slow', () => {
    expect(classifyBreathingRate(10).label).toBe('Slow');
  });

  it('classifies 16 BPM as Normal', () => {
    expect(classifyBreathingRate(16).label).toBe('Normal');
  });

  it('classifies 35 BPM as Rapid', () => {
    expect(classifyBreathingRate(35).label).toBe('Rapid');
  });
});

describe('calcRecoveryRate', () => {
  it('calculates drop in BPM', () => {
    expect(calcRecoveryRate(30, 18)).toBe(12);
  });
});

describe('rateRecovery', () => {
  it('rates fast recovery', () => {
    expect(rateRecovery(12)).toContain('Fast');
  });

  it('rates slow recovery', () => {
    expect(rateRecovery(3)).toContain('Slow');
  });
});
