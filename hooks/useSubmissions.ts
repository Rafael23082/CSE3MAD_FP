import { db } from '@/firebase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, query, where, getDocs, addDoc, orderBy, Timestamp } from 'firebase/firestore';

export interface SubmissionData {
  userId: string;
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
 * Fetch all submissions for the current user
 */
export function useUserSubmissions(userId: string | undefined) {
  return useQuery({
    queryKey: ['submissions', 'user', userId],
    queryFn: async () => {
      if (!userId) return [];
      const q = query(
        collection(db, 'submissions'),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!userId,
  });
}

/**
 * Fetch submissions for a specific activity
 */
export function useActivitySubmissions(activityKey: string, userId: string | undefined) {
  return useQuery({
    queryKey: ['submissions', 'activity', activityKey, userId],
    queryFn: async () => {
      if (!userId) return [];
      const q = query(
        collection(db, 'submissions'),
        where('activityKey', '==', activityKey),
        where('userId', '==', userId),
        orderBy('submittedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    enabled: !!userId && !!activityKey,
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
      queryClient.invalidateQueries({ queryKey: ['submissions', 'user', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['submissions', 'activity', variables.activityKey] });
    },
  });
}
