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
        language: "Language"
      },
      buttons: {
        register: "Register",
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
        tapNow: "TAP NOW!"
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
        inviteCodePlaceholder: "Enter invite code"
      },
      home: {
        welcome: "Welcome",
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
          ]
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
          ]
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
          ]
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
          ]
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
      errorMessages: {
        invalidCredential: "Invalid email or password",
        userNotFound: "No account found with this email",
        wrongPassword: "Incorrect password",
        invalidEmail: "Please enter a valid email",
        tooManyRequests: "Too many attempts. Please try again later",
        defaultError: "Something went wrong",
        weakPassword: "Password should be at least 6 characters",
        emailAlreadyInUse: "This email is already registered"
      },
      countdown: {
        getReady: "Get Ready"
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
        language: "言語"
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
        tapNow: "今すぐタップ！"
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
        inviteCodePlaceholder: "招待コードを入力してください"
      },
      home: {
        welcome: "ようこそ",
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
      errorMessages: {
        invalidCredential: "メールアドレスまたはパスワードが正しくありません",
        userNotFound: "このメールアドレスに登録されたアカウントが見つかりません",
        wrongPassword: "パスワードが間違っています",
        invalidEmail: "有効なメールアドレスを入力してください",
        tooManyRequests: "試行回数を超えました。後ほどもう一度お試しください",
        defaultError: "何か問題が発生しました",
        weakPassword: "パスワードは6文字以上にしてください",
        emailAlreadyInUse: "このメールアドレスはすでに登録されています"
      },
      countdown: {
        getReady: "準備をしよう"
      }
    }
  },
};

const deviceLanguage = getLocales()[0].languageCode;

i18n.use(initReactI18next).init({
  resources,
  lng: deviceLanguage ?? "en",
  interpolation: { escapeValue: false },
});

export default i18n;