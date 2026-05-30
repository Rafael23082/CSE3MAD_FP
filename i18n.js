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
        teamRoles: "Team Roles"
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
        start: "START"
      },
      landing: {
        slogan: "Experiment. Measure. Improve."
      },
      forms: {
        hello: "Hello!",
        welcome: "Welcome Back!",
        userRegister: "User Register",
        userLogin: "User Login",
        firstName: "First Name",
        firstNamePlaceholder: "Enter your first name",
        email: "Email",
        emailPlaceholder: "Enter your email",
        password: "Password",
        passwordPlaceholder: "Enter your password"
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
        startActivity: "Start activity",
        subtitle: "Ready for your next experiment?",
        howItWorks: "How STEMMLAB Works",
        howItWorksElements: [
          "Choose a Challenge",
          "Use real-world materials and record your experiment",
          "Capture data using your phone's sensors and upload results",
          "Refine your design and climb the leaderboard"
        ]
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
            { name: "Paper and cardboard", description: "Used as raw materials to construct both the fan and the vertical target." },
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
          }
        },
        
        stretchSpeedAndGracefulness: {
          name: "Stretch Speed & Gracefulness",
          description: "Students investigate human biomechanics by measuring the speed and smoothness of their movements during controlled stretching. Using the phone's vibration sensors, teams analyze how 'gracefully' they can move and how fatigue or speed impacts physical coordination.",
          instructions: [
            "Hold the phone firmly in one hand. Activate the app vibration sensor.",
            "Perform guided movement slowly as shown in the app. Record the vibration.",
            "Repeat the activity with vibration feedback enabled.",
            "Review speed, smoothness, and range-of-motion data.",
            "Upload results and reflect as a group."
          ],
          equipments: [
            { name: "Open space", description: "Provides a safe environment for students to perform full-range-of-motion exercises." }
          ],
          phases: [
            "Clockwise Movement",
            "Vertical Movement",
            "Horizontal Movement"
          ],
          recordMovement: "Record Movement",
          vibrationsDetected: "Vibrations Detected",
          smoothnessScore: "Smoothness Score",
          movementMonitor: "Movement Monitor",
          movementMonitorPlaceholder: "Start recording to visualize movement smoothness",
          movementVibrations: "Movement {{index}} Vibrations",
          movementSmoothness: "Movement {{index}} Smoothness"
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
            { name: "Variable Distractions", description: "Music, conversation, or physical tasks used to test how cognitive load affects response time." }
          ],
          phases: [
            "Dominant Hand Tap Reaction",
            "Non-Dominant Hand Tap Reaction",
            "Tracing Challenge"
          ],
          recordReactionTime: "Record Reaction Time",
          measureTracingAccuracy: "Measure Tracing Accuracy",
          tracingZone: "Tracing Zone",
          tracingZonePlaceholder: "Trace Here",
          reactionZone: "Reaction Zone",
          reactionZonePlaceholder: "Tap inside this area when the target appears",
          accuracyScore: "Accuracy Score",
          tap: "TAP!"
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
            { name: "Flat surface", description: "Music, conversation, or physical tasks used to test how cognitive load affects response time." }
          ],
          phases: [
            "Rest",
            "Jogging One Minute",
            "100 Star Jumps"
          ],
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
        recordedTrials: "Recorded Trials"
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
        emptyFirstName: "First name cannot be empty"
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
        darkMode: "Dark Mode"
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
        backToActivities: "Back to Activities",
        parachuteTheory: "How Parachutes Work\n\nWhen you drop a toy without a parachute, gravity pulls it straight down. The only force acting on it is gravity, so it accelerates at 9.8 m/s² until it hits the ground. A parachute adds drag force by increasing surface area. The drag force pushes upward against gravity, slowing the fall. The larger the canopy, the more air resistance, and the slower the descent. The g-force experienced on landing depends on how quickly the object stops. A longer contact time (softer landing) reduces g-force, while a hard, sudden stop increases it dramatically.\n\nKey formulas:\n• Velocity: v = d / t\n• Acceleration: a = v / t\n• Weight: W = m × 9.8\n• Net Force: F = m × a\n• Drag Force: F_drag = W - F_net\n• G-force (no bounce): (v / contactTime) / 9.8\n• G-force (bounce): ((v + v_rebound) / contactTime) / 9.8",
        soundTheory: "How Sound Pollution Works\n\nSound is measured in decibels (dB), a logarithmic scale. Every 10 dB increase represents a tenfold increase in sound intensity. Normal conversation is about 60 dB, while a rock concert can exceed 120 dB. Prolonged exposure above 85 dB can cause hearing damage. The louder the sound and the longer the exposure, the greater the risk of permanent hearing loss.\n\nKey concepts:\n• Decibel (dB): Unit of sound intensity\n• Logarithmic scale: 20 dB is 10× more intense than 10 dB\n• Safe: 0-60 dB (whisper, quiet room)\n• Warning: 60-85 dB (busy traffic)\n• Dangerous: 85+ dB (machinery, concerts)",
        fanTheory: "How Hand Fans Work\n\nWhen you fan air toward a paper target, the moving air applies a force. The amount of force depends on the speed of the air, the stiffness of the fan material, and the distance to the target. Stiffer materials generate more force because they push more air per swing.\n\nKey formula:\n• Estimated force: F ≈ k × θ (k = stiffness coefficient, θ = bend angle in radians)\n• Materials: thin paper (k=0.05), card stock (k=0.20), thin cardboard (k=0.50), corrugated cardboard (k=2.50)",
        earthquakeTheory: "How Earthquake-Resistant Structures Work\n\nWhen an earthquake strikes, buildings experience vibrations in multiple directions. Engineers design structures to absorb and dissipate this energy rather than resist it rigidly. Folds and pillars add structural stability by distributing forces more evenly. More pillars generally create a stronger base, while strategic folding adds cross-bracing that helps absorb lateral movement.\n\nKey concepts:\n• Base isolation: Separating the building from the ground\n• Cross-bracing: Diagonal supports add stability\n• Energy dissipation: Folds and flexible joints absorb vibrations\n• Center of mass: Lowering it improves stability",
        breathingTheory: "How Breathing Works\n\nBreathing rate changes with physical activity. At rest, a typical person breathes 12-20 times per minute. During exercise, the body needs more oxygen, so breathing rate increases. The accelerometer in your phone can detect the subtle chest movements of breathing to measure your respiration rate.\n\nKey concept:\n• BPM: Breaths per minute — your breathing rate\n• Rest: 12-20 BPM typical\n• Light exercise: 20-40 BPM\n• Vigorous exercise: 40-60 BPM",
        reactionTheory: "How Reaction Time Works\n\nReaction time is the interval between a stimulus and your response. It involves your senses detecting the stimulus, your brain processing the information, and your nerves signaling your muscles to act. The average human reaction time to a visual stimulus is about 200-250 milliseconds.\n\nKey factors:\n• Dominant hand: Typically 10-20ms faster than non-dominant\n• Age: Reaction time peaks in early 20s\n• Fatigue: Slows reaction time significantly\n• Practice: Can improve reaction time by 10-15%",
        movementTheory: "How Movement Smoothness Works\n\nMovement smoothness is measured by sudden changes in acceleration. The phone's accelerometer detects vibrations and jolts. Smooth movements produce fewer and smaller acceleration changes. The smoothness score (0-100%) measures how gracefully you moved.\n\nKey concepts:\n• Vibrations: Sudden acceleration changes\n• Smoothness: Percentage of time without excessive vibration\n• Score: Starts at 100%, decreases with each jolt"
      },

      leaderboard: {
        title: "Leaderboard",
        global: "Global Rankings",
        byActivity: "By Activity",
        rank: "Rank",
        team: "Team",
        score: "Score",
        members: "Members",
        noData: "No submissions yet",
        selectActivity: "Select Activity"
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
        teamRoles: "チームの役割"
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
        start: "開始"
      },
      landing: {
        slogan: "試行。測定。改善。"
      },
      forms: {
        hello: "こんにちは！",
        welcome: "お帰りなさい！",
        userRegister: "ユーザー登録",
        userLogin: "ユーザーログイン",
        firstName: "名前",
        firstNamePlaceholder: "名前を入力してください",
        email: "メール",
        emailPlaceholder: "メールアドレスを入力してください",
        password: "パスワード",
        passwordPlaceholder: "パスワードを入力してください"
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
        startActivity: "アクティビティを開始",
        subtitle: "次の実験の準備はできましたか？",
        howItWorks: "STEMMLABの仕組み",
        howItWorksElements: [
          "チャレンジを選ぶ",
          "実際の材料を使い、実験の様子を記録しましょう",
          "スマートフォンのセンサーを使ってデータを取得し、結果をアップロードする",
          "デザインを磨き、ランキングを駆け上がろう"
        ]
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
          ]
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
          phases: [
            "時計回りの動き",
            "垂直方向の動き",
            "水平方向の動き"
          ],
          recordMovement: "記録の推移",
          vibrationsDetected: "振動が検出されました",
          smoothnessScore: "滑らかさスコア",
          movementMonitor: "動作モニター",
          movementMonitorPlaceholder: "録画を開始して、動きの滑らかさを確認しましょう",
          movementVibrations: "運動 {{index}} 振動",
          movementSmoothness: "動き {{index}} の滑らかさ"
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
            { name: "さまざまな気晴らし", description: "認知的負荷が反応時間にどのような影響を与えるかを調べるために用いられる、音楽、会話、または身体的な課題。" }
          ],
          phases: [
            "利き手のタップ反応",
            "利き手ではない方の手のタップ反応",
            "トレースチャレンジ"
          ],
          recordReactionTime: "反応時間を記録する",
          measureTracingAccuracy: "トレース精度の測定",
          tracingZone: "トレースゾーン",
          tracingZonePlaceholder: "ここにトレース",
          reactionZone: "リアクション・ゾーン",
          reactionZonePlaceholder: "ターゲットが表示されたら、このエリア内をタップしてください",
          accuracyScore: "精度スコア",
          tap: "タップ！"
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
            { name: "平らな面", description: "認知的負荷が反応時間にどのような影響を与えるかを調べるために用いられる、音楽、会話、または身体的な課題。" }
          ],
          phases: [
            "休憩",
            "1分間のジョギング",
            "スタージャンプ100回"
          ],
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
        missingReflection: "反省文がありません",
        missingReflectionMsg: "送信前に反省文を書いてください。",
        confirmRequired: "チーム確認が必要です",
        confirmRequiredMsg: "すべてのチームメンバーが提出前に確認する必要があります。確認ボックスをチェックしてください。",
        submitSuccess: "ミッションが送信されました！",
        submitError: "送信に失敗しました。接続を確認してください。",
        deleteTitle: "試験を削除",
        deleteMsg: "この試験を削除しますか？",
        clearAllTitle: "すべてクリア",
        clearAllMsg: "このアクティビティのすべての試験を削除しますか？",
        velocityMetric: "速度（m/s）",
        decibelMetric: "デシベル（dB）",
        forceMetric: "力（N）",
        swayMetric: "揺れ（cm）",
        defaultMetric: "測定",
        recordedTrials: "記録された試験"
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
        emptyFirstName: "名字は空欄にできません"
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
        darkMode: "ダークモード"
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
        teamRoles: "Peran Tim"
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
        start: "MULAI"
      },
      landing: {
        slogan: "Eksperimen. Ukur. Tingkatkan."
      },
      forms: {
        hello: "Halo!",
        welcome: "Selamat Datang Kembali!",
        userRegister: "Daftar Pengguna",
        userLogin: "Masuk Pengguna",
        firstName: "Nama Depan",
        firstNamePlaceholder: "Masukkan nama depan",
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
        startActivity: "Mulai aktivitas",
        subtitle: "Siap untuk eksperimen berikutnya?",
        subtitle: "Siap untuk eksperimen berikutnya?",
        howItWorks: "Cara Kerja STEMMLAB",
        howItWorksElements: [
          "Pilih Tantangan",
          "Gunakan bahan nyata dan catat eksperimen Anda",
          "Ambil data menggunakan sensor ponsel dan unggah hasilnya",
          "Sempurnakan desain Anda dan naikkan peringkat"
        ]
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
          }
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
          phases: [
            "Gerakan Searah Jarum Jam",
            "Gerakan Vertikal",
            "Gerakan Horizontal"
          ],
          recordMovement: "Rekam Gerakan",
          vibrationsDetected: "Getaran Terdeteksi",
          smoothnessScore: "Skor Kehalusan",
          movementMonitor: "Monitor Gerakan",
          movementMonitorPlaceholder: "Mulai merekam untuk memvisualisasikan kehalusan gerakan",
          movementVibrations: "Gerakan {{index}} Getaran",
          movementSmoothness: "Gerakan {{index}} Kehalusan"
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
            { name: "Berbagai Gangguan", description: "Musik, percakapan, atau tugas fisik yang digunakan untuk menguji bagaimana beban kognitif mempengaruhi waktu respons." }
          ],
          phases: [
            "Reaksi Ketuk Tangan Dominan",
            "Reaksi Ketuk Tangan Non-Dominan",
            "Tantangan Menelusuri"
          ],
          recordReactionTime: "Rekam Waktu Reaksi",
          measureTracingAccuracy: "Ukur Akurasi Penelusuran",
          tracingZone: "Zona Penelusuran",
          tracingZonePlaceholder: "Telusuri Di Sini",
          reactionZone: "Zona Reaksi",
          reactionZonePlaceholder: "Ketuk di area ini saat target muncul",
          accuracyScore: "Skor Akurasi",
          tap: "KETUK!"
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
            { name: "Permukaan Datar", description: "Musik, percakapan, atau tugas fisik yang digunakan untuk menguji bagaimana beban kognitif mempengaruhi waktu respons." }
          ],
          phases: [
            "Istirahat",
            "Joging Satu Menit",
            "100 Lompatan Bintang"
          ],
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
        recordedTrials: "Percobaan Tercatat"
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
        emptyFirstName: "Nama depan tidak boleh kosong"
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
        darkMode: "Mode Gelap"
      },
      team: {
        teamInformation: "Informasi Tim",
        manageMembers: "Kelola Anggota",
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
        backToActivities: "Kembali ke Aktivitas",
        parachuteTheory: "Cara Kerja Parasut\n\nSaat Anda menjatuhkan mainan tanpa parasut, gravitasi menariknya langsung ke bawah. Satu-satunya gaya yang bekerja adalah gravitasi, sehingga ia berakselerasi pada 9,8 m/s² hingga menyentuh tanah. Parasut menambahkan gaya hambat dengan meningkatkan luas permukaan. Gaya hambat mendorong ke atas melawan gravitasi, memperlambat jatuh.\n\nRumus utama:\n• Kecepatan: v = d / t\n• Akselerasi: a = v / t\n• Berat: W = m × 9,8\n• Gaya Bersih: F = m × a\n• Gaya Hambat: F_hambat = W - F_bersih\n• G-force (tanpa pantul): (v / waktuKontak) / 9,8\n• G-force (dengan pantul): ((v + v_pantul) / waktuKontak) / 9,8",
        soundTheory: "Cara Kerja Polusi Suara\n\nSuara diukur dalam desibel (dB), skala logaritmik. Setiap kenaikan 10 dB mewakili peningkatan sepuluh kali lipat intensitas suara. Percakapan normal sekitar 60 dB, sementara konser rock bisa melebihi 120 dB. Paparan berkepanjangan di atas 85 dB dapat menyebabkan kerusakan pendengaran.\n\n• Desibel (dB): Satuan intensitas suara\n• Aman: 0-60 dB\n• Peringatan: 60-85 dB\n• Berbahaya: 85+ dB",
        fanTheory: "Cara Kerja Kipas Tangan\n\nSaat Anda mengipaskan udara ke target kertas, udara yang bergerak memberikan gaya. Jumlah gaya tergantung pada kecepatan udara, kekakuan bahan kipas, dan jarak ke target. Bahan yang lebih kaku menghasilkan lebih banyak gaya karena mendorong lebih banyak udara per ayunan.\n\nRumus utama:\n• Perkiraan gaya: F ≈ k × θ\n• Bahan: kertas tipis (k=0,05), kertas karton (k=0,20), karton tipis (k=0,50), karton bergelombang (k=2,50)",
        earthquakeTheory: "Cara Kerja Struktur Tahan Gempa\n\nSaat gempa terjadi, bangunan mengalami getaran di berbagai arah. Insinyur merancang struktur untuk menyerap dan menghilangkan energi ini. Lipatan dan pilar menambah stabilitas struktural dengan mendistribusikan gaya lebih merata.\n\n• Isolasi dasar: Memisahkan bangunan dari tanah\n• Penyangga diagonal: Penyangga diagonal menambah stabilitas\n• Disipasi energi: Lipatan dan sambungan fleksibel menyerap getaran",
        breathingTheory: "Cara Kerja Pernapasan\n\nLaju pernapasan berubah dengan aktivitas fisik. Saat istirahat, seseorang bernapas 12-20 kali per menit. Selama olahraga, tubuh membutuhkan lebih banyak oksigen, sehingga laju pernapasan meningkat.\n\n• BPM: Napas per menit\n• Istirahat: 12-20 BPM\n• Olahraga ringan: 20-40 BPM\n• Olahraga berat: 40-60 BPM",
        reactionTheory: "Cara Kerja Waktu Reaksi\n\nWaktu reaksi adalah interval antara stimulus dan respons Anda. Ini melibatkan indra Anda mendeteksi stimulus, otak Anda memproses informasi, dan saraf Anda memberi sinyal otot untuk bertindak. Waktu reaksi rata-rata manusia terhadap stimulus visual sekitar 200-250 milidetik.\n\n• Tangan dominan: Biasanya 10-20ms lebih cepat\n• Usia: Waktu reaksi puncak di awal 20-an\n• Kelelahan: Memperlambat waktu reaksi secara signifikan",
        movementTheory: "Cara Kerja Kehalusan Gerakan\n\nKehalusan gerakan diukur dari perubahan akselerasi mendadak. Akselerometer ponsel mendeteksi getaran dan sentakan. Gerakan halus menghasilkan perubahan akselerasi yang lebih sedikit dan lebih kecil.\n\n• Getaran: Perubahan akselerasi mendadak\n• Kehalusan: Persentase waktu tanpa getaran berlebihan\n• Skor: Mulai dari 100%, berkurang dengan setiap sentakan"
      },
      leaderboard: {
        title: "Peringkat",
        global: "Peringkat Global",
        byActivity: "Berdasarkan Aktivitas",
        rank: "Peringkat",
        team: "Tim",
        score: "Skor",
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
        teamRoles: "团队角色"
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
        start: "开始"
      },
      landing: {
        slogan: "实验。测量。改进。"
      },
      forms: {
        hello: "你好！",
        welcome: "欢迎回来！",
        userRegister: "用户注册",
        userLogin: "用户登录",
        firstName: "名字",
        firstNamePlaceholder: "请输入您的名字",
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
        startActivity: "开始活动",
        subtitle: "准备好下一次实验了吗？",
        howItWorks: "STEMMLAB 工作原理",
        howItWorksElements: [
          "选择挑战",
          "使用真实材料记录您的实验",
          "使用手机传感器捕获数据并上传结果",
          "优化设计并登上排行榜"
        ]
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
          }
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
          phases: [
            "顺时针运动",
            "垂直运动",
            "水平运动"
          ],
          recordMovement: "记录运动",
          vibrationsDetected: "检测到振动",
          smoothnessScore: "流畅度评分",
          movementMonitor: "运动监视器",
          movementMonitorPlaceholder: "开始录制以可视化运动流畅度",
          movementVibrations: "运动 {{index}} 振动",
          movementSmoothness: "运动 {{index}} 流畅度"
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
            { name: "各种干扰", description: "用于测试认知负荷如何影响反应时间的音乐、对话或体力任务。" }
          ],
          phases: [
            "惯用手点击反应",
            "非惯用手点击反应",
            "描摹挑战"
          ],
          recordReactionTime: "记录反应时间",
          measureTracingAccuracy: "测量描摹准确度",
          tracingZone: "描摹区域",
          tracingZonePlaceholder: "在此描摹",
          reactionZone: "反应区域",
          reactionZonePlaceholder: "目标出现时在此区域内点击",
          accuracyScore: "准确度评分",
          tap: "点击！"
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
            { name: "平坦表面", description: "用于测试认知负荷如何影响反应时间的工具。" }
          ],
          phases: [
            "休息",
            "慢跑一分钟",
            "100次开合跳"
          ],
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
        emptyFirstName: "名字不能为空"
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
        darkMode: "深色模式"
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
        backToActivities: "返回活动",
        parachuteTheory: "降落伞工作原理\n\n当您不带降落伞投掷玩具时，重力直接将其拉下。作用在它上面的唯一力是重力，因此它以9.8 m/s²加速直到撞击地面。降落伞通过增加表面积来增加阻力。阻力向上推，对抗重力，减缓下落。伞面越大，空气阻力越大，下降越慢。\n\n关键公式：\n• 速度：v = d / t\n• 加速度：a = v / t\n• 重量：W = m × 9.8\n• 净力：F = m × a\n• 阻力：F_drag = W - F_net\n• G力（无弹跳）：(v / 接触时间) / 9.8\n• G力（有弹跳）：((v + v_反弹) / 接触时间) / 9.8",
        soundTheory: "噪音污染的工作原理\n\n声音以分贝（dB）测量，为对数标度。每增加10 dB代表声音强度增加十倍。正常对话约为60 dB，而摇滚音乐会可能超过120 dB。长时间暴露在85 dB以上可能导致听力损伤。\n\n关键概念：\n• 分贝（dB）：声音强度单位\n• 对数标度：20 dB比10 dB强10倍\n• 安全：0-60 dB（耳语、安静房间）\n• 警告：60-85 dB（繁忙交通）\n• 危险：85+ dB（机械、音乐会）",
        fanTheory: "手扇的工作原理\n\n当您向纸目标扇风时，移动的空气施加力。力的大小取决于空气速度、扇子材料的刚度以及与目标的距离。更硬的材料每次挥动推动更多空气，产生更大的力。\n\n关键公式：\n• 估计力：F ≈ k × θ（k = 刚度系数，θ = 弯曲角度弧度）\n• 材料：薄纸（k=0.05）、卡片纸（k=0.20）、薄纸板（k=0.50）、瓦楞纸板（k=2.50）",
        earthquakeTheory: "抗震结构的工作原理\n\n地震发生时，建筑物经历多个方向的振动。工程师设计结构来吸收和消散这些能量，而不是刚性抵抗。折叠和支柱通过更均匀地分布力来增加结构稳定性。\n\n关键概念：\n• 基础隔离：将建筑与地面分离\n• 交叉支撑：对角支撑增加稳定性\n• 能量耗散：折叠和柔性接头吸收振动\n• 重心：降低重心提高稳定性",
        breathingTheory: "呼吸的工作原理\n\n呼吸频率随体力活动变化。静息时，人每分钟呼吸12-20次。运动中，身体需要更多氧气，呼吸频率增加。手机加速度计可以检测呼吸引起的细微胸部运动来测量呼吸频率。\n\n关键概念：\n• BPM：每分钟呼吸次数 — 您的呼吸频率\n• 静息：典型12-20 BPM\n• 轻度运动：20-40 BPM\n• 剧烈运动：40-60 BPM",
        reactionTheory: "反应时间的工作原理\n\n反应时间是刺激与您反应之间的间隔。它涉及您的感官检测刺激、大脑处理信息以及神经向肌肉发出信号。人类对视觉刺激的平均反应时间约为200-250毫秒。\n\n关键因素：\n• 惯用手：通常比非惯用手快10-20毫秒\n• 年龄：反应时间在20岁出头达到峰值\n• 疲劳：显著减慢反应时间\n• 练习：可提高反应时间10-15%",
        movementTheory: "运动流畅度的工作原理\n\n运动流畅度通过加速度的突然变化来衡量。手机加速度计检测振动和颠簸。流畅的运动产生更少、更小的加速度变化。流畅度评分（0-100%）衡量您移动的优雅程度。\n\n关键概念：\n• 振动：突然的加速度变化\n• 流畅度：无过度振动的时间百分比\n• 评分：从100%开始，每次颠簸减少"
      },
      leaderboard: {
        title: "排行榜",
        global: "全球排名",
        byActivity: "按活动",
        rank: "排名",
        team: "团队",
        score: "分数",
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