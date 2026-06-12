import {
  calculateCompositeScore,
  calculateOverallScore,
  getScoreExplanation,
} from "../scoring";

describe("calculateCompositeScore", () => {
  it("returns 0 for empty logs", () => {
    expect(calculateCompositeScore([], "parachute-drop-challenge")).toBe(0);
  });

  describe("parachute-drop-challenge", () => {
    it("computes inverted safety score", () => {
      // impactSpeed=0, gForce=0, predictedTime=10, recordedTime=10
      // accuracyError = |10-10|/10 = 0
      // score% = 0 → 100 - 0 = 100
      const logs = [{ impactSpeed: 0, gForce: 0, predictedTime: 10, recordedTime: 10 }];
      expect(calculateCompositeScore(logs, "parachute-drop-challenge")).toBe(100);
    });

    it("returns lower score for unsafe landing", () => {
      // impactSpeed=5, gForce=20, predictedTime=10, recordedTime=12
      // accuracyError = |12-10|/10 = 0.2
      // score% = 100(0.4*1 + 0.4*1 + 0.2*0.2) = 84
      // composite = 100 - 84 = 16
      const logs = [{ impactSpeed: 5, gForce: 20, predictedTime: 10, recordedTime: 12 }];
      const result = calculateCompositeScore(logs, "parachute-drop-challenge");
      expect(result).toBe(16);
    });

    it("handles missing predictedTime (accuracyError=0)", () => {
      const logs = [{ impactSpeed: 2, gForce: 5, recordedTime: 5 }];
      // predictedTime is falsy → accuracyError = 0
      const result = calculateCompositeScore(logs, "parachute-drop-challenge");
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });

  describe("sound-pollution-hunter", () => {
    it("computes inverse NPI score", () => {
      // avgDb = 85 → NPI = 1.0 → 100 - 100 = 0
      const logs = [{ db: 85 }];
      expect(calculateCompositeScore(logs, "sound-pollution-hunter")).toBe(0);
    });

    it("returns higher score for quieter sounds", () => {
      // avgDb = 42.5 → NPI = 0.5 → 100 - 50 = 50
      const logs = [{ db: 42.5 }];
      expect(calculateCompositeScore(logs, "sound-pollution-hunter")).toBe(50);
    });

    it("returns 0 when no positive dB readings", () => {
      const logs = [{ db: 0 }, { db: -10 }];
      expect(calculateCompositeScore(logs, "sound-pollution-hunter")).toBe(0);
    });
  });

  describe("hand-fan-challenge", () => {
    it("computes inverse force score", () => {
      // avgForce = 0.25 → 100 - 0.25*200 = 100 - 50 = 50
      const logs = [{ forceN: 0.25 }];
      expect(calculateCompositeScore(logs, "hand-fan-challenge")).toBe(50);
    });

    it("returns 0 for high force", () => {
      // avgForce = 0.75 → 100 - 0.75*200 = 100 - 150 = -50 → clamped to 0
      const logs = [{ forceN: 0.75 }];
      expect(calculateCompositeScore(logs, "hand-fan-challenge")).toBe(0);
    });

    it("returns 0 when no positive force readings", () => {
      const logs = [{ forceN: 0 }, { forceN: -1 }];
      expect(calculateCompositeScore(logs, "hand-fan-challenge")).toBe(0);
    });
  });

  describe("earthquake-resistant-structure", () => {
    it("uses stability score directly", () => {
      // peakAccel = 1 → score = 80 → 80
      const logs = [{ peakAccel: 1 }];
      expect(calculateCompositeScore(logs, "earthquake-resistant-structure")).toBe(80);
    });

    it("uses recordedPeak with ?? fallback to peakAccel", () => {
      // recordedPeak ?? peakAccel ?? 0 → recordedPeak wins
      const logs = [{ recordedPeak: 0.5, peakAccel: 99 }];
      // score = 100 - 0.5*20 = 90
      expect(calculateCompositeScore(logs, "earthquake-resistant-structure")).toBe(90);
    });

    it("falls back to 0 when both peak fields missing", () => {
      const logs = [{}];
      // recordedPeak ?? peakAccel ?? 0 → 0 → score = 100
      expect(calculateCompositeScore(logs, "earthquake-resistant-structure")).toBe(100);
    });

    it("clamps to 0 for very high acceleration", () => {
      const logs = [{ peakAccel: 100 }];
      // score = 100 - 2000 = -1900 → clamped to 0
      expect(calculateCompositeScore(logs, "earthquake-resistant-structure")).toBe(0);
    });
  });

  describe("breathing-pace-trainer", () => {
    it("scores 100 at exactly 15 BPM", () => {
      const logs = [{ breathsPerMinute: 15 }];
      expect(calculateCompositeScore(logs, "breathing-pace-trainer")).toBe(100);
    });

    it("penalizes deviation from 15 BPM", () => {
      // |18-15|*5 = 15 → 100 - 15 = 85
      const logs = [{ breathsPerMinute: 18 }];
      expect(calculateCompositeScore(logs, "breathing-pace-trainer")).toBe(85);
    });

    it("returns 0 when no positive BPM readings", () => {
      const logs = [{ breathsPerMinute: 0 }];
      expect(calculateCompositeScore(logs, "breathing-pace-trainer")).toBe(0);
    });
  });

  describe("reaction-board-challenge", () => {
    it("scores based on avg reaction time", () => {
      // avgTime = 300ms → 100 - 300/10 = 70
      const logs = [{ recordedMs: 300 }];
      expect(calculateCompositeScore(logs, "reaction-board-challenge")).toBe(70);
    });

    it("returns 0 for very slow reactions", () => {
      // avgTime = 1500ms → 100 - 150 = -50 → clamped to 0
      const logs = [{ recordedMs: 1500 }];
      expect(calculateCompositeScore(logs, "reaction-board-challenge")).toBe(0);
    });

    it("returns 0 when no positive time readings", () => {
      const logs = [{ recordedMs: 0 }];
      expect(calculateCompositeScore(logs, "reaction-board-challenge")).toBe(0);
    });
  });

  describe("stretch-speed-and-gracefulness", () => {
    it("scores based on avg vibration", () => {
      // avgVibration = 2 → 100 - 40 = 60
      const logs = [{ vibrationMm: 2 }];
      expect(calculateCompositeScore(logs, "stretch-speed-and-gracefulness")).toBe(60);
    });

    it("returns 0 for high vibration", () => {
      // avgVibration = 6 → 100 - 120 = -20 → clamped to 0
      const logs = [{ vibrationMm: 6 }];
      expect(calculateCompositeScore(logs, "stretch-speed-and-gracefulness")).toBe(0);
    });

    it("returns 0 when no positive vibration readings", () => {
      const logs = [{ vibrationMm: 0 }];
      expect(calculateCompositeScore(logs, "stretch-speed-and-gracefulness")).toBe(0);
    });
  });

  it("returns 0 for unknown activity key", () => {
    expect(calculateCompositeScore([{ some: "data" }], "unknown-activity")).toBe(0);
  });

  it("averages scores across multiple logs", () => {
    const logs = [
      { impactSpeed: 0, gForce: 0, predictedTime: 10, recordedTime: 10 },
      { impactSpeed: 5, gForce: 20, predictedTime: 10, recordedTime: 12 },
    ];
    // log1: 100, log2: 16 → avg = 58
    expect(calculateCompositeScore(logs, "parachute-drop-challenge")).toBe(58);
  });
});

describe("calculateOverallScore", () => {
  it("returns 0 for empty submissions", () => {
    const result = calculateOverallScore([]);
    expect(result.total).toBe(0);
    expect(result.perActivity).toEqual([]);
  });

  it("scores single submission", () => {
    const submissions = [
      {
        activityKey: "sound-pollution-hunter",
        logs: [{ db: 42.5 }],
      },
    ];
    const result = calculateOverallScore(submissions);
    expect(result.total).toBe(50);
    expect(result.perActivity).toHaveLength(1);
    expect(result.perActivity[0].score).toBe(50);
  });

  it("averages multiple submissions for same activity", () => {
    const submissions = [
      { activityKey: "sound-pollution-hunter", logs: [{ db: 42.5 }] },
      { activityKey: "sound-pollution-hunter", logs: [{ db: 85 }] },
    ];
    const result = calculateOverallScore(submissions);
    // (50 + 0) / 2 = 25
    expect(result.perActivity[0].score).toBe(25);
  });

  it("sums across multiple activities", () => {
    const submissions = [
      { activityKey: "sound-pollution-hunter", logs: [{ db: 42.5 }] },
      { activityKey: "parachute-drop-challenge", logs: [{ impactSpeed: 0, gForce: 0, predictedTime: 10, recordedTime: 10 }] },
    ];
    const result = calculateOverallScore(submissions);
    // sound = 50, parachute = 100 → total = 150
    expect(result.total).toBe(150);
    expect(result.perActivity).toHaveLength(2);
  });

  it("skips submissions without activityKey", () => {
    const submissions = [
      { logs: [{ db: 42.5 }] },
      { activityKey: "sound-pollution-hunter", logs: [{ db: 85 }] },
    ];
    const result = calculateOverallScore(submissions);
    expect(result.total).toBe(0);
    expect(result.perActivity).toHaveLength(1);
  });
});

describe("getScoreExplanation", () => {
  it("returns explanation for known activities", () => {
    const explanation = getScoreExplanation("parachute-drop-challenge");
    expect(explanation).toContain("landing safety");
    expect(explanation).toContain("impact speed");
  });

  it("returns fallback for unknown activity", () => {
    expect(getScoreExplanation("unknown")).toBe("Composite score based on activity performance data.");
  });
});
