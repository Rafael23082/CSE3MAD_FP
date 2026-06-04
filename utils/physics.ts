/**
 * Physics calculation utilities for STEMM Lab activities.
 */

export const GRAVITY_MPS2 = 9.8;

export interface GForceRisk {
  level: string;
  description: string;
}

// ==========================================
// Core physics helpers
// ==========================================

export function calculateVelocity(
  distanceMeters: number,
  timeSeconds: number,
): number {
  if (distanceMeters <= 0 || timeSeconds <= 0) return 0;
  return distanceMeters / timeSeconds;
}

export function calculateAcceleration(
  velocityMetersPerSecond: number,
  timeSeconds: number,
): number {
  if (velocityMetersPerSecond <= 0 || timeSeconds <= 0) return 0;
  return velocityMetersPerSecond / timeSeconds;
}

export function calculateWeight(massKg: number): number {
  if (massKg <= 0) return 0;
  return massKg * GRAVITY_MPS2;
}

export function calculateNetForce(
  massKg: number,
  accelerationMetersPerSecondSquared: number,
): number {
  if (massKg <= 0 || accelerationMetersPerSecondSquared <= 0) return 0;
  return massKg * accelerationMetersPerSecondSquared;
}

export function calculateDragForce(
  weightNewtons: number,
  netForceNewtons: number,
): number {
  if (weightNewtons <= 0) return 0;
  return Math.max(0, weightNewtons - Math.max(0, netForceNewtons));
}

export function calculateGForce(
  deltaVelocityMetersPerSecond: number,
  contactTimeSeconds: number,
): number {
  if (deltaVelocityMetersPerSecond <= 0 || contactTimeSeconds <= 0) return 0;
  return deltaVelocityMetersPerSecond / contactTimeSeconds / GRAVITY_MPS2;
}

export function calculateReboundVelocity(
  timeToMaxHeightSeconds: number,
): number {
  if (timeToMaxHeightSeconds <= 0) return 0;
  return GRAVITY_MPS2 * timeToMaxHeightSeconds;
}

export function getGForceRisk(gForce: number): GForceRisk {
  if (gForce <= 5)
    return {
      level: "Safe",
      description: "No injury (elevators, standing up quickly)",
    };
  if (gForce <= 10)
    return { level: "Moderate", description: "Possible bruising (hard falls)" };
  if (gForce <= 30)
    return {
      level: "Serious",
      description: "Serious injuries possible (sports collisions)",
    };
  if (gForce <= 50)
    return {
      level: "Severe",
      description: "High risk of severe injury (car crashes)",
    };
  return { level: "Critical", description: "Life-threatening injuries likely" };
}

// ==========================================
// Activity helpers
// ==========================================

export function calculateFanForce(
  kValue: number,
  angleDegrees: number,
): number {
  if (kValue <= 0 || angleDegrees <= 0) return 0;
  const theta = degreesToRadians(angleDegrees);
  return kValue * theta;
}

export function getDecibelRisk(db: number): string {
  if (db <= 60) return "Safe";
  if (db <= 85) return "Moderate";
  if (db <= 100) return "Dangerous";
  return "Critical";
}

export function amplitudeToDb(amplitude: number): number {
  if (amplitude <= 0) return -Infinity;
  return 20 * Math.log10(amplitude);
}

export function calcAverageDb(levels: number[]): number {
  if (levels.length === 0) return -Infinity;
  const avgAmp =
    levels.reduce((sum, value) => sum + Math.abs(value), 0) / levels.length;
  return amplitudeToDb(avgAmp);
}

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatPhysicsValue(
  value: number,
  decimals: number = 2,
): string {
  return value.toFixed(decimals);
}

// ==========================================
// Reaction board helpers
// ==========================================

export function calcMeanReactionTime(times: number[]): number {
  if (times.length === 0) return 0;
  return times.reduce((sum, value) => sum + value, 0) / times.length;
}

export function calcReactionImprovement(
  initialMs: number,
  finalMs: number,
): number {
  if (initialMs <= 0) return 0;
  return ((initialMs - finalMs) / initialMs) * 100;
}

export function rateReactionTime(ms: number): { level: string; emoji: string } {
  if (ms < 200) return { level: "Excellent", emoji: "🏆" };
  if (ms < 300) return { level: "Good", emoji: "👍" };
  if (ms < 400) return { level: "Average", emoji: "👌" };
  if (ms < 600) return { level: "Below Average", emoji: "💪" };
  return { level: "Needs Practice", emoji: "🎯" };
}

// ==========================================
// Backwards-compatible aliases
// ==========================================

export const calcFinalVelocity = calculateVelocity;
export const calcAcceleration = calculateAcceleration;
export const calcWeight = calculateWeight;
export const calcNetForce = calculateNetForce;
export const calcDragForce = calculateDragForce;
export const calcGForceNoBounce = calculateGForce;
export function calcGForceBounce(
  impactSpeed: number,
  reboundVelocity: number,
  contactTime: number,
): number {
  return calculateGForce(impactSpeed + reboundVelocity, contactTime);
}
export const calcReboundVelocity = calculateReboundVelocity;
export const calcFanForce = calculateFanForce;
