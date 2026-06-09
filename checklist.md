# STEM Lab Game — Feature Implementation Checklist

> 40 items across 12 sections. Check off each feature as it's implemented.

---

## I. Screens & Navigation

- [ ] **Splash / Onboarding screen** — Animated logo, auth state check, auto-route to Login or Home
- [ ] **Login / Register screen** — Email + Google Sign-In via Firebase Auth
- [ ] **Home Dashboard screen** — Experiment category grid, XP bar, daily challenge card
- [ ] **Experiment List screen** — Filterable list per category from Firestore
- [ ] **Experiment Runner screen** — Core game screen with sensor readouts, instructions, canvas
- [ ] **Results / Report Card screen** — Charts of collected data, score, share button
- [ ] **Profile / Settings screen** — Avatar, stats, notification toggle, battery-saver mode
- [ ] **Leaderboard / Map screen** — Global/local rankings, GPS-based nearby labs
- [ ] **Navigation Component (nav graph)** — Single-Activity, Safe Args, bottom nav bar, deep links
- [ ] **Data passing between screens** — Nav args for IDs, shared ViewModel for state, Room for large payloads

## II. Firebase Integration

- [ ] **Firebase Authentication** — Email/Password + Google Sign-In, AuthStateListener, auto-create user doc
- [ ] **Cloud Firestore data model** — /experiments, /users/{uid}/completedExperiments, /leaderboard collections
- [ ] **Firestore security rules** — request.auth.uid == userId enforcement on user-scoped data
- [ ] **Firestore offline persistence** — setPersistenceEnabled(true) for offline experiment support
- [ ] **Firebase Test Lab — Robo Test** — AI-driven crawl, crash discovery, screenshots across 20+ devices
- [ ] **Firebase Test Lab — Instrumentation** — Espresso/UI Automator suites on real device matrix in CI

## III. Device Sensors

- [ ] **Accelerometer integration** — SensorManager + TYPE_ACCELEROMETER, buffered readings, live graph
- [ ] **Gyroscope integration** — TYPE_GYROSCOPE for rotation-based experiments
- [ ] **Torch / flashlight control** — CameraManager.setTorchMode, strobe patterns, Morse code experiments
- [ ] **Light sensor** — TYPE_LIGHT for lux reading / signal decoding
- [ ] **Sensor availability checks** — getDefaultSensor != null gate, disable unavailable experiments

## IV. Maps & GPS

- [ ] **FusedLocationProviderClient** — GPS + Wi-Fi + cell location, runtime permission, high-accuracy tracking
- [ ] **Google Maps integration** — SupportMapFragment, custom markers, ClusterManager
- [ ] **Geofencing** — GeofencingClient triggers experiment unlocks at parks, museums, schools

## V. Data Storage (SQLite / Room)

- [ ] **Room entities defined** — Experiment, SensorReading, UserProgress data classes with @Entity
- [ ] **Room DAOs implemented** — @Query, @Insert(onConflict=REPLACE), @Delete, Flow returns
- [ ] **Room database with migrations** — RoomDatabase subclass, databaseBuilder, addMigrations()
- [ ] **Firestore ↔ Room sync strategy** — Repository pattern: Firestore fetch → Room upsert, UI reads Room only

## VI. Battery Awareness

- [ ] **Battery level monitoring** — BroadcastReceiver for ACTION_BATTERY_CHANGED, display in status bar
- [ ] **Adaptive sensor sampling** — Reduce rate below 20%, pause GPS below 10%, respect PowerSaveMode

## VII. Parallel Programming

- [ ] **Coroutines for I/O** — viewModelScope.launch(Dispatchers.IO) for Firestore sync, Room queries
- [ ] **Coroutines for computation** — Dispatchers.Default for FFT analysis, sensor data processing
- [ ] **Flow-based sensor streams** — callbackFlow wrapping SensorEventListener, auto-cleanup on cancel

## VIII. WorkManager

- [ ] **Offline sync worker** — OneTimeWorkRequest with CONNECTED constraint, fires on reconnect
- [ ] **Daily challenge refresh** — PeriodicWorkRequest (1 day), pre-caches tomorrow's challenge in Room
- [ ] **Data export worker** — CoroutineWorker queries Room → writes CSV → share notification

## IX. Notifications

- [ ] **Local notifications** — NotificationChannel, experiment-complete alerts, daily reminders
- [ ] **FCM push notifications** — FirebaseMessagingService, server-triggered friend challenges
- [ ] **Deep link from notification** — PendingIntent opens specific experiment via nav graph URI

## X. AdMob

- [ ] **Banner ad on Home Dashboard** — AdView at bottom, non-intrusive, loads on screen entry
- [ ] **Interstitial ad between experiments** — Preloaded during experiment, shown max once per 3 completions
- [ ] **Rewarded ad for hints** — RewardedAd.load(), grants hint on reward callback
- [ ] **COPPA compliance configured** — Child-directed treatment tag + MAX_AD_CONTENT_RATING_G

## XI. Testing

- [ ] **Unit tests (JUnit + MockK / Jest)** — ViewModel and Repository tests with mocked dependencies, 80%+ coverage
- [ ] **UI tests (Espresso / RTL)** — Navigation, form validation, sensor display verification

## XII. APK & Builds

- [ ] **Build variants configured** — debug/release types, free/premium flavors, signed release config
- [ ] **CI/CD pipeline** — Build → unit test → Test Lab → deploy to Play internal track

