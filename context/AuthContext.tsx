import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import { auth, db } from "../firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null;
}

type UserProfile = {
    displayName: string,
    createdAt: any, // Use proper Firestore Timestamp type if applicable
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    
    const unsubscribeSnapshotRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setUser(user);

            if (unsubscribeSnapshotRef.current) {
                unsubscribeSnapshotRef.current();
                unsubscribeSnapshotRef.current = null;
            }

            if (user) {
                const userDocRef = doc(db, "users", user.uid);

                unsubscribeSnapshotRef.current = onSnapshot(userDocRef, 
                    (docSnap) => {
                        if (docSnap.exists()) {
                            const rawData = docSnap.data() as UserProfile;

                            const formattedData: UserProfile = {
                                displayName: rawData.displayName || "No Name Provided",
                                createdAt: rawData.createdAt?.toDate ? rawData.createdAt.toDate() : rawData.createdAt
                            };
                            setUserProfile(formattedData);
                        }else{
                            setUserProfile(null);
                        }
                        setLoading(false);
                    }, 
                    (error) => {
                        Alert.alert("Firestore snapshot error");
                        setLoading(false);
                    }
                );
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshotRef.current) {
                unsubscribeSnapshotRef.current();
            }
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, userProfile }}>
            {children}
        </AuthContext.Provider>
    );
}