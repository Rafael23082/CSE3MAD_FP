import Card from "@/components/card";
import { AuthContext } from "@/context/AuthContext";
import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
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

  const {t} = useTranslation();

  return(
      <SafeAreaView style={styles.container}>
          <Text style={styles.welcomeMessage}>{t("home.welcome")}, {formattedName}!</Text>
          <Text style={styles.subHeader}>{t("home.subtitle")}</Text>
          <View style={styles.cardContainer}>
              <Card metric={"Metric1"} value={"10"} maximumWidth={false} />
              <Card metric={"Metric2"} value={"42"} maximumWidth={false} />
          </View>
          <Text style={styles.sectionHeader}>{t("home.howItWorks")}</Text>
          {(t("home.howItWorksElements", {returnObjects: true})as string[]).map((instruction, index) => (
            <Text style={styles.body} key={index}>• {instruction}</Text>
          ))}
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
      marginTop: 5,
      fontSize: 16
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
      paddingTop: 15,
      fontSize: 16
    }
  });
  return styles;
}