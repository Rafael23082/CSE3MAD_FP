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
    console.error("AUTH_PROVIDER_RENDER");

    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.error("AUTH_EFFECT_STARTED");

        console.error("AUTH_OBJECT =", auth);
        console.error("AUTH_TYPE =", typeof auth);

        console.error(
            "ON_AUTH_STATE_CHANGED_TYPE =",
            typeof onAuthStateChanged
        );

        try {
            console.error("BEFORE_ON_AUTH_STATE_CHANGED");

            const unsubscribeAuth = onAuthStateChanged(
                auth,
                async (user) => {
                    console.error("AUTH_CALLBACK_TRIGGERED");

                    try {
                        console.error("USER =", user);

                        setUser(user);

                        if (user) {
                            console.error("LOADING_PROFILE", user.uid);

                            const profile = await getUserProfile(user.uid);

                            console.error("PROFILE_RESULT =", profile);

                            if (profile) {
                                setUserProfile({
                                    displayName: profile.displayName,
                                    email: profile.email,
                                    teamMembers: profile.teamMembers
                                        ? JSON.parse(profile.teamMembers)
                                        : [],
                                    createdAt: profile.createdAt,
                                });

                                console.error("PROFILE_SET_SUCCESS");
                            } else {
                                console.error("PROFILE_NULL");
                                setUserProfile(null);
                            }
                        } else {
                            console.error("NO_USER_SIGNED_IN");
                            setUserProfile(null);
                        }
                    } catch (error) {
                        console.error(
                            "FAILED_TO_LOAD_SQLITE_PROFILE",
                            error
                        );
                        setUserProfile(null);
                    } finally {
                        console.error("SETTING_LOADING_FALSE");
                        setLoading(false);
                    }
                }
            );

            console.error("AFTER_ON_AUTH_STATE_CHANGED");

            return () => {
                console.error("AUTH_UNSUBSCRIBE");
                unsubscribeAuth();
            };
        } catch (error) {
            console.error(
                "ON_AUTH_STATE_CHANGED_REGISTRATION_FAILED",
                error
            );
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