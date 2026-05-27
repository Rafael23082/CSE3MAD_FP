import { useTheme } from "@/hooks/useTheme";
import { ThemeColors } from "@/theme/colors";
import { StyleSheet, Text, View } from "react-native";

type cardProps={
    metric: string;
    value: string,
    maximumWidth: boolean
}

export default function Card({metric, value, maximumWidth}: cardProps){
    const {theme} = useTheme();
    const styles = createStyles(theme);
    return(
        <View style={[styles.cardContainer, {
            width: maximumWidth ? "100%": "47%"
        }]}>
            <Text style={styles.valueText}>{value}</Text>
            <Text style={styles.metricText}>{metric}</Text>   
        </View>
    )
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        cardContainer: {
            backgroundColor: colors.card,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20
        },
        valueText: {
            fontFamily: "PoppinsBold",
            fontSize: 50,
            color: colors.secondary
        },
        metricText: {
            fontFamily: "InterRegular",
            color: colors.secondary,
            fontSize: 16
        }
    })
    return styles;
}