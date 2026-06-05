import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

type infoItemProps = {
    label: string,
    value: string,
    marginTop: boolean
}

export function InfoItem({label, value, marginTop}: infoItemProps){
    const { theme } = useTheme();
    const styles = createStyles(theme);
    
    return(
        <View style={{ marginTop: marginTop ? 16: 0 }}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
        </View>
    )
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    label: {
      fontFamily: "InterRegular",
      fontSize: 14,
      opacity: 0.7,
      color: colors.secondary,
      marginBottom: 8,
    },
    value: {
      fontFamily: "InterRegular",
      fontSize: 16,
      color: colors.secondary,
    },
  });
};