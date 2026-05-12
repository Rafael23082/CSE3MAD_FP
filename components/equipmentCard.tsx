import { ThemeContext } from "@/context/ThemeProvider";
import { ThemeColors } from "@/theme/colors";
import { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type equipmentCardProps = {
    toolName: string,
    description: string,
    image: any
}

export default function EquipmentCard({toolName, description, image}: equipmentCardProps){
    const theme = useContext(ThemeContext);
    if (!theme) return null;
    const styles = createStyles(theme);

    return (
        <View style={styles.cardContainer}>
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.head}>{toolName}</Text>
                <Text style={styles.body}>{description}</Text>
            </View>
        </View>
    );
}

const createStyles = (colors: ThemeColors) => {
    const styles = StyleSheet.create({
        cardContainer: {
            padding: 16,
            backgroundColor: colors.card,
            borderRadius: 16,
            display: "flex",
            flexDirection: "row",
            marginTop: 16,
            alignItems: "center"
        },
        imageContainer: {
            width: 80,
            height: 80,
            borderRadius: 16,
            overflow: "hidden",
        },
        textContainer: {
            width: "100%",
            flex: 1,
            marginLeft: 16
        },
        image: {
            width: "100%",
            height: "100%",
        },
        head: {
            color: colors.secondary,
            fontFamily: "InterRegular",
            fontSize: 17
        }, 
        body: {
            color: colors.secondary,
            fontFamily: "InterRegular",
            fontSize: 13,
            paddingTop: 4
        }
    })
    return styles;
}