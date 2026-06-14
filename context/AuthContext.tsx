import { getUserProfile } from "@/utils/database";
import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { auth } from "../firebase";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    userProfile: UserProfile | null;
    setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
};

type UserProfile = {
    displayName: string;
    email: string;
    teamMembers: any[];
    createdAt: string;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const unsubscribeAuth = onAuthStateChanged(
                auth,
                async (user) => {
                    try {
                        setUser(user);

                        if (user) {
                            const profile = await getUserProfile(user.uid);

                            if (profile) {
                                setUserProfile({
                                    displayName: profile.displayName,
                                    email: profile.email,
                                    teamMembers: profile.teamMembers
                                        ? JSON.parse(profile.teamMembers)
                                        : [],
                                    createdAt: profile.createdAt,
                                });
                            } else {
                                setUserProfile(null);
                            }
                        } else {
                            setUserProfile(null);
                        }
                    } catch (error) {
                        console.error(
                            error
                        );
                        setUserProfile(null);
                    } finally {
                        setLoading(false);
                    }
                }
            );

            return () => {
                unsubscribeAuth();
            };
        } catch (error) {
            throw error;
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                userProfile,
                setUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}