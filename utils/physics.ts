/**
 * Physics calculation utilities for STEMM Lab activities.
 * Based on formulas from responsibilities.pdf
 */

// ==========================================
// Activity 1: Parachute Drop — Physics
// ==========================================

/**
 * Calculate final velocity
 * v = d / t (distance divided by time)
 */
export function calcFinalVelocity(height: number, time: number): number {
  if (time <= 0 || height <= 0) return 0;
  return height / time;
}

/**
 * Calculate acceleration
 * a = v / t (velocity divided by time)
 */
export function calcAcceleration(velocity: number, time: number): number {
  if (time <= 0) return 0;
  return velocity / time;
}

/**
 * Calculate weight (downward force)
 * weight = mass × g (g = 9.8 m/s²)
 */
export function calcWeight(mass: number): number {
  return mass * 9.8;
}

/**
 * Calculate net force
 * F_net = mass × acceleration
 */
export function calcNetForce(mass: number, acceleration: number): number {
  return mass * acceleration;
}

/**
 * Calculate drag force
 * F_drag = weight - F_net
 */
export function calcDragForce(weight: number, netForce: number): number {
  return Math.max(0, weight - netForce);
}

/**
 * Calculate G-force for no-bounce case
 * g-force = (Δv / contactTime) / 9.8
 * Δv = impact speed (velocity at impact)
 */
export function calcGForceNoBounce(impactSpeed: number, contactTime: number): number {
  if (contactTime <= 0 || impactSpeed <= 0) return 0;
  return (impactSpeed / contactTime) / 9.8;
}

/**
 * Calculate G-force for bounce case
 * g-force = (Δv / contactTime) / 9.8
 * Δv = impact speed + rebound velocity
 */
export function calcGForceBounce(impactSpeed: number, reboundVelocity: number, contactTime: number): number {
  if (contactTime <= 0 || impactSpeed <= 0) return 0;
  const deltaV = impactSpeed + reboundVelocity;
  return (deltaV / contactTime) / 9.8;
}

/**
 * Calculate rebound velocity from time to max height after bounce
 * v_rebound = g × time_to_max_height
 */
export function calcReboundVelocity(timeToMaxHeight: number): number {
  return 9.8 * timeToMaxHeight;
}

/**
 * Estimate G-force injury risk level
 */
export function getGForceRisk(gForce: number): { level: string; description: string } {
  if (gForce <= 5) return { level: 'Safe', description: 'No injury (elevators, standing up quickly)' };
  if (gForce <= 10) return { level: 'Moderate', description: 'Possible bruising (hard falls)' };
  if (gForce <= 30) return { level: 'Serious', description: 'Serious injuries possible (sports collisions)' };
  if (gForce <= 50) return { level: 'Severe', description: 'High risk of severe injury (car crashes)' };
  return { level: 'Critical', description: 'Life-threatening injuries likely' };
}

// ==========================================
// Activity 3: Hand Fan — Force
// ==========================================

/**
 * Calculate estimated force from fan
 * F ≈ k × θ
 * k = stiffness coefficient (N/rad)
 * θ = bend angle in radians
 */
export function calcFanForce(kValue: number, angleDegrees: number): number {
  const theta = angleDegrees * (Math.PI / 180);
  return kValue * theta;
}

// ==========================================
// Activity 2: Sound dB
// ==========================================

/**
 * Get risk level from decibel reading
 */
export function getDecibelRisk(db: number): string {
  if (db <= 60) return 'Safe';
  if (db <= 85) return 'Moderate';
  if (db <= 100) return 'Dangerous';
  return 'Critical';
}

/**
 * Estimate decibels from audio amplitude
 */
export function amplitudeToDb(amplitude: number): number {
  if (amplitude <= 0) return -Infinity;
  return 20 * Math.log10(amplitude);
}

/**
 * Calculate average dB from an array of amplitude levels
 */
export function calcAverageDb(levels: number[]): number {
  if (!levels.length) return -Infinity;
  const avgAmp = levels.reduce((sum, val) => sum + Math.abs(val), 0) / levels.length;
  return amplitudeToDb(avgAmp);
}

// ==========================================
// Common utilities
// ==========================================

/**
 * Convert degrees to radians
 */
export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format a number to a fixed decimal places
 */
export function formatPhysicsValue(value: number, decimals: number = 2): string {
  return value.toFixed(decimals);
}

// ==========================================
// Activity 6: Reaction Board — Statistics
// ==========================================

/**
 * Calculate mean reaction time from an array of times in ms
 */
export function calcMeanReactionTime(times: number[]): number {
  if (!times.length) return 0;
  return times.reduce((a, b) => a + b, 0) / times.length;
}

/**
 * Calculate improvement percentage between two phases
 * Positive value means improvement (faster)
 */
export function calcReactionImprovement(initialMs: number, finalMs: number): number {
  if (initialMs <= 0) return 0;
  return ((initialMs - finalMs) / initialMs) * 100;
}

/**
 * Get reaction time rating
 */
export function rateReactionTime(ms: number): { level: string; emoji: string } {
  if (ms < 200) return { level: 'Excellent', emoji: '🏆' };
  if (ms < 300) return { level: 'Good', emoji: '👍' };
  if (ms < 400) return { level: 'Average', emoji: '👌' };
  if (ms < 600) return { level: 'Below Average', emoji: '💪' };
  return { level: 'Needs Practice', emoji: '🎯' };
}
