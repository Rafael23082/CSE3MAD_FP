import { db, storage } from "@/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export interface SubmissionLogEntry {
  activityKey: string;
  data: Record<string, unknown>;
  timestamp: number;
}

export interface SubmissionPayload {
  userId: string;
  activityKey: string;
  logs: SubmissionLogEntry[];
  reflection: string;
  rating?: number;
  submittedAt?: Date;
  media?: {
    type: "video" | "image";
    url: string;
    path: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
  };
}

export interface UploadProgressSnapshot {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
  state: string;
}

export async function uploadFileFromUri(
  uri: string,
  destinationPath: string,
  contentType: string,
  onProgress?: (snapshot: UploadProgressSnapshot) => void,
): Promise<{ downloadUrl: string; path: string }> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, destinationPath);

  return await new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob, { contentType });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const totalBytes = snapshot.totalBytes || 1;
        onProgress?.({
          bytesTransferred: snapshot.bytesTransferred,
          totalBytes,
          progress: (snapshot.bytesTransferred / totalBytes) * 100,
          state: snapshot.state,
        });
      },
      (error) => reject(error),
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        resolve({ downloadUrl, path: destinationPath });
      },
    );
  });
}

export async function saveSubmission(
  payload: SubmissionPayload,
): Promise<string> {
  const submittedAt = payload.submittedAt ?? new Date();

  const docRef = await addDoc(collection(db, "submissions"), {
    userId: payload.userId,
    activityKey: payload.activityKey,
    logs: payload.logs,
    reflection: payload.reflection,
    rating: payload.rating ?? null,
    submittedAt: Timestamp.fromDate(submittedAt),
    media: payload.media ?? null,
    location: payload.location ?? null,
    logCount: payload.logs.length,
  });

  return docRef.id;
}
