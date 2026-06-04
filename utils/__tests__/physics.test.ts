import {
  GRAVITY_MPS2,
  amplitudeToDb,
  calcAcceleration,
  calcAverageDb,
  calcDragForce,
  calcFanForce,
  calcFinalVelocity,
  calcGForceBounce,
  calcGForceNoBounce,
  calcMeanReactionTime,
  calcNetForce,
  calcReactionImprovement,
  calcReboundVelocity,
  calcWeight,
  calculateAcceleration,
  calculateDragForce,
  calculateFanForce,
  calculateGForce,
  calculateNetForce,
  calculateReboundVelocity,
  calculateVelocity,
  calculateWeight,
  degreesToRadians,
  formatPhysicsValue,
  getDecibelRisk,
  getGForceRisk,
  rateReactionTime,
} from "../physics";

describe("core physics helpers", () => {
  it("calculates velocity", () => {
    expect(calculateVelocity(10, 2)).toBeCloseTo(5, 4);
  });

  it("calculates acceleration", () => {
    expect(calculateAcceleration(5, 2)).toBeCloseTo(2.5, 4);
  });

  it("calculates weight", () => {
    expect(calculateWeight(0.2)).toBeCloseTo(1.96, 4);
  });

  it("calculates net force", () => {
    expect(calculateNetForce(0.2, 4)).toBeCloseTo(0.8, 4);
  });

  it("calculates drag force", () => {
    expect(calculateDragForce(1.96, 0.8)).toBeCloseTo(1.16, 4);
  });

  it("calculates g-force", () => {
    expect(calculateGForce(2, 0.05)).toBeCloseTo(4.0816, 4);
  });

  it("calculates rebound velocity", () => {
    expect(calculateReboundVelocity(0.15)).toBeCloseTo(1.47, 2);
  });

  it("keeps the gravity constant stable", () => {
    expect(GRAVITY_MPS2).toBe(9.8);
  });
});

describe("compatibility aliases", () => {
  it("keeps legacy velocity and force helpers working", () => {
    expect(calcFinalVelocity(10, 2)).toBeCloseTo(5, 4);
    expect(calcAcceleration(5, 2)).toBeCloseTo(2.5, 4);
    expect(calcWeight(0.2)).toBeCloseTo(1.96, 4);
    expect(calcNetForce(0.2, 4)).toBeCloseTo(0.8, 4);
    expect(calcDragForce(1.96, 0.8)).toBeCloseTo(1.16, 4);
    expect(calcGForceNoBounce(2, 0.05)).toBeCloseTo(4.0816, 4);
    expect(calcGForceBounce(2, 1.47, 0.02)).toBeCloseTo(17.7, 1);
    expect(calcReboundVelocity(0.15)).toBeCloseTo(1.47, 2);
    expect(calcFanForce(0.05, 30)).toBeCloseTo(0.026, 2);
  });
});

describe("risk and formatting helpers", () => {
  it("classifies g-force risk", () => {
    expect(getGForceRisk(3).level).toBe("Safe");
    expect(getGForceRisk(7).level).toBe("Moderate");
    expect(getGForceRisk(20).level).toBe("Serious");
    expect(getGForceRisk(40).level).toBe("Severe");
    expect(getGForceRisk(100).level).toBe("Critical");
  });

  it("classifies sound levels", () => {
    expect(getDecibelRisk(30)).toBe("Safe");
    expect(getDecibelRisk(70)).toBe("Moderate");
    expect(getDecibelRisk(90)).toBe("Dangerous");
    expect(getDecibelRisk(110)).toBe("Critical");
  });

  it("converts amplitude to db", () => {
    expect(amplitudeToDb(1)).toBe(0);
    expect(amplitudeToDb(0)).toBe(-Infinity);
  });

  it("calculates average db", () => {
    expect(calcAverageDb([0.1, 0.2, 0.15])).toBeLessThan(0);
    expect(calcAverageDb([])).toBe(-Infinity);
  });

  it("formats values", () => {
    expect(formatPhysicsValue(3.14159)).toBe("3.14");
    expect(formatPhysicsValue(3.14159, 3)).toBe("3.142");
  });
});

describe("reaction helpers", () => {
  it("calculates mean reaction time", () => {
    expect(calcMeanReactionTime([100, 200, 300])).toBe(200);
  });

  it("calculates reaction improvement", () => {
    expect(calcReactionImprovement(300, 200)).toBeCloseTo(33.3333, 3);
  });

  it("rates reaction time", () => {
    expect(rateReactionTime(150).level).toBe("Excellent");
    expect(rateReactionTime(700).level).toBe("Needs Practice");
  });
});

describe("angles", () => {
  it("converts degrees to radians", () => {
    expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 5);
  });

  it("aliases the fan force helper", () => {
    expect(calculateFanForce(0.05, 30)).toBeCloseTo(calcFanForce(0.05, 30), 6);
  });
});
