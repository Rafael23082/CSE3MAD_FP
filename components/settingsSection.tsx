import { ThemeContext } from "@/context/ThemeContext";
import { ThemeColors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type settingsSectionProps = {
    label: string,
    action: any,
    icon: any
}

export function SettingsSection({label, icon, action}: settingsSectionProps){
  const theme = useContext(ThemeContext);
  if (!theme) return null;
  const styles = createStyles(theme);

    return(
        <Pressable onPress={action} style={styles.container}>
            <View style={styles.left}>
                <Ionicons name={icon} size={20} color={theme.secondary} />
                <Text style={styles.text}>{label}</Text>
            </View>

            <Ionicons name="chevron-forward" size={18} color={theme.secondary} />
        </Pressable>
    )
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    text: {
      fontFamily: "PoppinsRegular",
      fontSize: 16,
      color: colors.secondary,
    },
  });