import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function ActivityResultsRedirect() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const activityKey = params.activityKey as string;

    useEffect(() => {
        if (activityKey) {
            const routeMap: Record<string, string> = {
                'parachute-drop-challenge': '/activityResults/parachuteResults',
                'sound-pollution-hunter': '/activityResults/soundResults',
                'hand-fan-challenge': '/activityResults/fanResults',
                'earthquake-resistant-structure': '/activityResults/earthquakeResults',
                'breathing-pace-trainer': '/activityResults/breathingResults',
                'reaction-board-challenge': '/activityResults/reactionResults',
                'stretch-speed-and-gracefulness': '/activityResults/humanPerformanceResults',
            };
            const route = routeMap[activityKey];
            if (route) {
                // Using setTimeout to avoid re-render issues during redirect
                setTimeout(() => router.replace(route as any), 0);
                return;
            }
        }
        setTimeout(() => router.replace("/(tabs)/activities" as any), 0);
    }, [activityKey, router]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#020617" }}>
            <ActivityIndicator color="#22d3ee" />
        </View>
    );
}
