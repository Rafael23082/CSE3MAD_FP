import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      tabs: {
        home: "Home",
        activities: "Activities",
        leaderboard: "Leaderboard",
        settings: "Settings",
        account: "Account",
        team: "Team",
        appearance: "Appearance",
        about: "About",
        details: "Details",
        attempt: "Attempt",
        instructions: "Instructions",
        language: "Language",
        contactSupport: "Contact Support",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Term of Service",
        changePassword: "Change Password",
        profileInformation: "Profile Information",
        members: "Members",
        teamInformation: "Team Information",
        teamRoles: "Team Roles",
        journal: "Journal"
      },
      buttons: {
        register: "Register",
        logTrial: "Log Trial",
        logReading: "Log Reading",
        logDesign: "Log Design",
        login: "Login",
        createTeam: "Create Team",
        joinTeam: "Join Team",
        begin: "Begin",
        startRecording: "Start Recording",
        startChallenge: "Start Challenge",
        recording: "Recording...",
        finishActivity: "Finish Activity",
        continue: "Continue",
        backToActivities: "Back to Activities",
        waitForSignal: "Wait for the Signal",
        tapNow: "TAP NOW!",
        changePassword: "Change Password",
        stop: "STOP",
        start: "START",
        edit: "Edit",
        save: "Save",
        openCamera: "Open Camera",
        closeCamera: "Close Camera",
        recordVideo: "Record Video"
      },
      landing: {
        slogan: "Experiment. Measure. Improve."
      },
      forms: {
        hello: "Hello!",
        welcome: "Welcome Back!",
        userRegister: "User Register",
        userLogin: "User Login",
        displayName: "Display Name",
        displayNamePlaceholder: "Enter your display name",
        email: "Email",
        emailPlaceholder: "Enter your email",
        password: "Password",
        passwordPlaceholder: "Enter your password"
      },
      signup: {
        teamName: "Team Name",
        teamNamePlaceholder: "Enter team name",
        teamMembersTitle: "Add Your Team Members",
        teamMembersSubtitle: "Enter the names of your team members (2-4 total including yourself)",
        firstName: "First Name",
        firstNamePlaceholder: "First name",
        lastName: "Last Name",
        lastNamePlaceholder: "Last name",
        addMember: "Add Member",
        removeMember: "Remove",
        completeRegistration: "Complete Registration",
        minMembers: "At least 1 additional member required",
        maxMembers: "Maximum 4 members allowed"
      },
      teamInitialization: {
        createTitle: "Create Your Team",
        joinTitle: "Join a Team",
        teamName: "Team Name",
        teamNamePlaceholder: "Enter team name",
        gradeLevel: "Grade Level",
        gradeLevelPlaceholder: "Select grade level",
        skip: "Skip for now",
        teamID: "Team ID",
        teamIDPlaceholder: "Enter team ID",
        inviteCode: "Invite Code",
        inviteCodePlaceholder: "Enter invite code",
        grantCamera: "Grant Camera Permission",
        cancelScan: "Cancel Scan",
        scanQR: "Scan QR Code"
      },
      home: {
        welcome: "Welcome",
        rank: "Rank",
        completed: "Completed",
        noTeam: "Not in a team",
        joinOrCreate: "Join a team or create your own to get started",
        recentActivity: "Recent Activity",
        noRecentActivity: "No recent activity",
        signinToTrackProgress: "Sign in to track your progress",
        startActivity: "Start activity",
        subtitle: "Ready for your next experiment?",
        howItWorks: "How STEMMLAB Works",
        howItWorksElements: [
          "Choose a Challenge",
          "Use real-world materials and record your experiment",
          "Capture data using your phone's sensors and upload results",
          "Refine your design and climb the leaderboard"
        ],
        seeActivityRequirement: "Complete an activity to see it here",
        progress: "Progress",
        progressSummary: "You've completed {{count}} of 7 activities ({{points}} points)",
        bestActivity: "Best Activity",
        activityCompletion: "Activity Completion",
        scoresOverview: "Scores Overview",
        submissionHistory: "Submission History",
        noSubmissionsYet: "No submissions yet",
        noScoresYet: "Start completing activities to see your scores",
        viewProgressionBoard: "View Progression Board",
        viewFullProgress: "View Full Progress",
        completedActivities: "Completed Activities",
        activitiesCompleted: "Activities Completed",
        latestScore: "Latest Score"
      },
      activities: {
        selectActivity: "Select an Activity",
        activityDetails: "Activity Details",
        overview: "Overview",
        equipmentsNeeded: "Equipment Needed",
        instructions: "Instructions",
        attempt: "Attempt",
        phase: "Phase",
        activityResults: "Activity Results",
        allActivities: "All Activities",
        
        parachuteDropChallenge: {
          name: "Parachute Drop Challenge",
          description: "Design, build, and test a parachute for a small toy to reduce its landing speed and impact force. Your team will iterate under time and material constraints to achieve the slowest and safest landing within the target area.",
          instructions: [
            "Drop the toy without a parachute and record the fall (baseline test).",
            "Build a parachute using provided materials.",
            "Drop the toy from the same height and record the fall.",
            "Review speed and landing accuracy results in the app.",
            "Redesign and test up to three prototypes within 20 minutes.",
            "Upload videos, results, and team reflections."
          ],
          equipments: [
            { name: "Plastic Trash Bag", description: "Used to create the canopy of the parachute." },
            { name: "String", description: "Used for the shroud lines to connect the canopy to the load." },
            { name: "Small toy", description: "Serves as the 'passenger' or cargo for the drop test." },
            { name: "Table", description: "Provides a consistent, measured drop height to ensure fair testing." },
            { name: "Scissors", description: "Used to cut and shape the canopy and string to specific design requirements." },
            { name: "Tape", description: "Secures the components together and marks the drop height." }
          ],
          parameters: "Parameters",
          analytics: "Physics Analysis",
          gForce: "G-Force Analysis",
          contactTime: "Contact Time (s)",
          contactTimePlaceholder: "Enter contact time (e.g. 0.05)",
          didBounce: "Did it bounce?",
          surfaceArea: "Surface Area (cm²)",
          surfaceAreaPlaceholder: "Parachute surface area",
          gForceResult: "G-Force",
          gForceRisk: "Injury Risk",
          gForceRiskScale: "G-Force Risk Scale",
          gForceTip: "Use slow-motion video to measure contact time",
          prototype: "Prototype",
          dropHeightPlaceholder: "Drop Height (m)",
          toyMassPlaceholder: "Toy Mass (kg)",
          baselineLabel: "Baseline (No Parachute)",
          predictTime: "Predicted Time (s)",
          predictTimePlaceholder: "Predicted fall time",
          wasRight: "Was your prediction right?",
          writeUpPrediction: "Prediction Log",
          easiestDesign: "Easiest design to make",
          easiestDesignPlaceholder: "Which design was easiest?",
          gForceTable: {
            safe: "1-5 g: No injury (elevators, standing)",
            moderate: "5-10 g: Possible bruising (hard falls)",
            serious: "10-30 g: Serious injuries possible (sports collisions)",
            severe: "30-50 g: High risk of severe injury (car crashes)",
            critical: "50+ g: Life-threatening injuries likely"
          }
        },
        
        soundPollutionHunter: {
          name: "Sound Pollution Hunter",
          description: "Students act as environmental investigators to measure and compare sound levels produced by different classroom activities. The goal is to identify how energy and surfaces affect sound intensity and to understand the health risks associated with prolonged noise exposure.",
          instructions: [
            "Measure noise from different actions (dropping objects, talking, walking, stamping your feet).",
            "Record sound levels and locations.",
            "Map loud and quiet zones."
          ],
          equipments: [
            { name: "Any Object", description: "Object that is dropped to measure noise from." }
          ],
          actionLabel: "Action",
          actionPlaceholder: "e.g. Dropping a book",
          actionOptions: ["Dropping a book", "Talking", "Walking", "Stamping feet", "Closing a door"],
          locationPlaceholder: "e.g. Cafeteria, Library, Gym",
          predictionLabel: "Prediction (Louder/Softer)",
          predictLouder: "Louder",
          predictSofter: "Softer",
          predictionCompare: "Was your prediction right?",
          hearingRiskTable: "Hearing Damage Risk",
          safeZone: "Safe Zone",
          warningZone: "Warning Zone",
          dangerZone: "Danger Zone",
          riskScale: {
            safe: "0-60 dB: Safe — no risk",
            moderate: "60-85 dB: Safe for brief exposure",
            warning: "85-90 dB: Warning — damage possible >8 hrs",
            high: "90-100 dB: High risk — damage >15 mins",
            dangerous: "100-120 dB: Dangerous — minutes count",
            critical: "120dB+: Immediate damage risk"
          },
          needEarMuffs: "Should you wear ear muffs?",
          needEarMuffsPlaceholder: "Your thoughts on ear protection"
        },
        
        handFanChallenge: {
          name: "Hand Fan Challenge",
          description: "Students test how air movement applies force to flexible materials. By designing different hand fans and testing them against paper and cardboard targets, teams investigate the relationship between fan design, distance, and material stiffness.",
          instructions: [
            "Stand paper upright on a table.",
            "Fan air from 30 cm away.",
            "Observe and record movement.",
            "Repeat with different fan designs and fan distances (15 cm, 30 cm, 45 cm)."
          ],
          equipments: [
            { name: "Paper", description: "Used as raw materials to construct both the fan and the vertical target." },
            { name: "Scissors", description: "Enables precise cutting of materials to create specific fan shapes and sizes." },
            { name: "Sticky Tape", description: "Secures the vertical target to the table so it can bend without falling." }
          ],
          selectMaterial: "Target Material",
          selectDistance: "Distance (cm)",
          materialStiffness: "Stiffness Coefficient",
          targetToggle: "Target Type",
          paper: "Paper",
          cardboard: "Cardboard",
          fanDesign: "Fan Design Name",
          fanDesignPlaceholder: "e.g. Origami Pleated Fold",
          deflectionAngle: "Deflection Angle (°)",
          anglePlaceholder: "Enter bend angle",
          forceResult: "Estimated Force",
          forceUnit: "N",
          stiffnessNote: "Higher stiffness = more force required to bend",
          predictionAngle: "Predicted Angle (°)",
          predictionAnglePlaceholder: "Your predicted angle",
          wasRightLabel: "Were you right?",
          writeUp: {
            bestDesign: "Which design moved the paper most?",
            bestDesignPlaceholder: "Your answer",
            stiffnessEffect: "How does stiffness affect bend angle?",
            stiffnessEffectPlaceholder: "Your observation",
            distanceEffect: "How does distance affect bending?",
            distanceEffectPlaceholder: "Your observation"
          }
        },
        
        earthquakeResistantStructure: {
          name: "Earthquake-Resistant Structure",
          description: "Students design and build structural prototypes to withstand simulated earthquake vibrations. The goal is to use iterative engineering to create a base that absorbs and distributes energy, protecting the 'building' (the mobile phone) from excessive movement.",
          instructions: [
            "Secure the vertical target to the table so it can bend without falling.",
            "Place a flat cardboard platform on top.",
            "Place the phone in the center and activate vibration mode on the STEMM App.",
            "Modify the structure to reduce movement (e.g. more pillars, more folds, etc)."
          ],
          equipments: [
            { name: "Paper and cardboard", description: "Primary materials used to construct the structural platform and anti-vibration layers." },
            { name: "Scissors", description: "Enables precise cutting of materials to create specific fan shapes and sizes." },
            { name: "Sticky Tape", description: "Secures the vertical target to the table so it can bend without falling." }
          ],
          designName: "Design Name",
          designNamePlaceholder: "e.g. Design 1",
          foldCount: "Fold Count",
          foldCountPlaceholder: "Number of folds",
          pillarCount: "Pillar Count",
          pillarCountPlaceholder: "Number of pillars",
          predictedMovement: "Predicted Movement (cm)",
          predictedMovementPlaceholder: "Your prediction",
          observedSway: "Observed Sway (cm)",
          observedSwayPlaceholder: "Measured movement",
          accelerometerData: "Accelerometer Data",
          startVibration: "Start Vibration",
          stopVibration: "Stop Vibration",
          writeUp: {
            bestDesign: "Which design moved the least?",
            bestDesignPlaceholder: "Your answer",
            structuralEffect: "How did folds/pillars affect stability?",
            structuralEffectPlaceholder: "Your observation",
            realWorldLink: "How does this relate to real buildings?",
            realWorldLinkPlaceholder: "Your connection"
          },
          designPreset1: "4 folds + 4 pillars",
          designPreset2: "10 folds + 4 pillars",
          designPreset3: "3 folds + 6 pillars",
          folds: "Folds",
          pillars: "Pillars",
          sway: "Sway",
          peak: "Peak",
          predicted: "Predicted"
        },
        
        stretchSpeedAndGracefulness: {
          name: "Stretch Speed & Gracefulness",
          description: "Students investigate human biomechanics by measuring the speed and smoothness of their movements during controlled stretching. Using the phone's vibration sensors, teams analyze how 'gracefully' they can move and how fatigue or speed impacts physical coordination.",
          instructions: [
            "Hold the phone firmly in one hand. Activate the app vibration sensor.",
            "Perform guided movement slowly as shown in the app. Record the vibration.",
            "Repeat the activity with vibration feedback enabled.",
            "Review smoothness, and vibrations data.",
            "Upload results and reflect as a group."
          ],
          equipments: [
            { name: "Open space", description: "Provides a safe environment for students to perform full-range-of-motion exercises." }
          ],
          clockwiseMovement: "Clockwise Movement",
          verticalMovement: "Vertical Movement",
          horizontalMovement: "Horizontal Movement",
          recordMovement: "Record Movement",
          vibrationsDetected: "Vibrations Detected",
          smoothnessScore: "Smoothness Score",
          movementMonitor: "Movement Monitor",
          movementMonitorPlaceholder: "Start recording to visualize movement smoothness",
          movementVibrations: "Movement {{index}} Vibrations",
          movementSmoothness: "Movement {{index}} Smoothness",
          vibrations: "Vibrations"
        },
        
        reactionBoardChallenge: {
          name: "Reaction Board Challenge",
          description: "Students test their neuromuscular coordination by measuring reaction times under different conditions. The activity uses the phone as a digital 'stimulus and response' board to capture the speed of the brain-to-body signaling pathway.",
          instructions: [
            "Tap the screen as soon as the hidden button appears. Record reaction time.",
            "Repeat using the non-dominant hand. Compare results.",
            "Trace a moving shape on the screen. Review accuracy and delay."
          ],
          equipments: [
            { name: "None", description: "No Equipments Required." }
          ],
          dominantHand: "Dominant Hand Tap Reaction",
          nonDominantHand: "Non-Dominant Hand Tap Reaction",
          tracingChallenge: "Tracing Challenge",
          recordReactionTime: "Record Reaction Time",
          measureTracingAccuracy: "Measure Tracing Accuracy",
          tracingZone: "Tracing Zone",
          tracingZonePlaceholder: "Trace Here",
          reactionZone: "Reaction Zone",
          reactionZonePlaceholder: "Tap inside this area when the target appears",
          accuracyScore: "Accuracy Score",
          tap: "TAP!",
          tracingAccuracy: "Tracing Accuracy",
          reactionTime: "Reaction Time"
        },
        
        breathingPaceTrainer: {
          name: "Breathing Pace Trainer",
          description: "Students explore the relationship between respiration and physical relaxation. By following a digital pacer, they learn to control their breathing rate to observe how conscious regulation affects heart rate or perceived stress levels.",
          instructions: [
            "Place the phone gently on the chest.",
            "Record breathing at rest.",
            "Perform light exercise (jog one minute on the spot and do 100 star jumps).",
            "Record breathing again and compare results."
          ],
          equipments: [
            { name: "Flat surface", description: "A stable, level surface used to place the phone during breathing measurements. It helps keep the device steady and ensures more accurate detection of chest movements and breathing patterns." }
          ],
          rest: "Rest",
          jogging: "Jogging One Minute",
          starJumps: "100 Star Jumps",
          recordBreathing: "Record Breathing",
          breathsRecorded: "Breaths Recorded",
          bpm: "BPM",
          breathingMonitor: "Breathing Monitor",
          breathingMonitorPlaceholder: "Start recording to visualize chest movement",
          activityBPMCount: "Activity {{index}} BPM"
        }
      },
      journal: {
        title: "Journal",
        experimentRecords: "EXPERIMENT RECORDS",
        clearAll: "Clear All",
        noData: "No experiment data yet",
        noDataSubtext: "Go to the Experiment tab and log your first trial!",
        trialCount: "{{count}} trial",
        trialCount_plural: "{{count}} trials",
        trialNumber: "Trial #{{number}}",
        teamConfirmation: "TEAM CONFIRMATION",
        confirmSubtext: "All team members must confirm before submission",
        confirmed: "Confirmed",
        confirmText: "I confirm our team's submission",
        confirmNote: "Each team member should confirm independently. This is self-reported.",
        teamReflection: "TEAM REFLECTION",
        reflectionPlaceholder: "What did you observe? What was surprising?",
        submitting: "SUBMITTING...",
        submitMission: "SUBMIT MISSION",
        missingReflection: "Missing Reflection",
        missingReflectionMsg: "Please write your reflection before submitting.",
        confirmRequired: "Team Confirmation Required",
        confirmRequiredMsg: "All team members must confirm before submission. Please check the confirmation box.",
        submitSuccess: "Mission Submitted!",
        submitError: "Failed to submit. Check your connection.",
        deleteTitle: "Delete Trial",
        deleteMsg: "Remove this trial?",
        clearAllTitle: "Clear All",
        clearAllMsg: "Delete all trials for this activity?",
        velocityMetric: "Velocity (m/s)",
        decibelMetric: "Decibel (dB)",
        forceMetric: "Force (N)",
        swayMetric: "Sway (cm)",
        defaultMetric: "Measurement",
        recordedTrials: "Recorded Trials",
        attempts: "ATTEMPTS",
        noAttempts: "No attempts saved yet",
        noAttemptsSubtext: "Save an attempt during your experiment to see it here",
        saveAttempt: "Save Attempt",
        attemptSaved: "Attempt saved successfully",
        attemptError: "Failed to save attempt",
        deleteAttempt: "Delete Attempt",
        deleteAttemptConfirm: "Are you sure you want to delete this attempt?",
        officialSubmission: "Official Submission",
        submitToLeaderboard: "Submit to Leaderboard",
        submitted: "Submitted",
        replaceSubmission: "Replace Submission",
        replaceSubmissionConfirm: "This will replace your current official submission. Continue?",
        deleteSubmissionFirst: "Delete Submission",
        deleteSubmissionConfirm: "Are you sure you want to delete your official submission?",
        deleteSubmissionWarning: "You cannot delete a submitted attempt. Please unsubmit first.",
        submissionSuccess: "Success",
        submissionReplaced: "Submission replaced successfully",
        attemptNumber: "Attempt #{{number}}",
        viewAttempt: "View",
        deleteSubmittedTitle: "Cannot Delete",
        deleteSubmittedWarning: "You cannot delete a submitted attempt. Please unsubmit first.",
        confirmReplace: "Replace Submission?",
        confirmReplaceMsg: "This will replace your current official submission. Continue?",
        noData: "No experiment data yet",
        noDataSubtext: "Go to the Experiment tab and log your first trial!",
        saving: "Saving..."
      },
      worksheet: {
        title: "Worksheet",
        predictions: "Predictions",
        designRecords: "Design Records",
        discussion: "Discussion Questions",
        complete: "Worksheet Completed",
        incomplete: "Incomplete Worksheet",
        incompleteMsg: "Please fill in at least one prediction, one design record, and one discussion question.",
        continueToReflection: "Save & Continue to Reflection"
      },
      reflection: {
        title: "Reflection",
        subtitle: "Think about what you learned and how you could improve",
        placeholder: "Write your reflection here...",
        whatDidYouLearn: "What did you learn from this experiment?",
        rateExperience: "How would you rate your experience?",
        reflectionRequired: "Reflection Required",
        reflectionRequiredMsg: "Please write a reflection before saving."
      },
      validation: {
        worksheetRequired: "Worksheet",
        reflectionRequired: "Reflection",
        experimentRequired: "Experiment Data",
        incompleteAttempt: "Incomplete Attempt",
        incompleteAttemptMsg: "Cannot submit without: {{missing}}"
      },
      errorMessages: {
        invalidCredential: "Invalid email or password",
        fillInAllFields: "Please fill in all fields",
        userNotFound: "No account found with this email",
        wrongPassword: "Incorrect password",
        invalidEmail: "Please enter a valid email",
        tooManyRequests: "Too many attempts. Please try again later",
        defaultError: "Something went wrong",
        weakPassword: "Password should be at least 6 characters",
        emailAlreadyInUse: "This email is already registered",
        failedPasswordUpdate: "Password update failed",
        passwordsDoNotMatch: "Passwords do not match",
        emptyDisplayName: "Display name cannot be empty",
        unfinishedChallenge: "Challenge Unfinished",
        unfinishedChallengeDescription: "Complete and log all challenges before this attempt can be saved.",
        batterySaverOn: "Power Saver Mode Enabled",
        batterySaverOnDescription: "This activity collects experimental data using your device's sensors, timing functions, or media capabilities. Power Saver Mode may affect device performance and measurement consistency. For the most reliable results, consider disabling Power Saver Mode before continuing."
      },
      countdown: {
        getReady: "Get Ready"
      },
      about: {
        appName: "App Name:",
        version: "Version:",
        description: "Description:",
        descriptionValue: "Interactive STEM learning platform designed for collaborative activities and competitions.",
        privacyPolicy: "Privacy Policy",
        termsOfService: "Terms of Service",
        contactSupport: "Contact Support"
      },
      account: {
        profileInformation: "Profile Information",
        teamInformation: "Team Information",
        changePassword: "Change Password",
        logout: "Logout"
      },
      appearance: {
        lightMode: "Light Mode",
        darkMode: "Dark Mode",
        system: "System"
      },
      team: {
        teamInformation: "Team Information",
        members: "Members",
        teamRoles: "Team Roles",
        leaveTeam: "Leave Team"
      },
      changePassword: {
        currentPassword: "Current Password",
        currentPasswordPlaceholder: "Enter current password",
        newPassword: "New Password",
        newPasswordPlaceholder: "Enter new password",
        confirmPassword: "Confirm Password",
        confirmPasswordPlaceholder: "Confirm new password"
      },

      results: {
        attempts: "Attempts",
        ranking: "Ranking",
        theoryExplanation: "Theory Explanation",
        rating: "Rate this Activity",
        ratingPrompt: "How was this activity?",
        accuracy: "Accuracy",
        noData: "No trials recorded",
        entryNumber: "#{{number}}",
        ratingHint: "Tap a star to rate this activity",
        compare: "Compare your results with your team and the leaderboard!",
        compareNoise: "Compare your team's noise map with others on the leaderboard!",
        velocity: "Velocity",
        gForce: "G-Force",
        time: "Time",
        surfaceArea: "Surface Area",
        submitToLeaderboard: "Submit to Leaderboard",
        submitted: "Submitted ✓",
        leaderboard: "Leaderboard",
        backToActivities: "Back to Activities",
        parachuteTheory: "How Parachutes Work\n\nWhen you drop a toy without a parachute, gravity pulls it straight down. The only force acting on it is gravity, so it accelerates at 9.8 m/s² until it hits the ground. A parachute adds drag force by increasing surface area. The drag force pushes upward against gravity, slowing the fall. The larger the canopy, the more air resistance, and the slower the descent. The g-force experienced on landing depends on how quickly the object stops. A longer contact time (softer landing) reduces g-force, while a hard, sudden stop increases it dramatically.\n\nKey formulas:\n• Velocity: v = d / t\n• Acceleration: a = v / t\n• Weight: W = m × 9.8\n• Net Force: F = m × a\n• Drag Force: F_drag = W - F_net\n• G-force (no bounce): (v / contactTime) / 9.8\n• G-force (bounce): ((v + v_rebound) / contactTime) / 9.8",
        soundTheory: "How Sound Pollution Works\n\nSound is measured in decibels (dB), a logarithmic scale. Every 10 dB increase represents a tenfold increase in sound intensity. Normal conversation is about 60 dB, while a rock concert can exceed 120 dB. Prolonged exposure above 85 dB can cause hearing damage. The louder the sound and the longer the exposure, the greater the risk of permanent hearing loss.\n\nKey concepts:\n• Decibel (dB): Unit of sound intensity\n• Logarithmic scale: 20 dB is 10× more intense than 10 dB\n• Safe: 0-60 dB (whisper, quiet room)\n• Warning: 60-85 dB (busy traffic)\n• Dangerous: 85+ dB (machinery, concerts)",
        fanTheory: "How Hand Fans Work\n\nWhen you fan air toward a paper target, the moving air applies a force. The amount of force depends on the speed of the air, the stiffness of the fan material, and the distance to the target. Stiffer materials generate more force because they push more air per swing.\n\nKey formula:\n• Estimated force: F ≈ k × θ (k = stiffness coefficient, θ = bend angle in radians)\n• Materials: thin paper (k=0.05), card stock (k=0.20), thin cardboard (k=0.50), corrugated cardboard (k=2.50)",
        earthquakeTheory: "How Earthquake-Resistant Structures Work\n\nWhen an earthquake strikes, buildings experience vibrations in multiple directions. Engineers design structures to absorb and dissipate this energy rather than resist it rigidly. Folds and pillars add structural stability by distributing forces more evenly. More pillars generally create a stronger base, while strategic folding adds cross-bracing that helps absorb lateral movement.\n\nKey concepts:\n• Base isolation: Separating the building from the ground\n• Cross-bracing: Diagonal supports add stability\n• Energy dissipation: Folds and flexible joints absorb vibrations\n• Center of mass: Lowering it improves stability",
        breathingTheory: "How Breathing Works\n\nBreathing rate changes with physical activity. At rest, a typical person breathes 12-20 times per minute. During exercise, the body needs more oxygen, so breathing rate increases. The accelerometer in your phone can detect the subtle chest movements of breathing to measure your respiration rate.\n\nKey concept:\n• BPM: Breaths per minute — your breathing rate\n• Rest: 12-20 BPM typical\n• Light exercise: 20-40 BPM\n• Vigorous exercise: 40-60 BPM",
        reactionTheory: "How Reaction Time Works\n\nReaction time is the interval between a stimulus and your response. It involves your senses detecting the stimulus, your brain processing the information, and your nerves signaling your muscles to act. The average human reaction time to a visual stimulus is about 200-250 milliseconds.\n\nKey factors:\n• Dominant hand: Typically 10-20ms faster than non-dominant\n• Age: Reaction time peaks in early 20s\n• Fatigue: Slows reaction time significantly\n• Practice: Can improve reaction time by 10-15%",
        movementTheory: "How Movement Smoothness Works\n\nMovement smoothness is measured by sudden changes in acceleration. The phone's accelerometer detects vibrations and jolts. Smooth movements produce fewer and smaller acceleration changes. The smoothness score (0-100%) measures how gracefully you moved.\n\nKey concepts:\n• Vibrations: Sudden acceleration changes\n• Smoothness: Percentage of time without excessive vibration\n• Score: Starts at 100%, decreases with each jolt",
        preset: "Preset",
        score: "Score",
        viewSoundMap: "View Sound Map",
        notSignedIn: "Not signed in",
        notSignedInMessage: "Sign in to submit results to the leaderboard.",
        submittedTitle: "Submitted!",
        submittedMessage: "Your results are on the leaderboard.",
        submitFailed: "Submit failed"
      },

      soundMap: {
        title: "Sound Pollution Map",
        readingsWithGps: "{{count}} readings with GPS",
        noGpsReadings: "No GPS readings yet",
        recordPlaceholder: "Record sound readings with location enabled to see them on the map",
        mapPlaceholder: "Map Placeholder (Expo Go)",
        legend: "Legend",
        allReadings: "All Readings",
        back: "Back"
      },

      leaderboard: {
        title: "Progression Board",
        global: "Global Rankings",
        byActivity: "By Activity",
        rank: "Rank",
        user: "User",
        team: "Team",
        score: "Score",
        scoreExplanation: "Score Explanation",
        perActivity: "Per Activity",
        points: "Points",
        noData: "No submissions yet",
        noTeams: "No teams on the board yet",
        selectActivity: "Select Activity",
        activitiesCompleted: "{{count}}/{{total}} activities"
      },

      teamSettings: {
        title: "Team Settings",
        teamName: "Team Name",
        teamId: "Team ID",
        inviteCode: "Invite Code",
        gradeLevel: "Grade Level",
        members: "Members",
        maxReached: "Team is full (max 4)",
        shareQR: "Share QR Code",
        qrInstructions: "Other students can scan this QR code to join your team",
        leaveTeam: "Leave Team",
        leaveConfirm: "Are you sure you want to leave the team?",
        noTeam: "Not in a team",
        member: "Member",
        leader: "Leader",
        remove: "Remove"
      },
      privacyPolicy: {
          dataCollection: "Data Collection",
          dataCollectionContents: "This app collects motion sensor data (accelerometer) to analyze movement performance. No personal identity data is required.",
          useOfData: "Use of Data",
          useOfDataContents: "Data is used for activity tracking, performance analysis, and improving user experience.",
          dataStorage: "Data Storage",
          dataStorageContents: "Data may be stored locally or temporarily depending on application flow. It is not sold or shared with third parties.",
          thirdPartyServices: "Third-Party Services",
          thirdPartyServicesContents: "External services (e.g. APIs or analytics) may collect data according to their own privacy policies.",
          security: "Security",
          securityContents: "We apply reasonable security measures, but no system is fully secure.",
          policyChanges: "Policy Updates",
          policyChangesContents: "This privacy policy may be updated from time to time."
      },
      termsOfService: {
          useOfApp: "Use of the App",
          useOfAppContents: "This application is provided for educational and demonstration purposes. Users must use it lawfully.",
          userResponsibilities: "User Responsibilities",
          userResponsibilitiesContents: "Users must not attempt to disrupt, misuse, or reverse-engineer the application or its services.",
          intellectualProperty: "Intellectual Property",
          intellectualPropertyContents: "All content, design, and source code belong to the developer unless stated otherwise.",
          noWarranty: "No Warranty",
          noWarrantyContents: "This application is provided 'as is' without warranties of any kind.",
          limitationOfLiability: "Limitation of Liability",
          limitationOfLiabilityContents: "The developer is not responsible for any damages resulting from use of this application.",
          changesToTerms: "Changes to Terms",
          changesToTermsContents: "These terms may be updated at any time without prior notice."
      },
      contactSupport: {
        customerService: "Our 24x7 Customer Service",
        writeUsAt: "Write us at"
      },
      attempt: {
        newTrial: "New Trial",
        designPresets: "Design Presets",
        structuralIterations: "Structural Iterations",
        logTrialPlaceholder: "No trials logged yet. Complete a challenge and tap \"Log Trial\" to record your results."
      },
      settings: {
        batteryLevel: "Battery Level"
      }
    }
  },
  ja: {
    translation: {
      tabs: {
        home: "ホーム",
        activities: "活動",
        leaderboard: "ランキング",
        settings: "設定",
        account: "アカウント",
        team: "チーム",
        appearance: "外観",
        about: "概要",
        details: "詳細",
        attempt: "試み",
        instructions: "手順",
        language: "言語",
        contactSupport: "サポートに問い合わせる",
        privacyPolicy: "プライバシーポリシー",
        termsOfService: "利用規約",
        changePassword: "パスワードを変更する",
        profileInformation: "プロフィール情報",
        members: "メンバー",
        teamInformation: "チーム情報",
        teamRoles: "チームの役割",
        journal: "ジャーナル"
      },
      buttons: {
        register: "登録",
        login: "ログイン",
        createTeam: "チームを作成する",
        joinTeam: "チームに参加する",
        begin: "はじめに",
        startChallenge: "チャレンジを開始",
        startRecording: "録画を開始",
        recording: "録音中...",
        finishActivity: "アクティビティを終了する",
        continue: "続ける",
        backToActivities: "アクティビティに戻る",
        waitForSignal: "合図を待ってください",
        tapNow: "今すぐタップ！",
        changePassword: "パスワードを変更する",
        logTrial: "試験を記録",
        logReading: "測定を記録",
        logDesign: "設計を記録",
        stop: "停止",
        start: "開始",
        edit: "編集",
        save: "保存",
        openCamera: "カメラを開く",
        closeCamera: "クローズアップカメラ",
        recordVideo: "ビデオを録画"
      },
      landing: {
        slogan: "試行。測定。改善。"
      },
      forms: {
        hello: "こんにちは！",
        welcome: "お帰りなさい！",
        userRegister: "ユーザー登録",
        userLogin: "ユーザーログイン",
        displayName: "表示名",
        displayNamePlaceholder: "表示名を入力してください",
        email: "メール",
        emailPlaceholder: "メールアドレスを入力してください",
        password: "パスワード",
        passwordPlaceholder: "パスワードを入力してください"
      },
      signup: {
        teamName: "チーム名",
        teamNamePlaceholder: "チーム名を入力してください",
        teamMembersTitle: "チームメンバーを追加",
        teamMembersSubtitle: "チームメンバーの名前を入力してください（自分を含めて2〜4人）",
        firstName: "名",
        firstNamePlaceholder: "名",
        lastName: "姓",
        lastNamePlaceholder: "姓",
        addMember: "メンバーを追加",
        removeMember: "削除",
        completeRegistration: "登録を完了",
        minMembers: "少なくとも1人の追加メンバーが必要です",
        maxMembers: "最大4人までです"
      },
      teamInitialization: {
        createTitle: "チームを作成する",
        joinTitle: "チームに参加する",
        teamName: "チーム名",
        teamNamePlaceholder: "チーム名を入力してください",
        gradeLevel: "学年",
        gradeLevelPlaceholder: "学年を選択してください",
        skip: "とりあえずスキップする",
        teamID: "チームID",
        teamIDPlaceholder: "チームIDを入力してください",
        inviteCode: "招待コード",
        inviteCodePlaceholder: "招待コードを入力してください",
        grantCamera: "カメラの許可を与える",
        cancelScan: "スキャンをキャンセル",
        scanQR: "QRコードをスキャン"
      },
      home: {
        welcome: "ようこそ",
        rank: "順位",
        completed: "完了",
        noTeam: "チームに参加していません",
        joinOrCreate: "チームに参加するか作成して始めましょう",
        recentActivity: "最近のアクティビティ",
        noRecentActivity: "最近のアクティビティはありません",
        signinToTrackProgress: "サインインして進捗を追跡",
        startActivity: "アクティビティを開始",
        subtitle: "次の実験の準備はできましたか？",
        howItWorks: "STEMMLABの仕組み",
        howItWorksElements: [
          "チャレンジを選ぶ",
          "実際の材料を使い、実験の様子を記録しましょう",
          "スマートフォンのセンサーを使ってデータを取得し、結果をアップロードする",
          "デザインを磨き、ランキングを駆け上がろう"
        ],
        seeActivityRequirement: "アクティビティを完了すると、ここに表示されます。",
        progress: "進捗",
        progressSummary: "7つのアクティビティのうち{{count}}を完了しました（{{points}}ポイント）",
        bestActivity: "最高のアクティビティ",
        activityCompletion: "アクティビティの完了状況",
        scoresOverview: "スコア概要",
        submissionHistory: "提出履歴",
        noSubmissionsYet: "まだ提出はありません",
        noScoresYet: "アクティビティを完了してスコアを確認しましょう",
        viewProgressionBoard: "進行ボードを見る",
        viewFullProgress: "詳細な進捗を見る",
        completedActivities: "完了したアクティビティ",
        activitiesCompleted: "アクティビティ完了",
        latestScore: "最新スコア"
      },
      activities: {
        selectActivity: "アクティビティを選択してください",
        activityDetails: "アクティビティの詳細",
        overview: "概要",
        equipmentsNeeded: "必要な機材",
        instructions: "手順",
        attempt: "試み",
        phase: "段階",
        activityResults: "活動結果",
        allActivities: "すべてのアクティビティ",
        
        parachuteDropChallenge: {
          name: "パラシュート投下チャレンジ",
          description: "小さなおもちゃの着地速度と衝撃力を軽減するためのパラシュートを設計、製作、そしてテストしてください。チームは、時間と資材の制約の中で試行錯誤を重ね、目標エリア内で最も緩やかで安全な着地を実現してください。",
          instructions: [
            "パラシュートなしで玩具を落とし、落下の様子を記録する（基準試験）。",
            "用意された材料を使ってパラシュートを作ってください。",
            "おもちゃを同じ高さから落とし、落下の様子を記録してください。",
            "アプリで速度と着地精度の結果を確認してください。",
            "20分以内に最大3つのプロトタイプを再設計し、テストしてください。",
            "動画、結果、チームの振り返りをアップロードしてください。"
          ],
          equipments: [
            { name: "プラスチック製ゴミ袋", description: "パラシュートのキャノピーを作るために使用されます。" },
            { name: "文字列", description: "キャノピーと荷物を結ぶシュラウドラインに使用されます。" },
            { name: "小さなおもちゃ", description: "落下試験における「被試験体」または試験用荷物の役割を果たす。" },
            { name: "表", description: "一貫した、正確に測定された落下高さを確保し、公平な試験を行うことができます。" },
            { name: "はさみ", description: "特定の設計要件に合わせてキャノピーとストリングを裁断・成形するために使用されます。" },
            { name: "テープ", description: "部品を固定し、落下高さを印付けします。" }
          ]
        },
        
        soundPollutionHunter: {
          name: "騒音ハンター",
          description: "生徒たちは環境調査員となり、教室でのさまざまな活動によって発生する騒音レベルを測定し、比較します。その目的は、エネルギーや物体が音の強さにどのような影響を与えるかを明らかにし、長時間の騒音曝露に伴う健康リスクを理解することです。",
          instructions: [
            "さまざまな動作（物を落とす、話す、歩く、足を踏み鳴らす）による騒音を測定する。",
            "騒音レベルと発生場所を記録してください。",
            "騒音レベルの高い区域と低い区域を地図上に表示する。"
          ],
          equipments: [
            { name: "任意のオブジェクト", description: "ノイズを測定するために置く物体。" }
          ]
        },
        
        handFanChallenge: {
          name: "うちわチャレンジ",
          description: "生徒たちは、気流が柔軟な素材にどのように力を及ぼすかを検証します。チームごとにさまざまな扇子を設計し、紙や段ボールの標的に当てて実験を行うことで、扇子の設計、距離、素材の剛性との関係を調べます。",
          instructions: [
            "紙をテーブルの上に立てかけます。",
            "30cm離れた位置から送風してください。",
            "動きを観察し、記録する。",
            "ファンデザインやファン間の距離（15 cm、30 cm、45 cm）を変えて、同じ手順を繰り返してください。"
          ],
          equipments: [
            { name: "紙および段ボール", description: "ファンと垂直ターゲットの両方を構成する原材料として使用される。" },
            { name: "はさみ", description: "特定の扇形の形状やサイズに合わせて、素材を正確に切断することができます。" },
            { name: "粘着テープ", description: "対象物をテーブルに固定し、倒れることなく曲げられるようにします。" }
          ]
        },
        
        earthquakeResistantStructure: {
          name: "耐震構造",
          description: "学生たちは、模擬地震の振動に耐えられる構造プロトタイプを設計・製作します。その目的は、反復的なエンジニアリング手法を用いて、エネルギーを吸収・分散させる土台を作り出し、「建物」（携帯電話）を過度な動きから保護することにあります。",
          instructions: [
            "垂直のターゲットが倒れずに曲がるように、テーブルに固定してください。",
            "その上に平らな段ボールの台を置きます。",
            "スマートフォンを中央に置き、STEMMアプリでバイブレーションモードをオンにしてください。",
            "動きを抑えるよう構造を調整してください（例：支柱を増やす、折り目を増やすなど）。"
          ],
          equipments: [
            { name: "紙および段ボール", description: "構造プラットフォームおよび防振層の構築に使用される主要材料。" },
            { name: "はさみ", description: "特定の扇形の形状やサイズに合わせて、素材を正確に切断することができます。" },
            { name: "粘着テープ", description: "対象物をテーブルに固定し、倒れることなく曲げられるようにします。" }
          ],
          designPreset1: "4つ折り + 4つの柱",
          designPreset2: "10つ折り + 4つの柱",
          designPreset3: "3つ折り + 6つの柱",
          folds: "折り目",
          pillars: "支柱",
          sway: "揺れ",
          peak: "最大値",
          predicted: "予測",
        },
        
        stretchSpeedAndGracefulness: {
          name: "ストレッチのスピードと優雅さ",
          description: "生徒たちは、制御されたストレッチ中の動きの速度と滑らかさを測定することで、人間の生体力学について調査します。スマートフォンの振動センサーを活用し、各チームは自分たちの動きがどれほど「優雅」であるかを分析するとともに、疲労や速度が身体の協調性にどのような影響を与えるかを調べます。",
          instructions: [
            "携帯電話を片手でしっかりと持ちます。アプリの振動センサーを有効にします。",
            "アプリに表示されている通りに、ガイドに従ってゆっくりと動作を行ってください。振動を記録してください。",
            "振動フィードバックを有効にして、この操作を繰り返してください。",
            "速度、滑らかさ、および可動域のデータを確認してください。",
            "結果をアップロードし、グループで振り返りましょう。"
          ],
          equipments: [
            { name: "オープンスペース", description: "生徒が可動域をフルに活かした運動を行える、安全な環境を提供します。" }
          ],
          clockwiseMovement: "時計回りの動き",
          verticalMovement: "垂直方向の動き",
          horizontalMovement: "水平方向の動き",
          recordMovement: "記録の推移",
          vibrationsDetected: "振動が検出されました",
          smoothnessScore: "滑らかさスコア",
          movementMonitor: "動作モニター",
          movementMonitorPlaceholder: "録画を開始して、動きの滑らかさを確認しましょう",
          movementVibrations: "運動 {{index}} 振動",
          movementSmoothness: "動き {{index}} の滑らかさ",
          vibrations: "振動回数"
        },
        
        reactionBoardChallenge: {
          name: "リアクションボード・チャレンジ",
          description: "生徒たちは、さまざまな条件下での反応時間を測定することで、神経筋協調機能を検証します。この活動では、スマートフォンをデジタル版の「刺激と反応」ボードとして活用し、脳から身体への信号伝達経路の速度を計測します。",
          instructions: [
            "隠しボタンが表示されたらすぐに画面をタップしてください。反応時間を記録してください。",
            "利き手ではない方の手でも同じことを行ってください。その結果を比べてみてください。",
            "画面上で動く図形をなぞってください。精度と遅延を確認してください。"
          ],
          equipments: [
            {
              name: "なし",
              description: "必要な器具はありません。"
            }
          ],
          dominantHand: "利き手のタップ反応",
          nonDominantHand: "非利き手のタップ反応",
          tracingChallenge: "トレース（なぞり書き）チャレンジ",
          recordReactionTime: "反応時間を記録する",
          measureTracingAccuracy: "トレース精度の測定",
          tracingZone: "トレースゾーン",
          tracingZonePlaceholder: "ここにトレース",
          reactionZone: "リアクション・ゾーン",
          reactionZonePlaceholder: "ターゲットが表示されたら、このエリア内をタップしてください",
          accuracyScore: "精度スコア",
          tap: "タップ！",
          tracingAccuracy: "トレース精度",
          reactionTime: "反応時間"
        },
        
        breathingPaceTrainer: {
          name: "呼吸ペーストレーナー",
          description: "生徒たちは、呼吸と身体のリラックスとの関連性について探求します。デジタルペースメーカーに従うことで、呼吸のペースをコントロールする方法を学び、意識的な呼吸の調整が心拍数やストレスの感じ方にどのような影響を与えるかを観察します。",
          instructions: [
            "携帯電話を胸の上にそっと置いてください。",
            "安静時の呼吸数を記録してください。",
            "軽い運動を行ってください（その場で1分間ジョギングし、スタージャンプを100回行います）。",
            "もう一度呼吸を記録し、結果を比較してください。"
          ],
          equipments: [
            { name: "平らな面", description: "呼吸測定中にスマートフォンを置くための、安定した平らな面です。デバイスをしっかり固定し、胸の動きや呼吸パターンをより正確に検出するのに役立ちます。" }
          ],
          rest: "安静（休憩）",
          jogging: "1分間のジョギング",
          starJumps: "スタージャンプ100回",
          recordBreathing: "呼吸を記録する",
          breathsRecorded: "記録された呼吸",
          bpm: "BPM",
          breathingMonitor: "呼吸モニター",
          breathingMonitorPlaceholder: "胸の動きを確認するために録画を開始してください",
          activityBPMCount: "アクティビティ {{index}} BPM"
        }
      },
      journal: {
        title: "ジャーナル",
        experimentRecords: "実験記録",
        clearAll: "すべてクリア",
        noData: "実験データがまだありません",
        noDataSubtext: "実験タブに移動して最初の試験を記録してください！",
        trialCount: "{{count}} 回の試験",
        trialCount_plural: "{{count}} 回の試験",
        trialNumber: "試験 #{{number}}",
        teamConfirmation: "チーム確認",
        confirmSubtext: "提出前にすべてのチームメンバーが確認する必要があります",
        confirmed: "確認済み",
        confirmText: "チームの提出を確認します",
        confirmNote: "各メンバーが独立して確認する必要があります。これは自己申告です。",
        teamReflection: "チーム反省",
        reflectionPlaceholder: "何を観察しましたか？何が驚きでしたか？",
        submitting: "送信中...",
        submitMission: "ミッションを送信",
        missingReflection: "振り返りがありません",
        missingReflectionMsg: "送信前に振り返りを記録してください。",
        confirmRequired: "チーム確認が必要です",
        confirmRequiredMsg: "送信前に全チームメンバーが確認する必要があります。確認ボックスにチェックを入れてください。",
        submitSuccess: "ミッション送信完了！",
        submitError: "送信に失敗しました。接続を確認してください。",
        deleteTitle: "試験を削除",
        deleteMsg: "この試験を削除しますか？",
        clearAllTitle: "すべてクリア",
        clearAllMsg: "このアクティビティのすべての試験を削除しますか？",
        velocityMetric: "速度 (m/s)",
        decibelMetric: "デシベル (dB)",
        forceMetric: "力 (N)",
        swayMetric: "揺れ (cm)",
        defaultMetric: "測定値",
        recordedTrials: "記録された試験",
        attempts: "試行",
        noAttempts: "まだ保存された試行がありません",
        noAttemptsSubtext: "実験中に試行を保存すると、ここに表示されます",
        saveAttempt: "試行を保存",
        attemptSaved: "試行が正常に保存されました",
        attemptError: "試行の保存に失敗しました",
        deleteAttempt: "試行を削除",
        deleteAttemptConfirm: "この試行を削除してもよろしいですか？",
        officialSubmission: "公式提出",
        submitToLeaderboard: "ランキングに提出",
        submitted: "提出済み",
        replaceSubmission: "提出を変更",
        replaceSubmissionConfirm: "現在の公式提出を変更します。続行しますか？",
        deleteSubmissionFirst: "提出を削除",
        deleteSubmissionConfirm: "公式提出を削除してもよろしいですか？",
        deleteSubmissionWarning: "提出された試行は削除できません。提出を解除してください。",
        submissionSuccess: "成功",
        submissionReplaced: "提出が正常に変更されました",
        attemptNumber: "試行 #{{number}}",
        viewAttempt: "表示",
        deleteSubmittedTitle: "削除できません",
        deleteSubmittedWarning: "提出された試行は削除できません。提出を解除してください。",
        confirmReplace: "提出を変更しますか？",
        confirmReplaceMsg: "現在の公式提出を変更します。続行しますか？",
        noData: "実験データがまだありません",
        noDataSubtext: "実験タブに移動して最初の試験を記録してください！",
        saving: "保存中..."
      },
      errorMessages: {
        invalidCredential: "メールアドレスまたはパスワードが正しくありません",
        fillInAllFields: "すべての項目にご記入ください",
        userNotFound: "このメールアドレスに登録されたアカウントが見つかりません",
        wrongPassword: "パスワードが間違っています",
        invalidEmail: "有効なメールアドレスを入力してください",
        tooManyRequests: "試行回数を超えました。後ほどもう一度お試しください",
        defaultError: "何か問題が発生しました",
        weakPassword: "パスワードは6文字以上にしてください",
        emailAlreadyInUse: "このメールアドレスはすでに登録されています",
        failedPasswordUpdate: "パスワードの更新に失敗しました",
        emptyDisplayName: "表示名は空欄にできません",
        unfinishedChallenge: "チャレンジ未完了",
        unfinishedChallengeDescription: "この試行を保存する前に、すべてのチャレンジを完了して記録してください。",
        batterySaverOn: "省電力モードが有効です",
        batterySaverOnDescription: "このアクティビティでは、デバイスのセンサー、タイマー機能、またはメディア機能を使用して実験データを収集します。省電力モードが有効になっていると、デバイスのパフォーマンスや測定の一貫性に影響を与える可能性があります。より信頼性の高い結果を得るため、続行する前に省電力モードを無効にすることを検討してください。"
      },
      countdown: {
        getReady: "準備をしよう"
      },
      about: {
        appName: "アプリ名：",
        version: "バージョン：",
        description: "説明：",
        descriptionValue: "共同活動やコンテスト向けに設計された、インタラクティブなSTEM学習プラットフォーム。",
        privacyPolicy: "プライバシーポリシー",
        termsOfService: "利用規約",
        contactSupport: "サポートへのお問い合わせ"
      },
      account: {
        profileInformation: "プロフィール情報",
        teamInformation: "チーム情報",
        changePassword: "パスワードを変更する",
        logout: "ログアウト"
      },
      appearance: {
        lightMode: "ライトモード",
        darkMode: "ダークモード",
        system: "システム"
      },
      team: {
        teamInformation: "チーム情報",
        members: "メンバー",
        teamRoles: "チームの役割",
        leaveTeam: "チームを離れる"
      },
      changePassword: {
        currentPassword: "現在のパスワード",
        currentPasswordPlaceholder: "現在のパスワードを入力してください",
        newPassword: "新しいパスワード",
        newPasswordPlaceholder: "新しいパスワードを入力してください",
        confirmPassword: "パスワードを認証する",
        confirmPasswordPlaceholder: "新しいパスワードを確認します"
      },
      results: {
        attempts: "試行回数",
        ranking: "ランキング",
        theoryExplanation: "解説",
        rating: "このアクティビティを評価する",
        ratingPrompt: "アクティビティはいかがでしたか？",
        accuracy: "精度",
        noData: "記録がまだありません",
        entryNumber: "#{{number}}",
        ratingHint: "星をタップしてアクティビティを評価してください",
        compare: "自分の結果をチームやリーダーボードと比較してみましょう！",
        compareNoise: "チームの騒音マップをリーダーボードの他のマップと比較してみましょう！",
        velocity: "速度",
        gForce: "Gフォース",
        time: "時間",
        surfaceArea: "表面積",
        submitToLeaderboard: "リーダーボードに送信",
        submitted: "送信済み ✓",
        leaderboard: "リーダーボード",
        backToActivities: "アクティビティに戻る",
        parachuteTheory: "パラシュートの仕組み\n\nパラシュートをつけずにオモチャを落とすと、重力によって真下に引っ張られます。働く力は重力だけなので、地面にぶつかるまで9.8 m/s²で加速します。パラシュートは表面積を大きくすることで、空気抵抗（抗力）を生み出します。この抗力が重力に逆らって上向きに押し出すため、落下速度が遅くなります。\n\n主な公式：\n• 速度：v = d / t\n• 加速度：a = v / t\n• 重さ（重量）：W = m × 9.8\n• 合力：F = m × a\n• 抗力：F_抗力 = W - F_合力\n• Gフォース（跳ね返りなし）：(v / 接触時間) / 9.8\n• Gフォース（跳ね返りあり）：((v + v_跳ね返り) / 接触時間) / 9.8",
        soundTheory: "騒音公害の仕組み\n\n音の大きさは、対数記号であるデシベル（dB）という単位で測定されます。10 dB上がるごとに、音の強さは10倍になります。通常の会話は約60 dBですが、ロックコンサートでは120 dBを超えることもあります。85 dB以上の音に長時間さらされると、聴覚障害を引き起こす恐れがあります。\n\n• デシベル（dB）：音の強さの単位\n• 安全：0-60 dB\n• 注意：60-85 dB\n• 危険：85 dB以上",
        fanTheory: "うちわの仕組み\n\n的となる紙に向かってうちわで風を送ると、動く空気が力を生み出します。力の大きさは、風の速度、うちわの素材の硬さ、そして的までの距離によって決まります。硬い素材ほど、ひといきで多くの空気を押し出すことができるため、より強い力を生み出せます。\n\n主な公式：\n• 推定力：F ≈ k × θ\n• 素材係数：薄い紙（k=0.05）、画用紙（k=0.20）、薄い段ボール（k=0.50）、波構造の段ボール（k=2.50）",
        earthquakeTheory: "耐震構造の仕組み\n\n地震が発生すると、建物はさまざまな方向から揺れ（振動）を受けます。エンジニアは、このエネルギーを吸収して逃がす（分散させる）ように構造を設計します。「折り」や「柱」を増やすことで、かかる力が均等に分散され、構造の安定性が高まります。\n\n• 免震：建物を地面から切り離す\n• 筋交い（ブレース）：斜めの補強材によって安定性を高める\n• エネルギー散逸：「折り」や柔軟な接合部が振動を吸収する",
        breathingTheory: "呼吸の仕組み\n\n呼吸数は身体活動（運動）によって変化します。安静時、人の呼吸数は1分間に12〜20回です。運動中は体に多くの酸素が必要になるため、呼吸数が多くなります。\n\n• BPM：1分間あたりの呼吸数\n• 安静時：12-20 BPM\n• 軽い運動：20-40 BPM\n• 激しい運動：40-60 BPM",
        reactionTheory: "反応時間の仕組み\n\n反応時間とは、刺激を受けてから体が反応するまでの時間のことです。感覚器官が刺激を察知し、脳がその情報を処理し、神経が筋肉に動くよう信号を送る、というプロセスを経て行われます。人間の視覚刺激に対する平均反応時間は、約200〜250ミリ秒（ms）です。\n\n• 利き手：通常、利き手ではない方よりも10〜20ms速い\n• 年齢：20代前半に反応時間のピークを迎える\n• 疲労：反応時間を著しく低下させる（遅らせる）",
        movementTheory: "動きの滑らかさの仕組み\n\n動きの滑らかさは、加速度の急激な変化によって測定されます。スマートフォンの加速度センサーが、揺れや衝撃（ジャーク）を検知します。滑らかな動きほど、加速度の変化が少なく、その幅も小さくなります。\n\n• 揺れ：加速度の急激な変化\n• 滑らかさ：過度な揺れがない時間の割合（％）\n• スコア：100%からスタートし、衝撃が加わるたびに減点される",
        preset: "プリセット",
        score: "スコア",
        viewSoundMap: "サウンドマップを見る",
        notSignedIn: "サインインしていません",
        notSignedInMessage: "リーダーボードに結果を送信するにはサインインしてください。",
        submittedTitle: "送信完了！",
        submittedMessage: "結果がリーダーボードに掲載されました。",
        submitFailed: "送信に失敗しました"
      },
      soundMap: {
        title: "騒音マップ",
        readingsWithGps: "GPS付き{{count}}件の測定結果",
        noGpsReadings: "GPSデータがまだありません",
        recordPlaceholder: "場所を有効にして録音し、マップで確認しましょう",
        mapPlaceholder: "マッププレースホルダー（Expo Go）",
        legend: "凡例",
        allReadings: "すべての測定結果",
        back: "戻る"
      },
      leaderboard: {
        title: "進行ボード",
        global: "グローバルランキング",
        byActivity: "アクティビティ別",
        rank: "順位",
        user: "ユーザー",
        team: "チーム",
        score: "スコア",
        scoreExplanation: "スコアの説明",
        perActivity: "アクティビティ別",
        points: "ポイント",
        noData: "まだ提出がありません",
        noTeams: "まだチームがいません",
        selectActivity: "アクティビティを選択",
        activitiesCompleted: "{{count}}/{{total}} アクティビティ完了"
      },
      teamSettings: {
        title: "チーム設定",
        teamName: "チーム名",
        teamId: "チームID",
        inviteCode: "招待コード",
        gradeLevel: "学年",
        members: "メンバー",
        maxReached: "チームが満員です（最大4名）",
        shareQR: "QRコードを共有",
        qrInstructions: "他の生徒がこのQRコードをスキャンすると、あなたのチームに参加できます",
        leaveTeam: "チームを脱退する",
        leaveConfirm: "本当にチームを脱退しますか？",
        noTeam: "チームに所属していません",
        member: "メンバー",
        leader: "リーダー",
        remove: "削除"
      },
      privacyPolicy: {
        dataCollection: "データの収集",
        dataCollectionContents: "当アプリは、動作分析のためにモーションセンサー（加速度計）データのみを収集します。個人を特定する情報は必要ありません。",
        useOfData: "データの使用目的",
        useOfDataContents: "収集したデータは、アクティビティの追跡、パフォーマンス分析、およびユーザーエクスペリエンスの向上のために使用されます。",
        dataStorage: "データの保存",
        dataStorageContents: "データはアプリケーションの動作に応じてローカルまたは一時的に保存されます。第三者への販売や共有は行われません。",
        thirdPartyServices: "サードパーティサービス",
        thirdPartyServicesContents: "外部サービス（APIや解析ツールなど）が、独自のプライバシーポリシーに基づいてデータを収集する場合があります。",
        security: "セキュリティ",
        securityContents: "合理的なセキュリティ対策を講じていますが、完全に安全なシステムは存在しません。",
        policyChanges: "ポリシーの更新",
        policyChangesContents: "本プライバシーポリシーは、随時更新される場合があります。"
      },
      termsOfService: {
        useOfApp: "アプリの利用",
        useOfAppContents: "本アプリケーションは、教育およびデモンストレーション目的で提供されています。ユーザーは適法に使用する必要があります。",
        userResponsibilities: "ユーザーの責任",
        userResponsibilitiesContents: "ユーザーは、本アプリケーションまたはそのサービスを混乱させたり、悪用したり、リバースエンジニアリングを試みたりしてはなりません。",
        intellectualProperty: "知的財産権",
        intellectualPropertyContents: "特に明記されていない限り、すべてのコンテンツ、デザイン、ソースコードは開発者に帰属します。",
        noWarranty: "免責事項",
        noWarrantyContents: "本アプリケーションは「現状有姿」で提供され、いかなる保証もいたしません。",
        limitationOfLiability: "責任の制限",
        limitationOfLiabilityContents: "開発者は、本アプリケーションの使用に起因するいかなる損害についても責任を負いません。",
        changesToTerms: "利用規約の変更",
        changesToTermsContents: "本規約は、予告なしにいつでも更新される場合があります。"
      },
      contactSupport: {
        customerService: "24時間365日対応のカスタマーサービス",
        writeUsAt: "お問い合わせ先"
      },
      attempt: {
        newTrial: "新しい試行",
        designPresets: "デザインプリセット",
        structuralIterations: "構造の反復試行",
        logTrialPlaceholder: "まだ試行は記録されていません。チャレンジを完了し、「試行を記録」をタップして結果を保存してください。"
      },
      settings: {
        batteryLevel: "バッテリー残量"
      }
    }
  },
  id: {
    translation: {
      tabs: {
        home: "Beranda",
        activities: "Aktivitas",
        leaderboard: "Peringkat",
        settings: "Pengaturan",
        account: "Akun",
        team: "Tim",
        appearance: "Tampilan",
        about: "Tentang",
        details: "Detail",
        attempt: "Percobaan",
        instructions: "Petunjuk",
        language: "Bahasa",
        contactSupport: "Hubungi Dukungan",
        privacyPolicy: "Kebijakan Privasi",
        termsOfService: "Ketentuan Layanan",
        changePassword: "Ubah Kata Sandi",
        profileInformation: "Informasi Profil",
        manageMembers: "Kelola Anggota",
        members: "Anggota",
        teamInformation: "Informasi Tim",
        teamRoles: "Peran Tim",
        journal: "Jurnal"
      },
      buttons: {
        register: "Daftar",
        login: "Masuk",
        createTeam: "Buat Tim",
        joinTeam: "Gabung Tim",
        begin: "Mulai",
        startRecording: "Mulai Rekam",
        startChallenge: "Mulai Tantangan",
        recording: "Merekam...",
        finishActivity: "Selesaikan Aktivitas",
        continue: "Lanjutkan",
        backToActivities: "Kembali ke Aktivitas",
        waitForSignal: "Tunggu Sinyal",
        tapNow: "TAP SEKARANG!",
        changePassword: "Ubah Kata Sandi",
        logTrial: "Catat Percobaan",
        logReading: "Catat Pembacaan",
        logDesign: "Catat Desain",
        stop: "BERHENTI",
        start: "MULAI",
        edit: "Ubah",
        save: "Simpan",
        openCamera: "Buka Kamera",
        closeCamera: "Tutup Kamera"
      },
      landing: {
        slogan: "Eksperimen. Ukur. Tingkatkan."
      },
      forms: {
        hello: "Halo!",
        welcome: "Selamat Datang Kembali!",
        userRegister: "Daftar Pengguna",
        userLogin: "Masuk Pengguna",
        displayName: "Nama Tampilan",
        displayNamePlaceholder: "Masukkan nama tampilan",
        email: "Email",
        emailPlaceholder: "Masukkan email",
        password: "Kata Sandi",
        passwordPlaceholder: "Masukkan kata sandi"
      },
      common: {
        loading: "Memuat...",
        notImplemented: "Belum Diimplementasikan",
        cancel: "Batal",
        delete: "Hapus",
        clear: "Bersihkan"
      },
      teamInitialization: {
        createTitle: "Buat Tim Anda",
        joinTitle: "Gabung Tim",
        teamName: "Nama Tim",
        teamNamePlaceholder: "Masukkan nama tim",
        gradeLevel: "Tingkat Kelas",
        gradeLevelPlaceholder: "Pilih tingkat kelas",
        skip: "Lewati dulu",
        teamID: "ID Tim",
        teamIDPlaceholder: "Masukkan ID tim",
        inviteCode: "Kode Undangan",
        inviteCodePlaceholder: "Masukkan kode undangan",
        grantCamera: "Izinkan Akses Kamera",
        cancelScan: "Batalkan Pindai",
        scanQR: "Pindai Kode QR"
      },
      home: {
        welcome: "Selamat Datang",
        rank: "Peringkat",
        completed: "Selesai",
        noTeam: "Tidak dalam tim",
        joinOrCreate: "Gabung atau buat tim untuk memulai",
        recentActivity: "Aktivitas Terbaru",
        noRecentActivity: "Tidak ada aktivitas terbaru",
        signinToTrackProgress: "Masuk untuk melacak kemajuan Anda",
        startActivity: "Mulai aktivitas",
        subtitle: "Siap untuk eksperimen berikutnya?",
        subtitle: "Siap untuk eksperimen berikutnya?",
        howItWorks: "Cara Kerja STEMMLAB",
        howItWorksElements: [
          "Pilih Tantangan",
          "Gunakan bahan nyata dan catat eksperimen Anda",
          "Ambil data menggunakan sensor ponsel dan unggah hasilnya",
          "Sempurnakan desain Anda dan naikkan peringkat"
        ],
        seeActivityRequirement: "Selesaikan sebuah aktivitas untuk melihatnya di sini.",
        progress: "Kemajuan",
        progressSummary: "Anda telah menyelesaikan {{count}} dari 7 aktivitas",
        bestActivity: "Aktivitas Terbaik",
        activityCompletion: "Penyelesaian Aktivitas",
        scoresOverview: "Ikhtisar Skor",
        submissionHistory: "Riwayat Pengiriman",
        noSubmissionsYet: "Belum ada pengiriman",
        noScoresYet: "Mulai selesaikan aktivitas untuk melihat skor Anda",
        viewFullProgress: "Lihat Kemajuan Penuh",
        completedActivities: "Aktivitas Selesai",
        latestScore: "Skor Terbaru"
      },
      activities: {
        selectActivity: "Pilih Aktivitas",
        activityDetails: "Detail Aktivitas",
        overview: "Gambaran",
        equipmentsNeeded: "Peralatan yang Diperlukan",
        instructions: "Petunjuk",
        attempt: "Percobaan",
        phase: "Fase",
        activityResults: "Hasil Aktivitas",
        allActivities: "Semua Aktivitas",

        parachuteDropChallenge: {
          name: "Tantangan Jatuhkan Parasut",
          description: "Rancang, buat, dan uji parasut untuk mainan kecil guna mengurangi kecepatan jatuh dan gaya benturan. Tim Anda akan melakukan iterasi dengan batasan waktu dan bahan untuk mencapai pendaratan paling lambat dan aman di area target.",
          instructions: [
            "Jatuhkan mainan tanpa parasut dan rekam jatuhnya (uji dasar).",
            "Buat parasut menggunakan bahan yang disediakan.",
            "Jatuhkan mainan dari ketinggian yang sama dan rekam jatuhnya.",
            "Tinjau kecepatan dan akurasi pendaratan di aplikasi.",
            "Rancang ulang dan uji hingga tiga prototipe dalam 20 menit.",
            "Unggah video, hasil, dan refleksi tim."
          ],
          equipments: [
            { name: "Kantong Plastik Sampah", description: "Digunakan untuk membuat kanopi parasut." },
            { name: "Tali", description: "Digunakan untuk tali kafan yang menghubungkan kanopi ke beban." },
            { name: "Mainan Kecil", description: "Berfungsi sebagai 'penumpang' atau muatan untuk uji jatuh." },
            { name: "Meja", description: "Menyediakan ketinggian jatuh yang konsisten untuk pengujian yang adil." },
            { name: "Gunting", description: "Digunakan untuk memotong dan membentuk kanopi dan tali sesuai kebutuhan desain." },
            { name: "Selotip", description: "Mengamankan komponen dan menandai ketinggian jatuh." }
          ],
          parameters: "Parameter",
          analytics: "Analisis Fisika",
          gForce: "Analisis G-Force",
          contactTime: "Waktu Kontak (s)",
          contactTimePlaceholder: "Masukkan waktu kontak (mis. 0.05)",
          didBounce: "Apakah memantul?",
          surfaceArea: "Luas Permukaan (cm²)",
          surfaceAreaPlaceholder: "Luas permukaan parasut",
          gForceResult: "G-Force",
          gForceRisk: "Risiko Cedera",
          gForceRiskScale: "Skala Risiko G-Force",
          gForceTip: "Gunakan video gerak lambat untuk mengukur waktu kontak",
          prototype: "Prototipe",
          dropHeightPlaceholder: "Tinggi Jatuh (m)",
          toyMassPlaceholder: "Massa Mainan (kg)",
          baselineLabel: "Dasar (Tanpa Parasut)",
          predictTime: "Waktu Perkiraan (s)",
          predictTimePlaceholder: "Perkiraan waktu jatuh",
          wasRight: "Apakah perkiraan Anda benar?",
          writeUpPrediction: "Catatan Perkiraan",
          easiestDesign: "Desain termudah untuk dibuat",
          easiestDesignPlaceholder: "Desain mana yang paling mudah?",
          gForceTable: {
            safe: "1-5 g: Tidak cedera (lift, berdiri)",
            moderate: "5-10 g: Memar mungkin terjadi (jatuh keras)",
            serious: "10-30 g: Cedera serius mungkin (tabrakan olahraga)",
            severe: "30-50 g: Risiko tinggi cedera parah (kecelakaan mobil)",
            critical: "50+ g: Cedera mengancam jiwa"
          }
        },

        soundPollutionHunter: {
          name: "Pemburu Polusi Suara",
          description: "Siswa bertindak sebagai penyelidik lingkungan untuk mengukur dan membandingkan tingkat suara yang dihasilkan oleh berbagai aktivitas di kelas. Tujuannya adalah mengidentifikasi bagaimana energi dan permukaan mempengaruhi intensitas suara dan memahami risiko kesehatan terkait paparan kebisingan berkepanjangan.",
          instructions: [
            "Ukur kebisingan dari berbagai tindakan (menjatuhkan benda, berbicara, berjalan, menghentakkan kaki).",
            "Catat tingkat suara dan lokasi.",
            "Petakan zona bising dan tenang."
          ],
          equipments: [
            { name: "Benda Apapun", description: "Benda yang dijatuhkan untuk mengukur kebisingan." }
          ],
          actionLabel: "Tindakan",
          actionPlaceholder: "Mis. Menjatuhkan buku",
          actionOptions: ["Menjatuhkan buku", "Berbicara", "Berjalan", "Menghentakkan kaki", "Menutup pintu"],
          locationPlaceholder: "Mis. Kantin, Perpustakaan, Gym",
          predictionLabel: "Perkiraan (Lebih Keras/Lebih Lembut)",
          predictLouder: "Lebih Keras",
          predictSofter: "Lebih Lembut",
          predictionCompare: "Apakah perkiraan Anda benar?",
          hearingRiskTable: "Risiko Kerusakan Pendengaran",
          safeZone: "Zona Aman",
          warningZone: "Zona Peringatan",
          dangerZone: "Zona Berbahaya",
          riskScale: {
            safe: "0-60 dB: Aman — tidak berisiko",
            moderate: "60-85 dB: Aman untuk paparan singkat",
            warning: "85-90 dB: Peringatan — kerusakan mungkin >8 jam",
            high: "90-100 dB: Risiko tinggi — kerusakan >15 menit",
            dangerous: "100-120 dB: Berbahaya — hitungan menit",
            critical: "120dB+: Risiko kerusakan langsung"
          },
          needEarMuffs: "Haruskah Anda memakai pelindung telinga?",
          needEarMuffsPlaceholder: "Pendapat Anda tentang perlindungan telinga"
        },

        handFanChallenge: {
          name: "Tantangan Kipas Tangan",
          description: "Siswa menguji bagaimana pergerakan udara memberikan gaya pada bahan fleksibel. Dengan merancang kipas tangan yang berbeda dan mengujinya terhadap target kertas dan karton, tim menyelidiki hubungan antara desain kipas, jarak, dan kekakuan bahan.",
          instructions: [
            "Tegakkan kertas di atas meja.",
            "Kipaskan udara dari jarak 30 cm.",
            "Amati dan catat pergerakan.",
            "Ulangi dengan desain kipas dan jarak yang berbeda (15 cm, 30 cm, 45 cm)."
          ],
          equipments: [
            { name: "Kertas dan Karton", description: "Digunakan sebagai bahan baku untuk membuat kipas dan target vertikal." },
            { name: "Gunting", description: "Memungkinkan pemotongan presisi untuk membuat bentuk dan ukuran kipas tertentu." },
            { name: "Selotip", description: "Mengamankan target vertikal ke meja sehingga bisa ditekuk tanpa jatuh." }
          ],
          selectMaterial: "Bahan Target",
          selectDistance: "Jarak (cm)",
          materialStiffness: "Koefisien Kekakuan",
          targetToggle: "Jenis Target",
          paper: "Kertas",
          cardboard: "Karton",
          fanDesign: "Nama Desain Kipas",
          fanDesignPlaceholder: "Mis. Lipatan Origami",
          deflectionAngle: "Sudut Lenturan (°)",
          anglePlaceholder: "Masukkan sudut lentur",
          forceResult: "Perkiraan Gaya",
          forceUnit: "N",
          stiffnessNote: "Kekakuan lebih tinggi = lebih banyak gaya diperlukan untuk membengkokkan",
          predictionAngle: "Sudut Perkiraan (°)",
          predictionAnglePlaceholder: "Perkiraan sudut Anda",
          wasRightLabel: "Apakah Anda benar?",
          writeUp: {
            bestDesign: "Desain mana yang paling menggerakkan kertas?",
            bestDesignPlaceholder: "Jawaban Anda",
            stiffnessEffect: "Bagaimana kekakuan mempengaruhi sudut lentur?",
            stiffnessEffectPlaceholder: "Pengamatan Anda",
            distanceEffect: "Bagaimana jarak mempengaruhi lenturan?",
            distanceEffectPlaceholder: "Pengamatan Anda"
          }
        },

        earthquakeResistantStructure: {
          name: "Struktur Tahan Gempa",
          description: "Siswa merancang dan membangun prototipe struktur untuk menahan simulasi getaran gempa. Tujuannya adalah menggunakan rekayasa iteratif untuk menciptakan dasar yang menyerap dan mendistribusikan energi, melindungi 'bangunan' (ponsel) dari gerakan berlebihan.",
          instructions: [
            "Amankan target vertikal ke meja sehingga bisa ditekuk tanpa jatuh.",
            "Tempatkan platform karton datar di atasnya.",
            "Letakkan ponsel di tengah dan aktifkan mode getaran pada Aplikasi STEMM.",
            "Modifikasi struktur untuk mengurangi gerakan (mis. lebih banyak pilar, lebih banyak lipatan, dll)."
          ],
          equipments: [
            { name: "Kertas dan Karton", description: "Bahan utama untuk membangun platform struktur dan lapisan anti-getaran." },
            { name: "Gunting", description: "Memungkinkan pemotongan presisi bahan." },
            { name: "Selotip", description: "Mengamankan target vertikal ke meja." }
          ],
          designName: "Nama Desain",
          designNamePlaceholder: "Mis. Desain 1",
          foldCount: "Jumlah Lipatan",
          foldCountPlaceholder: "Jumlah lipatan",
          pillarCount: "Jumlah Pilar",
          pillarCountPlaceholder: "Jumlah pilar",
          predictedMovement: "Perkiraan Gerakan (cm)",
          predictedMovementPlaceholder: "Perkiraan Anda",
          observedSway: "Gerakan Teramati (cm)",
          observedSwayPlaceholder: "Gerakan terukur",
          accelerometerData: "Data Akselerometer",
          startVibration: "Mulai Getaran",
          stopVibration: "Hentikan Getaran",
          writeUp: {
            bestDesign: "Desain mana yang paling sedikit bergerak?",
            bestDesignPlaceholder: "Jawaban Anda",
            structuralEffect: "Bagaimana lipatan/pilar mempengaruhi stabilitas?",
            structuralEffectPlaceholder: "Pengamatan Anda",
            realWorldLink: "Bagaimana ini terkait dengan bangunan nyata?",
            realWorldLinkPlaceholder: "Hubungan Anda"
          },
          designPreset1: "4 lipatan + 4 pilar",
          designPreset2: "10 lipatan + 4 pilar",
          designPreset3: "3 lipatan + 6 pilar",
          folds: "Lipatan",
          pillars: "Pilar",
          sway: "Goyangan",
          peak: "Puncak",
          predicted: "Prediksi",
        },

        stretchSpeedAndGracefulness: {
          name: "Kecepatan & Keanggunan Gerakan",
          description: "Siswa menyelidiki biomekanika manusia dengan mengukur kecepatan dan kehalusan gerakan mereka selama peregangan terkontrol. Menggunakan sensor getaran ponsel, tim menganalisis seberapa 'anggun' mereka bergerak dan bagaimana kelelahan atau kecepatan mempengaruhi koordinasi fisik.",
          instructions: [
            "Pegang ponsel dengan kuat di satu tangan. Aktifkan sensor getaran aplikasi.",
            "Lakukan gerakan terbimbing secara perlahan seperti yang ditunjukkan. Rekam getaran.",
            "Ulangi aktivitas dengan umpan balik getaran diaktifkan.",
            "Tinjau data kecepatan, kehalusan, dan rentang gerak.",
            "Unggah hasil dan refleksikan sebagai kelompok."
          ],
          equipments: [
            { name: "Ruangan Terbuka", description: "Menyediakan lingkungan yang aman bagi siswa untuk melakukan latihan rentang gerak penuh." }
          ],
          clockwiseMovement: "Gerakan Searah Jarum Jam",
          verticalMovement: "Gerakan Vertikal",
          horizontalMovement: "Gerakan Horizontal",
          recordMovement: "Rekam Gerakan",
          vibrationsDetected: "Getaran Terdeteksi",
          smoothnessScore: "Skor Kehalusan",
          movementMonitor: "Monitor Gerakan",
          movementMonitorPlaceholder: "Mulai merekam untuk memvisualisasikan kehalusan gerakan",
          movementVibrations: "Gerakan {{index}} Getaran",
          movementSmoothness: "Gerakan {{index}} Kehalusan",
          vibrations: "Getaran"
        },

        reactionBoardChallenge: {
          name: "Tantangan Papan Reaksi",
          description: "Siswa menguji koordinasi neuromuskular mereka dengan mengukur waktu reaksi dalam kondisi berbeda. Aktivitas ini menggunakan ponsel sebagai papan 'stimulus dan respons' digital untuk menangkap kecepatan jalur sinyal otak-ke-tubuh.",
          instructions: [
            "Ketuk layar segera setelah tombol tersembunyi muncul. Catat waktu reaksi.",
            "Ulangi menggunakan tangan yang tidak dominan. Bandingkan hasil.",
            "Telusuri bentuk bergerak di layar. Tinjau akurasi dan penundaan."
          ],
          equipments: [
            {
              name: "Tidak Ada",
              description: "Tidak memerlukan peralatan apa pun."
            }
          ],
          dominantHand: "Reaksi Ketukan Tangan Dominan",
          nonDominantHand: "Reaksi Ketukan Tangan Non-Dominan",
          tracingChallenge: "Tantangan Menelusuri",
          recordReactionTime: "Rekam Waktu Reaksi",
          measureTracingAccuracy: "Ukur Akurasi Penelusuran",
          tracingZone: "Zona Penelusuran",
          tracingZonePlaceholder: "Telusuri Di Sini",
          reactionZone: "Zona Reaksi",
          reactionZonePlaceholder: "Ketuk di area ini saat target muncul",
          accuracyScore: "Skor Akurasi",
          tap: "KETUK!",
          tracingAccuracy: "Akurasi Menelusuri",
          reactionTime: "Waktu Reaksi"
        },

        breathingPaceTrainer: {
          name: "Pelatih Irama Napas",
          description: "Siswa mengeksplorasi hubungan antara pernapasan dan relaksasi fisik. Dengan mengikuti pengatur waktu digital, mereka belajar mengontrol laju pernapasan untuk mengamati bagaimana pengaturan sadar mempengaruhi detak jantung atau tingkat stres.",
          instructions: [
            "Letakkan ponsel dengan lembut di dada.",
            "Rekam pernapasan saat istirahat.",
            "Lakukan olahraga ringan (joging di tempat 1 menit dan 100 lompatan bintang).",
            "Rekam pernapasan lagi dan bandingkan hasilnya."
          ],
          equipments: [
            { name: "Permukaan Datar", description: "Permukaan yang stabil dan rata untuk meletakkan ponsel selama pengukuran pernapasan. Membantu menjaga perangkat tetap stabil sehingga gerakan dada dan pola pernapasan dapat terdeteksi dengan lebih akurat." }
          ],
          rest: "Istirahat",
          jogging: "Joging Satu Menit",
          starJumps: "100 Star Jump",
          recordBreathing: "Rekam Pernapasan",
          breathsRecorded: "Napas Terekam",
          bpm: "BPM",
          breathingMonitor: "Monitor Pernapasan",
          breathingMonitorPlaceholder: "Mulai merekam untuk memvisualisasikan gerakan dada",
          activityBPMCount: "Aktivitas {{index}} BPM"
        }
      },
      journal: {
        title: "Jurnal",
        experimentRecords: "CATATAN EKSPERIMEN",
        clearAll: "Hapus Semua",
        noData: "Belum ada data eksperimen",
        noDataSubtext: "Pergi ke tab Eksperimen dan catat percobaan pertama Anda!",
        trialCount: "{{count}} percobaan",
        trialCount_plural: "{{count}} percobaan",
        trialNumber: "Percobaan #{{number}}",
        teamConfirmation: "KONFIRMASI TIM",
        confirmSubtext: "Semua anggota tim harus mengonfirmasi sebelum pengiriman",
        confirmed: "Dikonfirmasi",
        confirmText: "Saya mengonfirmasi pengiriman tim kami",
        confirmNote: "Setiap anggota harus mengonfirmasi secara mandiri. Ini adalah laporan mandiri.",
        teamReflection: "REFLEKSI TIM",
        reflectionPlaceholder: "Apa yang Anda amati? Apa yang mengejutkan?",
        submitting: "MENGIRIM...",
        submitMission: "KIRIM MISI",
        missingReflection: "Refleksi Hilang",
        missingReflectionMsg: "Harap tulis refleksi Anda sebelum mengirim.",
        confirmRequired: "Konfirmasi Tim Diperlukan",
        confirmRequiredMsg: "Semua anggota tim harus mengonfirmasi sebelum pengiriman. Harap centang kotak konfirmasi.",
        submitSuccess: "Misi Terkirim!",
        submitError: "Gagal mengirim. Periksa koneksi Anda.",
        deleteTitle: "Hapus Percobaan",
        deleteMsg: "Hapus percobaan ini?",
        clearAllTitle: "Hapus Semua",
        clearAllMsg: "Hapus semua percobaan untuk aktivitas ini?",
        velocityMetric: "Kecepatan (m/s)",
        decibelMetric: "Desibel (dB)",
        forceMetric: "Gaya (N)",
        swayMetric: "Ayunan (cm)",
        defaultMetric: "Pengukuran",
        recordedTrials: "Percobaan Tercatat",
        attempts: "Percobaan",
        noAttempts: "Belum ada percobaan tersimpan",
        noAttemptsSubtext: "Simpan percobaan selama eksperimen untuk melihatnya di sini",
        saveAttempt: "Simpan Percobaan",
        attemptSaved: "Percobaan berhasil disimpan",
        attemptError: "Gagal menyimpan percobaan",
        deleteAttempt: "Hapus Percobaan",
        deleteAttemptConfirm: "Apakah Anda yakin ingin menghapus percobaan ini?",
        officialSubmission: "Pengiriman Resmi",
        submitToLeaderboard: "Kirim ke Papan Peringkat",
        submitted: "Terkirim",
        replaceSubmission: "Ganti Pengiriman",
        replaceSubmissionConfirm: "Ini akan mengganti pengiriman resmi Anda saat ini. Lanjutkan?",
        deleteSubmissionFirst: "Hapus Pengiriman",
        deleteSubmissionConfirm: "Apakah Anda yakin ingin menghapus pengiriman resmi Anda?",
        deleteSubmissionWarning: "Anda tidak dapat menghapus percobaan yang sudah dikirim. Harap batalkan pengiriman terlebih dahulu.",
        submissionSuccess: "Berhasil",
        submissionReplaced: "Pengiriman berhasil diganti",
        attemptNumber: "Percobaan #{{number}}",
        viewAttempt: "Lihat",
        deleteSubmittedTitle: "Tidak Dapat Dihapus",
        deleteSubmittedWarning: "Anda tidak dapat menghapus percobaan yang sudah dikirim. Harap batalkan pengiriman terlebih dahulu.",
        confirmReplace: "Ganti Pengiriman?",
        confirmReplaceMsg: "Ini akan mengganti pengiriman resmi Anda saat ini. Lanjutkan?",
        saving: "Menyimpan..."
      },
      errorMessages: {
        invalidCredential: "Email atau kata sandi tidak valid",
        fillInAllFields: "Harap isi semua kolom",
        userNotFound: "Tidak ada akun dengan email ini",
        wrongPassword: "Kata sandi salah",
        invalidEmail: "Harap masukkan email yang valid",
        tooManyRequests: "Terlalu banyak percobaan. Silakan coba lagi nanti",
        defaultError: "Terjadi kesalahan",
        weakPassword: "Kata sandi minimal 6 karakter",
        emailAlreadyInUse: "Email ini sudah terdaftar",
        failedPasswordUpdate: "Pembaruan kata sandi gagal",
        passwordsDoNotMatch: "Kata sandi tidak cocok",
        emptyDisplayName: "Nama tampilan tidak boleh kosong",
        unfinishedChallenge: "Tantangan Belum Selesai",
        unfinishedChallengeDescription: "Selesaikan dan simpan semua tantangan sebelum percobaan ini dapat disimpan.",
        batterySaverOn: "Mode Hemat Daya Aktif",
        batterySaverOnDescription: "Aktivitas ini mengumpulkan data eksperimen menggunakan sensor, fungsi pengukuran waktu, atau kemampuan media pada perangkat Anda. Mode Hemat Daya dapat memengaruhi performa perangkat dan konsistensi pengukuran. Untuk memperoleh hasil yang paling andal, pertimbangkan untuk menonaktifkan Mode Hemat Daya sebelum melanjutkan."
      },
      countdown: {
        getReady: "Bersiaplah"
      },
      about: {
        appName: "Nama Aplikasi:",
        version: "Versi:",
        description: "Deskripsi:",
        descriptionValue: "Platform pembelajaran STEM interaktif yang dirancang untuk aktivitas kolaboratif dan kompetisi.",
        privacyPolicy: "Kebijakan Privasi",
        termsOfService: "Ketentuan Layanan",
        contactSupport: "Hubungi Dukungan"
      },
      account: {
        profileInformation: "Informasi Profil",
        teamInformation: "Informasi Tim",
        changePassword: "Ubah Kata Sandi",
        logout: "Keluar"
      },
      appearance: {
        lightMode: "Mode Terang",
        darkMode: "Mode Gelap",
        system: "Sistem"
      },
      team: {
        teamInformation: "Informasi Tim",
        members: "Anggota",
        teamRoles: "Peran Tim",
        leaveTeam: "Tinggalkan Tim"
      },
      changePassword: {
        currentPassword: "Kata Sandi Saat Ini",
        currentPasswordPlaceholder: "Masukkan kata sandi saat ini",
        newPassword: "Kata Sandi Baru",
        newPasswordPlaceholder: "Masukkan kata sandi baru",
        confirmPassword: "Konfirmasi Kata Sandi",
        confirmPasswordPlaceholder: "Konfirmasi kata sandi baru"
      },
      results: {
        attempts: "Percobaan",
        ranking: "Peringkat",
        theoryExplanation: "Penjelasan Teori",
        rating: "Nilai Aktivitas Ini",
        ratingPrompt: "Bagaimana aktivitas ini?",
        accuracy: "Akurasi",
        noData: "Belum ada catatan",
        entryNumber: "#{{number}}",
        ratingHint: "Ketuk bintang untuk menilai aktivitas ini",
        compare: "Bandingkan hasil Anda dengan tim dan papan peringkat!",
        compareNoise: "Bandingkan peta kebisingan tim Anda dengan yang lain di papan peringkat!",
        velocity: "Kecepatan",
        gForce: "G-Force",
        time: "Waktu",
        surfaceArea: "Luas Permukaan",
        submitToLeaderboard: "Kirim ke Papan Peringkat",
        submitted: "Terkirim ✓",
        leaderboard: "Papan Peringkat",
        backToActivities: "Kembali ke Aktivitas",
        parachuteTheory: "Cara Kerja Parasut\n\nSaat Anda menjatuhkan mainan tanpa parasut, gravitasi menariknya langsung ke bawah. Satu-satunya gaya yang bekerja adalah gravitasi, sehingga ia berakselerasi pada 9,8 m/s² hingga menyentuh tanah. Parasut menambahkan gaya hambat dengan meningkatkan luas permukaan. Gaya hambat mendorong ke atas melawan gravitasi, memperlambat jatuh.\n\nRumus utama:\n• Kecepatan: v = d / t\n• Akselerasi: a = v / t\n• Berat: W = m × 9,8\n• Gaya Bersih: F = m × a\n• Gaya Hambat: F_hambat = W - F_bersih\n• G-force (tanpa pantul): (v / waktuKontak) / 9,8\n• G-force (dengan pantul): ((v + v_pantul) / waktuKontak) / 9,8",
        soundTheory: "Cara Kerja Polusi Suara\n\nSuara diukur dalam desibel (dB), skala logaritmik. Setiap kenaikan 10 dB mewakili peningkatan sepuluh kali lipat intensitas suara. Percakapan normal sekitar 60 dB, sementara konser rock bisa melebihi 120 dB. Paparan berkepanjangan di atas 85 dB dapat menyebabkan kerusakan pendengaran.\n\n• Desibel (dB): Satuan intensitas suara\n• Aman: 0-60 dB\n• Peringatan: 60-85 dB\n• Berbahaya: 85+ dB",
        fanTheory: "Cara Kerja Kipas Tangan\n\nSaat Anda mengipaskan udara ke target kertas, udara yang bergerak memberikan gaya. Jumlah gaya tergantung pada kecepatan udara, kekakuan bahan kipas, dan jarak ke target. Bahan yang lebih kaku menghasilkan lebih banyak gaya karena mendorong lebih banyak udara per ayunan.\n\nRumus utama:\n• Perkiraan gaya: F ≈ k × θ\n• Bahan: kertas tipis (k=0,05), kertas karton (k=0,20), karton tipis (k=0,50), karton bergelombang (k=2,50)",
        earthquakeTheory: "Cara Kerja Struktur Tahan Gempa\n\nSaat gempa terjadi, bangunan mengalami getaran di berbagai arah. Insinyur merancang struktur untuk menyerap dan menghilangkan energi ini. Lipatan dan pilar menambah stabilitas struktural dengan mendistribusikan gaya lebih merata.\n\n• Isolasi dasar: Memisahkan bangunan dari tanah\n• Penyangga diagonal: Penyangga diagonal menambah stabilitas\n• Disipasi energi: Lipatan dan sambungan fleksibel menyerap getaran",
        breathingTheory: "Cara Kerja Pernapasan\n\nLaju pernapasan berubah dengan aktivitas fisik. Saat istirahat, seseorang bernapas 12-20 kali per menit. Selama olahraga, tubuh membutuhkan lebih banyak oksigen, sehingga laju pernapasan meningkat.\n\n• BPM: Napas per menit\n• Istirahat: 12-20 BPM\n• Olahraga ringan: 20-40 BPM\n• Olahraga berat: 40-60 BPM",
        reactionTheory: "Cara Kerja Waktu Reaksi\n\nWaktu reaksi adalah interval antara stimulus dan respons Anda. Ini melibatkan indra Anda mendeteksi stimulus, otak Anda memproses informasi, dan saraf Anda memberi sinyal otot untuk bertindak. Waktu reaksi rata-rata manusia terhadap stimulus visual sekitar 200-250 milidetik.\n\n• Tangan dominan: Biasanya 10-20ms lebih cepat\n• Usia: Waktu reaksi puncak di awal 20-an\n• Kelelahan: Memperlambat waktu reaksi secara signifikan",
        movementTheory: "Cara Kerja Kehalusan Gerakan\n\nKehalusan gerakan diukur dari perubahan akselerasi mendadak. Akselerometer ponsel mendeteksi getaran dan sentakan. Gerakan halus menghasilkan perubahan akselerasi yang lebih sedikit dan lebih kecil.\n\n• Getaran: Perubahan akselerasi mendadak\n• Kehalusan: Persentase waktu tanpa getaran berlebihan\n• Skor: Mulai dari 100%, berkurang dengan setiap sentakan",
        preset: "Preset",
        score: "Skor"
      },
      leaderboard: {
        title: "Peringkat",
        global: "Peringkat Global",
        byActivity: "Berdasarkan Aktivitas",
        rank: "Peringkat",
        team: "Tim",
        score: "Skor",
        scoreExplanation: "Penjelasan Skor",
        perActivity: "Per Aktivitas",
        points: "poin",
        members: "Anggota",
        noData: "Belum ada pengiriman",
        selectActivity: "Pilih Aktivitas"
      },
      teamSettings: {
        title: "Pengaturan Tim",
        teamName: "Nama Tim",
        teamId: "ID Tim",
        inviteCode: "Kode Undangan",
        gradeLevel: "Tingkat Kelas",
        members: "Anggota",
        maxReached: "Tim sudah penuh (maks 4)",
        shareQR: "Bagikan Kode QR",
        qrInstructions: "Siswa lain dapat memindai kode QR ini untuk bergabung dengan tim Anda",
        leaveTeam: "Tinggalkan Tim",
        leaveConfirm: "Apakah Anda yakin ingin meninggalkan tim?",
        noTeam: "Tidak dalam tim",
        member: "Anggota",
        leader: "Ketua",
        remove: "Hapus"
      },
      privacyPolicy: {
        dataCollection: "Pengumpulan Data",
        dataCollectionContents: "Aplikasi ini mengumpulkan data sensor gerak (akselerometer) untuk menganalisis performa gerakan. Tidak diperlukan data identitas pribadi.",
        useOfData: "Penggunaan Data",
        useOfDataContents: "Data digunakan untuk pelacakan aktivitas, analisis performa, dan meningkatkan pengalaman pengguna.",
        dataStorage: "Penyimpanan Data",
        dataStorageContents: "Data mungkin disimpan secara lokal atau sementara tergantung pada alur aplikasi. Data tidak dijual atau dibagikan kepada pihak ketiga.",
        thirdPartyServices: "Layanan Pihak Ketiga",
        thirdPartyServicesContents: "Layanan eksternal (misalnya API atau analitik) dapat mengumpulkan data sesuai dengan kebijakan privasi mereka sendiri.",
        security: "Keamanan",
        securityContents: "Kami menerapkan langkah-langkah keamanan yang wajar, namun tidak ada sistem yang sepenuhnya aman.",
        policyChanges: "Pembaruan Kebijakan",
        policyChangesContents: "Kebijakan privasi ini dapat diperbarui dari waktu ke waktu."
      },
      termsOfService: {
        useOfApp: "Penggunaan Aplikasi",
        useOfAppContents: "Aplikasi ini disediakan untuk tujuan pendidikan dan demonstrasi. Pengguna wajib menggunakan aplikasi secara sah.",
        userResponsibilities: "Tanggung Jawab Pengguna",
        userResponsibilitiesContents: "Pengguna tidak boleh mencoba untuk mengganggu, menyalahgunakan, atau melakukan rekayasa balik (reverse-engineer) pada aplikasi atau layanannya.",
        intellectualProperty: "Kekayaan Intelektual",
        intellectualPropertyContents: "Semua konten, desain, dan kode sumber adalah milik pengembang kecuali dinyatakan lain.",
        noWarranty: "Tanpa Jaminan",
        noWarrantyContents: "Aplikasi ini disediakan 'apa adanya' tanpa jaminan dalam bentuk apa pun.",
        limitationOfLiability: "Batasan Tanggung Jawab",
        limitationOfLiabilityContents: "Pengembang tidak bertanggung jawab atas kerugian apa pun yang timbul dari penggunaan aplikasi ini.",
        changesToTerms: "Perubahan Ketentuan",
        changesToTermsContents: "Ketentuan ini dapat diperbarui kapan saja tanpa pemberitahuan sebelumnya."
      },
      contactSupport: {
        customerService: "Layanan Pelanggan 24/7 Kami",
        writeUsAt: "Hubungi kami di"
      },
      attempt: {
        newTrial: "Uji Coba Baru",
        designPresets: "Preset Desain",
        structuralIterations: "Iterasi Struktural",
        logTrialPlaceholder: "Belum ada percobaan yang dicatat. Selesaikan tantangan lalu ketuk \"Catat Percobaan\" untuk menyimpan hasil Anda."
      },
      settings: {
        batteryLevel: "Tingkat Baterai"
      }
    }
  },
  zh: {
    translation: {
      tabs: {
        home: "首页",
        activities: "活动",
        leaderboard: "排行榜",
        settings: "设置",
        account: "账户",
        team: "团队",
        appearance: "外观",
        about: "关于",
        details: "详情",
        attempt: "尝试",
        instructions: "说明",
        language: "语言",
        contactSupport: "联系支持",
        privacyPolicy: "隐私政策",
        termsOfService: "服务条款",
        changePassword: "修改密码",
        profileInformation: "个人信息",
        members: "成员",
        teamInformation: "团队信息",
        teamRoles: "团队角色",
        journal: "杂志"
      },
      buttons: {
        register: "注册",
        logTrial: "记录试验",
        logReading: "记录读数",
        logDesign: "记录设计",
        login: "登录",
        createTeam: "创建团队",
        joinTeam: "加入团队",
        begin: "开始",
        startRecording: "开始录制",
        startChallenge: "开始挑战",
        recording: "录制中...",
        finishActivity: "完成活动",
        continue: "继续",
        backToActivities: "返回活动",
        waitForSignal: "等待信号",
        tapNow: "立即点击！",
        changePassword: "修改密码",
        stop: "停止",
        edit: "编辑",
        save: "节省",
        openCamera: "打开摄像头",
        closeCamera: "近景镜头"
      },
      landing: {
        slogan: "实验。测量。改进。"
      },
      forms: {
        hello: "你好！",
        welcome: "欢迎回来！",
        userRegister: "用户注册",
        userLogin: "用户登录",
        displayName: "显示名称",
        displayNamePlaceholder: "请输入您的显示名称",
        email: "邮箱",
        emailPlaceholder: "请输入您的邮箱",
        password: "密码",
        passwordPlaceholder: "请输入您的密码"
      },
      teamInitialization: {
        createTitle: "创建您的团队",
        joinTitle: "加入团队",
        teamName: "团队名称",
        teamNamePlaceholder: "请输入团队名称",
        gradeLevel: "年级",
        gradeLevelPlaceholder: "选择年级",
        skip: "跳过",
        teamID: "团队ID",
        teamIDPlaceholder: "请输入团队ID",
        inviteCode: "邀请码",
        inviteCodePlaceholder: "请输入邀请码",
        grantCamera: "授予相机权限",
        cancelScan: "取消扫描",
        scanQR: "扫描二维码"
      },
      home: {
        welcome: "欢迎",
        rank: "排名",
        completed: "已完成",
        noTeam: "未加入团队",
        joinOrCreate: "加入或创建团队来开始",
        recentActivity: "最近活动",
        noRecentActivity: "暂无最近活动",
        signinToTrackProgress: "登录以跟踪进度",
        startActivity: "开始活动",
        subtitle: "准备好下一次实验了吗？",
        howItWorks: "STEMMLAB 工作原理",
        howItWorksElements: [
          "选择挑战",
          "使用真实材料记录您的实验",
          "使用手机传感器捕获数据并上传结果",
          "优化设计并登上排行榜"
        ],
        seeActivityRequirement: "完成活动即可在此处查看。",
        progress: "进度",
        progressSummary: "您已完成{{count}}个活动（共7个）",
        bestActivity: "最佳活动",
        activityCompletion: "活动完成情况",
        scoresOverview: "分数概览",
        submissionHistory: "提交历史",
        noSubmissionsYet: "暂无提交",
        noScoresYet: "开始完成活动以查看您的分数",
        viewFullProgress: "查看完整进度",
        completedActivities: "已完成活动",
        latestScore: "最新分数"
      },
      activities: {
        selectActivity: "选择活动",
        activityDetails: "活动详情",
        overview: "概述",
        equipmentsNeeded: "所需设备",
        instructions: "说明",
        attempt: "尝试",
        phase: "阶段",
        activityResults: "活动结果",
        allActivities: "所有活动",

        parachuteDropChallenge: {
          name: "降落伞投放挑战",
          description: "设计、制作和测试小型玩具的降落伞，以降低其落地速度和冲击力。您的团队将在时间和材料的限制下迭代，在目标区域内实现最慢、最安全的着陆。",
          instructions: [
            "不带降落伞投掷玩具并记录坠落（基线测试）。",
            "使用提供的材料制作降落伞。",
            "从相同高度投掷玩具并记录坠落。",
            "在应用中查看速度和着陆精度结果。",
            "在20分钟内重新设计和测试最多三个原型。",
            "上传视频、结果和团队反思。"
          ],
          equipments: [
            { name: "塑料袋", description: "用于制作降落伞的伞面。" },
            { name: "绳子", description: "用于连接伞面与负载的吊带。" },
            { name: "小玩具", description: "用作投掷测试的乘客或货物。" },
            { name: "桌子", description: "提供一致、可测量的投掷高度以确保公平测试。" },
            { name: "剪刀", description: "用于根据设计要求切割和塑形伞面和绳子。" },
            { name: "胶带", description: "固定各部件并标记投掷高度。" }
          ],
          parameters: "参数",
          analytics: "物理分析",
          gForce: "G力分析",
          contactTime: "接触时间（秒）",
          contactTimePlaceholder: "输入接触时间（例如 0.05）",
          didBounce: "是否弹起？",
          surfaceArea: "表面积（cm²）",
          surfaceAreaPlaceholder: "降落伞表面积",
          gForceResult: "G力",
          gForceRisk: "受伤风险",
          gForceRiskScale: "G力风险等级",
          gForceTip: "使用慢动作视频测量接触时间",
          prototype: "原型",
          dropHeightPlaceholder: "投掷高度（米）",
          toyMassPlaceholder: "玩具质量（千克）",
          baselineLabel: "基线（无降落伞）",
          predictTime: "预测时间（秒）",
          predictTimePlaceholder: "预测坠落时间",
          wasRight: "您的预测正确吗？",
          writeUpPrediction: "预测记录",
          easiestDesign: "最容易制作的设计",
          easiestDesignPlaceholder: "哪个设计最容易？",
          gForceTable: {
            safe: "1-5 g：无伤害（电梯、站立）",
            moderate: "5-10 g：可能擦伤（硬摔）",
            serious: "10-30 g：可能严重受伤（运动碰撞）",
            severe: "30-50 g：严重受伤高风险（车祸）",
            critical: "50+ g：可能危及生命"
          }
        },

        soundPollutionHunter: {
          name: "噪音污染探测",
          description: "学生作为环境调查员，测量和比较不同课堂活动产生的声音水平。目标是识别能量和表面如何影响声音强度，并了解长时间暴露于噪音的健康风险。",
          instructions: [
            "测量不同动作的噪音（扔物体、说话、走路、跺脚）。",
            "记录声音水平和位置。",
            "绘制噪音区和安静区地图。"
          ],
          equipments: [
            { name: "任意物品", description: "用于测量噪音的投掷物。" }
          ],
          actionLabel: "动作",
          actionPlaceholder: "例如：扔书",
          actionOptions: ["扔书", "说话", "走路", "跺脚", "关门"],
          locationPlaceholder: "例如：食堂、图书馆、体育馆",
          predictionLabel: "预测（更响/更轻）",
          predictLouder: "更响",
          predictSofter: "更轻",
          predictionCompare: "您的预测正确吗？",
          hearingRiskTable: "听力损伤风险",
          safeZone: "安全区",
          warningZone: "警告区",
          dangerZone: "危险区",
          riskScale: {
            safe: "0-60 dB：安全 — 无风险",
            moderate: "60-85 dB：短时间暴露安全",
            warning: "85-90 dB：警告 — 超过8小时可能损伤",
            high: "90-100 dB：高风险 — 超过15分钟损伤",
            dangerous: "100-120 dB：危险 — 按分钟计",
            critical: "120dB+：立即损伤风险"
          },
          needEarMuffs: "应该戴耳罩吗？",
          needEarMuffsPlaceholder: "您对听力保护的看法"
        },

        handFanChallenge: {
          name: "手扇挑战",
          description: "学生测试空气流动如何对柔性材料施加力。通过设计不同的手扇并针对纸和纸板目标进行测试，团队研究扇子设计、距离和材料刚度之间的关系。",
          instructions: [
            "将纸直立放在桌子上。",
            "从30厘米外扇风。",
            "观察并记录运动。",
            "使用不同的扇子设计和距离（15厘米、30厘米、45厘米）重复。"
          ],
          equipments: [
            { name: "纸和纸板", description: "用于制作扇子和垂直目标的原材料。" },
            { name: "剪刀", description: "用于精确切割材料以制作特定扇子形状和尺寸。" },
            { name: "胶带", description: "将垂直目标固定到桌子上，使其可弯曲而不倒下。" }
          ],
          selectMaterial: "目标材料",
          selectDistance: "距离（厘米）",
          materialStiffness: "刚度系数",
          targetToggle: "目标类型",
          paper: "纸",
          cardboard: "纸板",
          fanDesign: "扇子设计名称",
          fanDesignPlaceholder: "例如：折纸褶皱",
          deflectionAngle: "偏转角（°）",
          anglePlaceholder: "输入弯曲角度",
          forceResult: "估计力",
          forceUnit: "N",
          stiffnessNote: "刚度越高 = 弯曲所需力越大",
          predictionAngle: "预测角度（°）",
          predictionAnglePlaceholder: "您的预测角度",
          wasRightLabel: "您正确吗？",
          writeUp: {
            bestDesign: "哪个设计最能使纸移动？",
            bestDesignPlaceholder: "您的答案",
            stiffnessEffect: "刚度如何影响弯曲角度？",
            stiffnessEffectPlaceholder: "您的观察",
            distanceEffect: "距离如何影响弯曲？",
            distanceEffectPlaceholder: "您的观察"
          }
        },

        earthquakeResistantStructure: {
          name: "抗震结构",
          description: "学生设计和构建结构原型以承受模拟地震振动。目标是通过迭代工程创建一个吸收和分布能量的底座，保护建筑（手机）免受过度移动。",
          instructions: [
            "将垂直目标固定在桌子上，使其可弯曲而不倒下。",
            "在上面放置一个平坦的纸板平台。",
            "将手机放在中心，在STEMM应用中激活振动模式。",
            "修改结构以减少移动（例如增加支柱、增加折叠等）。"
          ],
          equipments: [
            { name: "纸和纸板", description: "用于构建结构平台和防振层的主要材料。" },
            { name: "剪刀", description: "用于精确切割材料以制作特定形状和尺寸。" },
            { name: "胶带", description: "将垂直目标固定到桌子上。" }
          ],
          designName: "设计名称",
          designNamePlaceholder: "例如：设计1",
          foldCount: "折叠数量",
          foldCountPlaceholder: "折叠数量",
          pillarCount: "支柱数量",
          pillarCountPlaceholder: "支柱数量",
          predictedMovement: "预测移动（厘米）",
          predictedMovementPlaceholder: "您的预测",
          observedSway: "观察摆动（厘米）",
          observedSwayPlaceholder: "测量移动",
          accelerometerData: "加速度计数据",
          startVibration: "开始振动",
          stopVibration: "停止振动",
          writeUp: {
            bestDesign: "哪个设计移动最少？",
            bestDesignPlaceholder: "您的答案",
            structuralEffect: "折叠/支柱如何影响稳定性？",
            structuralEffectPlaceholder: "您的观察",
            realWorldLink: "这与真实建筑有何关系？",
            realWorldLinkPlaceholder: "您的联系"
          },
          designPreset1: "4 折 + 4 柱",
          designPreset2: "10 折 + 4 柱",
          designPreset3: "3 折 + 6 柱",
          folds: "折痕",
          pillars: "支柱",
          sway: "摆动",
          peak: "峰值",
          predicted: "预测",
        },

        stretchSpeedAndGracefulness: {
          name: "拉伸速度与优雅度",
          description: "学生通过测量控制拉伸过程中运动的速度和流畅度来研究人体生物力学。使用手机的振动传感器，团队分析他们移动的优雅程度以及疲劳或速度如何影响身体协调。",
          instructions: [
            "用一只手牢牢握住手机。激活应用振动传感器。",
            "按照应用指示缓慢进行引导运动。记录振动。",
            "在启用振动反馈的情况下重复活动。",
            "查看速度、流畅度和运动范围数据。",
            "上传结果并作为小组进行反思。"
          ],
          equipments: [
            { name: "开放空间", description: "为学生进行全范围运动练习提供安全环境。" }
          ],
          clockwiseMovement: "顺时针运动",
          verticalMovement: "垂直运动",
          horizontalMovement: "水平运动",
          recordMovement: "记录运动",
          vibrationsDetected: "检测到振动",
          smoothnessScore: "流畅度评分",
          movementMonitor: "运动监视器",
          movementMonitorPlaceholder: "开始录制以可视化运动流畅度",
          movementVibrations: "运动 {{index}} 振动",
          movementSmoothness: "运动 {{index}} 流畅度",
          vibrations: "振动次数"
        },

        reactionBoardChallenge: {
          name: "反应板挑战",
          description: "学生通过测量不同条件下的反应时间来测试神经肌肉协调能力。该活动使用手机作为数字刺激与反应板来捕获大脑到身体信号通路的速度。",
          instructions: [
            "隐藏按钮出现后立即点击屏幕。记录反应时间。",
            "用非惯用手重复。比较结果。",
            "描摹屏幕上移动的形状。查看准确度和延迟。"
          ],
          equipments: [
            {
              name: "无",
              description: "无需任何器材。"
            }
          ],
          dominantHand: "优势手点击反应",
          nonDominantHand: "非优势手点击反应",
          tracingChallenge: "描摹挑战",
          recordReactionTime: "记录反应时间",
          measureTracingAccuracy: "测量描摹准确度",
          tracingZone: "描摹区域",
          tracingZonePlaceholder: "在此描摹",
          reactionZone: "反应区域",
          reactionZonePlaceholder: "目标出现时在此区域内点击",
          accuracyScore: "准确度评分",
          tap: "点击！",
          tracingAccuracy: "描摹准确率",
          reactionTime: "反应时间"
        },

        breathingPaceTrainer: {
          name: "呼吸节奏训练器",
          description: "学生探索呼吸与身体放松之间的关系。通过跟随数字节奏器，他们学会控制呼吸频率，观察有意识的调节如何影响心率或感知压力水平。",
          instructions: [
            "将手机轻轻放在胸前。",
            "记录静息时呼吸。",
            "进行轻度运动（原地慢跑1分钟和100次开合跳）。",
            "再次记录呼吸并比较结果。"
          ],
          equipments: [
            { name: "平坦表面", description: "用于在呼吸测量过程中放置手机的稳定平坦表面。它有助于保持设备稳定，从而更准确地检测胸部运动和呼吸模式。" }
          ],
          rest: "静止休息",
          jogging: "慢跑一分钟",
          starJumps: "100次开合跳",
          recordBreathing: "记录呼吸",
          breathsRecorded: "记录呼吸次数",
          bpm: "次/分钟",
          breathingMonitor: "呼吸监视器",
          breathingMonitorPlaceholder: "开始录制以可视化胸部运动",
          activityBPMCount: "活动 {{index}} 次/分钟"
        }
      },
      journal: {
        title: "日志",
        experimentRecords: "实验记录",
        clearAll: "清除全部",
        noData: "暂无实验数据",
        noDataSubtext: "前往实验标签页记录您的第一次试验！",
        trialCount: "{{count}} 次试验",
        trialCount_plural: "{{count}} 次试验",
        trialNumber: "试验 #{{number}}",
        teamConfirmation: "团队确认",
        confirmSubtext: "所有团队成员必须在提交前确认",
        confirmed: "已确认",
        confirmText: "我确认我们团队的提交",
        confirmNote: "每位成员应独立确认。此为自我报告。",
        teamReflection: "团队反思",
        reflectionPlaceholder: "您观察到了什么？有什么令人惊讶的？",
        submitting: "提交中...",
        submitMission: "提交任务",
        missingReflection: "缺少反思",
        missingReflectionMsg: "请在提交前撰写您的反思。",
        confirmRequired: "需要团队确认",
        confirmRequiredMsg: "所有团队成员必须在提交前确认。请勾选确认框。",
        submitSuccess: "任务已提交！",
        submitError: "提交失败。请检查您的连接。",
        deleteTitle: "删除试验",
        deleteMsg: "要移除此试验吗？",
        clearAllTitle: "清除全部",
        clearAllMsg: "要删除此活动的所有试验吗？",
        velocityMetric: "速度（米/秒）",
        decibelMetric: "分贝（dB）",
        forceMetric: "力（N）",
        swayMetric: "摆动（厘米）",
        defaultMetric: "测量",
        recordedTrials: "已记录试验"
      },
      errorMessages: {
        invalidCredential: "邮箱或密码无效",
        fillInAllFields: "请填写所有字段",
        userNotFound: "未找到此邮箱的账户",
        wrongPassword: "密码错误",
        invalidEmail: "请输入有效邮箱",
        tooManyRequests: "尝试次数过多。请稍后再试。",
        defaultError: "出现错误",
        weakPassword: "密码至少6个字符",
        emailAlreadyInUse: "此邮箱已注册",
        failedPasswordUpdate: "密码更新失败",
        passwordsDoNotMatch: "密码不匹配",
        emptyDisplayName: "显示名称不能为空",
        unfinishedChallenge: "挑战未完成",
        unfinishedChallengeDescription: "请先完成并记录所有挑战，然后才能保存本次尝试。",
        batterySaverOn: "省电模式已开启",
        batterySaverOnDescription: "此活动会使用您设备的传感器、计时功能或媒体功能来收集实验数据。省电模式可能会影响设备性能和测量结果的一致性。为了获得最可靠的实验结果，建议您在继续之前关闭省电模式。"
      },
      countdown: {
        getReady: "准备"
      },
      about: {
        appName: "应用名称：",
        version: "版本：",
        description: "描述：",
        descriptionValue: "专为协作活动和竞赛设计的互动STEM学习平台。",
        privacyPolicy: "隐私政策",
        termsOfService: "服务条款",
        contactSupport: "联系支持"
      },
      account: {
        profileInformation: "个人信息",
        teamInformation: "团队信息",
        changePassword: "修改密码",
        logout: "退出登录"
      },
      appearance: {
        lightMode: "浅色模式",
        darkMode: "深色模式",
        system: "系统"
      },
      team: {
        teamInformation: "团队信息",
        members: "成员",
        teamRoles: "团队角色",
        leaveTeam: "离开团队"
      },
      changePassword: {
        currentPassword: "当前密码",
        currentPasswordPlaceholder: "输入当前密码",
        newPassword: "新密码",
        newPasswordPlaceholder: "输入新密码",
        confirmPassword: "确认密码",
        confirmPasswordPlaceholder: "确认新密码"
      },
      results: {
        attempts: "尝试次数",
        ranking: "排名",
        theoryExplanation: "理论解释",
        rating: "评价此活动",
        ratingPrompt: "这个活动怎么样？",
        accuracy: "准确度",
        noData: "暂无记录",
        entryNumber: "#{{number}}",
        ratingHint: "点击星星评价此活动",
        compare: "将您的结果与团队和排行榜进行比较！",
        compareNoise: "将您团队的噪音图与排行榜上的其他人进行比较！",
        velocity: "速度",
        gForce: "G力",
        time: "时间",
        surfaceArea: "表面积",
        submitToLeaderboard: "提交到排行榜",
        submitted: "已提交 ✓",
        leaderboard: "排行榜",
        backToActivities: "返回活动",
        parachuteTheory: "降落伞工作原理\n\n当您不带降落伞投掷玩具时，重力直接将其拉下。作用在它上面的唯一力是重力，因此它以9.8 m/s²加速直到撞击地面。降落伞通过增加表面积来增加阻力。阻力向上推，对抗重力，减缓下落。伞面越大，空气阻力越大，下降越慢。\n\n关键公式：\n• 速度：v = d / t\n• 加速度：a = v / t\n• 重量：W = m × 9.8\n• 净力：F = m × a\n• 阻力：F_drag = W - F_net\n• G力（无弹跳）：(v / 接触时间) / 9.8\n• G力（有弹跳）：((v + v_反弹) / 接触时间) / 9.8",
        soundTheory: "噪音污染的工作原理\n\n声音以分贝（dB）测量，为对数标度。每增加10 dB代表声音强度增加十倍。正常对话约为60 dB，而摇滚音乐会可能超过120 dB。长时间暴露在85 dB以上可能导致听力损伤。\n\n关键概念：\n• 分贝（dB）：声音强度单位\n• 对数标度：20 dB比10 dB强10倍\n• 安全：0-60 dB（耳语、安静房间）\n• 警告：60-85 dB（繁忙交通）\n• 危险：85+ dB（机械、音乐会）",
        fanTheory: "手扇的工作原理\n\n当您向纸目标扇风时，移动的空气施加力。力的大小取决于空气速度、扇子材料的刚度以及与目标的距离。更硬的材料每次挥动推动更多空气，产生更大的力。\n\n关键公式：\n• 估计力：F ≈ k × θ（k = 刚度系数，θ = 弯曲角度弧度）\n• 材料：薄纸（k=0.05）、卡片纸（k=0.20）、薄纸板（k=0.50）、瓦楞纸板（k=2.50）",
        earthquakeTheory: "抗震结构的工作原理\n\n地震发生时，建筑物经历多个方向的振动。工程师设计结构来吸收和消散这些能量，而不是刚性抵抗。折叠和支柱通过更均匀地分布力来增加结构稳定性。\n\n关键概念：\n• 基础隔离：将建筑与地面分离\n• 交叉支撑：对角支撑增加稳定性\n• 能量耗散：折叠和柔性接头吸收振动\n• 重心：降低重心提高稳定性",
        breathingTheory: "呼吸的工作原理\n\n呼吸频率随体力活动变化。静息时，人每分钟呼吸12-20次。运动中，身体需要更多氧气，呼吸频率增加。手机加速度计可以检测呼吸引起的细微胸部运动来测量呼吸频率。\n\n关键概念：\n• BPM：每分钟呼吸次数 — 您的呼吸频率\n• 静息：典型12-20 BPM\n• 轻度运动：20-40 BPM\n• 剧烈运动：40-60 BPM",
        reactionTheory: "反应时间的工作原理\n\n反应时间是刺激与您反应之间的间隔。它涉及您的感官检测刺激、大脑处理信息以及神经向肌肉发出信号。人类对视觉刺激的平均反应时间约为200-250毫秒。\n\n关键因素：\n• 惯用手：通常比非惯用手快10-20毫秒\n• 年龄：反应时间在20岁出头达到峰值\n• 疲劳：显著减慢反应时间\n• 练习：可提高反应时间10-15%",
        movementTheory: "运动流畅度的工作原理\n\n运动流畅度通过加速度的突然变化来衡量。手机加速度计检测振动和颠簸。流畅的运动产生更少、更小的加速度变化。流畅度评分（0-100%）衡量您移动的优雅程度。\n\n关键概念：\n• 振动：突然的加速度变化\n• 流畅度：无过度振动的时间百分比\n• 评分：从100%开始，每次颠簸减少",
        preset: "预设",
        score: "得分"
      },
      leaderboard: {
        title: "排行榜",
        global: "全球排名",
        byActivity: "按活动",
        rank: "排名",
        team: "团队",
        score: "分数",
        scoreExplanation: "分数说明",
        perActivity: "按活动",
        points: "分",
        members: "成员",
        noData: "暂无提交",
        selectActivity: "选择活动"
      },
      teamSettings: {
        title: "团队设置",
        teamName: "团队名称",
        teamId: "团队ID",
        inviteCode: "邀请码",
        gradeLevel: "年级",
        members: "成员",
        maxReached: "团队已满（最多4人）",
        shareQR: "分享二维码",
        qrInstructions: "其他学生可以扫描此二维码加入您的团队",
        leaveTeam: "离开团队",
        leaveConfirm: "您确定要离开团队吗？",
        noTeam: "未加入团队",
        member: "成员",
        leader: "队长",
        remove: "移除"
      },
      privacyPolicy: {
        dataCollection: "数据收集",
        dataCollectionContents: "本应用收集运动传感器（加速度计）数据以分析运动表现。无需个人身份数据。",
        useOfData: "数据使用",
        useOfDataContents: "数据用于活动跟踪、性能分析和改善用户体验。",
        dataStorage: "数据存储",
        dataStorageContents: "数据可能根据应用流程在本地或临时存储。不会出售或与第三方共享。",
        thirdPartyServices: "第三方服务",
        thirdPartyServicesContents: "外部服务（如API或分析工具）可能会根据其自身的隐私政策收集数据。",
        security: "安全措施",
        securityContents: "我们采取合理的安全措施，但不存在绝对安全的系统。",
        policyChanges: "政策更新",
        policyChangesContents: "本隐私政策可能会不时更新。"
      },
      termsOfService: {
        useOfApp: "应用使用",
        useOfAppContents: "本应用程序仅供教育和演示目的。用户必须合法使用。",
        userResponsibilities: "用户责任",
        userResponsibilitiesContents: "用户不得试图破坏、滥用或对应用程序及其服务进行反向工程。",
        intellectualProperty: "知识产权",
        intellectualPropertyContents: "除非另有说明，所有内容、设计和源代码均属于开发人员。",
        noWarranty: "无保证条款",
        noWarrantyContents: "本应用程序按“现状”提供，不提供任何形式的保证。",
        limitationOfLiability: "责任限制",
        limitationOfLiabilityContents: "开发人员对因使用本应用程序而导致的任何损害不承担责任。",
        changesToTerms: "条款变更",
        changesToTermsContents: "这些条款可能随时更新，恕不另行通知。"
      },
      contactSupport: {
        customerService: "我们的 24×7 客户服务",
        writeUsAt: "发送邮件至"
      },
      attempt: {
        newTrial: "新测试",
        designPresets: "设计预设",
        structuralIterations: "结构迭代",
        logTrialPlaceholder: "尚未记录任何试验。请完成挑战，然后点击“记录试验”以保存您的结果。"
      },
      settings: {
        batteryLevel: "电池电量"
      }
    }
  },
};

const deviceLanguage = getLocales()[0].languageCode;

const LANGUAGE_KEY = "app-language";

export async function initI18n() {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);

  await i18n.use(initReactI18next).init({
    resources,
    lng: savedLanguage || deviceLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
}

export async function changeLanguage(language) {
  await AsyncStorage.setItem(LANGUAGE_KEY, language);
  await i18n.changeLanguage(language);
}

export default i18n;