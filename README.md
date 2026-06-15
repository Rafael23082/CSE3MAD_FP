# CSE3MAD_FP

A cross-platform mobile application built with React Native and Expo, featuring Firebase integration, internationalization support, and comprehensive testing infrastructure.

## Overview

CSE3MAD_FP is a full-stack mobile application that leverages modern web and mobile technologies. The project is written primarily in TypeScript with additional JavaScript, HTML, and CSS components,[...]

## Technology Stack

- Framework: React Native with Expo
- Language: TypeScript (74.4%), JavaScript
- Navigation: Expo Router / React Navigation
- State management: TanStack React Query + React Context
- Backend: Firebase (Auth, Firestore, Storage) and SQLite for offline sync
- Internationalization: i18next + react-i18next
- Testing: Jest + Testing Library
- Linting: ESLint (Expo config)
- UI / Graphics: React Native Skia, Victory Native
- Icons: Expo Vector Icons
- CI/CD & Builds: GitHub Actions + EAS Build

## Project Structure

```
CSE3MAD_FP/
├── app/                    # Expo Router app configuration and screens (tabs, activity attempts, results)
├── components/             # Reusable React components (buttons, cards, charts, activity UIs)
├── constants/              # Application constants and activity definitions
├── context/                # React Context providers (Auth, Activity state, Theme)
├── hooks/                  # Custom React hooks (e.g. useTheme)
├── utils/                  # Utility functions (progress calculations, helpers)
├── theme/                  # Light and dark theme colour definitions
├── assets/                 # Images, fonts, activity definitions, equipment photos
├── scripts/                # Build and utility scripts
├── coverage/               # Test coverage reports
├── package.json            # Dependencies and npm scripts
├── tsconfig.json           # TypeScript configuration
├── jest.config.js          # Jest testing configuration
├── babel.config.js         # Babel transpilation config
├── eslint.config.js        # ESLint configuration
├── app.json                # Expo app configuration
├── firebase.js.example     # Firebase configuration template
├── firestore.rules         # Firestore security rules
├── storage.rules           # Firebase Storage security rules
└── i18n.js                 # Internationalization configuration
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rafael23082/CSE3MAD_FP.git
   cd CSE3MAD_FP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   - Copy `firebase.js.example` to `firebase.js`
   - Update with your Firebase project credentials

4. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in required configuration values

### Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
- **iOS**: `npm run ios`
- **Android**: `npm run android`
- **Web**: `npm run web`

### Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

### Linting

Check code quality:
```bash
npm run lint
```

## Key Features

- Cross-platform compatibility (iOS, Android, Web)
- Type-safe development with TypeScript
- Firebase integration for backend services
- Multi-language support via i18next
- Gesture handling and animations with React Native Reanimated
- Camera and sensor access
- QR code generation and scanning
- Data visualization with Victory Native charts
- Comprehensive test coverage with Jest
- Bottom tab navigation

## Configuration Files

- **app.json**: Expo project configuration with platform-specific settings
- **package.json**: Project dependencies and npm scripts
- **tsconfig.json**: TypeScript compiler options
- **jest.config.js**: Testing framework configuration
- **babel.config.js**: JavaScript transpilation configuration
- **eslint.config.js**: Code linting rules
- **firestore.rules**: Firebase Firestore security rules
- **storage.rules**: Firebase Storage security rules

## Development Workflow

1. Create feature branches for development
2. Write tests for new features
3. Ensure linting passes with `npm run lint`
4. Run test suite with `npm test`
5. Submit pull requests for review

## Security

- Firebase security rules are configured in `firestore.rules` and `storage.rules`
- Environment variables should never be committed; use `.env.example` as a template
- Sensitive Firebase configuration should be stored securely

## Build and Deployment

The project uses Expo for streamlined builds and deployments. Refer to the Expo documentation for iOS TestFlight and Google Play Store distribution.

## Contributing

When contributing to this project:
1. Follow the existing code style and TypeScript conventions
2. Add tests for new functionality
3. Run linting and tests before submitting changes
4. Update documentation as needed

## License

This project is private. See repository settings for license information.

## Support

For issues and questions, please refer to the project's GitHub issues page or documentation.

---

## STEMMLAB Documentation

1. Introduction

STEMMLab is a mobile application designed for upper primary and lower high school students that turns real-world physical activities into interactive, game-based learning experiences across Science, Technology, Engineering, Mathematics, and Medicine (STEMM). By utilizing the built-in sensors of a mobile phone such as the camera, GPS, timers, and motion sensors, students are able to perform experimentation on the challenges, collect and analyze data, and iterate on their designs, going through a similar flow of process done by real-world scientists and engineers. The platform encourages a collaborative and competitive learning environment where teams manage their progress, upload results, and compete on leaderboards.

For more information about the app, you can go here: https://github.com/Rafael23082/CSE3MAD_FP/blob/main/README.md

2. Main Navigation

Navigation through the bottom tab bar

After login, the app uses a bottom tab bar with the four section

| Dashboard | Home screen with overview and progress summary. |
| :---- | ----: |
| Activities | Browse and launch all seven science activities. |
| Leaderboard | Points-based ranking of all users with progress bars. |
| Settings | Account, appearance, language, and about pages. |

The STEMMLab application has the following core functionalities:

1. User Authentication and Profile Management

STEMMLAB allows users to create accounts, log in securely, and manage their profiles. Users can update their display name, change passwords, and maintain personalized account information throughout their learning journey.

2. Interactive STEM Activities

STEMLAB provides a collection of hands-on STEM activities that integrate scientific inquiry, engineering design, and data collection. Current activities include:

- Parachute Drop Challenge: Designing a parachute to minimize impact force and maximize landing safety.
- Sound Pollution Hunter: Measuring and mapping sound intensity in different environments to understand noise pollution.
- Hand Fan Challenge: Investigating how material stiffness and fan design affect air movement and force.
- Earthquake-Resistant Structure: Engineering structures capable of absorbing and distributing energy during simulated seismic vibrations.
- Stretch Speed & Gracefulness: Measuring body movement, coordination, and smoothness during stretching activities.
- Reaction Board Challenge: Testing brain-body coordination through digital reaction time and tracing tasks.
- Breathing Pace Trainer: Analyzing how physical exertion impacts respiratory patterns at rest versus after exercise.

3. Sensor-Based Data Collection

The application utilizes smartphone sensors to collect real-time experimental data. Features include:

- Accelerometer-based motion and vibration measurements
- Breathing rate detection through movement analysis
- Reaction time measurement
- Sound level monitoring

This enables students to gather accurate data directly from their mobile devices during experiments.

4. Digital Journal and Reflection System

STEMMLAB includes a journaling feature where users can document predictions, observations, discussion responses, and reflections. This promotes scientific thinking and encourages students to evaluate their learning outcomes after each activity.

5. Progress Tracking

Students can track completed activities, compare results, and monitor their learning progress over time.

6. Leaderboard System

A leaderboard feature allows users to view rankings and compare participation and performance with other users or teams. This encourages engagement and motivates students to actively participate in STEM activities.

7. Multi-Language Support

To improve accessibility, STEMMLAB supports multiple languages:

- English
- Indonesian
- Japanese
- Simplified Chinese

Users can switch languages through the Settings menu, allowing the application to accommodate diverse learning environments.

8. Cloud Integration and Data Storage

STEMMLAB integrates with Firebase services for authentication, cloud storage, and database management with SQLite for offline sync. User accounts, team information, activity records, and uploaded evidence are securely stored and synchronized across devices.

3. Getting Started

1. Landing Screen
   - The first screen shows the STEMM Lab logo and slogan. Users are asked to either Register a new account or Login with their existing account.
2. Creating an account
   - Registration requires an email address and password. The app uses Firebase Authentication. After filling in your credentials and tapping Register, your account is created and you are taken to the main dashboard. A display name is set during signup and synced to Firestore for leaderboard display.
3. Logging in
   - Enter your email and password, then tap Login. The app validates credentials against Firebase Auth. Error messages appear inline for common issues:
     - Invalid credentials or wrong password
     - User not found (no account with that email)
     - Too many requests

Sensor Debug Screen

Before starting any activities, the user/student must validate that phone sensors work correctly and the app has the permission to use them (such as camera and microphone).

Inside of the activity tab, it includes a “Sensor Validation” where it is used for the debug screen for phone sensor permissions. This screen tests the accelerometer, microphone, camera, gyroscope, and other sensors that the activities depend on. It confirms permission and tests whether the sensors are working fine or not.

Permissions: For the app to function, please "Allow" the following permissions when prompted:

- Camera: For motion tracking and reaction tests.
- Microphone: For sound pollution data collection.
- Location (GPS): For mapping where the student submit their attempts, ensure they done it in the school grounds.
- Sensors: Required for accelerometer (vibration) and motion data.

Your First Experiment: 3-Step Walkthrough

Follow these steps to complete your first "Breathing Pace Trainer" activity:

1. Step 1: Sign In & Profile

Open the app and tap "Register." Create your account or log in. Once logged in, visit the Profile tab to set your display name, this is how your team will identify you on the leaderboard!

2. Step 2: Choose Your Challenge

Tap the "Activities" icon on the bottom navigation bar. Select "Breathing Pace Trainer" from the list. Read the brief introduction to understand your objective, and ensure you are in an area where you are able to lie down on a flat surface.

3. Step 3: Record and Discuss

- Enter the prediction prompted on which activity is going to result in the highest BPM (Rest, Jogging, Star Jumps).
- Proceed down and enter your predicted BPM for the first activity (Rest). Lie on a flat surface and start recording. You may record for how long you want, but it is recommended to record for more than 30 seconds for a reliable sample size. After finishing the recording, you may log the trial for the first activity. After that, proceed to the next phases of the activities which follow a similar flow.

- After finishing all of the phases, you will be required to fill in the discussions section, discussing whether your predictions were right, what surprising insights you learned. And lastly, you need to fill in the team reflection and rate the activity.

- Finally you are able to finish the attempt, and will be redirected to the Journal Tab. In the journal tab, you are able to see the past attempts you have done in the activity, and are able to submit it to the leaderboard to be scored if you are satisfied with the results.

4. Data Ethics & Integrity Pledge

STEMMLab is a place for discovery. To ensure our leaderboards remain fair and our findings remain scientifically sound, all users are expected to adhere to these three principles:

- Honest Reporting: Record your data exactly as the sensors display it. Never manipulate your environment or the sensor placement to force a specific result.
- Respect for Privacy: When taking photos or mapping data for activities like "Sound Pollution Hunter," ensure you do not capture identifiable information of people who have not consented.
- Collaborative Integrity: In team challenges, ensure every member has a role in the experiment. A win for the team is a win for everyone’s scientific growth.

Leaderboard & Scoring System

Points system, where each fully completed activity would reward the team with 100 points. So maximum 700 points across all activities.

1. In the ranking metric, the top three will be getting the medal icons.
2. Display name and activities completed count (e.g, “3/7”)
3. Progress bar showing completion percentage with color coding on the activities.
4. Points total against the 700 maximum

Your own row is highlighted with a distinct border.

Pull down to refresh the rankings at any time, to get the latest ones.

It’s important to know that my team here considers the leaderboard, not as a competitive ranking metric system. But more as a progression board for the user and other teams. As we know that most or all teams are either way going to complete every activities. That’s why there is the timestamp mechanics that differenstiate the ranking completion between the teams.

Our goal for this leaderboard to make this into a shared progression of learning space.

Settings system

* Account: Here user can view their account information.
  * Update display name
  * Change password
  * View list of team members
  * Unique Team ID
  * Date of created account
* Apperance
  * Here user can switch between Light and Dark themes. If user doesn’t know which one, there is also System Theme, where it follows the system theme appearance from the phone.
* Language
  * As this app’s goal is to have wider global audience. We have prepared 4 languages:
    * English
    * Indonesia
    * Japanese
    * Chinese
  * All UI text, activity descriptions, error messages, button labels are translated.
* About & Support
  * View app version information and contact support.
  * The about page provides application details
  * Contact support cards are available for reporting issues or help requests either from phone number or email choice.

Developer setup information:

1. Prerequisites

Node.js v16 or higher.

npm or yarn package manager.

Expo CLI: npm install -g expo-cli

2. Installation

Clone, install, and configure in four steps.

Clone: git clone https://github.com/Rafael23082/CSE3MAD_FP.git

Install dependencies: npm install

Copy firebase.js.example to firebase.js and add your Firebase project credentials.

Copy .env.example to .env and fill in required configuration values.

3. Running the App

npm start,	Start the Expo development server.

4. Testing & Linting

npm test/npx jest \\- Run the Jest test suite.

npm run test: watch	 \\- Run tests in watch mode.

npm run test:coverage \\- Generate a coverage report.

npm run lint	\\- Check code quality with ESLint.

Security & Data

All user data is stored in Firebase Firestore with security rules enforcing per-user read/write access.

Firebase Storage rules protect uploaded files.

Environment variables and Firebase credentials are never committed to version control — .env.example and firebase.js.example serve as templates.

Authentication is handled entirely by Firebase Auth with standard email/password flow.

Project Structure

For the project's file layout, see the "Project Structure" section near the top of this README.

Tech Stack

For the technology stack used by this project, see the "Technology Stack" section near the top of this README.


