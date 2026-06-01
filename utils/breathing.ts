/**
 * Calculation utilities for Breathing Pace Trainer (Activity 7).
 */

/**
 * Calculate breaths per minute from peak intervals
 * @param intervalsMs Array of time between consecutive breaths in milliseconds
 */
export function calcBreathsPerMinute(intervalsMs: number[]): number {
  if (!intervalsMs.length) return 0;
  const avgIntervalSec = intervalsMs.reduce((a, b) => a + b, 0) / intervalsMs.length / 1000;
  if (avgIntervalSec <= 0) return 0;
  return 60 / avgIntervalSec;
}

/**
 * Calculate breathing depth (average chest movement amplitude)
 */
export function calcBreathingDepth(chestMovements: number[]): number {
  if (!chestMovements.length) return 0;
  return chestMovements.reduce((sum, m) => sum + Math.abs(m), 0) / chestMovements.length;
}

/**
 * Classify breathing rate
 */
export function classifyBreathingRate(bpm: number): { label: string; description: string } {
  if (bpm < 12) return { label: 'Slow', description: 'Below typical resting rate — may indicate deep relaxation' };
  if (bpm <= 20) return { label: 'Normal', description: 'Typical adult resting breathing rate' };
  if (bpm <= 30) return { label: 'Elevated', description: 'Above resting — light to moderate exertion' };
  return { label: 'Rapid', description: 'High breathing rate — heavy exertion or excitement' };
}

/**
 * Calculate recovery rate (drop in bpm between post-exercise readings)
 */
export function calcRecoveryRate(bpmAfter1: number, bpmAfter2: number): number {
  return bpmAfter1 - bpmAfter2;
}

/**
 * Rate recovery
 */
export function rateRecovery(rate: number): string {
  if (rate >= 10) return 'Fast recovery — good cardiovascular fitness';
  if (rate >= 5) return 'Moderate recovery — average cardiovascular fitness';
  return 'Slow recovery — may benefit from more cardiovascular activity';
}
