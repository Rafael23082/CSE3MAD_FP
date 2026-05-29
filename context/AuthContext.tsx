import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null
}

type UserProfile = {
    firstName: string,
    createdAt: Date,
    teamId: string
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

                const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        setUserProfile(doc.data() as UserProfile);
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