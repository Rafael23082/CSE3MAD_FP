import {
  calculateSafetyScore,
  calculateNPI,
  getNPILevel,
  getFlexibilityLabel,
  calculateStabilityScore,
  calculateDampingRatio,
  getDampingLabel,
} from "../physics";

describe("calculateSafetyScore", () => {
  it("returns Excellent for zero values (perfect)", () => {
    const result = calculateSafetyScore(0, 0, 0);
    expect(result.percent).toBe(0);
    expect(result.rating).toBe("Excellent");
  });

  it("returns Poor for max values", () => {
    const result = calculateSafetyScore(100, 100, 100);
    expect(result.percent).toBeGreaterThanOrEqual(80);
    expect(result.rating).toBe("Poor");
  });

  it("returns Fair for mid-range values", () => {
    const result = calculateSafetyScore(2.5, 10, 0.5);
    // velocityNorm=0.5, gNorm=0.5, accuracyNorm=0.5 → rawScore=0.5 → percent=50 → Fair
    expect(result.rating).toBe("Fair");
  });

  it("returns Poor around the Poor boundary", () => {
    const result = calculateSafetyScore(3, 15, 0.6);
    // velocityNorm=0.6, gNorm=0.75, accuracyNorm=0.6 → rawScore=0.63 → percent=63 → Poor
    expect(result.rating).toBe("Poor");
  });

  it("returns Good for low (safe) values", () => {
    // percent < 40 → Good
    const result = calculateSafetyScore(1, 5, 0.2);
    expect(result.rating).toBe("Good");
  });

  it("computes weighted components correctly", () => {
    const result = calculateSafetyScore(5, 20, 1);
    // velocityNorm = min(5/5, 1) = 1, gNorm = min(20/20, 1) = 1, accuracyNorm = min(1/1, 1) = 1
    // rawScore = 0.4*1 + 0.4*1 + 0.2*1 = 1.0
    // percent = 100
    expect(result.rawScore).toBeCloseTo(1.0, 5);
    expect(result.percent).toBeCloseTo(100, 5);
    expect(result.rating).toBe("Poor");
  });
});

describe("calculateNPI", () => {
  it("returns 0 for zero dB", () => {
    expect(calculateNPI(0)).toBe(0);
  });

  it("returns 0 for negative dB", () => {
    expect(calculateNPI(-10)).toBe(0);
  });

  it("returns ~0.588 for 50 dB", () => {
    const npi = calculateNPI(50);
    expect(npi).toBeCloseTo(0.588, 2);
  });

  it("returns 1.0 at 85 dB (threshold boundary)", () => {
    expect(calculateNPI(85)).toBeCloseTo(1.0, 5);
  });

  it("returns > 1 for loud sounds", () => {
    expect(calculateNPI(100)).toBeGreaterThan(1);
    expect(calculateNPI(120)).toBeCloseTo(1.412, 2);
  });
});

describe("getNPILevel", () => {
  it("returns Safe for NPI < 0.5", () => {
    expect(getNPILevel(0)).toBe("Safe");
    expect(getNPILevel(0.49)).toBe("Safe");
  });

  it("returns Warning for NPI between 0.5 and 1.0", () => {
    expect(getNPILevel(0.5)).toBe("Warning");
    expect(getNPILevel(0.75)).toBe("Warning");
    expect(getNPILevel(1.0)).toBe("Warning");
  });

  it("returns Unsafe for NPI > 1.0", () => {
    expect(getNPILevel(1.01)).toBe("Unsafe");
    expect(getNPILevel(2)).toBe("Unsafe");
  });
});

describe("getFlexibilityLabel", () => {
  it("returns High for k < 0.2", () => {
    expect(getFlexibilityLabel(0)).toBe("High");
    expect(getFlexibilityLabel(0.05)).toBe("High");
    expect(getFlexibilityLabel(0.19)).toBe("High");
  });

  it("returns Medium for 0.2 <= k < 1.0", () => {
    expect(getFlexibilityLabel(0.2)).toBe("Medium");
    expect(getFlexibilityLabel(0.5)).toBe("Medium");
    expect(getFlexibilityLabel(0.99)).toBe("Medium");
  });

  it("returns Low for k >= 1.0", () => {
    expect(getFlexibilityLabel(1.0)).toBe("Low");
    expect(getFlexibilityLabel(2.5)).toBe("Low");
    expect(getFlexibilityLabel(100)).toBe("Low");
  });
});

describe("calculateStabilityScore", () => {
  it("returns 100 for zero peak acceleration", () => {
    const result = calculateStabilityScore(0);
    expect(result.score).toBe(100);
    expect(result.rating).toBe("Excellent");
    expect(result.passed).toBe(true);
  });

  it("scores 60 at peakAccel = 2 (high but passing)", () => {
    const result = calculateStabilityScore(2);
    expect(result.score).toBe(60);
    expect(result.rating).toBe("Fair");
    expect(result.passed).toBe(false);
  });

  it("passes at boundary score 70 (peakAccel = 1.5)", () => {
    const result = calculateStabilityScore(1.5);
    expect(result.score).toBe(70);
    expect(result.passed).toBe(true);
  });

  it("fails just below boundary (peakAccel = 1.51)", () => {
    const result = calculateStabilityScore(1.51);
    expect(result.score).toBe(69.8);
    expect(result.passed).toBe(false);
  });

  it("clamps to 0 for very high acceleration", () => {
    const result = calculateStabilityScore(100);
    expect(result.score).toBe(0);
    expect(result.rating).toBe("Poor");
    expect(result.passed).toBe(false);
  });

  it("returns Good for peakAccel near 0.5", () => {
    const result = calculateStabilityScore(0.5);
    // score = 100 - 0.5*20 = 90
    expect(result.score).toBe(90);
    expect(result.rating).toBe("Excellent");
    expect(result.passed).toBe(true);
  });
});

describe("calculateDampingRatio", () => {
  it("returns 1 for empty arrays", () => {
    expect(calculateDampingRatio([], [])).toBe(1);
  });

  it("returns 1 for zero initial readings", () => {
    expect(calculateDampingRatio([0, 0, 0], [5, 10])).toBe(1);
    expect(calculateDampingRatio([0], [5])).toBe(1);
  });

  it("returns 1 when initial and final peaks are equal", () => {
    expect(calculateDampingRatio([1, 2, 3], [1, 2, 3])).toBe(1);
    expect(calculateDampingRatio([5, 10, 8], [3, 10, 7])).toBe(1);
  });

  it("returns < 1 when final peak is smaller (good damping)", () => {
    const ratio = calculateDampingRatio([10, 8, 6], [2, 3, 1]);
    expect(ratio).toBeCloseTo(0.3, 5);
  });

  it("returns > 1 when final peak is larger (amplification)", () => {
    const ratio = calculateDampingRatio([2, 3, 1], [10, 8, 6]);
    expect(ratio).toBeCloseTo(3.333, 3);
  });

  it("handles single-element arrays", () => {
    expect(calculateDampingRatio([5], [2])).toBe(0.4);
  });
});

describe("getDampingLabel", () => {
  it("returns Excellent for ratio < 0.1", () => {
    expect(getDampingLabel(0)).toBe("Excellent");
    expect(getDampingLabel(0.09)).toBe("Excellent");
  });

  it("returns Good for ratio < 0.3", () => {
    expect(getDampingLabel(0.1)).toBe("Good");
    expect(getDampingLabel(0.29)).toBe("Good");
  });

  it("returns Moderate for ratio < 0.5", () => {
    expect(getDampingLabel(0.3)).toBe("Moderate");
    expect(getDampingLabel(0.49)).toBe("Moderate");
  });

  it("returns Poor for ratio < 0.8", () => {
    expect(getDampingLabel(0.5)).toBe("Poor");
    expect(getDampingLabel(0.79)).toBe("Poor");
  });

  it("returns None for ratio >= 0.8", () => {
    expect(getDampingLabel(0.8)).toBe("None");
    expect(getDampingLabel(1.0)).toBe("None");
    expect(getDampingLabel(5)).toBe("None");
  });
});
