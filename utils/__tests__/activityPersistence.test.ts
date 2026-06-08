import {
  buildActivityResultRecord,
  buildFirestoreSubmissionPayload,
  REQUIRED_ACTIVITY_KEYS,
} from "../activityPersistence";

const baseLog = {
  activityKey: "sound-pollution-hunter",
  timestamp: 1_786_000_000_000,
  data: {
    action: "Closing a door",
    db: 88,
    risk: "Dangerous",
    location: "Science lab",
    latitude: -37.812,
    longitude: 144.963,
  },
};

describe("activity persistence contracts", () => {
  test("tracks required assessment activities", () => {
    expect(REQUIRED_ACTIVITY_KEYS).toEqual([
      "parachute-drop-challenge",
      "sound-pollution-hunter",
      "hand-fan-challenge",
      "earthquake-resistant-structure",
    ]);
  });

  test("builds a SQLite-ready activity result record", () => {
    const record = buildActivityResultRecord({
      userId: "user-1",
      teamId: "team-1",
      activityKey: "sound-pollution-hunter",
      logs: [baseLog],
      rating: 4,
      location: { latitude: -37.812, longitude: 144.963, accuracy: 8 },
      submittedAt: new Date("2026-06-06T09:00:00.000Z"),
    });

    expect(record.activityKey).toBe("sound-pollution-hunter");
    expect(record.userId).toBe("user-1");
    expect(record.teamId).toBe("team-1");
    expect(record.rating).toBe(4);
    expect(record.latitude).toBe(-37.812);
    expect(record.longitude).toBe(144.963);
    expect(record.accuracy).toBe(8);
    expect(JSON.parse(record.logsJson)).toEqual([baseLog]);
    expect(record.submittedAt).toBe("2026-06-06T09:00:00.000Z");
  });

  test("builds Firestore payload with GPS attached", () => {
    const payload = buildFirestoreSubmissionPayload({
      userId: "user-1",
      teamId: "team-1",
      activityKey: "sound-pollution-hunter",
      logs: [baseLog],
      reflection: "Measured hallway noise.",
      rating: 5,
      location: { latitude: -37.812, longitude: 144.963, accuracy: null },
      submittedAt: new Date("2026-06-06T09:00:00.000Z"),
    });

    expect(payload.activityKey).toBe("sound-pollution-hunter");
    expect(payload.logCount).toBe(1);
    expect(payload.location).toEqual({
      latitude: -37.812,
      longitude: 144.963,
      accuracy: null,
    });
    expect(payload.rating).toBe(5);
    expect(payload.submittedAt).toBe("2026-06-06T09:00:00.000Z");
  });
});
