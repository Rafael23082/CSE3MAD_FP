# STEMM Lab - Testing and Deployment Guide

## Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- Android Studio (for Android builds)
- Xcode (for iOS builds)

### Installation

```bash
# Clone the repository
git clone https://github.com/Rafael23082/CSE3MAD_FP.git
cd stemm-fp

# Install dependencies
npm install --legacy-peer-deps

# Configure Firebase
cp firebase.js.example firebase.js
# Edit firebase.js with your Firebase credentials

# Start development server
npm start
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

```
components/__tests__/    # Component tests
utils/__tests__/         # Utility function tests
```

### Writing Tests

Tests use Jest and React Testing Library:

```typescript
import { render, screen } from '@testing-library/react-native';
import MyComponent from '../MyComponent';

test('renders correctly', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeTruthy();
});
```

### Manual Testing Checklist

**Authentication:**
- [ ] Sign up with new account
- [ ] Login with existing credentials
- [ ] Password reset flow
- [ ] Team creation and joining

**Activities:**
- [ ] Parachute: Timer, calculations, video recording
- [ ] Sound: Audio recording, dB meter, GPS logging
- [ ] Fan: Material selection, angle measurement
- [ ] Earthquake: Accelerometer, vibration tracking
- [ ] Breathing: BPM detection
- [ ] Reaction: Time measurement
- [ ] Movement: Smoothness scoring

**Data Persistence:**
- [ ] Experiment logs save to SQLite
- [ ] Ratings persist across app restarts
- [ ] Offline data syncs when online

**Leaderboard:**
- [ ] Submit results to Firestore
- [ ] View team rankings
- [ ] Video upload for parachute drops

**UI/UX:**
- [ ] Dark mode works correctly
- [ ] All 4 languages display properly
- [ ] Responsive layout on different screen sizes
- [ ] Ad banners display without blocking content

## Building for Production

### Android APK (Preview)

```bash
# Configure EAS
eas build:configure

# Build APK
eas build -p android --profile preview

# Download from Expo dashboard
```

### Android AAB (Production)

```bash
# Build AAB for Play Store
eas build -p android --profile production

# Submit to Play Store
eas submit -p android
```

### iOS (TestFlight)

```bash
# Build for iOS
eas build -p ios --profile preview

# Submit to TestFlight
eas submit -p ios
```

## EAS Configuration

The `eas.json` file configures build profiles:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
```

## Firebase Configuration

### Firestore Rules

Ensure `firestore.rules` allows:
- Read/write for authenticated users
- Team-based data isolation
- Submission collection writes

### Storage Rules

Ensure `storage.rules` allows:
- Video uploads for authenticated users
- File size limits (100MB recommended)
- Content type validation

### Indexes

Check `firestore.indexes.json` for required composite indexes.

## CI/CD Pipeline

### GitHub Actions (Optional)

```yaml
name: Test and Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install --legacy-peer-deps
      - run: npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install --legacy-peer-deps
      - run: npm install -g eas-cli
      - run: eas build -p android --profile preview --non-interactive
```

## Troubleshooting Builds

### Common Issues

**Build fails with peer dependency errors:**
```bash
npm install --legacy-peer-deps
```

**Firebase config not found:**
- Ensure `firebase.js` exists with correct credentials
- Check environment variables are loaded

**Camera/GPS permissions denied:**
- Check `app.json` permission descriptions
- Test on physical device (not simulator)

**AdMob not showing:**
- Verify ad unit ID is correct
- Test with test ads first
- Check device is not in airplane mode

### Clean Build

```bash
# Clear cache
rm -rf node_modules/.cache
npx expo r --clear

# Fresh install
rm -rf node_modules
npm install --legacy-peer-deps
```

## Performance Optimization

### Bundle Size

- Use Expo modules instead of native dependencies where possible
- Enable Hermes engine (default in Expo SDK 54)
- Tree-shake unused imports

### Runtime Performance

- Use `React.memo` for expensive components
- Debounce sensor data updates
- Lazy load non-critical screens

### Memory Management

- Clean up sensor subscriptions on unmount
- Limit camera recording duration
- Compress video before upload

## Security Considerations

### API Keys

- Never commit `firebase.js` to version control
- Use environment variables for sensitive data
- Rotate API keys regularly

### Data Privacy

- Audio recordings processed locally
- GPS data only stored with user consent
- Video uploads encrypted in transit
- Team data isolated by Firestore rules

### Authentication

- Use Firebase Authentication
- Implement session timeout
- Validate team membership before data access

## Release Checklist

### Pre-Release

- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] Manual testing completed
- [ ] Performance benchmarks acceptable
- [ ] Security review completed

### Build

- [ ] Version number updated in `app.json`
- [ ] Changelog updated
- [ ] Build artifacts downloaded and tested
- [ ] Signed with correct certificates

### Deployment

- [ ] Play Store listing updated
- [ ] App Store listing updated
- [ ] Screenshots refreshed
- [ ] Privacy policy updated if needed

### Post-Release

- [ ] Monitor crash reports
- [ ] Check user reviews
- [ ] Verify analytics tracking
- [ ] Plan next iteration
