import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null;
}

type UserProfile = {
    displayName: string,
    createdAt: Date,
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            setUser(user);

            if (user) {
                const userDocRef = doc(db, "users", user.uid);

                const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data() as UserProfile;
                        setUserProfile(data);
                    }
                });

                setLoading(false);

                return unsubscribeSnapshot;
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return unsubscribeAuth;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, userProfile }}>
            {children}
        </AuthContext.Provider>
    );
}
