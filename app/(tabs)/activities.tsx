import ActivityGroup from "@/components/activityGroup";
import { ThemeContext } from "@/context/ThemeProvider";
import { ThemeColors } from "@/theme/colors";
import { useContext } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActivitiesScreen() {
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.outerContainer} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeMessage}>Select an Activity</Text>

        <ActivityGroup
          activityName={"Reaction Board Challenge"}
          description={"Students test their neuromuscular coordination by measuring reaction times under different conditions. The activity uses the phone as a digital 'stimulus and response' board to capture the speed of the brain-to-body signaling pathway."}
          imagePath={require("@/assets/images/speed_8252022_layout_07.jpg")}
          onlyImage={false}
        />

        <ActivityGroup
          activityName={"Breathing Pace Trainer"}
          description={"Students explore the relationship between respiration and physical relaxation. By following a digital pacer, they learn to control their breathing rate to observe how conscious regulation affects heart rate or perceived stress levels."}
          imagePath={require("@/assets/images/rm373batch7-18a.jpg")}
          onlyImage={false}
        />

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: colors.backgroundColor,
    },
    container: {
      padding: 24,
      flexGrow: 1,
    },
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 16,
    },
  });
};