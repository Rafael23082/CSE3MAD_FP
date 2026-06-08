import InstructionGroup from "@/components/InstructionGroup";
import { ActivityContext } from "@/context/ActivityContext";
import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { use } from "react";
import { useTranslation } from "react-i18next";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";

export default function ActivityAttemptInstructionsScreen(){
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const {t} = useTranslation();

    const activityContext = use(ActivityContext);

    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    return(
        <KeyboardAvoidingView style={styles.outerContainer} behavior="height">
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.head}>{activity.name}</Text>
                <Text style={styles.sectionHeader}>{t("activities.instructions")}</Text>
                {activity.instructions.map((instruction, index) => (
                    <InstructionGroup 
                        text={instruction.instruction} 
                        videoPath={instruction.video} 
                        key={index} 
                        number={index+1} 
                    />
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
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
        },
        sectionHeader: {
            fontFamily: "PoppinsRegular",
            fontSize: 20,
            color: colors.secondary,
        }
    });
    return styles;
}