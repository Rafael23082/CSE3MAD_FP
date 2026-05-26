import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const context = useContext(AuthContext);
    if (!context) return;
    const router = useRouter();

    const {user, loading} = context;
    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator />
            </View>
        );
    }

    if (!user) {
        return router.push("/home");
    }

    router.push("/(tabs)");
}