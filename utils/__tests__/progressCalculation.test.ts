jest.mock("@/constants/data", () => ({
  TOTAL_ACTIVITIES: 7,
}));

jest.mock("@/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
}));

import {
  calculateProgressPercentage,
  getProgressColor,
  rankTeams,
  calculateTotalPointsFromProgress,
  getCompletedActivityCount,
} from "../progressCalculation";

function mockTimestamp(millis: number) {
  return { toMillis: () => millis, seconds: Math.floor(millis / 1000), nanoseconds: 0 };
}

describe("calculateProgressPercentage", () => {
  it("returns 0 for 0 completed", () => {
    expect(calculateProgressPercentage(0)).toBe(0);
  });

  it("returns ~14 for 1 of 7", () => {
    expect(calculateProgressPercentage(1)).toBe(14);
  });

  it("returns 50 for 3.5 of 7 (rounded)", () => {
    expect(calculateProgressPercentage(3.5)).toBe(50);
  });

  it("returns 100 for all 7 completed", () => {
    expect(calculateProgressPercentage(7)).toBe(100);
  });
});

describe("getProgressColor", () => {
  it("returns green for >= 80%", () => {
    expect(getProgressColor(80)).toBe("#22c55e");
    expect(getProgressColor(100)).toBe("#22c55e");
  });

  it("returns yellow for 50-79%", () => {
    expect(getProgressColor(50)).toBe("#eab308");
    expect(getProgressColor(79)).toBe("#eab308");
  });

  it("returns red for < 50%", () => {
    expect(getProgressColor(0)).toBe("#ef4444");
    expect(getProgressColor(49)).toBe("#ef4444");
  });
});

describe("calculateTotalPointsFromProgress", () => {
  it("sums points across all entries", () => {
    const progress = [
      { points: 80, isCompleted: true } as any,
      { points: 60, isCompleted: false } as any,
      { points: 40, isCompleted: true } as any,
    ];
    expect(calculateTotalPointsFromProgress(progress)).toBe(180);
  });

  it("returns 0 for empty array", () => {
    expect(calculateTotalPointsFromProgress([])).toBe(0);
  });
});

describe("getCompletedActivityCount", () => {
  it("counts only completed activities", () => {
    const progress = [
      { isCompleted: true } as any,
      { isCompleted: false } as any,
      { isCompleted: true } as any,
    ];
    expect(getCompletedActivityCount(progress)).toBe(2);
  });

  it("returns 0 for empty array", () => {
    expect(getCompletedActivityCount([])).toBe(0);
  });
});

describe("rankTeams", () => {
  it("returns empty array for no teams", () => {
    expect(rankTeams([])).toEqual([]);
  });

  it("ranks single team at position 1", () => {
    const teams = [
      { userId: "user1", points: 100, currentScoreReachedAt: mockTimestamp(1000), isCompleted: true } as any,
    ];
    const result = rankTeams(teams);
    expect(result).toHaveLength(1);
    expect(result[0].rank).toBe(1);
    expect(result[0].totalPoints).toBe(100);
    expect(result[0].completedCount).toBe(1);
  });

  it("aggregates duplicate userId entries", () => {
    const teams = [
      { userId: "user1", points: 60, currentScoreReachedAt: mockTimestamp(1000), isCompleted: true } as any,
      { userId: "user1", points: 40, currentScoreReachedAt: mockTimestamp(2000), isCompleted: true } as any,
    ];
    const result = rankTeams(teams);
    expect(result).toHaveLength(1);
    expect(result[0].totalPoints).toBe(100);
    expect(result[0].completedCount).toBe(2);
  });

  it("ranks by points descending", () => {
    const teams = [
      { userId: "user3", points: 30, currentScoreReachedAt: mockTimestamp(3000), isCompleted: true } as any,
      { userId: "user1", points: 100, currentScoreReachedAt: mockTimestamp(1000), isCompleted: true } as any,
      { userId: "user2", points: 60, currentScoreReachedAt: mockTimestamp(2000), isCompleted: true } as any,
    ];
    const result = rankTeams(teams);
    expect(result[0].userId).toBe("user1");
    expect(result[1].userId).toBe("user2");
    expect(result[2].userId).toBe("user3");
    expect(result[0].rank).toBe(1);
    expect(result[1].rank).toBe(2);
    expect(result[2].rank).toBe(3);
  });

  it("breaks ties by earliest timestamp", () => {
    const teams = [
      { userId: "userB", points: 100, currentScoreReachedAt: mockTimestamp(2000), isCompleted: true } as any,
      { userId: "userA", points: 100, currentScoreReachedAt: mockTimestamp(1000), isCompleted: true } as any,
    ];
    const result = rankTeams(teams);
    expect(result[0].userId).toBe("userA");
    expect(result[1].userId).toBe("userB");
  });

  it("uses ?? 0 fallback for missing timestamps", () => {
    const teams = [
      { userId: "userA", points: 100, isCompleted: true } as any,
      { userId: "userB", points: 100, currentScoreReachedAt: mockTimestamp(1000), isCompleted: true } as any,
    ];
    const result = rankTeams(teams);
    // userA has no timestamp → toMillis?.() → undefined → ?? 0
    // userB has 1000
    // Earlier time ranks higher → userA (0) before userB (1000)
    expect(result[0].userId).toBe("userA");
  });
});
