# CSE3MAD_FP

A cross-platform mobile application built with React Native and Expo, featuring Firebase integration, internationalization support, and comprehensive testing infrastructure.

## Overview

CSE3MAD_FP is a full-stack mobile application that leverages modern web and mobile technologies. The project is written primarily in TypeScript with additional JavaScript, HTML, and CSS components, providing a robust and type-safe codebase.

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript (69.3%), JavaScript (23.9%), HTML (5.6%), CSS (1.2%)
- **Navigation**: React Navigation with Expo Router
- **State Management**: TanStack React Query
- **Backend**: Firebase (Firestore, Storage)
- **Internationalization**: i18next with react-i18next
- **Testing**: Jest with Testing Library
- **Linting**: ESLint with Expo config
- **UI Libraries**: React Native Skia, Victory Native
- **Icons**: Expo Vector Icons

## Project Structure

```
CSE3MAD_FP/
├── app/                    # Expo Router app configuration and screens
├── components/             # Reusable React components
├── constants/              # Application constants
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── theme/                  # Theme configuration and styling
├── assets/                 # Images, fonts, and other static assets
├── scripts/                # Build and utility scripts
├── coverage/               # Test coverage reports
├── package.json            # Dependencies and scripts
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
