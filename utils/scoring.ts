/**
 * Physics-based leaderboard scoring for STEMM Lab activities.
 */
import {
  calculateSafetyScore,
  calculateStabilityScore,
  calculateNPI,
} from './physics';

export interface ActivityScore {
  activityKey: string;
  score: number;
}

export interface OverallScore {
  total: number;
  perActivity: ActivityScore[];
}

/**
 * Calculate composite score for a single activity based on its logs.
 * Returns a value 0-100 for the activity (higher = better).
 */
export function calculateCompositeScore(logs: any[], activityKey: string): number {
  if (!logs || logs.length === 0) return 0;

  switch (activityKey) {
    case 'parachute-drop-challenge': {
      // Lower safety score = safer = higher leaderboard score (inverted)
      const scores = logs.map((log: any) => {
        const impactSpeed = log.impactSpeed || 0;
        const gForce = log.gForce || 0;
        const recordedTime = log.recordedTime || 0;
        const predictedTime = log.predictedTime || 0;
        const accuracyError = predictedTime > 0
          ? Math.abs(recordedTime - predictedTime) / predictedTime
          : 0;
        const result = calculateSafetyScore(impactSpeed, gForce, accuracyError);
        return result.percent;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.max(0, Math.round(100 - avg));
    }

    case 'sound-pollution-hunter': {
      // Inverse of NPI: lower dB = higher score
      const dbs = logs.map((log: any) => log.db || 0);
      const filteredDbs = dbs.filter((d: number) => d > 0);
      if (filteredDbs.length === 0) return 0;
      const avgDb = filteredDbs.reduce((a: number, b: number) => a + b, 0) / filteredDbs.length;
      const npi = calculateNPI(avgDb);
      return Math.max(0, Math.round(100 - npi * 100));
    }

    case 'hand-fan-challenge': {
      // Inverse of force: lower force = higher score
      const forces = logs.map((log: any) => log.forceN || 0);
      const filteredForces = forces.filter((f: number) => f > 0);
      if (filteredForces.length === 0) return 0;
      const avgForce = filteredForces.reduce((a: number, b: number) => a + b, 0) / filteredForces.length;
      return Math.max(0, Math.round(100 - avgForce * 200));
    }

    case 'earthquake-resistant-structure': {
      // Higher stability score = better
      const scores = logs.map((log: any) => {
        const peakAccel = log.recordedPeak ?? log.peakAccel ?? 0;
        const result = calculateStabilityScore(peakAccel);
        return result.score;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.max(0, Math.min(100, Math.round(avg)));
    }

    case 'breathing-pace-trainer': {
      // Closer to 15 BPM = higher score
      const bpms = logs.map((log: any) => log.breathsPerMinute || 0);
      const filteredBpms = bpms.filter((b: number) => b > 0);
      if (filteredBpms.length === 0) return 0;
      const avgBpm = filteredBpms.reduce((a: number, b: number) => a + b, 0) / filteredBpms.length;
      return Math.max(0, Math.round(100 - Math.abs(avgBpm - 15) * 5));
    }

    case 'reaction-board-challenge': {
      // Faster reaction = higher score
      const times = logs.map((log: any) => log.recordedMs || 0);
      const filteredTimes = times.filter((t: number) => t > 0);
      if (filteredTimes.length === 0) return 0;
      const avgTime = filteredTimes.reduce((a: number, b: number) => a + b, 0) / filteredTimes.length;
      return Math.max(0, Math.round(100 - avgTime / 10));
    }

    case 'stretch-speed-and-gracefulness': {
      // Lower vibration = smoother = higher score
      const vibrations = logs.map((log: any) => log.vibrationMm || 0);
      const filteredVib = vibrations.filter((v: number) => v > 0);
      if (filteredVib.length === 0) return 0;
      const avgVibration = filteredVib.reduce((a: number, b: number) => a + b, 0) / filteredVib.length;
      return Math.max(0, Math.round(100 - avgVibration * 20));
    }

    default:
      return 0;
  }
}

/**
 * Calculate overall score across all submissions for a team.
 * Returns total score (sum of per-activity averages) and per-activity breakdown.
 */
export function calculateOverallScore(submissions: any[]): OverallScore {
  if (!submissions || submissions.length === 0) {
    return { total: 0, perActivity: [] };
  }

  const activityScores: Record<string, number[]> = {};

  for (const sub of submissions) {
    const key = sub.activityKey;
    if (!key) continue;
    const score = calculateCompositeScore(sub.logs || [], key);
    if (!activityScores[key]) activityScores[key] = [];
    activityScores[key].push(score);
  }

  const perActivity: ActivityScore[] = Object.entries(activityScores).map(([key, scores]) => ({
    activityKey: key,
    score: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }));

  const total = perActivity.reduce((sum, a) => sum + a.score, 0);

  return { total, perActivity };
}

const explanations: Record<string, string> = {
  'parachute-drop-challenge':
    'Based on landing safety: lower impact speed and g-force = higher score. Scored 0-100 per trial, averaged.',
  'sound-pollution-hunter':
    'Based on Noise Pollution Index (NPI): lower average dB = higher score. max(0, 100 - NPI×100).',
  'hand-fan-challenge':
    'Based on force: lower force = higher score. max(0, 100 - avgForce×200).',
  'earthquake-resistant-structure':
    'Based on stability: lower peak acceleration = higher score. Scored 0-100 directly.',
  'breathing-pace-trainer':
    'Based on breathing rate proximity to 15 BPM: closer to 15 = higher score. max(0, 100 - |avgBpm-15|×5).',
  'reaction-board-challenge':
    'Based on reaction time: faster reaction = higher score. max(0, 100 - avgTime/10).',
  'stretch-speed-and-gracefulness':
    'Based on movement smoothness: lower vibration = smoother = higher score. max(0, 100 - avgVibration×20).',
};

/**
 * Return a human-readable explanation of scoring for a given activity.
 */
export function getScoreExplanation(activityKey: string): string {
  return explanations[activityKey] || 'Composite score based on activity performance data.';
}
