import { activities } from "@/assets/activities";
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
          {Object.entries(activities).map(([key, activity], index) => (
            <ActivityGroup
              key={index}
              activityKey={key}
              activityName={activity.name}
              description={activity.description}
              imagePath={activity.image}
              onlyImage={false}
            />
          ))}
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