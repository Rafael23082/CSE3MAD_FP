import { db } from '@/firebase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, addDoc, orderBy, Timestamp } from 'firebase/firestore';

export interface SubmissionData {
  userId: string;
  teamId: string;
  activityKey: string;
  logs: any[];
  reflection: string;
  submittedAt: Date;
  rating?: number;
  media?: {
    type: "video" | "image";
    url: string;
    path: string;
  };
}

/**
 * Fetch all submissions for the current user's team
 */
export function useTeamSubmissions(teamId: string | undefined) {
  return useQuery({
    queryKey: ['submissions', 'team', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const q = query(
        collection(db, 'submissions'),
        where('teamId', '==', teamId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!teamId,
  });
}

/**
 * Fetch submissions for a specific activity
 */
export function useActivitySubmissions(activityKey: string, teamId: string | undefined) {
  return useQuery({
    queryKey: ['submissions', 'activity', activityKey, teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const q = query(
        collection(db, 'submissions'),
        where('activityKey', '==', activityKey),
        where('teamId', '==', teamId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!teamId && !!activityKey,
  });
}

/**
 * Submit activity data to Firestore
 */
export function useSubmitActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmissionData) => {
      const docRef = await addDoc(collection(db, 'submissions'), {
        ...data,
        submittedAt: Timestamp.fromDate(data.submittedAt),
      });
      return docRef.id;
    },
    onSuccess: (_data, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['submissions', 'team', variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ['submissions', 'activity', variables.activityKey] });
    },
  });
}
