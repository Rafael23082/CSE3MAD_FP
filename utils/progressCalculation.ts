import { TOTAL_ACTIVITIES } from "@/constants/data";
import { ActivityProgress } from "@/constants/types";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Calculate progress percentage (0-100)
 */
export function calculateProgressPercentage(completedCount: number): number {
  return Math.round((completedCount / TOTAL_ACTIVITIES) * 100);
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return '#22c55e';  // green
  if (percentage >= 50) return '#eab308';  // yellow
  return '#ef4444';  // red
}

/**
 * Rank teams: primary = points DESC, secondary = currentScoreReachedAt ASC
 * (first to reach that score ranks higher)
 */
export function rankTeams(teams: ActivityProgress[]): {
  userId: string;
  totalPoints: number;
  completedCount: number;
  latestScoreReachedAt: any;
  rank: number;
}[] {
  // Group by userId and aggregate points
  const teamMap = new Map<string, {
    userId: string;
    totalPoints: number;
    completedCount: number;
    latestScoreReachedAt: any;
  }>();

  for (const team of teams) {
    const existing = teamMap.get(team.userId);
    if (existing) {
      existing.totalPoints += team.points;
      existing.completedCount += 1;
      // Track the LATEST time this team reached their current score
      if (team.currentScoreReachedAt && (!existing.latestScoreReachedAt ||
          team.currentScoreReachedAt.toMillis?.() > existing.latestScoreReachedAt.toMillis?.())) {
        existing.latestScoreReachedAt = team.currentScoreReachedAt;
      }
    } else {
      teamMap.set(team.userId, {
        userId: team.userId,
        totalPoints: team.points,
        completedCount: 1,
        latestScoreReachedAt: team.currentScoreReachedAt,
      });
    }
  }

  // Convert to array and sort
  const ranked = Array.from(teamMap.values())
    .sort((a, b) => {
      // Primary: Points DESC
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      // Secondary: Earliest to reach that score ASC (first to reach wins)
      const aTime = a.latestScoreReachedAt?.toMillis?.() ?? 0;
      const bTime = b.latestScoreReachedAt?.toMillis?.() ?? 0;
      return aTime - bTime;
    })
    .map((team, index) => ({
      ...team,
      rank: index + 1,
    }));

  return ranked;
}

/**
 * Get all completed activities for the progression board
 */
export async function getProgressionBoardData(): Promise<{
  userId: string;
  totalPoints: number;
  completedCount: number;
  latestScoreReachedAt: any;
  rank: number;
}[]> {
  const q = query(
    collection(db, "activityProgress"),
    where("isCompleted", "==", true)
  );

  const snapshot = await getDocs(q);
  const progressData = snapshot.docs.map(d => ({
    id: d.id,
    ...d.data(),
  })) as ActivityProgress[];

  return rankTeams(progressData);
}

/**
 * Calculate total points from activity progress
 */
export function calculateTotalPointsFromProgress(progress: ActivityProgress[]): number {
  return progress.reduce((sum, p) => sum + p.points, 0);
}

/**
 * Get completed activity count
 */
export function getCompletedActivityCount(progress: ActivityProgress[]): number {
  return progress.filter(p => p.isCompleted).length;
}
