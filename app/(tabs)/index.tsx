import Card from "@/components/card";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen(){
  const theme = useContext(ThemeContext)
  if (!theme) return null;
  const styles = createStyles(theme);

  const auth = useContext(AuthContext);
  if (!auth) return null;
  const { userProfile } = auth;

  const firstName = userProfile?.firstName ?? "";
  const formattedName = firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase();

  return(
      <SafeAreaView style={styles.container}>
          <Text style={styles.welcomeMessage}>Welcome, {formattedName}!</Text>
          <Text style={styles.subHeader}>{"Ready for your next experiment?"}</Text>
          <View style={styles.cardContainer}>
              <Card metric={"Metric1"} value={"10"} maximumWidth={false} />
              <Card metric={"Metric2"} value={"42"} maximumWidth={false} />
          </View>
          <Text style={styles.sectionHeader}>{"How STEMMLAB Works"}</Text>
          <Text style={styles.body}>• Choose a Challenge</Text>
          <Text style={styles.body}>• Use real-world materials and record your experiment.</Text>
          <Text style={styles.body}>• Capture data using your phone's sensors and upload results.</Text>
          <Text style={styles.body}>• Refine your design and climb the leaderboard.</Text>
      </SafeAreaView>
  )
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      backgroundColor: colors.backgroundColor,
      padding: 24,
    },
    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary
    },
    subHeader: {
      fontFamily: "InterRegular",
      color: colors.secondary,
      marginTop: 5
    },
    cardContainer: {
      display: "flex",
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "space-between"
    }, 
    sectionHeader: {
      color: colors.secondary,
      fontFamily: "PoppinsRegular",
      fontSize: 20,
      paddingTop: 40
    },
    body: {
      color: colors.secondary,
      fontFamily: "InterRegular",
      paddingTop: 15
    }
  });
  return styles;
}