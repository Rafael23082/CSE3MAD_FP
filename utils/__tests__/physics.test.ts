/**
 * Unit tests for STEMM Lab physics calculation utilities.
 * Based on example calculations from responsibilities.pdf
 */
import {
  calcFinalVelocity,
  calcAcceleration,
  calcWeight,
  calcNetForce,
  calcDragForce,
  calcGForceNoBounce,
  calcGForceBounce,
  calcReboundVelocity,
  getGForceRisk,
  calcFanForce,
  getDecibelRisk,
  calcAverageDb,
  degreesToRadians,
} from '../physics';

// ==========================================
// Activity 1: Parachute Drop — Velocity
// ==========================================
describe('calcFinalVelocity', () => {
  it('calculates velocity from height and time', () => {
    // PDF example: height=1.0m, time=0.5s => v=2.0m/s
    expect(calcFinalVelocity(1.0, 0.5)).toBeCloseTo(2.0, 4);
  });

  it('returns 0 when time is 0', () => {
    expect(calcFinalVelocity(1.0, 0)).toBe(0);
  });

  it('returns 0 when height is 0', () => {
    expect(calcFinalVelocity(0, 0.5)).toBe(0);
  });
});

// ==========================================
// Activity 1: Parachute Drop — Acceleration
// ==========================================
describe('calcAcceleration', () => {
  it('calculates acceleration from velocity and time', () => {
    // PDF example: v=2.0m/s, time=0.5s => a=4.0m/s²
    expect(calcAcceleration(2.0, 0.5)).toBeCloseTo(4.0, 4);
  });

  it('returns 0 when time is 0', () => {
    expect(calcAcceleration(5.0, 0)).toBe(0);
  });
});

// ==========================================
// Activity 1: Parachute Drop — Forces
// ==========================================
describe('calcWeight', () => {
  it('calculates weight (mass × 9.8)', () => {
    // PDF example: mass=0.20kg => weight=1.96N
    expect(calcWeight(0.20)).toBeCloseTo(1.96, 4);
  });

  it('returns 0 for zero mass', () => {
    expect(calcWeight(0)).toBe(0);
  });
});

describe('calcNetForce', () => {
  it('calculates net force (mass × acceleration)', () => {
    // PDF example: mass=0.20kg, accel=4.0m/s² => F_net=0.8N
    expect(calcNetForce(0.20, 4.0)).toBeCloseTo(0.8, 4);
  });
});

describe('calcDragForce', () => {
  it('calculates drag force (weight - net force)', () => {
    // PDF example: weight=1.96N, netForce=0.8N => drag=1.16N
    expect(calcDragForce(1.96, 0.8)).toBeCloseTo(1.16, 4);
  });

  it('returns 0 if net force exceeds weight', () => {
    expect(calcDragForce(1.0, 2.0)).toBe(0);
  });
});

// ==========================================
// Activity 1: Parachute Drop — G-Force
// ==========================================
describe('calcGForceNoBounce', () => {
  it('calculates g-force for no-bounce case', () => {
    // PDF example: impactSpeed=2.0m/s, contactTime=0.05s => g-force≈4.1
    const result = calcGForceNoBounce(2.0, 0.05);
    expect(result).toBeCloseTo(4.0816, 1);
  });

  it('returns 0 when contact time is 0', () => {
    expect(calcGForceNoBounce(2.0, 0)).toBe(0);
  });
});

describe('calcGForceBounce', () => {
  it('calculates g-force for bounce case', () => {
    // PDF example: impactSpeed=2.0m/s, rebound=1.47m/s, contactTime=0.02s => g-force≈17.7
    const result = calcGForceBounce(2.0, 1.47, 0.02);
    expect(result).toBeCloseTo(17.7, 1);
  });

  it('handles zero rebound velocity', () => {
    const result = calcGForceBounce(2.0, 0, 0.05);
    expect(result).toBeCloseTo(4.0816, 1);
  });
});

describe('calcReboundVelocity', () => {
  it('calculates rebound velocity from time to max height', () => {
    // PDF example: timeToMaxHeight=0.15s => rebound=1.47m/s
    const result = calcReboundVelocity(0.15);
    expect(result).toBeCloseTo(1.47, 1);
  });
});

// ==========================================
// Activity 1: G-Force Risk Level
// ==========================================
describe('getGForceRisk', () => {
  it('returns "Safe" for g-force <= 5', () => {
    expect(getGForceRisk(3).level).toBe('Safe');
    expect(getGForceRisk(5).level).toBe('Safe');
  });

  it('returns "Moderate" for g-force 5-10', () => {
    expect(getGForceRisk(7.5).level).toBe('Moderate');
  });

  it('returns "Serious" for g-force 10-30', () => {
    expect(getGForceRisk(20).level).toBe('Serious');
  });

  it('returns "Severe" for g-force 30-50', () => {
    expect(getGForceRisk(40).level).toBe('Severe');
  });

  it('returns "Critical" for g-force > 50', () => {
    expect(getGForceRisk(100).level).toBe('Critical');
  });
});

// ==========================================
// Activity 3: Fan Force Calculation
// ==========================================
describe('calcFanForce', () => {
  it('calculates force using F ≈ k × θ', () => {
    // Paper example: k=0.05, 30° => θ≈0.524, F=0.026N
    const result = calcFanForce(0.05, 30);
    expect(result).toBeCloseTo(0.026, 2);
  });

  it('calculates force for cardboard (higher k)', () => {
    // Cardboard: k=0.5, 30° => θ≈0.524, F=0.26N
    const result = calcFanForce(0.5, 30);
    expect(result).toBeCloseTo(0.26, 1);
  });

  it('returns 0 for 0 degree angle', () => {
    expect(calcFanForce(0.2, 0)).toBe(0);
  });
});

// ==========================================
// Activity 2: Decibel Risk
// ==========================================
describe('getDecibelRisk', () => {
  it('returns "Safe" for dB <= 60', () => {
    expect(getDecibelRisk(30)).toBe('Safe');
    expect(getDecibelRisk(60)).toBe('Safe');
  });

  it('returns "Moderate" for dB 61-85', () => {
    expect(getDecibelRisk(70)).toBe('Moderate');
    expect(getDecibelRisk(85)).toBe('Moderate');
  });

  it('returns "Dangerous" for dB 86-100', () => {
    expect(getDecibelRisk(90)).toBe('Dangerous');
    expect(getDecibelRisk(100)).toBe('Dangerous');
  });

  it('returns "Critical" for dB > 100', () => {
    expect(getDecibelRisk(110)).toBe('Critical');
    expect(getDecibelRisk(140)).toBe('Critical');
  });
});

// ==========================================
// Activity 2: Average dB Calculation
// ==========================================
describe('calcAverageDb', () => {
  it('calculates average dB from amplitude levels', () => {
    const levels = [0.1, 0.2, 0.15, 0.12, 0.18];
    const avgDb = calcAverageDb(levels);
    // Average amplitude = 0.15, dB = 20*log10(0.15) ≈ -16.48
    expect(avgDb).toBeLessThan(0);
    expect(avgDb).toBeGreaterThan(-20);
  });

  it('returns -Infinity for empty array', () => {
    expect(calcAverageDb([])).toBe(-Infinity);
  });
});

// ==========================================
// Common Utilities
// ==========================================
describe('degreesToRadians', () => {
  it('converts 0° to 0 rad', () => {
    expect(degreesToRadians(0)).toBe(0);
  });

  it('converts 180° to π rad', () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
  });

  it('converts 90° to π/2 rad', () => {
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 5);
  });
});
