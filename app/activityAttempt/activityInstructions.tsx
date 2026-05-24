import InstructionGroup from "@/components/InstructionGroup";
import { ActivityContext } from "@/context/ActivityContext";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useContext } from "react";
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivityAttemptInstructionsScreen(){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const styles = createStyles(theme);

    const activityContext = useContext(ActivityContext);
    if (!activityContext) return null;
    const { activity } = activityContext;
    if (!activity) return null;

    return(
        <SafeAreaView style={styles.outerContainer} edges={["top"]}>
        <KeyboardAvoidingView style={{flex: 1}} behavior="height">
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.head}>{activity.name}</Text>
                <Text style={styles.sectionHeader}>Instructions</Text>
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
        },
        sectionHeader: {
            fontFamily: "PoppinsRegular",
            fontSize: 20,
            color: colors.secondary,
        }
    });
    return styles;
}