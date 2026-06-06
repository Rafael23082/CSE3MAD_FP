import { AuthContext } from "@/context/AuthContext";
import { usePathname, useRouter } from "expo-router";
import { use, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const context = use(AuthContext);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!context || context.loading) return;
        if (pathname !== "/") return;

        if (!context.user) {
            router.replace("/home");
        } else {
            router.replace("/(tabs)");
        }
    }, [context?.user, context?.loading, pathname]);

    if (!context) return null;
    const { user, loading } = context;

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator />
            </View>
        );
    }

    return null;
}