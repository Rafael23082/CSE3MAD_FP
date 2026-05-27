import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { Pressable, StyleSheet, Text } from "react-native";

type settingsOptionProps = {
    text: string,
    action: any
}

export function SettingsOption({text, action}: settingsOptionProps){
  const {theme} = useTheme();

  const styles = createStyles(theme);

  return(
      <Pressable style={styles.option} onPress={action}>
          <Text style={styles.text}>{text}</Text>
      </Pressable>
  )
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
      backgroundColor: colors.backgroundColor,
    },

    welcomeMessage: {
      fontFamily: "PoppinsBold",
      fontSize: 22,
      color: colors.primary,
      marginBottom: 16,
    },

    option: {
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
    },

    text: {
      fontFamily: "PoppinsRegular",
      color: colors.secondary,
      fontSize: 16,
    },
  });
};