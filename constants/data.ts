import { ActionConfig, EarthquakeDesign, FanDesign, FanMaterial, ParachuteTrial, SoundReading } from './types';

export const TOTAL_ACTIVITIES = 7;
export const POINTS_PER_ACTIVITY = 100;
export const MAX_POINTS = TOTAL_ACTIVITIES * POINTS_PER_ACTIVITY;

// Structured 3-Action Templates for Activities 1-4
export const ACTION_CONFIGS: Record<string, ActionConfig[]> = {
  "parachute-drop-challenge": [
    {
      id: "action-1",
      label: "Small Parachute",
      subtitle: "Test a small parachute design",
      inputs: [
        { id: "timeToGround", label: "Time to Ground (s)", type: "number", placeholder: "0.00" },
        { id: "landingAccuracy", label: "Landing Accuracy (m)", type: "number", placeholder: "0.0" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-2",
      label: "Medium Parachute",
      subtitle: "Test a medium parachute design",
      inputs: [
        { id: "timeToGround", label: "Time to Ground (s)", type: "number", placeholder: "0.00" },
        { id: "landingAccuracy", label: "Landing Accuracy (m)", type: "number", placeholder: "0.0" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-3",
      label: "Large Parachute",
      subtitle: "Test a large parachute design",
      inputs: [
        { id: "timeToGround", label: "Time to Ground (s)", type: "number", placeholder: "0.00" },
        { id: "landingAccuracy", label: "Landing Accuracy (m)", type: "number", placeholder: "0.0" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
  ],
  "sound-pollution-hunter": [
    {
      id: "action-1",
      label: "Dropping Books",
      subtitle: "Measure sound level when dropping books",
      inputs: [
        { id: "measuredDb", label: "Measured dB", type: "number", placeholder: "Use sound meter" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what you observed..." },
      ],
    },
    {
      id: "action-2",
      label: "Stomping Feet",
      subtitle: "Measure sound level of stomping feet",
      inputs: [
        { id: "measuredDb", label: "Measured dB", type: "number", placeholder: "Use sound meter" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what you observed..." },
      ],
    },
    {
      id: "action-3",
      label: "Clapping Hands",
      subtitle: "Measure sound level of clapping hands",
      inputs: [
        { id: "measuredDb", label: "Measured dB", type: "number", placeholder: "Use sound meter" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what you observed..." },
      ],
    },
  ],
  "hand-fan-challenge": [
    {
      id: "action-1",
      label: "15cm",
      subtitle: "Fan from 15cm away",
      inputs: [
        { id: "foldsCount", label: "Number of Folds", type: "number", placeholder: "0" },
        { id: "materialUsed", label: "Material Used", type: "text", placeholder: "Paper or Cardboard" },
        { id: "observedAngle", label: "Observed Bend Angle (°)", type: "number", placeholder: "0" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-2",
      label: "30cm",
      subtitle: "Fan from 30cm away",
      inputs: [
        { id: "foldsCount", label: "Number of Folds", type: "number", placeholder: "0" },
        { id: "materialUsed", label: "Material Used", type: "text", placeholder: "Paper or Cardboard" },
        { id: "observedAngle", label: "Observed Bend Angle (°)", type: "number", placeholder: "0" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-3",
      label: "45cm",
      subtitle: "Fan from 45cm away",
      inputs: [
        { id: "foldsCount", label: "Number of Folds", type: "number", placeholder: "0" },
        { id: "materialUsed", label: "Material Used", type: "text", placeholder: "Paper or Cardboard" },
        { id: "observedAngle", label: "Observed Bend Angle (°)", type: "number", placeholder: "0" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
  ],
  "earthquake-resistant-structure": [
    {
      id: "action-1",
      label: "Design 1",
      subtitle: "4 folds + 4 pillars",
      inputs: [
        { id: "designDescription", label: "Design Description", type: "text", placeholder: "e.g. 6 folds and 5 pillars" },
        { id: "predictedMovement", label: "Predicted Movement (cm)", type: "number", placeholder: "0.0" },
        { id: "measuredMovement", label: "Measured Movement (cm)", type: "number", placeholder: "Use vibration test" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-2",
      label: "Design 2",
      subtitle: "10 folds + 4 pillars",
      inputs: [
        { id: "designDescription", label: "Design Description", type: "text", placeholder: "e.g. 6 folds and 5 pillars" },
        { id: "predictedMovement", label: "Predicted Movement (cm)", type: "number", placeholder: "0.0" },
        { id: "measuredMovement", label: "Measured Movement (cm)", type: "number", placeholder: "Use vibration test" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-3",
      label: "Design 3",
      subtitle: "3 folds + 6 pillars",
      inputs: [
        { id: "designDescription", label: "Design Description", type: "text", placeholder: "e.g. 6 folds and 5 pillars" },
        { id: "predictedMovement", label: "Predicted Movement (cm)", type: "number", placeholder: "0.0" },
        { id: "measuredMovement", label: "Measured Movement (cm)", type: "number", placeholder: "Use vibration test" },
        { id: "observation", label: "Observation Notes", type: "text", placeholder: "Describe what happened..." },
      ],
    },
  ],
  "stretch-speed-and-gracefulness": [
    {
      id: "action-1",
      label: "Clockwise Movement",
      subtitle: "Move your phone in a clockwise movement.",
      inputs: [
        { id: "predictedVibrations", label: "Predicted Vibrations", type: "number", placeholder: "0.0" },
        { id: "measuredVibrations", label: "Measured Vibrations", type: "number", placeholder: "Use movement test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-2",
      label: "Horizontal Movement",
      subtitle: "Move your phone in a horizontal movement.",
      inputs: [
        { id: "predictedVibrations", label: "Predicted Vibrations", type: "number", placeholder: "0.0" },
        { id: "measuredVibrations", label: "Measured Vibrations", type: "number", placeholder: "Use movement test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-3",
      label: "Vertical Movement",
      subtitle: "Move your phone in a vertical movement.",
      inputs: [
        { id: "predictedVibrations", label: "Predicted Vibrations", type: "number", placeholder: "0.0" },
        { id: "measuredVibrations", label: "Measured Vibrations", type: "number", placeholder: "Use movement test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    }
  ],
  "reaction-board-challenge": [
    {
      id: "action-1",
      label: "Dominant Hand Tap Challenge",
      subtitle: "React and tap the hidden button using your dominant hand.",
      inputs: [
        { id: "predictedReactionTime", label: "Predicted Reaction Time (ms)", type: "number", placeholder: "0.0" },
        { id: "measuredReactionTime", label: "Measured Reaction Time (ms)", type: "number", placeholder: "Use reaction time test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-2",
      label: "Non-Dominant Hand Tap Challenge",
      subtitle: "React and tap the hidden button using your non-dominant hand.",
      inputs: [
        { id: "predictedReactionTime", label: "Predicted Reaction Time (ms)", type: "number", placeholder: "0.0" },
        { id: "measuredReactionTime", label: "Measured Reaction Time (ms)", type: "number", placeholder: "Use reaction time test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-3",
      label: "Tracing Challenge",
      subtitle: "Trace the moving object.",
      inputs: [
        { id: "predictedTracingAccuracy", label: "Predicted Tracing Accuracy (%)", type: "number", placeholder: "0.0" },
        { id: "measureTracingAccuracy", label: "Measured Tracing Accuracy (%)", type: "number", placeholder: "Use tracing test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    }
  ],
  "breathing-pace-trainer": [
    {
      id: "action-1",
      label: "Rest",
      subtitle: "Record your BPM during rest.",
      inputs: [
        { id: "predictedBPM", label: "Predicted BPM", type: "number", placeholder: "0.0" },
        { id: "measuredBPM", label: "Measured BPM", type: "number", placeholder: "Use breathing test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-2",
      label: "Jogging",
      subtitle: "Record your BPM after jogging for 1 minute.",
      inputs: [
        { id: "predictedBPM", label: "Predicted BPM", type: "number", placeholder: "0.0" },
        { id: "measuredBPM", label: "Measured BPM", type: "number", placeholder: "Use breathing test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    },
    {
      id: "action-3",
      label: "Star Jumps",
      subtitle: "Record your BPM after doing 100 star jumps.",
      inputs: [
        { id: "predictedBPM", label: "Predicted BPM", type: "number", placeholder: "0.0" },
        { id: "measuredBPM", label: "Measured BPM", type: "number", placeholder: "Use breathing test" },
        { id: "observation", label: "Observation", type: "text", placeholder: "Describe what happened..." },
      ],
    }
  ]
};

export interface ActivityMetadata {
  id: string;
  title: string;
  category: string;
  subTitle: string;
  curriculumCode: string[];
  overview: string;
  equipment: { name: string; icon: string }[];
  procedure: { stepNumber: number; title: string; description: string }[];
  theoryTitle: string;
  theoryContent: string;
  accentColor: string;
  // PDF additions
  writeUpQuestions?: string[];
  discussionContent?: string;
}

export const ACTIVITIES: Record<string, ActivityMetadata> = {
  parachute: {
    id: 'parachute',
    title: 'Parachute Drop Challenge',
    category: 'Physics & Engineering',
    subTitle: 'Optimize air resistance and terminal velocity through iterative engineering design.',
    curriculumCode: ['ACSSU076', 'ACSSU117', 'ACSIS124', 'ACSIS126'],
    overview: 'Students design, build, and test a parachute for a small toy to reduce its landing speed and impact force. Teams iterate their designs under time and material constraints, aiming to achieve the slowest and safest landing within a target area.',
    equipment: [
      { name: 'Mobile phone (Camera)', icon: 'smartphone' },
      { name: 'Small toy (The payload)', icon: 'toys' },
      { name: 'Table (Drop platform)', icon: 'table_bar' },
      { name: 'Paper / Plastic sheets', icon: 'layers' },
      { name: 'String & Tape', icon: 'conversion_path' },
      { name: 'Scissors', icon: 'content_cut' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Baseline Drop', description: 'Record a baseline drop of the payload with no parachute from a fixed height.' },
      { stepNumber: 2, title: 'Engineering Phase', description: 'Build your first parachute prototype using the provided materials.' },
      { stepNumber: 3, title: 'Standardized Testing', description: 'Drop from the exact same height as the baseline. Record the flight path.' },
      { stepNumber: 4, title: 'Data Review', description: 'Analyze your video footage and identify contact time with the floor.' },
      { stepNumber: 5, title: 'Iterative Redesign', description: 'Refine your design based on data. Test up to 3 different prototypes.' }
    ],
    theoryTitle: 'PRO TIP: VIDEO ANALYSIS',
    theoryContent: 'Keep the ruler in the camera frame to provide a scale for measurement. Ensure the landing zone is clearly visible to accurately identify the exact millisecond of contact.',
    accentColor: 'border-l-tertiary',
    discussionContent: 'Gravity pulls objects downward, causing them to speed up as they fall. A parachute increases air resistance (also called drag). Drag acts upward, opposing the motion and slowing the fall. A slower fall reduces the force when the toy hits the ground, making the landing safer.',
    writeUpQuestions: ['Which parachute design was the best?', 'What design was the easiest to make?', 'Were your timings correct?']
  },
  sound: {
    id: 'sound',
    title: 'Sound Pollution Hunter',
    category: 'Environmental Science',
    subTitle: 'Measure and compare sound levels across different environments to map decibel exposure and hazard zones.',
    curriculumCode: ['ACSSU073', 'ACPPS053'],
    overview: 'Students investigate sound pollution around their learning campus, using a digital decibel (dB) collector. They formulate predictions, log real-world environments, map results to identify acoustic zones, and identify regions requiring auditory safety measures.',
    equipment: [
      { name: 'Mobile phone (Acoustic Sensor)', icon: 'mic' },
      { name: 'Classroom standard spaces', icon: 'room' },
      { name: 'Auditory protective scale', icon: 'hearing' },
      { name: 'Notebook & Field Map', icon: 'map' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Establish Baseline Measurements', description: 'Use the decibel meter to record ambient noise in a quiet area. Then measure specific actions (dropping pens, stacking books, conversational talking).' },
      { stepNumber: 2, title: 'Record Field Data', description: 'Move to different locations around the campus. Capture peak decibel readings and log the GPS coordinates for each reading.' },
      { stepNumber: 3, title: 'Spatial Mapping', description: 'Correlate your decibel readings with location data to create a "heat map" of acoustic intensity. Identify zones requiring acoustic mitigation.' }
    ],
    theoryTitle: 'Acoustic Theory',
    theoryContent: 'Sound intensity is measured in decibels (dB), a logarithmic scale. An increase of 10 dB means the sound energy is 10 times more intense. Prolonged exposure to levels above 85 dB can cause permanent hearing damage.',
    accentColor: 'border-l-secondary'
  },
  fan: {
    id: 'fan',
    title: 'Hand Fan Challenge',
    category: 'Physics — Air Movement',
    subTitle: 'Test how air movement affects flexible materials using different hand-fan designs to maximize force output.',
    curriculumCode: ['ACSSU076'],
    overview: 'Students test how hand-generated air flows interact with vertical targets of various flexural rigidities. By designing folds and altering distance, they capture and compare approximate aerodynamic force in Newtons.',
    equipment: [
      { name: 'Paper & Cardboard', icon: 'description' },
      { name: 'Scissors', icon: 'content_cut' },
      { name: 'Mobile Phone with STEMM app', icon: 'smartphone' },
      { name: 'Sticky Tape & Ruler', icon: 'straighten' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Stand paper upright on a table', description: 'Ensure it is secured with a small piece of sticky tape if necessary.' },
      { stepNumber: 2, title: 'Fan air from 30 cm away', description: 'Use consistent force for each fan stroke.' },
      { stepNumber: 3, title: 'Observe and record the bend', description: 'Use the STEMM Lab app to measure the angle in degrees.' },
      { stepNumber: 4, title: 'Repeat with variables', description: 'Test different fan designs and distances: 15 cm, 30 cm, 45 cm.' },
      { stepNumber: 5, title: 'Change the target material', description: 'Repeat the entire process using cardboard instead of paper as the vertical target.' }
    ],
    theoryTitle: 'Theoretical Concept',
    theoryContent: 'Moving air applies force to objects. When a fan blows air at a flexible material, it bends. The amount of bending depends on the force of the air and the stiffness of the material. The formula F ≈ k × θ lets us estimate the force applied by the fan, where F is force, k is the stiffness coefficient, and θ (theta) is the bend angle in radians.',
    accentColor: 'border-l-secondary'
  },
  earthquake: {
    id: 'earthquake',
    title: 'Earthquake Structure Challenge',
    category: 'Engineering & Earth Science',
    subTitle: 'Design and test architectural structures that withstand simulated earthquake vibrations.',
    curriculumCode: ['ACSSU096', 'ACTDEP036'],
    overview: 'Students design anti-vibration layers using folded paper, cardboard platforms, and custom pillars, then record seismic vector movement using the phone accelerometer to evaluate structural resilience. Example designs: Design 1 (4 folds + 4 pillars), Design 2 (10 folds + 4 pillars), Design 3 (3 folds + 6 pillars). These are starting points — you may create your own designs.',
    equipment: [
      { name: 'Cardboard & Paper', icon: 'category' },
      { name: 'Scissors & Sticky tape', icon: 'content_cut' },
      { name: 'Plastic/Paper Cups (pillars)', icon: 'local_cafe' },
      { name: 'Mobile phone with accelerometer', icon: 'smartphone' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Choose or design a structure', description: 'Start with an example (4 folds + 4 pillars, 10 folds + 4 pillars, or 3 folds + 6 pillars) or create your own. Record your design description.' },
      { stepNumber: 2, title: 'Place elevated platform', description: 'Secure a flat cardboard deck on top of your damping structures.' },
      { stepNumber: 3, title: 'Setup phone and trigger sensor', description: 'Place the phone in the center and activate vibration measurement on the STEMM App.' },
      { stepNumber: 4, title: 'Vibrate & Record', description: 'Generate horizontal movement on the testing table, and monitor live vector changes.' },
      { stepNumber: 5, title: 'Iterate configuration', description: 'Add pillars or alter folds to reduce lateral sway, and compare outcomes across runs.' }
    ],
    theoryTitle: 'Overview',
    theoryContent: 'Build anti-vibration structures and use the phone\'s accelerometer to measure stability. Modify designs to reduce movement across iterations to learn principles of earthquake-resistant design.',
    accentColor: 'border-l-secondary-container',
    discussionContent: 'Earthquakes cause ground vibrations that can collapse poorly designed structures. Engineers design buildings to absorb and distribute energy safely.'
  },
  humanPerformance: {
    id: 'humanPerformance',
    title: 'Human Performance Lab',
    category: 'Medical Science + Biomechanics',
    subTitle: 'Measure speed, smoothness, and coordination during controlled stretching activities.',
    curriculumCode: ['ACPPS051', 'ACPPS054', 'ACSSU176'],
    overview: 'Students investigate how the human body moves by measuring speed, smoothness, and coordination during controlled stretching activities using the phone\'s vibration sensor.',
    equipment: [
      { name: 'Mobile phone (Vibration sensor)', icon: 'smartphone' },
      { name: 'Open space to move safely', icon: 'open_in_full' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Setup', description: 'Hold the phone firmly in one hand. Activate the vibration sensor in the STEMM App.' },
      { stepNumber: 2, title: 'Perform Movement 1', description: 'Perform guided movement slowly as shown in the app. Record vibration amplitude.' },
      { stepNumber: 3, title: 'Repeat with Feedback', description: 'Repeat the activity with real-time vibration feedback enabled.' },
      { stepNumber: 4, title: 'Review Data', description: 'Review speed, smoothness, and range-of-motion data from all attempts.' },
      { stepNumber: 5, title: 'Reflect', description: 'Upload results and discuss as a group.' }
    ],
    theoryTitle: 'Biomechanics Overview',
    theoryContent: 'Muscles and joints work together to create movement. Faster movements often reduce control, while smoother movements show better coordination.',
    accentColor: 'border-l-tertiary'
  },
  reactionBoard: {
    id: 'reactionBoard',
    title: 'Reaction Board Challenge',
    category: 'Neuroscience + Mathematics',
    subTitle: 'Measure reaction time, coordination, and improvement through repeated digital and physical challenges.',
    curriculumCode: ['ACSIS130', 'ACMSP147', 'ACPPS057'],
    overview: 'Students measure reaction time by tapping a hidden button, compare dominant vs non-dominant hands, and trace moving shapes to evaluate coordination.',
    equipment: [
      { name: 'Mobile phone', icon: 'smartphone' },
      { name: 'Clear working space', icon: 'open_in_full' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Phase 1 — Tap Reaction', description: 'Tap the screen as soon as the hidden button appears. Record reaction time for each team member.' },
      { stepNumber: 2, title: 'Phase 2 — Swap Hands', description: 'Repeat using your non-dominant hand. Compare results with Phase 1.' },
      { stepNumber: 3, title: 'Phase 3 — Tracing', description: 'Trace a moving shape on the screen. Review accuracy and delay.' }
    ],
    theoryTitle: 'Reaction Time Science',
    theoryContent: 'Reaction time measures how quickly the brain processes information and sends signals to muscles. Practice can improve speed and coordination.',
    accentColor: 'border-l-secondary'
  },
  breathing: {
    id: 'breathing',
    title: 'Breathing Pace Trainer',
    category: 'Medical Science',
    subTitle: 'Analyse breathing patterns at rest and after exercise using the phone\'s motion sensor.',
    curriculumCode: ['ACSSU176', 'ACPPS054'],
    overview: 'Students record breathing patterns at rest and after physical activity using the phone placed on their chest, then compare and analyse the changes.',
    equipment: [
      { name: 'Mobile phone (Motion sensor)', icon: 'smartphone' },
      { name: 'Flat surface or mat', icon: 'floor' }
    ],
    procedure: [
      { stepNumber: 1, title: 'Resting Baseline', description: 'Place the phone gently on your chest. Record breathing pattern for 30 seconds while at rest.' },
      { stepNumber: 2, title: 'Exercise Phase 1', description: 'Jog one minute on the spot. Immediately record breathing again.' },
      { stepNumber: 3, title: 'Exercise Phase 2', description: 'Perform 100 star jumps. Record breathing one more time.' },
      { stepNumber: 4, title: 'Compare & Analyse', description: 'Review all three recordings. Compare breathing rates and amplitudes.' },
      { stepNumber: 5, title: 'Reflect', description: 'Rotate for each team member and compare results as a group.' }
    ],
    theoryTitle: 'Respiratory Response',
    theoryContent: 'Breathing rate increases during exercise to supply more oxygen to muscles. Sensors detect chest movement, helping students visualise breathing patterns.',
    accentColor: 'border-l-secondary-container'
  }
};

// Activity 1 Mock Data
export const DEFAULT_PARACHUTE_TRIALS: ParachuteTrial[] = [
  {
    id: 'trial-1',
    trialNumber: 'Action 1 (Blank Baseline)',
    surfaceArea: 0,
    weight: 10,
    predictedTime: 0.35,
    recordedTime: 0.38,
    contactTime: 0.05,
    didBounce: false,
    impactSpeed: 2.0,
    gForce: 4.1,
    timestamp: '11:15 AM',
    wasRight: 'Yes'
  },
  {
    id: 'trial-2',
    trialNumber: 'Action 2 (Plastic 4-Corners)',
    surfaceArea: 400,
    weight: 10,
    predictedTime: 1.20,
    recordedTime: 1.42,
    contactTime: 0.12,
    didBounce: true,
    impactSpeed: 1.2,
    gForce: 2.5,
    reboundVelocity: 0.6,
    timestamp: '11:25 AM',
    wasRight: 'No'
  },
  {
    id: 'trial-3',
    trialNumber: 'Action 3 (Canopy Redesign #1)',
    surfaceArea: 400,
    weight: 20,
    predictedTime: 0.90,
    recordedTime: 0.88,
    contactTime: 0.04,
    didBounce: false,
    impactSpeed: 1.7,
    gForce: 4.3,
    timestamp: '11:35 AM',
    wasRight: 'Yes'
  },
  {
    id: 'trial-4',
    trialNumber: 'Action 4 (Canopy Redesign #2)',
    surfaceArea: 600,
    weight: 10,
    predictedTime: 1.80,
    recordedTime: 1.95,
    contactTime: 0.15,
    didBounce: true,
    impactSpeed: 0.77,
    gForce: 1.2,
    reboundVelocity: 0.4,
    timestamp: '11:45 AM',
    wasRight: 'Yes'
  }
];

// Activity 2 dB scale Table
export interface DecibelRiskRow {
  dbRange: string;
  source: string;
  risk: string;
  colorClass: string;
}

export const DECIBEL_RISK_SCALE: DecibelRiskRow[] = [
  { dbRange: '0–30 dB', source: 'Whisper, quiet library', risk: 'Safe', colorClass: 'text-tertiary' },
  { dbRange: '30–60 dB', source: 'Normal conversation, classroom', risk: 'Safe', colorClass: 'text-tertiary' },
  { dbRange: '60–85 dB', source: 'Busy traffic, vacuum cleaner', risk: 'Safe (brief exposure)', colorClass: 'text-tertiary-fixed' },
  { dbRange: '85–90 dB', source: 'Lawn mower, loud classroom', risk: 'Warning (damage >8 hrs)', colorClass: 'text-primary' },
  { dbRange: '90–100 dB', source: 'Motorbike, power tools', risk: 'High risk (>15 mins)', colorClass: 'text-primary' },
  { dbRange: '100–120 dB', source: 'Nightclub, rock concert, drill', risk: 'Dangerous (mins count)', colorClass: 'text-primary-container' },
  { dbRange: '120dB+', source: 'Air raid siren, jet takeoff', risk: 'Immediate Damage Risk', colorClass: 'text-danger font-semibold' }
];

// Activity 2 Mock Readings
export const DEFAULT_SOUND_READINGS: SoundReading[] = [
  {
    id: 'read-1',
    location: 'Cafeteria Door',
    action: 'Talking',
    prediction: 'Louder',
    db: 82,
    risk: 'Moderate',
    x: 42,
    y: 32,
    timestamp: '12:45 PM'
  },
  {
    id: 'read-2',
    location: 'Library Corner',
    action: 'Walking',
    prediction: 'Softer',
    db: 45,
    risk: 'Safe',
    x: 68,
    y: 62,
    timestamp: '12:55 PM'
  },
  {
    id: 'read-3',
    location: 'Gymnasium Entrance',
    action: 'Stamping feet',
    prediction: 'Louder',
    db: 104,
    risk: 'Dangerous',
    x: 78,
    y: 22,
    timestamp: '1:10 PM'
  }
];

// Activity 3 Hardness Coefficients
export const MATERIALS_LIST: FanMaterial[] = [
  { name: 'Thin printer paper', thickness: '0.1mm', kValue: 0.05 },
  { name: 'Standard card stock', thickness: '0.25mm', kValue: 0.20 },
  { name: 'Thin cardboard', thickness: '0.5mm', kValue: 0.50 },
  { name: 'Corrugated cardboard', thickness: '3mm', kValue: 2.50 }
];

export const DEFAULT_FAN_DESIGNS: FanDesign[] = [
  {
    id: 'design-1',
    name: 'Origami Pleated Fold',
    targetMaterial: 'Standard card stock',
    fanMaterial: 'paper',
    stiffnessK: 0.20,
    distanceCm: 30,
    predictedAngle: 25,
    observedAngle: 32,
    forceN: 0.112,
    wasRightAnswer: 'No',
    isUnlocked: true
  },
  {
    id: 'design-2',
    name: 'Flat Paddle Deflector',
    targetMaterial: 'Thin printer paper',
    fanMaterial: 'paper',
    stiffnessK: 0.05,
    distanceCm: 30,
    predictedAngle: 35,
    observedAngle: 45,
    forceN: 0.039,
    wasRightAnswer: 'Yes',
    isUnlocked: true
  },
  {
    id: 'design-3',
    name: 'Curved Scooper Fan',
    targetMaterial: 'Thin cardboard',
    fanMaterial: 'cardboard',
    stiffnessK: 0.50,
    distanceCm: 15,
    predictedAngle: 40,
    observedAngle: 45,
    forceN: 0.393,
    wasRightAnswer: 'Yes',
    isUnlocked: false
  }
];

// Activity 4 Iterations
export const DEFAULT_EARTHQUAKE_DESIGNS: EarthquakeDesign[] = [
  {
    id: 'eq-1',
    name: 'Design 1',
    description: '4 folds + 4 pillars',
    foldCount: 4,
    pillarCount: 4,
    predictedMovement: '+/- 1cm',
    recordedPeak: 4.2,
    observedCm: 1.0,
    wasRight: 'Yes',
    isActive: false,
    isUnlocked: true
  },
  {
    id: 'eq-2',
    name: 'Design 2',
    description: '10 folds + 4 pillars',
    foldCount: 10,
    pillarCount: 4,
    predictedMovement: '+/- 0.5cm',
    recordedPeak: null,
    observedCm: 0.0,
    wasRight: '',
    isActive: true,
    isUnlocked: true
  },
  {
    id: 'eq-3',
    name: 'Design 3',
    description: 'Structure locked',
    foldCount: 3,
    pillarCount: 6,
    predictedMovement: 'LOCKED',
    recordedPeak: null,
    observedCm: 0.0,
    wasRight: '',
    isActive: false,
    isUnlocked: false
  }
];
