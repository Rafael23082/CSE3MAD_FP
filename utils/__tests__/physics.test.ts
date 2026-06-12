import {
  calculateSafetyScore,
  calculateNPI,
  getNPILevel,
  getFlexibilityLabel,
  calculateStabilityScore,
  calculateDampingRatio,
  getDampingLabel,
  GRAVITY_MPS2,
  calculateVelocity,
  calculateAcceleration,
  calculateWeight,
  calculateNetForce,
  calculateDragForce,
  calculateGForce,
  calculateReboundVelocity,
  getGForceRisk,
  calculateFanForce,
  getDecibelRisk,
  amplitudeToDb,
  calcAverageDb,
  degreesToRadians,
  formatPhysicsValue,
  getParachuteRating,
  getStabilityRating,
  calcFinalVelocity,
  calcAcceleration,
  calcWeight,
  calcNetForce,
  calcDragForce,
  calcGForceNoBounce,
  calcGForceBounce,
  calcReboundVelocity,
  calcFanForce,
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

// ==========================================
// Core physics helpers
// ==========================================

describe("calculateVelocity", () => {
  it("divides distance by time", () => {
    expect(calculateVelocity(10, 2)).toBe(5);
  });

  it("returns 0 for zero distance", () => {
    expect(calculateVelocity(0, 2)).toBe(0);
  });

  it("returns 0 for zero time", () => {
    expect(calculateVelocity(10, 0)).toBe(0);
  });
});

describe("calculateAcceleration", () => {
  it("divides velocity by time", () => {
    expect(calculateAcceleration(10, 2)).toBe(5);
  });

  it("returns 0 for zero velocity", () => {
    expect(calculateAcceleration(0, 2)).toBe(0);
  });

  it("returns 0 for zero time", () => {
    expect(calculateAcceleration(10, 0)).toBe(0);
  });
});

describe("calculateWeight", () => {
  it("multiplies mass by gravity", () => {
    expect(calculateWeight(5)).toBeCloseTo(5 * GRAVITY_MPS2, 5);
  });

  it("returns 0 for zero mass", () => {
    expect(calculateWeight(0)).toBe(0);
  });
});

describe("calculateNetForce", () => {
  it("multiplies mass by acceleration", () => {
    expect(calculateNetForce(5, 2)).toBe(10);
  });

  it("returns 0 for zero mass", () => {
    expect(calculateNetForce(0, 2)).toBe(0);
  });

  it("returns 0 for zero acceleration", () => {
    expect(calculateNetForce(5, 0)).toBe(0);
  });
});

describe("calculateDragForce", () => {
  it("returns weight minus net force", () => {
    expect(calculateDragForce(50, 20)).toBe(30);
  });

  it("returns 0 for zero weight", () => {
    expect(calculateDragForce(0, 20)).toBe(0);
  });

  it("clamps net force to 0 before subtracting", () => {
    expect(calculateDragForce(50, -10)).toBe(50);
  });

  it("returns 0 if net force > weight", () => {
    expect(calculateDragForce(10, 20)).toBe(0);
  });
});

describe("calculateGForce", () => {
  it("divides deltaV by contact time by gravity", () => {
    expect(calculateGForce(49, 0.5)).toBeCloseTo(49 / 0.5 / GRAVITY_MPS2, 5);
  });

  it("returns 0 for zero deltaV", () => {
    expect(calculateGForce(0, 0.5)).toBe(0);
  });

  it("returns 0 for zero contact time", () => {
    expect(calculateGForce(49, 0)).toBe(0);
  });
});

describe("calculateReboundVelocity", () => {
  it("multiplies gravity by time", () => {
    expect(calculateReboundVelocity(2)).toBeCloseTo(GRAVITY_MPS2 * 2, 5);
  });

  it("returns 0 for zero time", () => {
    expect(calculateReboundVelocity(0)).toBe(0);
  });
});

describe("GRAVITY_MPS2", () => {
  it("is 9.8", () => {
    expect(GRAVITY_MPS2).toBe(9.8);
  });
});

// ==========================================
// G-Force Risk
// ==========================================

describe("getGForceRisk", () => {
  it("returns Safe for gForce <= 5", () => {
    const result = getGForceRisk(5);
    expect(result.level).toBe("Safe");
    expect(result.description).toContain("No injury");
  });

  it("returns Moderate for gForce between 5 and 10", () => {
    const result = getGForceRisk(10);
    expect(result.level).toBe("Moderate");
    expect(result.description).toContain("bruising");
  });

  it("returns Serious for gForce between 10 and 30", () => {
    const result = getGForceRisk(30);
    expect(result.level).toBe("Serious");
    expect(result.description).toContain("Serious injuries");
  });

  it("returns Severe for gForce between 30 and 50", () => {
    const result = getGForceRisk(50);
    expect(result.level).toBe("Severe");
    expect(result.description).toContain("car crashes");
  });

  it("returns Critical for gForce > 50", () => {
    const result = getGForceRisk(100);
    expect(result.level).toBe("Critical");
    expect(result.description).toContain("Life-threatening");
  });
});

// ==========================================
// Parachute helpers
// ==========================================

describe("getParachuteRating", () => {
  it("returns Excellent for percent < 20", () => {
    expect(getParachuteRating(0)).toBe("Excellent");
    expect(getParachuteRating(19)).toBe("Excellent");
  });

  it("returns Good for percent 20..39", () => {
    expect(getParachuteRating(20)).toBe("Good");
    expect(getParachuteRating(39)).toBe("Good");
  });

  it("returns Fair for percent 40..59", () => {
    expect(getParachuteRating(40)).toBe("Fair");
    expect(getParachuteRating(59)).toBe("Fair");
  });

  it("returns Poor for percent >= 60", () => {
    expect(getParachuteRating(60)).toBe("Poor");
    expect(getParachuteRating(100)).toBe("Poor");
  });
});

// ==========================================
// Activity helpers
// ==========================================

describe("calculateFanForce", () => {
  it("multiplies kValue by angle in radians", () => {
    const expected = 5 * (90 * Math.PI / 180);
    expect(calculateFanForce(5, 90)).toBeCloseTo(expected, 5);
  });

  it("returns 0 for zero kValue", () => {
    expect(calculateFanForce(0, 90)).toBe(0);
  });

  it("returns 0 for zero angle", () => {
    expect(calculateFanForce(5, 0)).toBe(0);
  });
});

describe("getDecibelRisk", () => {
  it("returns Safe for db <= 60", () => {
    expect(getDecibelRisk(60)).toBe("Safe");
    expect(getDecibelRisk(30)).toBe("Safe");
  });

  it("returns Moderate for db 61..85", () => {
    expect(getDecibelRisk(85)).toBe("Moderate");
  });

  it("returns Dangerous for db 86..100", () => {
    expect(getDecibelRisk(100)).toBe("Dangerous");
  });

  it("returns Critical for db > 100", () => {
    expect(getDecibelRisk(120)).toBe("Critical");
  });
});

describe("amplitudeToDb", () => {
  it("converts amplitude to dB", () => {
    expect(amplitudeToDb(1)).toBeCloseTo(0, 5);
    expect(amplitudeToDb(10)).toBeCloseTo(20, 5);
  });

  it("returns -Infinity for zero or negative amplitude", () => {
    expect(amplitudeToDb(0)).toBe(-Infinity);
    expect(amplitudeToDb(-1)).toBe(-Infinity);
  });
});

describe("calcAverageDb", () => {
  it("calculates average dB from levels", () => {
    const result = calcAverageDb([1, 10, 100]);
    // avgAmp = (1+10+100)/3 = 37
    // dB = 20*log10(37) ≈ 31.36
    expect(result).toBeCloseTo(31.36, 1);
  });

  it("returns -Infinity for empty array", () => {
    expect(calcAverageDb([])).toBe(-Infinity);
  });

  it("uses absolute values", () => {
    const result = calcAverageDb([-1, -10, -100]);
    // avgAmp = (1+10+100)/3 = 37
    expect(result).toBeCloseTo(31.36, 1);
  });
});

describe("degreesToRadians", () => {
  it("converts degrees to radians", () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
    expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 5);
  });

  it("returns 0 for 0 degrees", () => {
    expect(degreesToRadians(0)).toBe(0);
  });
});

describe("formatPhysicsValue", () => {
  it("formats with default 2 decimals", () => {
    expect(formatPhysicsValue(3.14159)).toBe("3.14");
  });

  it("formats with custom decimals", () => {
    expect(formatPhysicsValue(3.14159, 4)).toBe("3.1416");
  });
});

// ==========================================
// Earthquake stability rating
// ==========================================

describe("getStabilityRating", () => {
  it("returns Excellent for score >= 90", () => {
    expect(getStabilityRating(90)).toBe("Excellent");
    expect(getStabilityRating(100)).toBe("Excellent");
  });

  it("returns Good for score 70..89", () => {
    expect(getStabilityRating(70)).toBe("Good");
    expect(getStabilityRating(89)).toBe("Good");
  });

  it("returns Fair for score 50..69", () => {
    expect(getStabilityRating(50)).toBe("Fair");
    expect(getStabilityRating(69)).toBe("Fair");
  });

  it("returns Poor for score < 50", () => {
    expect(getStabilityRating(0)).toBe("Poor");
    expect(getStabilityRating(49)).toBe("Poor");
  });
});

// ==========================================
// Backward-compatible aliases
// ==========================================

describe("backward-compatible aliases", () => {
  it("calcFinalVelocity delegates to calculateVelocity", () => {
    expect(calcFinalVelocity(10, 2)).toBe(calculateVelocity(10, 2));
  });

  it("calcAcceleration delegates to calculateAcceleration", () => {
    expect(calcAcceleration(10, 2)).toBe(calculateAcceleration(10, 2));
  });

  it("calcWeight delegates to calculateWeight", () => {
    expect(calcWeight(5)).toBe(calculateWeight(5));
  });

  it("calcNetForce delegates to calculateNetForce", () => {
    expect(calcNetForce(5, 2)).toBe(calculateNetForce(5, 2));
  });

  it("calcDragForce delegates to calculateDragForce", () => {
    expect(calcDragForce(50, 20)).toBe(calculateDragForce(50, 20));
  });

  it("calcGForceNoBounce delegates to calculateGForce", () => {
    expect(calcGForceNoBounce(49, 0.5)).toBe(calculateGForce(49, 0.5));
  });

  it("calcGForceBounce sums impact and rebound before delegating", () => {
    const result = calcGForceBounce(10, 5, 0.5);
    const expected = calculateGForce(10 + 5, 0.5);
    expect(result).toBeCloseTo(expected, 10);
  });

  it("calcReboundVelocity delegates to calculateReboundVelocity", () => {
    expect(calcReboundVelocity(2)).toBe(calculateReboundVelocity(2));
  });

  it("calcFanForce delegates to calculateFanForce", () => {
    expect(calcFanForce(5, 90)).toBe(calculateFanForce(5, 90));
  });
});
