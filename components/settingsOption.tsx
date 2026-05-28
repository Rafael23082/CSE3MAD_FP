import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { Pressable, StyleSheet, Text } from "react-native";

type settingsOptionProps = {
    text: string,
    action: any,
    paddingTop: boolean
}

export function SettingsOption({text, action, paddingTop}: settingsOptionProps){
  const {theme} = useTheme();

  const styles = createStyles(theme);

  return(
      <Pressable 
        style={[styles.option, {
          paddingTop: paddingTop ? 16: 0
        }]} 
        onPress={action}
      >
          <Text style={styles.text}>{text}</Text>
      </Pressable>
  )
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    option: {
      borderBottomWidth: 1,
      borderBottomColor: colors.card,
      paddingBottom: 16
    },

    text: {
      fontFamily: "PoppinsRegular",
      color: colors.secondary,
      fontSize: 16,
    },
  });
};