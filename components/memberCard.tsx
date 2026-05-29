import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

type memberCardProps = {
    member: any,
    marginTop: boolean
}

export default function MemberCard({member, marginTop}: memberCardProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    return(
        <View style={[styles.card, {
            marginTop: marginTop ? 16: 0
        }]}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{member.firstName[0].toUpperCase()}</Text>
        </View>

        <Text style={styles.name}>{member.firstName}</Text>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        card: {
            flexDirection: "row",
            alignItems: "center",
            padding: 12,
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
            marginRight: 12,
        },
        avatarText: {
            fontSize: 16,
            fontWeight: "600",
            color: "#374151",
        },
        name: {
            fontSize: 16,
            fontWeight: "500",
            color: colors.secondary,
        },
    })
    return styles;
}