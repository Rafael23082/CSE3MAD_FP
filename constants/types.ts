export type ActivityId = 'parachute' | 'sound' | 'fan' | 'earthquake';
export type TabId = 'instructions' | 'experiment' | 'journal';

// Write-up prediction (shared pattern from PDF)
export interface PredictionEntry {
  id: string;
  label: string;
  prediction: string;
  outcome: string;
  wasRight: 'Yes' | 'No' | 'Close' | '';
  notes: string;
}

export interface TeamProfile {
  name: string;
  code: string;
}

// Activity 1 Types (Parachute Drop)
export interface ParachuteTrial {
  id: string;
  trialNumber: string;
  surfaceArea: number; // cm²
  weight: number; // g
  predictedTime: number; // s
  recordedTime: number; // s
  contactTime: number; // s
  didBounce: boolean;
  timestamp: string;
  wasRight?: 'Yes' | 'No' | 'Close' | '';
  // PDF additions: G-force tracking
  impactSpeed: number; // m/s
  gForce: number; // calculated g-force
  reboundVelocity?: number; // for bounce case m/s
}

export interface ParachuteJournal {
  q1: string; // prediction accuracy
  q2: string; // design characteristics
  q3: string; // iteration and optimization
  evidenceImages: string[];
}

// PDF Write-up questions for Parachute
export interface ParachuteWriteUp {
  bestDesign: string;
  easiestDesign: string;
  surprises: string;
}

// Activity 2 Types (Sound Pollution)
export interface SoundReading {
  id: string;
  location: string;
  action: string; // e.g. 'dropping book', 'talking', 'walking'
  prediction: 'Louder' | 'Softer' | '';
  db: number;
  risk: 'Safe' | 'Moderate' | 'Dangerous' | 'Critical';
  x: number; // coordinate for spatial map (0-100)
  y: number; // coordinate for spatial map (0-100)
  timestamp: string;
}

export interface SoundJournal {
  q1: string; // highest location and noise sources
  q2: string; // patterns in spatial distribution
  q3: string; // recommendation for ear protection
  evidenceImages: string[];
}

// PDF Write-up questions for Sound
export interface SoundWriteUp {
  loudestAction: string;
  surprises: string;
  needEarMuffs: string;
}

// Activity 3 Types (Hand Fan)
export interface FanMaterial {
  name: string;
  thickness: string;
  kValue: number;
}

export interface FanDesign {
  id: string;
  name: string;
  targetMaterial: string;
  fanMaterial: string; // paper or cardboard
  stiffnessK: number; // selected k value
  distanceCm: 15 | 30 | 45;
  predictedAngle: number;
  observedAngle: number;
  forceN: number; // calculated F ≈ k × θ
  wasRightAnswer: 'Yes' | 'No' | '';
  isUnlocked: boolean;
}

export interface FanJournal {
  q1: string; // which design moved most
  q2: string; // stiffness effect on angle
  q3: string; // distance effect
  evidenceImages: string[];
}

// Activity 4 Types (Earthquake Structure)
export interface EarthquakeDesign {
  id: string;
  name: string;
  description: string;
  foldCount: number;
  pillarCount: number;
  predictedMovement: string;
  recordedPeak: number | null;
  observedCm: number;
  wasRight: 'Yes' | 'No' | 'Surprise' | '';
  isActive: boolean;
  isUnlocked: boolean;
}

export interface EarthquakeJournal {
  q1: string; // least movement and prediction
  q2: string; // structural change effect
  q3: string; // real-world engineering links
  evidenceImages: string[];
}

// ==========================================
// Activity 5 Types (Human Performance Lab)
// ==========================================
export interface HumanPerformanceTrial {
  id: string;
  movementLabel: string;
  vibrationPrediction: string;
  attemptNumber: number;
  vibrationMm: number;
  durationSec: number;
  timestamp: string;
  wasRight?: 'Yes' | 'No' | 'Close' | '';
}

export interface HumanPerformanceJournal {
  q1: string;
  q2: string;
  q3: string;
  evidenceImages: string[];
}

// ==========================================
// Activity 6 Types (Reaction Board)
// ==========================================
export interface ReactionPhase {
  id: string;
  phase: 'tap-dominant' | 'tap-non-dominant' | 'tracing';
  memberName: string;
  predictedMs: number;
  recordedMs: number;
  accuracyPercent?: number;
  wasRight?: 'Yes' | 'No' | 'Close' | '';
}

export interface ReactionJournal {
  q1: string;
  q2: string;
  q3: string;
  evidenceImages: string[];
}

// ==========================================
// Activity 7 Types (Breathing Pace Trainer)
// ==========================================
export interface BreathingTrial {
  id: string;
  phase: 'rest' | 'post-exercise-1' | 'post-exercise-2';
  memberName: string;
  breathsPerMinute: number;
  chestMovementMm: number;
  durationSec: number;
  timestamp: string;
  predictedBpm: number;
  wasRight?: 'Yes' | 'No' | 'Close' | '';
}

export interface BreathingJournal {
  q1: string;
  q2: string;
  q3: string;
  evidenceImages: string[];
}

export type Submission = {
  id: string;
  userId: string;
  activityKey: string;
  logs: any[];
  reflection: string;
  submittedAt: any;
  rating?: number;
};
