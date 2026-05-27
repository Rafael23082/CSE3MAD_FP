import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const context = useContext(AuthContext);
    const router = useRouter();

    if (!context) return null;

    const { user, loading } = context;

    useEffect(() => {
        if (loading) return;

        if (!user) {
            router.replace("/home");
        } else {
            router.replace("/(tabs)");
        }
    }, [user, loading]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return null;
}