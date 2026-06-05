import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

type cardProps={
    label: string
    value: string
    Icon: React.ReactNode
    marginTop: boolean
}

export default function ContactSupportCard({label, value, Icon, marginTop}: cardProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    return(
        <View style={[styles.card, {
            marginTop: marginTop ? 16: 0
        }]}>
            <View style={styles.avatar}>
                {Icon}
            </View>
            <View style={styles.container}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>{value}</Text>
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        card: {
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderRadius: 12,
            backgroundColor: colors.card,
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: "#E5E7EB",
            justifyContent: "center",
            alignItems: "center",
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
        container: {
            display: "flex",
            flexDirection: "column",
            flex: 1
        }
    })
    return styles;
}