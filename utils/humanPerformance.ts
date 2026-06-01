/**
 * Physics calculation utilities for Human Performance Lab (Activity 5).
 */

/**
 * Calculate average vibration amplitude from an array of sensor readings
 */
export function calcAvgVibration(readings: number[]): number {
  if (!readings.length) return 0;
  return readings.reduce((sum, r) => sum + Math.abs(r), 0) / readings.length;
}

/**
 * Calculate smoothness score (lower = smoother)
 * Uses standard deviation of vibration readings
 */
export function calcSmoothnessScore(readings: number[]): number {
  if (readings.length < 2) return 0;
  const mean = calcAvgVibration(readings);
  const variance = readings.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (readings.length - 1);
  return Math.sqrt(variance);
}

/**
 * Rate coordination quality based on vibration consistency
 */
export function rateCoordination(smoothnessScore: number): { level: string; description: string } {
  if (smoothnessScore <= 0.5) return { level: 'Excellent', description: 'Very smooth and controlled movement' };
  if (smoothnessScore <= 1.0) return { level: 'Good', description: 'Mostly smooth with minor variations' };
  if (smoothnessScore <= 2.0) return { level: 'Moderate', description: 'Some inconsistency in movement' };
  return { level: 'Needs Practice', description: 'Movement is jerky or uncontrolled' };
}
