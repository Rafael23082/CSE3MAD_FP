import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type DesignPreset = {
    name: string;
    folds?: number;
    pillars?: number
};

type PresetSelectorProps = {
    designPresets: DesignPreset[];
    onSelect: (preset: DesignPreset) => void;
};

export default function PresetSelector({designPresets, onSelect}: PresetSelectorProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    const [showPresets, setShowPresets] = useState(false);
    return(
        <View>
            <Text style={styles.actionNameLarge}>New Trial</Text>
            <Pressable style={styles.presetsToggle} onPress={() => setShowPresets(!showPresets)}>
                <Text style={styles.presetsToggleText}>
                    {showPresets ? "▼ " : "▶ "}Design Presets
                </Text>
            </Pressable>
            {showPresets && (
                <View style={styles.presetsList}>
                    {designPresets.map((preset, i) => (
                        <Pressable
                            key={i}
                            style={styles.presetItem}
                            onPress={() => {
                                onSelect(preset);
                                setShowPresets(false);
                            }}
                        >
                        <Text style={styles.presetName}>{preset.name}</Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    )
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        actionNameLarge: {
            fontFamily: "PoppinsRegular",
            fontSize: 18,
            color: colors.secondary,
            marginBottom: 16,
            marginTop: 32
        },
        presetsToggle: { 
            padding: 16,
            backgroundColor: colors.card, 
            borderRadius: 8, 
            marginBottom: 16, 
            borderWidth: 1, 
            borderColor: colors.borderColor 
        },
        presetsToggleText: { 
            color: colors.primary, 
            fontWeight: "bold", 
            fontSize: 16
        },
        presetsList: { 
            backgroundColor: colors.card, 
            borderRadius: 8, 
            borderWidth: 1, 
            borderColor: colors.borderColor,
            marginBottom: 16
        },
        presetItem: { 
            padding: 16, 
            borderBottomWidth: 1, 
            borderBottomColor: colors.borderColor 
        },
        presetName: { 
            color: colors.secondary, 
            fontWeight: "bold",     
            fontSize: 16
        },
    })
    return styles;
}