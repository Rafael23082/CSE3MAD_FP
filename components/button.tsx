import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

type ButtonProps = {
  text: string;
  action: () => void;
  disabled?: boolean;
  loading?: boolean;
  testID?: string
};

export default function Button({
  text,
  action,
  disabled = false,
  loading = false,
  testID
}: ButtonProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
      onPress={() => {
        action();
      }}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={testID}
      testID={testID}
      accessible={true}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>{text}</Text>
        )}
      </View>
    </Pressable>
  );
}

const createStyles = (colors: ThemeColors) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      width: "100%",
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      display: "flex",
      alignSelf: "center",
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    buttonContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    buttonText: {
      color: "#FFFFFF",
      fontFamily: "InterRegular",
      textAlign: "center",
      lineHeight: 18,
      fontSize: 16,
    },
  });
  return styles;
};
