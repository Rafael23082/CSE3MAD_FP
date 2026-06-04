import ActivityDetailsContents from "@/components/activityDetailsContents";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { use } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityAttemptDetailsScreen(){
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const activityContext = use(ActivityContext);
    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    return(
        <SafeAreaView style={styles.outerContainer} edges={["top"]}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <ScrollView contentContainerStyle={styles.container}>
                <ActivityDetailsContents activity={activity} />
            </ScrollView>
        </KeyboardAvoidingView>
        </SafeAreaView>
    )
} 

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        outerContainer: {
            display: "flex",
            flexDirection: "column",
            flex: 1,
            backgroundColor: colors.backgroundColor,
        },
        container: {
            padding: 24,
            flexGrow: 1
        },
        head: {
          fontFamily: "PoppinsBold",
          fontSize: 22,
          color: colors.primary,
          marginBottom: 24
        }
    });
    return styles;
}