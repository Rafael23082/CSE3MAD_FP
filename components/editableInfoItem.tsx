import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type EditableInfoItemProps = {
  label: string;
  value: string;
  onSave: any;
  placeholder: string
};

export default function EditableInfoItem({ label, value, onSave, placeholder}: EditableInfoItemProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const {t} = useTranslation();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handlePress = async () => {
    if (editing) {
      await onSave(inputValue);
    }

    setEditing(!editing);
  };

  useFocusEffect(
    useCallback(() => {
      return () => setEditing(false);
    }, [])
  )

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>

        {editing ? (
          <TextInput
            value={inputValue}
            onChangeText={setInputValue}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={theme.secondary}
          />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>

      <Pressable onPress={handlePress}>
        <Text style={styles.actionText}>
          {editing ? t("buttons.save") : t("buttons.edit")}
        </Text>
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 16,
    },
    textContainer: {
      flex: 1,
      marginRight: 16,
    },
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
    input: {
      fontFamily: "InterRegular",
      fontSize: 16,
      color: colors.secondary,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderColor,
    },
    actionText: {
      fontFamily: "InterSemibold",
      fontSize: 14,
      color: colors.primary,
    },
  });
};