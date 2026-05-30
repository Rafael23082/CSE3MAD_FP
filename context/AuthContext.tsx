import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { Team } from "@/constants/types";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null;
    team: Team | null;
}

type UserProfile = {
    firstName: string,
    createdAt: Date,
    teamId?: string | null,
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [team, setTeam] = useState<Team | null>(null);
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

                        // If user belongs to a team, subscribe to team document
                        if (data.teamId) {
                            const teamRef = doc(db, "teams", data.teamId);
                            onSnapshot(teamRef, (teamDoc) => {
                                if (teamDoc.exists()) {
                                    setTeam(teamDoc.data() as Team);
                                } else {
                                    setTeam(null);
                                }
                            });
                        } else {
                            setTeam(null);
                        }
                    }
                });

                setLoading(false);

                return unsubscribeSnapshot;
            } else {
                setUserProfile(null);
                setTeam(null);
                setLoading(false);
            }
        });

        return unsubscribeAuth;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, userProfile, team }}>
            {children}
        </AuthContext.Provider>
    );
}