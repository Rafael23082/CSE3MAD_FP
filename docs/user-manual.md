# STEMM Lab - User Manual

## Overview

STEMM Lab is a mobile application for Science, Technology, Engineering, Mathematics, and Medicine experiments. It provides interactive activities with real-time physics calculations, data logging, and leaderboard submission.

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies: `npm install --legacy-peer-deps`
3. Configure Firebase: Copy `firebase.js.example` to `firebase.js` and add your credentials
4. Start the app: `npm start`

### Account Setup

1. Open the app and tap "Sign Up"
2. Enter your email and password
3. Create or join a team using the invite code
4. You're ready to start experiments!

## Activities

### Parachute Drop Challenge

**Objective:** Measure how parachute design affects fall time and g-force.

**How to use:**
1. Open camera to record the drop (optional)
2. Tap "Record Video" to capture the experiment
3. Set drop height and toy mass parameters
4. Tap "Start" to begin the timer
5. Drop the parachute and tap "Stop" when it lands
6. Enter contact time and whether it bounced
7. View real-time velocity, acceleration, and g-force calculations
8. Tap "Log Trial" to save the data
9. Tap "Finish Activity" to see results and submit to leaderboard

**Physics formulas:**
- Velocity: v = d / t
- Acceleration: a = v / t
- Drag Force: F_drag = W - F_net
- G-force: (v / contactTime) / 9.8

### Sound Pollution Hunter

**Objective:** Measure sound levels in different locations and create a noise map.

**How to use:**
1. Tap "Start Measuring" to begin audio recording
2. Select an action from the dropdown
3. Enter the location name
4. Predict if the sound will be louder or softer
5. Tap "Log Reading" to save the measurement
6. View the sound map to see all readings with GPS coordinates

**Risk levels:**
- Safe: 0-60 dB
- Moderate: 60-85 dB
- Dangerous: 85-100 dB
- Critical: 100+ dB

### Hand Fan Challenge

**Objective:** Test how fan material and distance affect paper target movement.

**How to use:**
1. Enter a name for your fan design
2. Select the target material (paper or cardboard)
3. Choose the distance (15, 30, or 45 cm)
4. Predict the angle the paper will move
5. Fan air toward the target and measure the angle
6. View real-time force calculation: F ≈ k × θ
7. Tap "Log Trial" to save data

**Material stiffness coefficients:**
- Thin printer paper: k=0.05
- Standard card stock: k=0.20
- Thin cardboard: k=0.50
- Corrugated cardboard: k=2.50

### Earthquake-Resistant Structure

**Objective:** Test how paper fold and pillar designs affect earthquake resistance.

**How to use:**
1. Select a design preset or enter custom fold/pillar counts
2. Name your design
3. Predict how much the structure will sway
4. Tap "Start Vibration" to begin accelerometer tracking
5. Shake the phone to simulate an earthquake
6. Tap "Stop Vibration" when done
7. View peak acceleration and estimated sway
8. Tap "Log Design" to save the trial

### Breathing Pace Trainer

**Objective:** Measure breathing rate using the phone's accelerometer.

**How to use:**
1. Select a breathing preset (Rest, Light Exercise, or Vigorous)
2. Place the phone on your chest
3. Breathe normally for the specified duration
4. The app detects chest movements to calculate BPM
5. View your breathing rate and compare to targets

### Reaction Board Challenge

**Objective:** Test reaction time and tracing accuracy.

**How to use:**
1. Select a challenge mode
2. For reaction time: Wait for the signal, then tap as fast as possible
3. For tracing: Follow the path accurately
4. View your results and compare to previous attempts

### Stretch Speed and Gracefulness

**Objective:** Measure movement smoothness using accelerometer data.

**How to use:**
1. Select a movement preset
2. Hold the phone and perform the movement
3. The app measures acceleration changes and vibrations
4. View your smoothness score (0-100%)

## Results and Leaderboard

After completing an activity:

1. View your experiment data in the results screen
2. Read the theory explanation
3. Rate the activity with 1-5 stars
4. Tap "Submit to Leaderboard" to share your results with your team
5. For parachute drops, any recorded video will be uploaded automatically

## Sound Map

For sound pollution experiments:

1. Go to the results screen
2. Tap "View Sound Map"
3. See all your readings plotted on a map
4. Colors indicate risk levels (green=safe, red=dangerous)
5. Review the legend for reference

## Settings

- **Language:** Switch between English, Japanese, Indonesian, and Chinese
- **Theme:** Toggle dark/light mode
- **Team Settings:** View team info and invite code
- **Support:** Contact support through the app

## Troubleshooting

**Camera not working:**
- Ensure camera permissions are granted
- Check that no other app is using the camera

**GPS not available:**
- Enable location services in device settings
- Grant location permissions to the app

**Timer not accurate:**
- Avoid switching apps while the timer is running
- Use the Reset button if the timer gets stuck

**Data not saving:**
- Ensure you have sufficient storage space
- Check your internet connection for leaderboard submissions

## Privacy

- Audio recordings are processed locally and not stored permanently
- GPS coordinates are only saved with your permission
- Video recordings are stored in Firebase Storage
- All data is associated with your team account
